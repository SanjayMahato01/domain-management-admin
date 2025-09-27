import { NextRequest, NextResponse } from "next/server"
import  prisma  from "@/lib/prisma"
import { verifyAdmin } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tld = await prisma.tld.findUnique({
      where: { id: params.id },
      include: { registrar: true }
    })

    if (!tld) {
      return NextResponse.json(
        { success: false, error: "TLD not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: tld })
  } catch (error) {
    console.error("Error fetching TLD:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch TLD" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await verifyAdmin(request)
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const body = await request.json()
    
    // Check if TLD exists
    const existingTLD = await prisma.tld.findUnique({
      where: { id: params.id }
    })

    if (!existingTLD) {
      return NextResponse.json(
        { success: false, error: "TLD not found" },
        { status: 404 }
      )
    }

    // If changing extension, check if new one already exists
    if (body.tldExtension && body.tldExtension !== existingTLD.tldExtension) {
      const duplicateTLD = await prisma.tld.findUnique({
        where: { tldExtension: body.tldExtension }
      })

      if (duplicateTLD) {
        return NextResponse.json(
          { success: false, error: "TLD extension already exists" },
          { status: 400 }
        )
      }
    }

    const updatedTLD = await prisma.tld.update({
      where: { id: params.id },
      data: {
        tldExtension: body.tldExtension,
        registrarId: body.registrarId ? parseInt(body.registrarId) : undefined,
        category: body.category,
        billingCycle: body.billingCycle,
        registrationPrice: body.registrationPrice,
        renewalPrice: body.renewalPrice,
        transferPrice: body.transferPrice,
        redemptionPrice: body.redemptionPrice,
        minimumYears: body.minimumYears,
        maximumYears: body.maximumYears,
        status: body.status,
        autoRenewal: body.autoRenewal,
        whoisPrivacy: body.whoisPrivacy,
        dnssecPrivacy: body.dnssecPrivacy,
      },
      include: {
        registrar: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: updatedTLD 
    })
  } catch (error) {
    console.error("Error updating TLD:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update TLD" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await verifyAdmin(request)
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    // Check if TLD exists
    const existingTLD = await prisma.tld.findUnique({
      where: { id: params.id }
    })

    if (!existingTLD) {
      return NextResponse.json(
        { success: false, error: "TLD not found" },
        { status: 404 }
      )
    }

    await prisma.tld.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      success: true, 
      message: "TLD deleted successfully" 
    })
  } catch (error) {
    console.error("Error deleting TLD:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete TLD" },
      { status: 500 }
    )
  }
}