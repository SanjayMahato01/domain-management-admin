
import { NextRequest, NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
       const adminCheck = await verifyAdmin(request)
       if ("error" in adminCheck) {
         return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
       }
     console.log(adminCheck)
    const admin = await prisma.admin.findFirst({
      select: { currency: true }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ currency: admin.currency })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch currency' },
      { status: 500 }
    )
  }
}