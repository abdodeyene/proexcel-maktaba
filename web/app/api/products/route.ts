import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const isPromo = searchParams.get('isPromo')
    const isBestOffer = searchParams.get('isBestOffer')
    const isNew = searchParams.get('isNew')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (isPromo === 'true') where.isPromo = true
    if (isBestOffer === 'true') where.isBestOffer = true
    if (isNew === 'true') where.isNew = true
    if (search) where.title = { contains: search, mode: 'insensitive' }

    const products = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAuth(req)
    const dto = await req.json()
    const product = await prisma.product.create({ data: dto })
    return NextResponse.json(product, { status: 201 })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
