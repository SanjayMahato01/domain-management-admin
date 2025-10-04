
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request)
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }
    let tax = await prisma.tax.findUnique({
      where: { id: "single" }
    })

    // If tax doesn't exist, create a default one
    if (!tax) {
      tax = await prisma.tax.create({
        data: {
          id: "single",
          name: "VAT",
          value: "5"
        }
      })
    }

    return NextResponse.json(tax)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tax' },
      { status: 500 }
    )
  }
}