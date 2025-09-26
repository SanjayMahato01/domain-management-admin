import { NextRequest, NextResponse } from 'next/server';

import { verifyAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if ('error' in adminCheck) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const { name, website, apiEndpoint, sandboxApiEndpoint } = body;
    
    if (!name || !website || !apiEndpoint) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const registrar = await prisma.registrar.create({
      data: {
        name: body.name,
        website: body.website,
        apiEndpoint: body.apiEndpoint,
        sandboxApiEndpoint: body.sandboxApiEndpoint || body.apiEndpoint,
        commissionPercentage: body.commissionPercentage ? parseFloat(body.commissionPercentage) : null,
        status: body.status || 'ACTIVE',
        sandboxMode: body.sandboxMode || false
      }
    });

    return NextResponse.json({
      success: true,
      data: registrar,
      message: 'Registrar created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating registrar:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create registrar' },
      { status: 500 }
    );
  }
}