
import { NextRequest, NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'

export async function GET() {
  try {
    // Get or create the single tax record
    let tax = await prisma.tax.findUnique({
      where: { id: "single" }
    })

    // If tax doesn't exist, create a default one
    if (!tax) {
      tax = await prisma.tax.create({
        data: {
          id: "single",
          name: "VAT",
          value: "20"
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