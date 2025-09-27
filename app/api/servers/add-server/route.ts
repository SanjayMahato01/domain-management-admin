import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import prisma from '@/lib/prisma'


export async function POST(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request)
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const body = await request.json()
    
   
    // Check if hostname or IP already exists
    const existingServer = await prisma.server.findFirst({
      where: {
        OR: [
          { hostName: body.hostName },
          { ipAddress: body.ipAddress }
        ]
      }
    })
    
    if (existingServer) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server with this hostname or IP address already exists' 
        },
        { status: 400 }
      )
    }
    
    const server = await prisma.server.create({
      data: body
    })
    
    return NextResponse.json({
      success: true,
      data: server
    }, { status: 201 })
    
  } catch (error : any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.errors 
        },
        { status: 400 }
      )
    }
    
    console.error('Error creating server:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create server' },
      { status: 500 }
    )
  }
}