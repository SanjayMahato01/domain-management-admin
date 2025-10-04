
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth' 

export async function GET(request: NextRequest) {
  const result = await verifyAdmin(request)

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 401 })
  }

  return NextResponse.json({ currency: result.admin.currency }) // returns: { currency: 'INR' or 'DOLLER' }
}
