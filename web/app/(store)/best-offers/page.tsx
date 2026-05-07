import { prisma } from '@/lib/prisma'
import BestOffersClient from './BestOffersClient'
import { Suspense } from 'react'

export const revalidate = 60

export default async function BestOffersPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text2)' }}>Chargement du catalogue...</div>}>
      <BestOffersClient products={products as any} categories={categories as any} />
    </Suspense>
  )
}


