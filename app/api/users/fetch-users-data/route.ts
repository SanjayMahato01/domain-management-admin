import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request)
    if ('error' in adminCheck) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    // Build where clause - handle null status
    const where: any = {
      verified: true
    }

    // Handle status filter - account for null values
    if (status !== 'all') {
      if (status === 'null') {
        where.status = null
      } else {
        where.status = status
      }
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Fetch users with safe enum handling
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            hostingsPurchased: true,
            domainPurchased: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data with safe status handling
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.fullName,
      email: user.email,
      phone: '',
      // Handle null status by providing a default
      status: user.status || 'active', // This will handle null values
      plan: 'Basic',
      domains: user._count.domainPurchased,
      totalVMs: user._count.hostingsPurchased,
      totalHosting: user._count.hostingsPurchased,
      joined: user.createdAt.toISOString().split('T')[0],
    }))

    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}