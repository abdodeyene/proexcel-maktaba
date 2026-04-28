import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-seed-secret')
  if (secret !== process.env.JWT_SECRET) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }
  const existing = await prisma.user.findUnique({ where: { email: 'proexcel2026@gmail.com' } })
  if (!existing) {
    const hashed = await bcrypt.hash('proexcel2026@@', 10)
    await prisma.user.create({
      data: { email: 'proexcel2026@gmail.com', password: hashed, role: 'admin' },
    })
  }
  return NextResponse.json({ ok: true })
}
