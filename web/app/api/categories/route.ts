import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findMany({ select: { category: true } }),
  ])
  const countMap: Record<string, number> = {}
  for (const p of products) {
    if (p.category) {
      const key = p.category.trim().toUpperCase()
      countMap[key] = (countMap[key] || 0) + 1
    }
  }
  return NextResponse.json(categories.map(c => ({ ...c, count: countMap[c.name.trim().toUpperCase()] || 0 })))
}

export async function POST(req: NextRequest) {
  try {
    requireAuth(req)
    const dto = await req.json()
    const category = await prisma.category.create({ data: dto })
    return NextResponse.json(category, { status: 201 })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
