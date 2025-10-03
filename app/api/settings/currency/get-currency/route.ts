
import { NextRequest, NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'

export async function GET() {
  try {
    const admin = await prisma.admin.findFirst({
      select: { currency: true }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ currency: admin.currency })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch currency' },
      { status: 500 }
    )
  }
}