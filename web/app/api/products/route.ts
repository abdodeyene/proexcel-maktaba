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
    const product = await prisma.product.create({
      data: {
        title: dto.title,
        titleAr: dto.titleAr ?? null,
        author: dto.author ?? null,
        price: Number(dto.price),
        compareAtPrice: dto.compareAtPrice ? Number(dto.compareAtPrice) : null,
        category: dto.category ?? null,
        emoji: dto.emoji ?? '📦',
        g1: dto.g1 ?? '#1a237e',
        g2: dto.g2 ?? '#3949ab',
        stock: Number(dto.stock ?? 0),
        isPromo: Boolean(dto.isPromo),
        isBestOffer: Boolean(dto.isBestOffer),
        isNew: Boolean(dto.isNew),
        description: dto.description ?? null,
        descriptionAr: dto.descriptionAr ?? null,
        variants: dto.variants ?? [],
        colors: dto.colors ?? [],
        media: dto.media ?? [],
      },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    const msg = e instanceof Error ? e.message : 'Server error'
    console.error('Product POST error:', e)
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
