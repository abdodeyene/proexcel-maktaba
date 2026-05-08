import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL || ''

  const envInfo = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    DIRECT_URL: !!process.env.DIRECT_URL,
    JWT_SECRET: !!process.env.JWT_SECRET,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  }

  if (!dbUrl) {
    return NextResponse.json({ message: 'DATABASE_URL and DIRECT_URL are both empty', envInfo }, { status: 500 })
  }

  const adapter = new PrismaPg({ connectionString: dbUrl })
  const prisma = new PrismaClient({ adapter })

  try {
    const existing = await prisma.user.findUnique({
      where: { email: 'proexcel2026@gmail.com' },
    })

    if (existing) {
      return NextResponse.json({ message: 'Admin already exists', email: existing.email, envInfo })
    }

    const hash = await bcrypt.hash('proexcel2026@@', 10)
    const user = await prisma.user.create({
      data: {
        email: 'proexcel2026@gmail.com',
        password: hash,
        role: 'admin',
      },
    })

    return NextResponse.json({ message: 'Admin created successfully', email: user.email, envInfo })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(e)
    return NextResponse.json({ message: msg, envInfo }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
