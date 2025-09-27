import { NextRequest, NextResponse } from "next/server"
import  prisma  from "@/lib/prisma"
import { verifyAdmin } from '@/lib/admin-auth'


export async function POST(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request)
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['tldExtension', 'registrarId', 'registrationPrice', 'renewalPrice']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Check if TLD extension already exists
    const existingTLD = await prisma.tld.findUnique({
      where: { tldExtension: body.tldExtension }
    })

    if (existingTLD) {
      return NextResponse.json(
        { success: false, error: "TLD extension already exists" },
        { status: 400 }
      )
    }

    const tld = await prisma.tld.create({
      data: {
        tldExtension: body.tldExtension,
        registrarId: parseInt(body.registrarId),
        category: body.category || 'generic',
        billingCycle: body.billingCycle || 'annually',
        registrationPrice: body.registrationPrice,
        renewalPrice: body.renewalPrice,
        transferPrice: body.transferPrice || '0.00',
        redemptionPrice: body.redemptionPrice || '0.00',
        minimumYears: body.minimumYears || 1,
        maximumYears: body.maximumYears || 10,
        status: body.status !== undefined ? body.status : true,
        autoRenewal: body.autoRenewal !== undefined ? body.autoRenewal : true,
        whoisPrivacy: body.whoisPrivacy !== undefined ? body.whoisPrivacy : true,
        dnssecPrivacy: body.dnssecPrivacy !== undefined ? body.dnssecPrivacy : true,
      },
      include: {
        registrar: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: tld 
    })
  } catch (error) {
    console.error("Error creating TLD:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create TLD" },
      { status: 500 }
    )
  }
}