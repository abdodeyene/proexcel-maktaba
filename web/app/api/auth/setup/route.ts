import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// Creates the admin user if it doesn't exist yet.
// Call once: GET /api/auth/setup
export async function GET() {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: 'proexcel2026@gmail.com' },
    })

    if (existing) {
      return NextResponse.json({ message: 'Admin already exists', email: existing.email })
    }

    const hash = await bcrypt.hash('proexcel2026@@', 10)
    const user = await prisma.user.create({
      data: {
        email: 'proexcel2026@gmail.com',
        password: hash,
        role: 'admin',
      },
    })

    return NextResponse.json({ message: 'Admin created successfully', email: user.email })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(e)
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
