import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'

export async function PUT(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request)
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { currency } = await request.json()

    const validCurrencies = ['DOLLAR', 'INR']
    if (!currency || !validCurrencies.includes(currency)) {
      return NextResponse.json(
        { error: 'Invalid currency' },
        { status: 400 }
      )
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: adminCheck.admin.id },
      data: { currency },
      select: { currency: true }
    })

    return NextResponse.json({ 
      message: 'Currency updated successfully',
      currency: updatedAdmin.currency 
    })
  } catch (error) {
    console.error('Update currency error:', error)
    return NextResponse.json(
      { error: 'Failed to update currency' },
      { status: 500 }
    )
  }
}