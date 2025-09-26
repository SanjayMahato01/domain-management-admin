import { NextRequest, NextResponse } from 'next/server';

import axios from 'axios';
import { verifyAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';


// GET - Fetch all registrars
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if ('error' in adminCheck) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const registrars = await prisma.registrar.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      data: registrars
    });
  } catch (error) {
    console.error('Error fetching registrars:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registrars' },
      { status: 500 }
    );
  }
}
