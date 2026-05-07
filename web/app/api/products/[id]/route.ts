import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id: Number(id) } })
  if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req)
    const { id } = await params
    const dto = await req.json()
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        title: dto.title,
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
        variants: dto.variants ?? [],
        colors: dto.colors ?? [],
        media: dto.media ?? [],
      },
    })
    return NextResponse.json(product)
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    const msg = e instanceof Error ? e.message : 'Server error'
    console.error('Product PATCH error:', e)
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req)
    const { id } = await params
    await prisma.product.delete({ where: { id: Number(id) } })
    return new NextResponse(null, { status: 204 })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
