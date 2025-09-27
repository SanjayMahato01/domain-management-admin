import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import prisma from '@/lib/prisma'

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const adminCheck = await verifyAdmin(request)
//     if ("error" in adminCheck) {
//       return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
//     }

//     const server = await prisma.server.findUnique({
//       where: { id: params.id }
//     })
    
//     if (!server) {
//       return NextResponse.json(
//         { success: false, error: 'Server not found' },
//         { status: 404 }
//       )
//     }
    
//     return NextResponse.json({
//       success: true,
//       data: server
//     })
//   } catch (error) {
//     console.error('Error fetching server:', error)
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch server' },
//       { status: 500 }
//     )
//   }
// }


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {

  const {id} = await params;
  try {
    const adminCheck = await verifyAdmin(request)
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const body = await request.json()

    // Check if server exists
    const existingServer = await prisma.server.findUnique({
      where: { id: id }
    })
    
    if (!existingServer) {
      return NextResponse.json(
        { success: false, error: 'Server not found' },
        { status: 404 }
      )
    }
    
    // Check for conflicts only if hostname or IP is being updated
    if (body.hostName || body.ipAddress) {
      const conflictingServer = await prisma.server.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                ...(body.hostName ? [{ hostName: body.hostName }] : []),
                ...(body.ipAddress ? [{ ipAddress: body.ipAddress }] : [])
              ]
            }
          ]
        }
      })
      
      if (conflictingServer) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Another server with this hostname or IP address already exists' 
          },
          { status: 400 }
        )
      }
    }
    
    const updatedServer = await prisma.server.update({
      where: { id: id },
      data: body
    })
    
    return NextResponse.json({
      success: true,
      data: updatedServer
    })
    
  } catch (error:any) {
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
    
    console.error('Error updating server:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update server' },
      { status: 500 }
    )
  }
}

