import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const product = await prisma.product.findUnique({ where: { id: Number(id) } })
    if (!product) notFound()

    const relatedProducts = await prisma.product.findMany({
      where: { category: product.category, id: { not: product.id } },
      take: 4
    })

    return <ProductDetailClient product={product as any} relatedProducts={relatedProducts as any} />
  } catch {
    notFound()
  }
}

