import { prisma } from '@/lib/prisma'
import NiveauPage from '@/components/store/NiveauPage'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const VALID_NIVEAUX = ['primaire', 'college', 'lycee']

// Normalise slug → DB value (handles both capitalizations)
function toDbNiveau(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1)
}

export default async function NiveauDynamicPage({
  params,
}: {
  params: Promise<{ niveau: string }>
}) {
  const { niveau: niveauRaw } = await params
  const niveau = niveauRaw.toLowerCase()

  if (!VALID_NIVEAUX.includes(niveau)) {
    notFound()
  }

  let products: unknown[] = []

  try {
    products = await prisma.product.findMany({
      where: { niveau: toDbNiveau(niveau) },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    // DB not reachable at build time — show empty grid
    products = []
  }

  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text2)' }}>
          Chargement...
        </div>
      }
    >
      <NiveauPage niveau={niveau} initialProducts={products as any} />
    </Suspense>
  )
}
