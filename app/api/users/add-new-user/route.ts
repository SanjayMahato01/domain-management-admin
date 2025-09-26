import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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

    const { name, email, phone, password } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        fullName: name,
        email,
        password: hashedPassword,
        phone: phone || null,
        verified: true,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
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

    const transformedUser = {
      id: newUser.id,
      name: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone || '',
      status: newUser.status?.toLowerCase(),
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