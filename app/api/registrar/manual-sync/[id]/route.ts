import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';


interface RouteParams {
  params: {
    id: string;
  }
}

// POST - Manual sync with registrar
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const adminCheck = await verifyAdmin(request);
    if ('error' in adminCheck) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const { id } = params;
    
    const registrar = await prisma.registrar.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!registrar) {
      return NextResponse.json(
        { success: false, error: 'Registrar not found' },
        { status: 404 }
      );
    }

    // Update last sync date
    const updatedRegistrar = await prisma.registrar.update({
      where: { id: parseInt(id) },
      data: { lastSyncDate: new Date() }
    });

    return NextResponse.json({
      success: true,
      data: updatedRegistrar,
      message: 'Manual sync completed'
    });
    
  } catch (error) {
    console.error('Error syncing registrar:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync registrar' },
      { status: 500 }
    );
  }
}