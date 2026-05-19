'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { useLang } from './LangContext'

export default function RecentlyViewed({ currentId }: { currentId: number }) {
  const [products, setProducts] = useState<any[]>([])
  const { lang } = useLang()
  const isAr = lang === 'ar'

  useEffect(() => {
    // 1. Get current list
    const history = JSON.parse(localStorage.getItem('proexcel_history') || '[]')
    
    // 2. Fetch details for these IDs (excluding current)
    const otherIds = history.filter((id: number) => id !== currentId).slice(0, 4)
    
    if (otherIds.length > 0) {
      fetch(`/api/products?ids=${otherIds.join(',')}`)
        .then(r => r.json())
        .then(data => setProducts(Array.isArray(data) ? data : (data?.products ?? [])))
        .catch(console.error)
    }

    // 3. Add current to history
    const newHistory = [currentId, ...history.filter((id: number) => id !== currentId)].slice(0, 10)
    localStorage.setItem('proexcel_history', JSON.stringify(newHistory))
  }, [currentId])

  if (products.length === 0) return null

  return (
    <section style={{ marginTop: '10rem' }}>
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          {isAr ? 'شوهد مؤخراً' : 'Consultés Récemment'}
        </div>
        <h2 style={{ fontSize: '3rem', fontWeight: 900 }}>
          {isAr ? 'تكملة تسوقك' : 'Poursuivre vos achats'}
        </h2>
      </div>
      <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  )
}
