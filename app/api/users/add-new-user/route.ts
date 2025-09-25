import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import prisma from '@/lib/prisma'

// Add new user
export async function POST(request: NextRequest) {
  try {

    const adminCheck = await verifyAdmin(request)
    if ('error' in adminCheck) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      )
    }

    const { name, email, phone, plan } = await request.json()

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        fullName: name,
        email,
        verified: true,
        status: 'ACTIVE',
      },
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
      }
    })

    // Transform the response
    const transformedUser = {
      id: newUser.id,
      name: newUser.fullName,
      email: newUser.email,
      phone: phone || '',
      status: newUser.status || 'active',
      plan: plan || 'Basic',
      domains: newUser._count.domainPurchased,
      totalVMs: newUser._count.hostingsPurchased,
      totalHosting: newUser._count.hostingsPurchased,
      joined: newUser.createdAt.toISOString().split('T')[0],
    }

    return NextResponse.json(transformedUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}