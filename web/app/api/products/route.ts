import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    console.log('[/api/products] params:', Object.fromEntries(searchParams))

    // ── Parse filters ───────────────────────────────────────────────────────
    const categoryNames = searchParams.getAll('category')
    const search        = searchParams.get('search')?.trim() ?? ''
    const minPrice      = parseFloat(searchParams.get('minPrice') ?? '0') || 0
    const maxPrice      = parseFloat(searchParams.get('maxPrice') ?? '999999') || 999999
    const inStock       = searchParams.get('inStock') === 'true'
    const onSale        = searchParams.get('onSale') === 'true'
    const sortBy        = searchParams.get('sortBy') ?? 'default'
    const niveau        = searchParams.get('niveau')
    const subject       = searchParams.get('subject')
    const isPromo       = searchParams.get('isPromo')
    const isBestOffer   = searchParams.get('isBestOffer')
    const isNew         = searchParams.get('isNew')
    const ids           = searchParams.get('ids')
    const page          = Math.max(1, parseInt(searchParams.get('page') ?? '1') || 1)
    const limit         = Math.min(500, parseInt(searchParams.get('limit') ?? '200') || 200)

    // ── Build WHERE clause ──────────────────────────────────────────────────
    const where: Record<string, unknown> = {}

    if (ids) {
      where.id = { in: ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) }
    }

    if (categoryNames.length > 0) {
      where.category = { in: categoryNames }
    }

    if (minPrice > 0 || maxPrice < 999999) {
      where.price = { gte: minPrice, lte: maxPrice }
    }

    if (inStock) {
      where.stock = { gt: 0 }
    }

    if (onSale) {
      where.compareAtPrice = { not: null }
    }

    if (isPromo === 'true')      where.isPromo = true
    if (isBestOffer === 'true')  where.isBestOffer = true
    if (isNew === 'true')        where.isNew = true

    if (niveau) where.niveau = niveau.trim().slice(0, 100)
    if (subject && subject !== 'all') where.subject = subject.trim().slice(0, 100)

    if (search) {
      const sanitized = search.replace(/[<>]/g, '').slice(0, 100)
      if (sanitized) {
        const searchNum = parseFloat(sanitized)
        where.OR = [
          { title:         { contains: sanitized, mode: 'insensitive' } },
          { titleAr:       { contains: sanitized, mode: 'insensitive' } },
          { category:      { contains: sanitized, mode: 'insensitive' } },
          { description:   { contains: sanitized, mode: 'insensitive' } },
          { descriptionAr: { contains: sanitized, mode: 'insensitive' } },
          { author:        { contains: sanitized, mode: 'insensitive' } },
          ...(isNaN(searchNum) ? [] : [
            { price: { gte: searchNum - 5, lte: searchNum + 5 } },
          ]),
        ]
      }
    }

    // ── Build ORDER BY ──────────────────────────────────────────────────────
    const orderBy: Record<string, string> =
      sortBy === 'price_asc'  ? { price: 'asc' }      :
      sortBy === 'price_desc' ? { price: 'desc' }     :
      sortBy === 'newest'     ? { createdAt: 'desc' } :
      sortBy === 'popular'    ? { rating: 'desc' }    :
      { createdAt: 'desc' }

    // ── Query ───────────────────────────────────────────────────────────────
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) })

  } catch (error) {
    console.error('[/api/products] FULL ERROR:', error)
    console.error('[/api/products] Stack:', error instanceof Error ? error.stack : 'no stack')

    return NextResponse.json(
      {
        message: 'Server error',
        ...(process.env.NODE_ENV === 'development' && {
          error: error instanceof Error ? error.message : String(error),
        }),
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAuth(req)
    const dto = await req.json()
    const product = await prisma.product.create({
      data: {
        title:         dto.title,
        titleAr:       dto.titleAr       ?? null,
        author:        dto.author        ?? null,
        price:         Number(dto.price),
        compareAtPrice: dto.compareAtPrice ? Number(dto.compareAtPrice) : null,
        costPrice:     dto.costPrice     ? Number(dto.costPrice) : null,
        category:      dto.category      ?? null,
        niveau:        dto.niveau        ?? null,
        subject:       dto.subject       ?? null,
        emoji:         dto.emoji         ?? '📦',
        g1:            dto.g1            ?? '#1a237e',
        g2:            dto.g2            ?? '#3949ab',
        stock:         Number(dto.stock  ?? 0),
        isPromo:       Boolean(dto.isPromo),
        isBestOffer:   Boolean(dto.isBestOffer),
        isNew:         Boolean(dto.isNew),
        description:   dto.description   ?? null,
        descriptionAr: dto.descriptionAr ?? null,
        variants:      dto.variants      ?? [],
        colors:        dto.colors        ?? [],
        media:         dto.media         ?? [],
      },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    console.error('Product POST error:', e)
    return NextResponse.json({ message: e instanceof Error ? e.message : 'Server error' }, { status: 500 })
  }
}
