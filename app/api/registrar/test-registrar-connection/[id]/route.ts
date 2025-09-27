import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { verifyAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';


interface RouteParams {
  params: {
    id: string;
  }
}


export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const adminCheck = await verifyAdmin(request);
    if ('error' in adminCheck) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const { id } = params;
    
    const registrar = await prisma.registrar.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!registrar) {
      return NextResponse.json(
        { success: false, error: 'Registrar not found' },
        { status: 404 }
      );
    }

    const endpoint = registrar.sandboxMode ? registrar.sandboxApiEndpoint : registrar.apiEndpoint;
    
    try {
      const response = await axios.get(endpoint, {
        timeout: 10000,
        headers: {
          'User-Agent': 'HostPanel-API-Test/1.0'
        }
      });
 
      await prisma.registrar.update({
        where: { id: parseInt(id) },
        data: { lastSyncDate: new Date() }
      });

      return NextResponse.json({
        success: true,
        status: 'connected',
        message: 'API connection successful',
        details: {
          statusCode: response.status,
          responseTime: response.headers['x-response-time'] || 'N/A'
        }
      });
      
    } catch (apiError: any) {
      let errorMessage = 'Connection failed';
      let status = 'disconnected';
      
      if (apiError.code === 'ECONNREFUSED') {
        errorMessage = 'Connection refused - API endpoint unavailable';
      } else if (apiError.code === 'ETIMEDOUT') {
        errorMessage = 'Connection timeout - API not responding';
        status = 'timeout';
      } else if (apiError.response) {
        errorMessage = `HTTP ${apiError.response.status}: ${apiError.response.statusText}`;
        status = 'error';
      }

      return NextResponse.json({
        success: false,
        status: status,
        message: errorMessage,
        details: {
          error: apiError.message,
          code: apiError.code
        }
      });
    }
    
  } catch (error) {
    console.error('Error testing registrar API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to test API connection' },
      { status: 500 }
    );
  }
}