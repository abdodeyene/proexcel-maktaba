import { prisma } from '@/lib/prisma'
import BestOffersClient from './BestOffersClient'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function BestOffersPage() {
  let products: any[] = []
  let categories: any[] = []

  try {
    const fetchDb = Promise.all([
      prisma.product.findMany({ take: 100, orderBy: { createdAt: 'desc' } }),
      prisma.category.findMany({ orderBy: { name: 'asc' } }),
    ])

    const timeout = new Promise<[any[], any[]]>((resolve) =>
      setTimeout(() => resolve([[], []]), 4000)
    )

    ;[products, categories] = await Promise.race([fetchDb, timeout])
  } catch (err) {
    console.error('BestOffersPage server-side query error:', err)
  }

  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text2)' }}>Chargement du catalogue...</div>}>
      <BestOffersClient products={products} categories={categories} />
    </Suspense>
  )
}




