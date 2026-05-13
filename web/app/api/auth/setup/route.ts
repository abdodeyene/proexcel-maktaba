import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Protected setup endpoint — requires SETUP_SECRET header to function.
// Set SETUP_SECRET in your environment variables to enable this route.
// In production, remove or rotate SETUP_SECRET after first use.
export async function GET(req: NextRequest) {
  const setupSecret = process.env.SETUP_SECRET
  if (!setupSecret) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }

  const providedSecret = req.headers.get('x-setup-secret')
  if (providedSecret !== setupSecret) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL || ''
  if (!dbUrl) {
    return NextResponse.json({ message: 'DATABASE_URL is not configured' }, { status: 500 })
  }

  const adapter = new PrismaPg({ connectionString: dbUrl })
  const prisma = new PrismaClient({ adapter })

  try {
    const existing = await prisma.user.findUnique({
      where: { email: 'proexcel2026@gmail.com' },
    })

    if (existing) {
      return NextResponse.json({ message: 'Admin already exists' })
    }

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json({ message: 'ADMIN_PASSWORD env var is required' }, { status: 500 })
    }

    const hash = await bcrypt.hash(adminPassword, 12)
    await prisma.user.create({
      data: {
        email: 'proexcel2026@gmail.com',
        password: hash,
        role: 'admin',
      },
    })

    return NextResponse.json({ message: 'Admin created successfully' })
  } catch (e) {
    console.error('Setup error:', e)
    return NextResponse.json({ message: 'Setup failed' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
