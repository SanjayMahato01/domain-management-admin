import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const tlds = await prisma.tld.findMany({
      include: {
        registrar: true
      },
      orderBy: {
        tldExtension: 'asc'
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: tlds 
    })
  } catch (error) {
    console.error("Error fetching TLDs:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch TLDs" },
      { status: 500 }
    )
  }
}
