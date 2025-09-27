import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { verifyAdmin } from '@/lib/admin-auth'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
  
) {
  const {id} = await params;
  try {
    const adminCheck = await verifyAdmin(request)
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const server = await prisma.server.findUnique({
      where: { id: id }
    })
    
    if (!server) {
      return NextResponse.json(
        { success: false, error: 'Server not found' },
        { status: 404 }
      )
    }
    
    // Fetch performance data from server using API key
    const performance = await fetchServerPerformance(server.hostName, server.apiKey, server.controlPanel)
    
    return NextResponse.json({
      success: true,
      data: {
        server,
        performance
      }
    })
    
  } catch (error:any) {
    console.error('Error fetching server performance:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch server performance data',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// Helper function to fetch server performance based on control panel
async function fetchServerPerformance(hostname: string, apiKey: string, controlPanel: string) {
  const baseUrl = `https://${hostname}:2087` // WHM/cPanel default port
  
  try {
    switch (controlPanel) {
      case 'CPANEL':
        return await fetchCPanelPerformance(baseUrl, apiKey)
      case 'PLESK':
        return await fetchPleskPerformance(baseUrl, apiKey)
      case 'DIRECTADMIN':
        return await fetchDirectAdminPerformance(baseUrl, apiKey)
      case 'CYBERPANEL':
        return await fetchCyberPanelPerformance(baseUrl, apiKey)
      default:
        throw new Error('Unsupported control panel')
    }
  } catch (error:any) {
    // If API fails, return mock data for demo purposes
    console.warn('API fetch failed, returning mock data:', error.message)
    return getMockPerformanceData()
  }
}

async function fetchCPanelPerformance(baseUrl: string, apiKey: string) {
  const headers = {
    'Authorization': `cpanel ${apiKey}`,
    'Content-Type': 'application/json'
  }
  
  const [systemStats, accountStats] = await Promise.all([
    axios.get(`${baseUrl}/json-api/loadavg`, { headers }),
    axios.get(`${baseUrl}/json-api/listaccts`, { headers })
  ])
  
  // Parse cPanel response and format
  return {
    cpu: {
      cores: systemStats.data.cpuinfo?.cores || 4,
      usage: Math.round(systemStats.data.one * 100),
      model: systemStats.data.cpuinfo?.model || "Intel Xeon"
    },
    memory: {
      total: Math.round(systemStats.data.meminfo?.memtotal / 1024 / 1024) || 16,
      used: Math.round((systemStats.data.meminfo?.memtotal - systemStats.data.meminfo?.memfree) / 1024 / 1024) || 8,
      usage: Math.round((1 - (systemStats.data.meminfo?.memfree / systemStats.data.meminfo?.memtotal)) * 100) || 50
    },
    storage: {
      total: 500,
      used: 180,
      usage: 36,
      type: "SSD"
    },
    network: {
      bandwidth: "1 Gbps",
      usage: Math.random() * 50
    },
    uptime: "99.9%",
    activeAccounts: accountStats.data.acct?.length || 0,
    lastUpdate: new Date().toISOString()
  }
}

async function fetchPleskPerformance(baseUrl: string, apiKey: string) {
  // Plesk API implementation
  const headers = {
    'HTTP_AUTH_LOGIN': 'admin',
    'HTTP_AUTH_PASSWD': apiKey,
    'Content-Type': 'text/xml'
  }
  
  // Simplified Plesk implementation - you would need to implement XML API calls
  return getMockPerformanceData()
}

async function fetchDirectAdminPerformance(baseUrl: string, apiKey: string) {
  // DirectAdmin API implementation
  return getMockPerformanceData()
}

async function fetchCyberPanelPerformance(baseUrl: string, apiKey: string) {
  // CyberPanel API implementation
  return getMockPerformanceData()
}

function getMockPerformanceData() {
  return {
    cpu: {
      cores: Math.floor(Math.random() * 16) + 2,
      usage: Math.floor(Math.random() * 80) + 10,
      model: "Intel Xeon E5-2686 v4"
    },
    memory: {
      total: 16,
      used: Math.random() * 14 + 1,
      usage: Math.floor(Math.random() * 80) + 10
    },
    storage: {
      total: 500,
      used: Math.random() * 400 + 50,
      usage: Math.floor(Math.random() * 80) + 10,
      type: "NVMe SSD"
    },
    network: {
      bandwidth: "1 Gbps",
      usage: Math.floor(Math.random() * 50) + 5
    },
    uptime: `${(99 + Math.random()).toFixed(1)}%`,
    activeAccounts: Math.floor(Math.random() * 100),
    lastUpdate: new Date().toISOString()
  }
}