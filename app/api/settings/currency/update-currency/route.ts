import { NextRequest, NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const { currency } = await request.json()

    if (!currency || (currency !== 'INR' && currency !== 'DOLLAR')) {
      return NextResponse.json(
        { error: 'Valid currency is required (INR or DOLLAR)' },
        { status: 400 }
      )
    }

    // Update the first admin user (you can modify this based on your auth)
    const admin = await prisma.admin.update({
      where: { id: 1 }, // Update with actual admin ID from session
      data: { currency },
    })

    return NextResponse.json({ currency: admin.currency })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update currency' },
      { status: 500 }
    )
  }
}