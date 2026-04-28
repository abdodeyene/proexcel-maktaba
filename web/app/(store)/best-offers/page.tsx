import { prisma } from '@/lib/prisma'
import BestOffersClient from './BestOffersClient'

export const revalidate = 60

export default async function BestOffersPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])
  return <BestOffersClient products={products} categories={categories} />
}
