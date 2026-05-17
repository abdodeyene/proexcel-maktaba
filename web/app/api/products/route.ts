import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const niveau = searchParams.get('niveau')
    const isPromo = searchParams.get('isPromo')
    const isBestOffer = searchParams.get('isBestOffer')
    const isNew = searchParams.get('isNew')
    const search = searchParams.get('search')
    const ids = searchParams.get('ids')

    const where: Record<string, unknown> = {}
    if (ids) {
      where.id = { in: ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) }
    }
    if (category) where.category = category.trim().slice(0, 100)
    if (niveau) where.niveau = niveau.trim().slice(0, 100)
    if (isPromo === 'true') where.isPromo = true
    if (isBestOffer === 'true') where.isBestOffer = true
    if (isNew === 'true') where.isNew = true
    if (search) {
      const sanitized = search.trim().replace(/[<>]/g, '').slice(0, 100)
      if (sanitized) {
        const searchNum = parseFloat(sanitized)
        where.OR = [
          { title: { contains: sanitized, mode: 'insensitive' } },
          { titleAr: { contains: sanitized, mode: 'insensitive' } },
          { category: { contains: sanitized, mode: 'insensitive' } },
          { description: { contains: sanitized, mode: 'insensitive' } },
          { descriptionAr: { contains: sanitized, mode: 'insensitive' } },
          { author: { contains: sanitized, mode: 'insensitive' } },
          ...(isNaN(searchNum) ? [] : [
            { price: { gte: searchNum - 5, lte: searchNum + 5 } },
            { id: isNaN(parseInt(sanitized)) ? undefined : { equals: parseInt(sanitized) } }
          ].filter(x => x !== undefined))
        ]
      }
    }

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
        costPrice: dto.costPrice ? Number(dto.costPrice) : null,
        category: dto.category ?? null,
        niveau: dto.niveau ?? null,
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
