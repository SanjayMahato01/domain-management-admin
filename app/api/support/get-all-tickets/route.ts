
import { NextRequest } from 'next/server'
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request)
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { ticketId: { contains: search, mode: 'insensitive' } },
        { user: { 
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          } 
        }
      ];
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    const formattedTickets = tickets.map(ticket => ({
      id: ticket.id,
      ticketId: ticket.ticketId,
      subject: ticket.subject,
      category: ticket.category,
      status: ticket.status,
      date: ticket.date,
      userName: ticket.user.fullName,
      userEmail: ticket.user.email,
      messages: ticket.messages
    }));

    return NextResponse.json(formattedTickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}