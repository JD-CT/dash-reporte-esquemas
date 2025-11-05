
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [dirisOptions, esquemaOptions, tipoOptions] = await Promise.all([
      // Get unique DIRIS values
      prisma.cumplimientoRecord.findMany({
        select: { dd_nombre: true },
        distinct: ['dd_nombre'],
        orderBy: { dd_nombre: 'asc' }
      }),
      
      // Get unique Esquema values
      prisma.cumplimientoRecord.findMany({
        select: { esquema_actual: true },
        distinct: ['esquema_actual'],
        orderBy: { esquema_actual: 'asc' }
      }),
      
      // Get unique Tipo values
      prisma.cumplimientoRecord.findMany({
        select: { tipo_esquema: true },
        distinct: ['tipo_esquema'],
        orderBy: { tipo_esquema: 'asc' }
      })
    ]);

    return NextResponse.json({
      diris: dirisOptions.map(item => item.dd_nombre),
      esquemas: esquemaOptions.map(item => item.esquema_actual),
      tipos: tipoOptions.map(item => item.tipo_esquema)
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}
