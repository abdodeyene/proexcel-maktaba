import { prisma } from '@/lib/prisma'
import BestOffersClient from '../best-offers/BestOffersClient'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function LyceePage() {
  let products: unknown[] = []
  let categories: unknown[] = []

  try {
    ;[products, categories] = await Promise.all([
      prisma.product.findMany({ where: { niveau: 'Lycee' }, orderBy: { createdAt: 'desc' } }),
      prisma.category.findMany({ orderBy: { name: 'asc' } }),
    ])
  } catch {
    // DB not reachable at build time
  }

  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text2)' }}>Chargement...</div>}>
      <BestOffersClient
        products={products as any}
        categories={categories as any}
        pageTitle="Niveau Lycée"
        pageSubtitle="Toute la fourniture scolaire pour les lycéens"
      />
    </Suspense>
  )
}
