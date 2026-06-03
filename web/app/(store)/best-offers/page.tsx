import { prisma } from '@/lib/prisma'
import BestOffersClient from './BestOffersClient'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function BestOffersPage() {
  let products: any[] = []
  let categories: any[] = []

  const timeout = (ms: number) => new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Query timeout')), ms))

  try {
    ;[products, categories] = await Promise.race([
      Promise.all([
        prisma.product.findMany({ take: 100, orderBy: { createdAt: 'desc' } }),
        prisma.category.findMany({ orderBy: { name: 'asc' } }),
      ]),
      timeout(3000)
    ]) as any
  } catch (err) {
    console.error('BestOffersPage server-side query failed or timed out:', err)
  }

  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text2)' }}>Chargement du catalogue...</div>}>
      <BestOffersClient products={products} categories={categories} />
    </Suspense>
  )
}



