import { NextRequest } from 'next/server'
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from '@/lib/admin-auth'

interface Params {
  params: {
    ticketId: string;
  };
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {

    const {ticketId} = await params;
    const adminCheck = await verifyAdmin(request)
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { status } = await request.json();

    if (!status || !["OPEN", "RESOLVED"].includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required" },
        { status: 400 }
      );
    }

    // Find the ticket by ticketId
    const ticket = await prisma.ticket.findUnique({
      where: {
        ticketId: params.ticketId,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { ticketId: ticketId },
      data: { status },
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}