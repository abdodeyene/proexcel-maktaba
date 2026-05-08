'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

type Product = {
  id: number
  title: string
  author?: string | null
  price: number
  compareAtPrice?: number | null
  category?: string | null
  g1?: string | null
  g2?: string | null
  emoji?: string | null
  stock: number
  rating?: number | null
  isPromo?: boolean | null
  isNew?: boolean | null
  isBestOffer?: boolean | null
  variants?: any
}

type Category = { id: number; name: string; emoji?: string | null; image?: string | null }

export default function BestOffersClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // States
  const [search, setSearch] = useState('')
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [promoOnly, setPromoOnly] = useState(false)
  const [sort, setSort] = useState('default')

  useEffect(() => {
    const catParam = searchParams.get('cat')
    if (catParam) {
      setSelectedCats([catParam])
    }
    const sortParam = searchParams.get('sort')
    if (sortParam) {
      setSort(sortParam)
    }
  }, [searchParams])

  const toggleCategory = (catName: string) => {
    setSelectedCats(prev => 
      prev.includes(catName) 
        ? prev.filter(c => c !== catName) 
        : [...prev, catName]
    )
  }

  const clearFilters = () => {
    setSelectedCats([])
    setInStockOnly(false)
    setPromoOnly(false)
    setSearch('')
    setSort('default')
    router.push('/best-offers')
  }

  const filtered = useMemo(() => {
    let list = [...products]

    // Category
    if (selectedCats.length > 0) {
      list = list.filter(p => p.category && selectedCats.includes(p.category))
    }

    // In Stock
    if (inStockOnly) {
      list = list.filter(p => p.stock > 0)
    }

    // Promo
    if (promoOnly) {
      list = list.filter(p => p.isPromo)
    }

    // Search
    if (search) {
      list = list.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        (p.author && p.author.toLowerCase().includes(search.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
      )
    }

    // Sorting
    if (sort === 'price-asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sort === 'price-desc') {
      list.sort((a, b) => b.price - a.price)
    } else if (sort === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sort === 'new') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    }

    return list
  }, [products, selectedCats, inStockOnly, promoOnly, search, sort])

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="breadcrumb-nav">
            <Link href="/">Accueil</Link>
            <span>›</span>
            <span>Meilleures Offres</span>
          </div>
          <h1>Meilleures Offres</h1>
          <p>Découvrez toute notre sélection de livres scolaires avec les meilleurs prix</p>
        </div>
      </div>

      <div className="offers-layout">
        <aside className="sidebar">
          <div className="sidebar-title">
            <span>Filtres</span>
            <button className="btn-clear" onClick={clearFilters}>Réinitialiser</button>
          </div>

          {/* Search Bar inside Filters */}
          <div className="filter-block">
            <div className="filter-block-title">Recherche</div>
            <input
              type="text"
              className="navbar-search-input"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', marginTop: '0.5rem', background: 'var(--bg2)', border: '1px solid var(--border)' }}
            />
          </div>

          <div className="filter-block">
            <div className="filter-block-title">Catégorie</div>
            <div className="filter-opts">
              {categories.map(cat => (
                <label key={cat.id} className="f-opt">
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(cat.name)}
                    onChange={() => toggleCategory(cat.name)}
                  />
                  {cat.image && (
                    <img src={cat.image} alt="" style={{width: 20, height: 20, borderRadius: '50%', objectFit: 'cover'}} />
                  )}
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stock & Promo */}
          <div className="filter-block">
            <div className="filter-block-title">Disponibilité</div>
            <div className="filter-opts">
              <label className="f-opt">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                />
                En stock uniquement
              </label>
              <label className="f-opt">
                <input
                  type="checkbox"
                  checked={promoOnly}
                  onChange={e => setPromoOnly(e.target.checked)}
                />
                En promotion
              </label>
            </div>
          </div>
        </aside>

        <div>
          <div className="offers-content-head">
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="default">Trier par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
              <option value="new">Nouveautés</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)' }}>
              Aucun produit ne correspond à vos filtres.
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
