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
    const res = NextResponse.json({ access_token, user: { id: user.id, email: user.email, role: user.role } })
    res.cookies.set('admin_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
