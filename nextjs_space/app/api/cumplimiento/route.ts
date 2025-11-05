
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

    // Get filtered records
    const records = await prisma.cumplimientoRecord.findMany({
      where,
      orderBy: [
        { dd_nombre: 'asc' },
        { esquema_actual: 'asc' }
      ]
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching compliance data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance data' },
      { status: 500 }
    );
  }
}
