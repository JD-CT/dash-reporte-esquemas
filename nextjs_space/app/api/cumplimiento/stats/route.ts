
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
      esquemaStats,
      tipoStats,
      condicionStats
    ] = await Promise.all([
      // Total count
      prisma.cumplimientoRecord.count({ where }),
      
      // Group by DIRIS
      prisma.cumplimientoRecord.groupBy({
        by: ['dd_nombre'],
        where,
        _count: true,
        orderBy: { _count: 'desc' }
      }),
      
      // Group by Esquema
      prisma.cumplimientoRecord.groupBy({
        by: ['esquema_actual'],
        where,
        _count: true,
        orderBy: { _count: 'desc' }
      }),
      
      // Group by Tipo
      prisma.cumplimientoRecord.groupBy({
        by: ['tipo_esquema'],
        where,
        _count: true,
        orderBy: { _count: 'desc' }
      }),
      
      // Group by Condicion
      prisma.cumplimientoRecord.groupBy({
        by: ['condicion'],
        where,
        _count: true,
        orderBy: { _count: 'desc' }
      })
    ]);

    return NextResponse.json({
      totalRecords,
      dirisStats: dirisStats.map(item => ({
        name: item.dd_nombre,
        value: item._count
      })),
      esquemaStats: esquemaStats.map(item => ({
        name: item.esquema_actual,
        value: item._count
      })),
      tipoStats: tipoStats.map(item => ({
        name: item.tipo_esquema,
        value: item._count
      })),
      condicionStats: condicionStats.map(item => ({
        name: item.condicion,
        value: item._count
      }))
    });
  } catch (error) {
    console.error('Error fetching compliance stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance stats' },
      { status: 500 }
    );
  }
}
