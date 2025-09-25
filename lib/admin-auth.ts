import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"

export async function verifyAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return { error: 'Unauthorized - No token provided', status: 401 }
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { 
        id: decoded.id,
        username: decoded.username
      }
    })

    if (!admin) {
      return { error: 'Admin not found', status: 404 }
    }

    return { admin, isAdmin: true }
  } catch (error) {
    return { error: 'Invalid token', status: 401 }
  }
}