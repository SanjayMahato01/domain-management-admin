import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request)
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const servers = await prisma.server.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({
      success: true,
      data: servers
    })
  } catch (error) {
    console.error('Error fetching servers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch servers' },
      { status: 500 }
    )
  }
}