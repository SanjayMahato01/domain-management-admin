import { verifyAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const {id} = await params
  try {
    const adminCheck = await verifyAdmin(request);
    if ('error' in adminCheck) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

  
    
    const registrar = await prisma.registrar.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!registrar) {
      return NextResponse.json(
        { success: false, error: 'Registrar not found' },
        { status: 404 }
      );
    }

    await prisma.registrar.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Registrar deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting registrar:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete registrar' },
      { status: 500 }
    );
  }
}
