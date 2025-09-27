import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyAdmin } from '@/lib/admin-auth'
import prisma from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const {id} = await params
  try {
    const adminCheck = await verifyAdmin(request)
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const server = await prisma.server.findUnique({
      where: { id: id }
    })
    
    if (!server) {
      return NextResponse.json(
        { success: false, error: 'Server not found' },
        { status: 404 }
      )
    }
    
    await prisma.server.delete({
      where: { id: id }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Server deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting server:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete server' },
      { status: 500 }
    )
  }
}