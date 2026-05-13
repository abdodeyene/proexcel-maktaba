import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const NOT_FOUND = NextResponse.json({ message: 'Not found' }, { status: 404 })
const isProd = process.env.NODE_ENV === 'production'

export async function GET(req: NextRequest) {
  // Gate 1: SETUP_SECRET must be configured in env — otherwise this route is completely disabled
  const setupSecret = process.env.SETUP_SECRET
  if (!setupSecret) return NOT_FOUND

  // Gate 2: caller must supply the exact secret — wrong or missing → same 404 (no signal to attackers)
  const provided = req.headers.get('x-setup-secret')
  if (provided !== setupSecret) return NOT_FOUND

  // Secret is valid — proceed with setup logic
  const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL || ''
  if (!dbUrl) {
    return NextResponse.json(
      isProd ? { message: 'Setup unavailable' } : { message: 'DATABASE_URL is not configured' },
      { status: 500 }
    )
  }

  const adapter = new PrismaPg({ connectionString: dbUrl })
  const prisma = new PrismaClient({ adapter })

  try {
    const existing = await prisma.user.findUnique({
      where: { email: 'proexcel2026@gmail.com' },
      select: { id: true },
    })

    if (existing) {
      return NextResponse.json({ message: isProd ? 'Setup already completed' : 'Admin already exists' })
    }

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json(
        isProd ? { message: 'Setup unavailable' } : { message: 'ADMIN_PASSWORD env var is required' },
        { status: 500 }
      )
    }

    const hash = await bcrypt.hash(adminPassword, 12)
    await prisma.user.create({
      data: { email: 'proexcel2026@gmail.com', password: hash, role: 'admin' },
    })

    return NextResponse.json({ message: isProd ? 'Setup completed' : 'Admin created successfully' })
  } catch (e) {
    console.error('Setup error:', e)
    return NextResponse.json(
      isProd ? { message: 'Setup unavailable' } : { message: 'Setup failed' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
