import { NextRequest, NextResponse } from 'next/server';

import { verifyAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const adminCheck = await verifyAdmin(request)
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { id } = params
    const body = await request.json()

    const registrar = await prisma.registrar.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!registrar) {
      return NextResponse.json({ success: false, error: "Registrar not found" }, { status: 404 })
    }

    const updatedRegistrar = await prisma.registrar.update({
      where: { id: Number.parseInt(id) },
      data: {
        name: body.name,
        website: body.website,
        apiEndpoint: body.apiEndpoint,
        sandboxApiEndpoint: body.sandboxApiEndpoint || body.apiEndpoint,
        apiKey: body.apiKey,
        commissionPercentage: body.commissionPercentage ? Number.parseFloat(body.commissionPercentage) : null,
        status: body.status || "ACTIVE",
        sandboxMode: body.sandboxMode || false,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedRegistrar,
      message: "Registrar updated successfully",
    })
  } catch (error) {
    console.error("Error updating registrar:", error)
    return NextResponse.json({ success: false, error: "Failed to update registrar" }, { status: 500 })
  }
}