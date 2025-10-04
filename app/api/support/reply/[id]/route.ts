import { NextRequest } from 'next/server'
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from '@/lib/admin-auth'

interface Params {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const {id} = await params
    const adminCheck = await verifyAdmin(request)
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }
    
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Find the ticket by ticketId
    const ticket = await prisma.ticket.findUnique({
      where: {
        ticketId: id,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Add admin message to the ticket
    const newMessage = await prisma.message.create({
      data: {
        content,
        sender: "ADMIN",
        ticketId: ticket.id,
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error adding message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}