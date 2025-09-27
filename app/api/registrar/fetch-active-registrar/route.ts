import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyAdmin } from '@/lib/admin-auth'
import { Status } from "@prisma/client" // ✅ Import the enum properly

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
    const filterActive = searchParams.get('filterActive') === 'true'

    const whereClause = filterActive
      ? { status: Status.ACTIVE } // ✅ Use enum instead of string
      : {}

    const registrars = await prisma.registrar.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: registrars,
    })
  } catch (error) {
    console.error("Error fetching registrars:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch registrars" },
      { status: 500 }
    )
  }
}
