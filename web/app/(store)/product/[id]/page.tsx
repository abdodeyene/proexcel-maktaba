import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductPage from '@/components/store/ProductPage'

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const product = await prisma.product.findUnique({ where: { id: Number(id) } })
    if (!product) notFound()

    const relatedProductsRaw = await prisma.product.findMany({
      where: { category: product.category, id: { not: product.id } },
      take: 4
    })

    const mapProduct = (p: any) => ({
      id: String(p.id),
      name: p.title,
      slug: String(p.id),
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      images: Array.isArray(p.media) ? p.media : [],
      category: { name: p.category || 'Livre', slug: p.category?.toLowerCase() || 'livre' },
      stock: p.stock,
      sku: `PE-${p.id}`,
      rating: p.rating || 4.5,
      reviewCount: p.reviewCount || 0,
      soldCount: 15 + (p.id % 40), // Realistic mock
      description: p.description || '',
      isFeatured: p.isBestOffer || false,
      reviews: Array.isArray(p.reviews) ? p.reviews : [],
    })

    return (
      <ProductPage 
        product={mapProduct(product)} 
        relatedProducts={relatedProductsRaw.map(mapProduct)} 
      />
    )
  } catch {
    notFound()
  }
}

