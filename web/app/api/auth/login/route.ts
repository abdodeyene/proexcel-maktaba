import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    const access_token = signToken({ id: user.id, email: user.email, role: user.role })
    return NextResponse.json({ access_token, user: { id: user.id, email: user.email, role: user.role } })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
