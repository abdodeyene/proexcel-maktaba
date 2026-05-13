import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const seedSecret = process.env.SETUP_SECRET
  if (!seedSecret) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }

  const secret = req.headers.get('x-seed-secret')
  if (secret !== seedSecret) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const existing = await prisma.user.findUnique({ where: { email: 'proexcel2026@gmail.com' } })
  if (!existing) {
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json({ message: 'ADMIN_PASSWORD env var is required' }, { status: 500 })
    }
    const hashed = await bcrypt.hash(adminPassword, 12)
    await prisma.user.create({
      data: { email: 'proexcel2026@gmail.com', password: hashed, role: 'admin' },
    })
  }
  return NextResponse.json({ ok: true })
}
