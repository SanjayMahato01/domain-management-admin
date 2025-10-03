import { NextRequest, NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const { name, value } = await request.json()

    if (!name || !value) {
      return NextResponse.json(
        { error: 'Name and value are required' },
        { status: 400 }
      )
    }

    // Upsert - update if exists, create if doesn't
    const tax = await prisma.tax.upsert({
      where: { id: "single" },
      update: {
        name,
        value,
      },
      create: {
        id: "single",
        name,
        value,
      },
    })

    return NextResponse.json(tax)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update tax' },
      { status: 500 }
    )
  }
}