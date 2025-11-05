
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dirisFilter = searchParams.get('diris');
    const esquemaFilter = searchParams.get('esquema');
    const tipoFilter = searchParams.get('tipo');

    // Build where clause
    const where: any = {};
    if (dirisFilter && dirisFilter !== 'all') {
      where.dd_nombre = dirisFilter;
    }
    if (esquemaFilter && esquemaFilter !== 'all') {
      where.esquema_actual = esquemaFilter;
    }
    if (tipoFilter && tipoFilter !== 'all') {
      where.tipo_esquema = tipoFilter;
    }

    // Get stats
    const [
      totalRecords,
      dirisStats,
      dirisStatsBySheet,
      esquemaStats,
      tipoStats,
      condicionStats
    ] = await Promise.all([
      // Total count
      prisma.cumplimientoRecord.count({ where }),
      
      // Group by DIRIS (overall)
      prisma.cumplimientoRecord.groupBy({
        by: ['dd_nombre'],
        where,
        _count: true
      }),
      
      // Group by DIRIS and sheet type for breakdown
      prisma.cumplimientoRecord.groupBy({
        by: ['dd_nombre', 'tipo_esquema'],
        where,
        _count: true,
        orderBy: [{ dd_nombre: 'asc' }, { tipo_esquema: 'asc' }]
      }),
      
      // Group by Esquema
      prisma.cumplimientoRecord.groupBy({
        by: ['esquema_actual'],
        where,
        _count: true
      }),
      
      // Group by Tipo
      prisma.cumplimientoRecord.groupBy({
        by: ['tipo_esquema'],
        where,
        _count: true
      }),
      
      // Group by Condicion
      prisma.cumplimientoRecord.groupBy({
        by: ['condicion'],
        where,
        _count: true
      })
    ]);

    // Process DIRIS stats by sheet type
    const dirisStatsBySheetProcessed: { [sheet: string]: { name: string; value: number }[] } = {};
    const sheetTypes = ['esquema_vigente', 'personalizados_18', 'personalizados_0a3', 'personalizados_4a17'];
    
    sheetTypes.forEach(sheetType => {
      dirisStatsBySheetProcessed[sheetType] = [];
    });
    
    dirisStatsBySheet.forEach(item => {
      if (!dirisStatsBySheetProcessed[item.tipo_esquema]) {
        dirisStatsBySheetProcessed[item.tipo_esquema] = [];
      }
      dirisStatsBySheetProcessed[item.tipo_esquema].push({
        name: item.dd_nombre,
        value: item._count
      });
    });

    // Sort each sheet's DIRIS by count
    Object.keys(dirisStatsBySheetProcessed).forEach(sheet => {
      dirisStatsBySheetProcessed[sheet].sort((a, b) => b.value - a.value);
    });

    return NextResponse.json({
      totalRecords,
      dirisStats: dirisStats
        .map(item => ({
          name: item.dd_nombre,
          value: item._count
        }))
        .sort((a, b) => b.value - a.value),
      dirisStatsBySheet: dirisStatsBySheetProcessed,
      esquemaStats: esquemaStats
        .map(item => ({
          name: item.esquema_actual,
          value: item._count
        }))
        .sort((a, b) => b.value - a.value),
      tipoStats: tipoStats
        .map(item => ({
          name: item.tipo_esquema,
          value: item._count
        }))
        .sort((a, b) => b.value - a.value),
      condicionStats: condicionStats
        .map(item => ({
          name: item.condicion,
          value: item._count
        }))
        .sort((a, b) => b.value - a.value)
    });
  } catch (error) {
    console.error('Error fetching compliance stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance stats' },
      { status: 500 }
    );
  }
}
