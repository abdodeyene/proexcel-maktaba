'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import Image from 'next/image'
import {
  SlidersHorizontal,
  RotateCcw,
  Search,
  X,
  Check,
  ChevronDown,
} from '@/components/LucideIcons'

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
  variants?: unknown
}

type Category = {
  id: number
  name: string
  emoji?: string | null
  image?: string | null
  count?: number
  _count?: { products?: number }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const titleCase = (s: string) =>
  s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')

// ─── Premium CheckRow ─────────────────────────────────────────────────────────

function CheckRow({
  selected, onClick, children,
}: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`flex items-center gap-3 rounded-[14px] cursor-pointer select-none transition-all duration-[180ms] ${!selected ? 'hover:bg-[#f8fafc]' : ''}`}
      style={{
        padding: '10px 12px',
        marginBottom: '6px',
        background: selected ? '#fff1f2' : undefined,
        border: selected ? '1px solid #fecdd3' : '1px solid transparent',
      }}
    >
      {/* Custom checkbox */}
      <div
        className="flex-shrink-0 flex items-center justify-center transition-all duration-[180ms]"
        style={{
          width: '20px', height: '20px', borderRadius: '6px',
          border: selected ? '2px solid #ef233c' : '2px solid #cbd5e1',
          background: selected ? '#ef233c' : '#ffffff',
        }}
      >
        {selected && (
          <Check style={{ width: '11px', height: '11px', color: '#fff', strokeWidth: 3 }} />
        )}
      </div>
      {children}
    </div>
  )
}

// ─── Section title ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '12px', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '0.12em', color: '#ef233c', marginBottom: '12px',
    }}>
      {children}
    </p>
  )
}

// ─── Premium FilterPanel ──────────────────────────────────────────────────────

function FilterPanel({
  categories,
  selectedCats,
  toggleCategory,
  isCatSelected,
  inStockOnly, setInStockOnly,
  promoOnly,   setPromoOnly,
  priceMin,    setPriceMin,
  priceMax,    setPriceMax,
  searchQuery, setSearchQuery,
  clearFilters,
  hasActiveFilters,
  activeFilterCount,
  onApply,
}: {
  categories: Category[]
  selectedCats: string[]
  toggleCategory: (name: string) => void
  isCatSelected: (name: string) => boolean
  inStockOnly: boolean; setInStockOnly: (v: boolean) => void
  promoOnly: boolean;   setPromoOnly:   (v: boolean) => void
  priceMin: number;     setPriceMin:    (v: number) => void
  priceMax: number;     setPriceMax:    (v: number) => void
  searchQuery: string;  setSearchQuery: (v: string) => void
  clearFilters: () => void
  hasActiveFilters: boolean
  activeFilterCount: number
  onApply?: () => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal style={{ width: '18px', height: '18px', color: '#ef233c', flexShrink: 0 }} strokeWidth={2.2} />
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a', letterSpacing: '-0.01em' }}>Filtres</span>
          {activeFilterCount > 0 && (
            <span style={{
              background: '#ef233c', color: '#fff', fontSize: '11px', fontWeight: 700,
              minWidth: '20px', height: '20px', padding: '0 6px',
              borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
            }}>
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={clearFilters}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '13px', fontWeight: 700,
            color: hasActiveFilters ? '#ef233c' : '#94a3b8',
            cursor: hasActiveFilters ? 'pointer' : 'default',
            background: 'none', border: 'none', padding: 0,
            transition: 'color 150ms',
            pointerEvents: hasActiveFilters ? 'auto' : 'none',
          }}
        >
          <RotateCcw style={{ width: '13px', height: '13px' }} strokeWidth={2.3} />
          Réinitialiser
        </button>
      </div>

      {/* ── Search ──────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', marginBottom: '26px' }}>
        <Search
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8', pointerEvents: 'none', flexShrink: 0 }}
          strokeWidth={2}
        />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%', height: '48px', boxSizing: 'border-box',
            paddingLeft: '44px', paddingRight: searchQuery ? '40px' : '16px',
            fontSize: '14px', fontWeight: 500, color: '#1e293b',
            background: '#f8fafc', border: '1.5px solid #e5e7eb',
            borderRadius: '14px', outline: 'none',
            transition: 'border-color 150ms, box-shadow 150ms',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#ef233c'
            e.target.style.boxShadow = '0 0 0 3px rgba(239,35,60,0.1)'
            e.target.style.background = '#fff'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb'
            e.target.style.boxShadow = 'none'
            e.target.style.background = '#f8fafc'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: '4px' }}
          >
            <X style={{ width: '14px', height: '14px' }} />
          </button>
        )}
      </div>

      {/* ── Categories ──────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <div style={{ marginBottom: '26px' }}>
          <SectionTitle>Catégorie</SectionTitle>
          <div>
            {categories.map((cat) => {
              const selected = isCatSelected(cat.name)
              const count = cat.count ?? cat._count?.products ?? 0
              return (
                <CheckRow key={cat.id} selected={selected} onClick={() => toggleCategory(cat.name)}>
                  {/* Thumbnail */}
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
                    overflow: 'hidden', background: '#f1f5f9', border: '1px solid #e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {cat.image ? (
                      <Image src={cat.image} alt={cat.name} width={34} height={34} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    ) : cat.emoji ? (
                      <span style={{ fontSize: '16px', lineHeight: 1 }}>{cat.emoji}</span>
                    ) : (
                      <span style={{ fontSize: '14px', color: '#94a3b8' }}>📁</span>
                    )}
                  </div>
                  {/* Name */}
                  <span style={{
                    fontSize: '15px', fontWeight: 700, flex: 1,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    color: selected ? '#dc2626' : '#1e293b', transition: 'color 150ms',
                  }}>
                    {titleCase(cat.name)}
                  </span>
                  {/* Count */}
                  {count > 0 && (
                    <span style={{ fontSize: '12px', flexShrink: 0, color: selected ? '#dc2626' : '#94a3b8' }}>
                      {count}
                    </span>
                  )}
                </CheckRow>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Price ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '26px' }}>
        <SectionTitle>Prix</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <input
            type="number"
            value={priceMin === 0 ? '' : priceMin}
            min={0}
            max={9999}
            placeholder="0"
            onChange={(e) => setPriceMin(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
            style={{
              flex: 1, height: '44px', borderRadius: '12px', boxSizing: 'border-box',
              border: '1.5px solid #e5e7eb', background: '#f8fafc',
              textAlign: 'center', fontWeight: 700, fontSize: '14px', color: '#1e293b',
              outline: 'none', padding: '0 8px',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#ef233c'; e.target.style.background = '#fff' }}
            onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f8fafc' }}
          />
          <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: '18px', flexShrink: 0, lineHeight: 1 }}>—</span>
          <input
            type="number"
            value={priceMax === 9999 ? '' : priceMax}
            min={0}
            max={9999}
            placeholder="9 999"
            onChange={(e) => setPriceMax(e.target.value === '' ? 9999 : Math.max(0, Number(e.target.value)))}
            style={{
              flex: 1, height: '44px', borderRadius: '12px', boxSizing: 'border-box',
              border: '1.5px solid #e5e7eb', background: '#f8fafc',
              textAlign: 'center', fontWeight: 700, fontSize: '14px', color: '#1e293b',
              outline: 'none', padding: '0 8px',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#ef233c'; e.target.style.background = '#fff' }}
            onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f8fafc' }}
          />
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', margin: 0 }}>
          {priceMin > 0 ? priceMin : 0} DH — {priceMax === 9999 ? '9 999' : priceMax} DH
        </p>
      </div>

      {/* ── Availability ────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '8px' }}>
        <SectionTitle>Disponibilité</SectionTitle>
        {[
          { id: 'inStock', label: 'En stock uniquement', value: inStockOnly, set: setInStockOnly },
          { id: 'onSale',  label: 'En promotion',        value: promoOnly,   set: setPromoOnly  },
        ].map((opt) => (
          <CheckRow key={opt.id} selected={opt.value} onClick={() => opt.set(!opt.value)}>
            <span style={{
              fontSize: '15px', fontWeight: 700,
              color: opt.value ? '#dc2626' : '#1e293b', transition: 'color 150ms',
            }}>
              {opt.label}
            </span>
          </CheckRow>
        ))}
      </div>

      {/* ── Active filters ───────────────────────────────────────────────── */}
      {hasActiveFilters && (
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '12px' }}>
          <SectionTitle>Filtres actifs</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selectedCats.map((catName) => (
              <span key={catName} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: '#fff1f2', color: '#dc2626', border: '1px solid #fecdd3',
                borderRadius: '999px', padding: '7px 10px', fontSize: '12px', fontWeight: 800,
              }}>
                {titleCase(catName)}
                <button onClick={() => toggleCategory(catName)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', padding: 0 }}>
                  <X style={{ width: '12px', height: '12px' }} strokeWidth={2.5} />
                </button>
              </span>
            ))}
            {priceMin > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff1f2', color: '#dc2626', border: '1px solid #fecdd3', borderRadius: '999px', padding: '7px 10px', fontSize: '12px', fontWeight: 800 }}>
                Min {priceMin} DH
                <button onClick={() => setPriceMin(0)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', padding: 0 }}>
                  <X style={{ width: '12px', height: '12px' }} strokeWidth={2.5} />
                </button>
              </span>
            )}
            {priceMax < 9999 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff1f2', color: '#dc2626', border: '1px solid #fecdd3', borderRadius: '999px', padding: '7px 10px', fontSize: '12px', fontWeight: 800 }}>
                Max {priceMax} DH
                <button onClick={() => setPriceMax(9999)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', padding: 0 }}>
                  <X style={{ width: '12px', height: '12px' }} strokeWidth={2.5} />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff1f2', color: '#dc2626', border: '1px solid #fecdd3', borderRadius: '999px', padding: '7px 10px', fontSize: '12px', fontWeight: 800 }}>
                En stock
                <button onClick={() => setInStockOnly(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', padding: 0 }}>
                  <X style={{ width: '12px', height: '12px' }} strokeWidth={2.5} />
                </button>
              </span>
            )}
            {promoOnly && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff1f2', color: '#dc2626', border: '1px solid #fecdd3', borderRadius: '999px', padding: '7px 10px', fontSize: '12px', fontWeight: 800 }}>
                En promo
                <button onClick={() => setPromoOnly(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', padding: 0 }}>
                  <X style={{ width: '12px', height: '12px' }} strokeWidth={2.5} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile apply ─────────────────────────────────────────────────── */}
      {onApply && (
        <button
          onClick={onApply}
          style={{
            width: '100%', marginTop: '20px',
            background: '#ef233c', color: '#fff',
            padding: '16px', borderRadius: '16px',
            fontWeight: 700, fontSize: '15px', letterSpacing: '0.01em',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(239,35,60,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <Check style={{ width: '16px', height: '16px' }} strokeWidth={2.5} />
          Appliquer les filtres
          {activeFilterCount > 0 && ` (${activeFilterCount})`}
        </button>
      )}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function BestOffersClient({
  products: initialProducts,
  categories: initialCategories,
  pageTitle,
  pageSubtitle,
}: {
  products: Product[]
  categories: Category[]
  pageTitle?: string
  pageSubtitle?: string
}) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [products,   setProducts]   = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<Category[]>(initialCategories)

  // Filter states
  const [searchQuery,  setSearchQuery]  = useState('')
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [inStockOnly,  setInStockOnly]  = useState(false)
  const [promoOnly,    setPromoOnly]    = useState(false)
  const [priceMin,     setPriceMin]     = useState(0)
  const [priceMax,     setPriceMax]     = useState(9999)
  const [sort,         setSort]         = useState('default')
  const [filterOpen,   setFilterOpen]   = useState(false)

  // Read URL params on mount
  useEffect(() => {
    const catParam  = searchParams.get('cat')
    if (catParam) setSelectedCats([catParam])
    const sortParam = searchParams.get('sort')
    if (sortParam) setSort(sortParam)
  }, [searchParams])

  // Fetch categories once
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((cats) => { if (Array.isArray(cats)) setCategories(cats) })
      .catch(() => {})
  }, [])

  // Fetch products from API whenever filters change
  useEffect(() => {
    const params = new URLSearchParams()
    selectedCats.forEach((name) => params.append('category', name))
    if (searchQuery)     params.set('search',   searchQuery)
    if (priceMax < 9999) params.set('maxPrice', String(priceMax))
    if (inStockOnly)     params.set('inStock',  'true')
    if (promoOnly)       params.set('onSale',   'true')
    params.set('sortBy', sort)

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products)
        } else if (Array.isArray(data)) {
          setProducts(data)
        } else {
          console.error('[BestOffersClient] API error:', data)
        }
      })
      .catch((err) => console.error('[BestOffersClient] fetch error:', err))
  }, [selectedCats, searchQuery, priceMax, inStockOnly, promoOnly, sort])

  // Lock body scroll when mobile filter open
  useEffect(() => {
    document.body.style.overflow = filterOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [filterOpen])

  const isCatSelected = (name: string) =>
    selectedCats.some((c) => c.toLowerCase() === name.toLowerCase())

  const toggleCategory = (catName: string) => {
    setSelectedCats((prev) =>
      isCatSelected(catName)
        ? prev.filter((c) => c.toLowerCase() !== catName.toLowerCase())
        : [...prev, catName]
    )
  }

  const clearFilters = () => {
    setSelectedCats([])
    setInStockOnly(false)
    setPromoOnly(false)
    setSearchQuery('')
    setPriceMin(0)
    setPriceMax(9999)
    setSort('default')
    router.push(pageTitle ? window.location.pathname : '/best-offers')
  }

  const hasActiveFilters =
    selectedCats.length > 0 || inStockOnly || promoOnly ||
    searchQuery.length > 0  || priceMin > 0 || priceMax < 9999

  const activeFilterCount =
    selectedCats.length +
    (inStockOnly ? 1 : 0) +
    (promoOnly ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (priceMin > 0 ? 1 : 0) +
    (priceMax < 9999 ? 1 : 0)

  // Local sort + priceMin filter (API handles the rest)
  const filtered = useMemo(() => {
    let list = [...products]
    if (priceMin > 0) list = list.filter((p) => p.price >= priceMin)
    if (sort === 'price_asc' || sort === 'price-asc')     list.sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc' || sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'newest' || sort === 'new')  list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    else if (sort === 'popular' || sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return list
  }, [products, priceMin, sort])

  const filterProps = {
    categories, selectedCats, toggleCategory, isCatSelected,
    inStockOnly, setInStockOnly, promoOnly, setPromoOnly,
    priceMin, setPriceMin, priceMax, setPriceMax,
    searchQuery, setSearchQuery, clearFilters, hasActiveFilters, activeFilterCount,
  }

  return (
    <>
      {/* ── PAGE HERO ──────────────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="breadcrumb-nav">
            <Link href="/">Accueil</Link>
            <span>›</span>
            <span>{pageTitle || 'Meilleures Offres'}</span>
          </div>
          <h1>{pageTitle || 'Meilleures Offres'}</h1>
          <p>
            {pageSubtitle ||
              'Découvrez toute notre sélection de livres scolaires avec les meilleurs prix'}
          </p>
        </div>
      </div>

      {/* ── LAYOUT ────────────────────────────────────────────────────── */}
      <div className="offers-layout">

        {/* ── DESKTOP SIDEBAR ───────────────────────────────────────── */}
        <aside
          className="hidden md:block sticky self-start flex-shrink-0"
          style={{ top: '88px', width: '300px' }}
        >
          <div style={{
            background: 'var(--card)',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid var(--border)',
            boxShadow: '0 18px 45px rgba(15,23,42,0.08)',
            overflow: 'hidden',
          }}>
            <FilterPanel {...filterProps} />
          </div>
        </aside>

        {/* ── RESULTS ───────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Sort bar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile filter button */}
              <button
                onClick={() => setFilterOpen(true)}
                className="md:hidden flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white shadow-sm hover:border-red-300 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-red-600" />
                Filtres
                {activeFilterCount > 0 && (
                  <span className="bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-900">{filtered.length}</span>{' '}
                produit{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 hidden sm:block">Trier par :</label>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-sm font-medium bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none cursor-pointer"
                >
                  <option value="default">Par défaut</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="newest">Nouveautés</option>
                  <option value="popular">Popularité</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCats.map((cat) => (
                <div key={`chip-cat-${cat}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100">
                  <span>{titleCase(cat)}</span>
                  <button onClick={() => toggleCategory(cat)} className="text-red-400 hover:text-red-700 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {priceMin > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100">
                  <span>Min {priceMin} DH</span>
                  <button onClick={() => setPriceMin(0)} className="text-red-400 hover:text-red-700 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {priceMax < 9999 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100">
                  <span>Max {priceMax} DH</span>
                  <button onClick={() => setPriceMax(9999)} className="text-red-400 hover:text-red-700 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {inStockOnly && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100">
                  <span>En stock</span>
                  <button onClick={() => setInStockOnly(false)} className="text-red-400 hover:text-red-700 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {promoOnly && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100">
                  <span>En promotion</span>
                  <button onClick={() => setPromoOnly(false)} className="text-red-400 hover:text-red-700 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Products grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Aucun produit trouvé</h3>
              <p className="text-sm text-gray-500 mb-4">
                Aucun produit ne correspond à vos filtres.
              </p>
              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p as any} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE BOTTOM SHEET ───────────────────────────────────────── */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setFilterOpen(false)}
          />
          <div
            className="absolute bottom-0 left-0 right-0 flex flex-col shadow-2xl"
            style={{ borderRadius: '24px 24px 0 0', maxHeight: '85vh', background: 'var(--card)' }}
          >
            {/* Mobile drawer header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal style={{ width: '18px', height: '18px', color: '#ef233c' }} strokeWidth={2.2} />
                <span style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a' }}>Filtres</span>
                {activeFilterCount > 0 && (
                  <span style={{
                    background: '#ef233c', color: '#fff', fontSize: '11px', fontWeight: 700,
                    minWidth: '20px', height: '20px', padding: '0 6px',
                    borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setFilterOpen(false)}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: '#f1f5f9', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b',
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* Scrollable content */}
            <div style={{ overflowY: 'auto', overscrollBehavior: 'contain', padding: '20px', flex: 1 }}>
              <FilterPanel {...filterProps} onApply={() => setFilterOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
