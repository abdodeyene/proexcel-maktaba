'use client'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'

type Product = {
  id: number; title: string; author?: string | null; price: number
  compareAtPrice?: number | null; category?: string | null
  g1?: string | null; g2?: string | null; emoji?: string | null
  stock: number; rating: number; isPromo: boolean; isNew: boolean; isBestOffer: boolean
}
type Category = { id: number; name: string; emoji?: string | null }

export default function BestOffersClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState(searchParams.get('cat') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || '')
  const [filter, setFilter] = useState('')

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeCat) list = list.filter(p => p.category === activeCat)
    if (filter === 'promo') list = list.filter(p => p.isPromo)
    if (filter === 'new') list = list.filter(p => p.isNew)
    if (search) list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'new') list = list.filter(p => p.isNew).concat(list.filter(p => !p.isNew))
    return list
  }, [products, activeCat, filter, search, sort])

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '.75rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#3b82f6', background: 'rgba(59,130,246,.1)', padding: '.25rem .75rem', borderRadius: 9999, display: 'inline-block', marginBottom: '.75rem' }}>Catalogue</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: '#eef0f5' }}>Tous nos Livres</h1>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher…"
          style={{ background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 9999, padding: '.5rem 1rem', color: '#eef0f5', fontSize: '.85rem', outline: 'none', minWidth: 200 }}
        />
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 9999, padding: '.5rem 1rem', color: '#eef0f5', fontSize: '.85rem', outline: 'none' }}>
          <option value="">Trier par</option>
          <option value="price-asc">Prix ↑</option>
          <option value="price-desc">Prix ↓</option>
          <option value="new">Nouveautés</option>
        </select>
        {['', 'promo', 'new'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '.4rem 1rem', borderRadius: 9999, fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', border: 'none',
            background: filter === f ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : 'rgba(59,130,246,.1)',
            color: filter === f ? '#fff' : '#8b96b0',
          }}>
            {f === '' ? 'Tout' : f === 'promo' ? '🔥 Promos' : '✨ Nouveaux'}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button onClick={() => setActiveCat('')} style={{
          padding: '.35rem .85rem', borderRadius: 9999, fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', border: 'none',
          background: activeCat === '' ? '#3b82f6' : 'rgba(59,130,246,.1)',
          color: activeCat === '' ? '#fff' : '#8b96b0',
        }}>
          Tous
        </button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCat(activeCat === cat.name ? '' : cat.name)} style={{
            padding: '.35rem .85rem', borderRadius: 9999, fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', border: 'none',
            background: activeCat === cat.name ? '#3b82f6' : 'rgba(59,130,246,.1)',
            color: activeCat === cat.name ? '#fff' : '#8b96b0',
          }}>
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      <p style={{ color: '#8b96b0', fontSize: '.82rem', marginBottom: '1.5rem' }}>{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#8b96b0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <p>Aucun livre trouvé.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
