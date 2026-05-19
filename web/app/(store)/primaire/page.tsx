import { prisma } from '@/lib/prisma'
import NiveauPage from '@/components/store/NiveauPage'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function PrimairePage() {
  let products: unknown[] = []

  try {
    products = await prisma.product.findMany({
      where: { niveau: 'Primaire' },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    // DB not reachable at build time
  }

  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text2)' }}>
          Chargement...
        </div>
      }
    >
      <NiveauPage niveau="primaire" initialProducts={products as any} />
    </Suspense>
  )
}
