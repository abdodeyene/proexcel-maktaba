import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

type Review = {
  id: string
  name: string
  rating: number
  comment: string
  date: string
}

// GET /api/reviews?productId=X  (admin: all, or by product)
export async function GET(req: NextRequest) {
  try {
    requireAuth(req)
    const productId = req.nextUrl.searchParams.get('productId')

    if (productId) {
      const product = await prisma.product.findUnique({ where: { id: Number(productId) } })
      if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 })
      const reviews: Review[] = Array.isArray(product.reviews) ? (product.reviews as Review[]) : []
      return NextResponse.json({ productId: product.id, title: product.title, reviews })
    }

    const products = await prisma.product.findMany({
      select: { id: true, title: true, reviews: true, rating: true, reviewCount: true }
    })
    const result = products
      .map(p => ({
        productId: p.id,
        title: p.title,
        rating: p.rating,
        reviewCount: p.reviewCount,
        reviews: Array.isArray(p.reviews) ? (p.reviews as Review[]) : []
      }))
      .filter(p => p.reviews.length > 0)
    return NextResponse.json(result)
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

// POST /api/reviews  { productId, name, rating, comment }  (public — customers add reviews)
export async function POST(req: NextRequest) {
  try {
    const { productId, name, rating, comment } = await req.json()
    if (!productId || !name || !rating || !comment)
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 })

    const product = await prisma.product.findUnique({ where: { id: Number(productId) } })
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 })

    const existing: Review[] = Array.isArray(product.reviews) ? (product.reviews as Review[]) : []
    const newReview: Review = {
      id: Date.now().toString(),
      name: String(name).slice(0, 80),
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: String(comment).slice(0, 500),
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    const updated = [...existing, newReview]

    const newAvg = updated.reduce((s, r) => s + r.rating, 0) / updated.length
    await prisma.product.update({
      where: { id: Number(productId) },
      data: { reviews: updated, rating: Math.round(newAvg * 10) / 10, reviewCount: updated.length }
    })

    return NextResponse.json(newReview, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/reviews?productId=X&reviewId=Y  (admin only)
export async function DELETE(req: NextRequest) {
  try {
    requireAuth(req)
    const productId = req.nextUrl.searchParams.get('productId')
    const reviewId = req.nextUrl.searchParams.get('reviewId')
    if (!productId || !reviewId)
      return NextResponse.json({ message: 'Missing params' }, { status: 400 })

    const product = await prisma.product.findUnique({ where: { id: Number(productId) } })
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 })

    const existing: Review[] = Array.isArray(product.reviews) ? (product.reviews as Review[]) : []
    const updated = existing.filter(r => r.id !== reviewId)

    const newAvg = updated.length > 0
      ? updated.reduce((s, r) => s + r.rating, 0) / updated.length
      : product.rating
    await prisma.product.update({
      where: { id: Number(productId) },
      data: { reviews: updated, rating: Math.round(newAvg * 10) / 10, reviewCount: updated.length }
    })

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
