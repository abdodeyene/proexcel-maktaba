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
  niveau?: string | null
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
      className={`flex items-center gap-3 rounded-[16px] px-3 py-2.5 mb-1.5 cursor-pointer select-none transition-all duration-[200ms] border ${
        selected
          ? 'bg-red-50/60 border-red-200 dark:bg-red-900/20 dark:border-red-800/50 shadow-sm'
          : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
      }`}
    >
      <div
        className={`flex-shrink-0 flex items-center justify-center w-[22px] h-[22px] rounded-[8px] transition-all duration-[200ms] ${
          selected ? 'bg-red-600 border-none shadow-[0_2px_8px_rgba(220,38,38,0.3)]' : 'bg-white dark:bg-zinc-900 border-[1.5px] border-slate-300 dark:border-slate-600 hover:border-red-400'
        }`}
      >
        {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
      {children}
    </div>
  )
}

// ─── Section title ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-red-600 dark:text-red-500 mb-3">
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
  niveauFilter, setNiveauFilter,
  categoryFilter, setCategoryFilter,
  brandFilter, setBrandFilter,
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
  niveauFilter: string; setNiveauFilter: (v: string) => void
  categoryFilter: string; setCategoryFilter: (v: string) => void
  brandFilter: string; setBrandFilter: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal style={{ width: '18px', height: '18px', color: '#ef233c', flexShrink: 0 }} strokeWidth={2.2} />
          <span className="font-bold text-[16px] text-slate-900 dark:text-white tracking-[-0.01em]">Filtres</span>
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
          className="w-full h-[46px] pl-[42px] pr-10 text-sm font-semibold bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[14px] outline-none transition-all text-slate-900 dark:text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/15 focus:bg-white dark:focus:bg-slate-800 shadow-inner"
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
      
      {/* ── Dropdowns ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '26px' }}>
        {/* Niveau Scolaire */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 ml-1">Niveau Scolaire</label>
          <div className="relative">
            <select
              value={niveauFilter}
              onChange={(e) => setNiveauFilter(e.target.value)}
              className="w-full h-[46px] pl-4 pr-10 text-sm font-semibold bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[14px] outline-none transition-all text-slate-900 dark:text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/15 focus:bg-white dark:focus:bg-slate-800 appearance-none cursor-pointer"
            >
              <option value="all">Tous les niveaux</option>
              <option value="primaire">Primaire</option>
              <option value="college">Collège</option>
              <option value="lycee">Lycée</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 ml-1">Type Catégorie</label>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-[46px] pl-4 pr-10 text-sm font-semibold bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[14px] outline-none transition-all text-slate-900 dark:text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/15 focus:bg-white dark:focus:bg-slate-800 appearance-none cursor-pointer"
            >
              <option value="all">Toutes les catégories</option>
              <option value="manuels">Manuels / Livres</option>
              <option value="outils scolaires">Outils Scolaires</option>
              <option value="accessoires">Accessoires</option>
              <option value="cahiers">Cahiers</option>
              <option value="cartables">Cartables</option>
              <option value="trousses">Trousses</option>
              <option value="romans">Romans</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Marque */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 ml-1">Marque</label>
          <div className="relative">
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full h-[46px] pl-4 pr-10 text-sm font-semibold bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[14px] outline-none transition-all text-slate-900 dark:text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/15 focus:bg-white dark:focus:bg-slate-800 appearance-none cursor-pointer"
            >
              <option value="all">Toutes les marques</option>
              <option value="deli">Deli</option>
              <option value="maped">Maped</option>
              <option value="faber-castell">Faber-Castell</option>
              <option value="uhu">UHU</option>
              <option value="navigator">Navigator</option>
              <option value="other">Autre / Sans marque</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>
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
                    width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
                    overflow: 'hidden', background: '#f8fafc', border: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}>
                    {cat.image ? (
                      <Image src={cat.image} alt={cat.name} width={36} height={36} style={{ objectFit: 'contain', width: '100%', height: '100%', padding: '4px' }} />
                    ) : cat.emoji ? (
                      <span style={{ fontSize: '18px', lineHeight: 1 }}>{cat.emoji}</span>
                    ) : (
                      <span style={{ fontSize: '15px', color: '#94a3b8' }}>📁</span>
                    )}
                  </div>
                  {/* Name */}
                  <span className={`text-[15px] font-bold flex-1 overflow-hidden text-ellipsis whitespace-nowrap transition-colors ${selected ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
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
            className="flex-1 h-11 rounded-xl border-[1.5px] border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-sm text-slate-900 dark:text-white outline-none focus:border-red-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
          />
          <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: '18px', flexShrink: 0, lineHeight: 1 }}>—</span>
          <input
            type="number"
            value={priceMax === 9999 ? '' : priceMax}
            min={0}
            max={9999}
            placeholder="9 999"
            onChange={(e) => setPriceMax(e.target.value === '' ? 9999 : Math.max(0, Number(e.target.value)))}
            className="flex-1 h-11 rounded-xl border-[1.5px] border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-sm text-slate-900 dark:text-white outline-none focus:border-red-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
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
            <span className={`text-[15px] font-bold transition-colors ${opt.value ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
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
            {niveauFilter !== 'all' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff1f2', color: '#dc2626', border: '1px solid #fecdd3', borderRadius: '999px', padding: '7px 10px', fontSize: '12px', fontWeight: 800 }}>
                Niveau: {titleCase(niveauFilter)}
                <button onClick={() => setNiveauFilter('all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', padding: 0 }}>
                  <X style={{ width: '12px', height: '12px' }} strokeWidth={2.5} />
                </button>
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff1f2', color: '#dc2626', border: '1px solid #fecdd3', borderRadius: '999px', padding: '7px 10px', fontSize: '12px', fontWeight: 800 }}>
                Cat: {titleCase(categoryFilter)}
                <button onClick={() => setCategoryFilter('all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', padding: 0 }}>
                  <X style={{ width: '12px', height: '12px' }} strokeWidth={2.5} />
                </button>
              </span>
            )}
            {brandFilter !== 'all' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff1f2', color: '#dc2626', border: '1px solid #fecdd3', borderRadius: '999px', padding: '7px 10px', fontSize: '12px', fontWeight: 800 }}>
                Marque: {titleCase(brandFilter)}
                <button onClick={() => setBrandFilter('all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', padding: 0 }}>
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
  
  const [niveauFilter,   setNiveauFilter]   = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [brandFilter,    setBrandFilter]    = useState('all')

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
    setNiveauFilter('all')
    setCategoryFilter('all')
    setBrandFilter('all')
    router.push(pageTitle ? window.location.pathname : '/best-offers')
  }

  const hasActiveFilters =
    selectedCats.length > 0 || inStockOnly || promoOnly ||
    searchQuery.length > 0  || priceMin > 0 || priceMax < 9999 ||
    niveauFilter !== 'all' || categoryFilter !== 'all' || brandFilter !== 'all'

  const activeFilterCount =
    selectedCats.length +
    (inStockOnly ? 1 : 0) +
    (promoOnly ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (priceMin > 0 ? 1 : 0) +
    (priceMax < 9999 ? 1 : 0) +
    (niveauFilter !== 'all' ? 1 : 0) +
    (categoryFilter !== 'all' ? 1 : 0) +
    (brandFilter !== 'all' ? 1 : 0)

  // Local sort + priceMin filter (API handles the rest)
  const filtered = useMemo(() => {
    let list = [...products]
    if (priceMin > 0) list = list.filter((p) => p.price >= priceMin)

    // Niveau filter client-side
    if (niveauFilter !== 'all') {
      list = list.filter((p) => {
        if (p.niveau) {
          return p.niveau.toLowerCase() === niveauFilter.toLowerCase()
        }
        const cat = (p.category || '').toLowerCase()
        if (cat.includes('manuel') || cat.includes('livre') || cat.includes('roman')) {
          const titleLower = p.title.toLowerCase()
          if (niveauFilter === 'primaire') {
            return titleLower.includes('primaire') || titleLower.includes('aep') || /([1-6])(er|ère|ème)?\s*année/.test(titleLower)
          }
          if (niveauFilter === 'college') {
            return titleLower.includes('collège') || titleLower.includes('college') || titleLower.includes('ac') || /([1-3])(er|ère|ème)?\s*année\s*collège/.test(titleLower)
          }
          if (niveauFilter === 'lycee') {
            return titleLower.includes('lycée') || titleLower.includes('lycee') || titleLower.includes('bac') || titleLower.includes('tronc commun')
          }
          return false
        }
        return true
      })
    }

    // Category filter dropdown client-side
    if (categoryFilter !== 'all') {
      list = list.filter((p) => {
        const cat = (p.category || '').toLowerCase()
        if (categoryFilter === 'manuels') {
          return cat.includes('manuel') || cat.includes('livre') || cat.includes('scolaire')
        }
        if (categoryFilter === 'outils scolaires') {
          return cat.includes('outil') || cat.includes('scolaire') || cat.includes('fourniture')
        }
        return cat === categoryFilter.toLowerCase()
      })
    }

    // Brand filter client-side
    if (brandFilter !== 'all') {
      list = list.filter((p) => {
        const titleLower = p.title.toLowerCase()
        if (brandFilter === 'other') {
          const knownBrands = ['deli', 'maped', 'faber-castell', 'uhu', 'navigator', 'faber castell']
          return !knownBrands.some(brand => titleLower.includes(brand))
        }
        if (brandFilter === 'faber-castell') {
          return titleLower.includes('faber-castell') || titleLower.includes('faber castell')
        }
        return titleLower.includes(brandFilter.toLowerCase())
      })
    }

    if (sort === 'price_asc' || sort === 'price-asc')     list.sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc' || sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'newest' || sort === 'new')  list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    else if (sort === 'popular' || sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return list
  }, [products, priceMin, sort, niveauFilter, categoryFilter, brandFilter])

  const filterProps = {
    categories, selectedCats, toggleCategory, isCatSelected,
    inStockOnly, setInStockOnly, promoOnly, setPromoOnly,
    priceMin, setPriceMin, priceMax, setPriceMax,
    searchQuery, setSearchQuery, clearFilters, hasActiveFilters, activeFilterCount,
    niveauFilter, setNiveauFilter,
    categoryFilter, setCategoryFilter,
    brandFilter, setBrandFilter,
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f0f11]">
      
      {/* ── HERO SECTION (WHITE) ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#18181b] border-b border-gray-100 dark:border-white/5 pt-8 pb-10 mb-8">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 flex flex-col items-center text-center">
          <nav className="flex items-center gap-2 text-[13px] font-medium text-gray-400 dark:text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Accueil</Link>
            <span>›</span>
            <span className="text-gray-900 dark:text-white">{pageTitle || 'Meilleures Offres'}</span>
          </nav>
          
          <h1 className="text-[32px] md:text-[42px] font-bold text-gray-900 dark:text-white tracking-tight mb-3">
            {pageTitle || 'Meilleures Offres'}
          </h1>
          
          <p className="text-[15px] text-gray-500 dark:text-gray-400 max-w-2xl">
            {pageSubtitle || 'Découvrez toute notre sélection de livres scolaires avec les meilleurs prix'}
          </p>
        </div>
      </div>

      {/* ── LAYOUT ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 w-full max-w-[1400px] mx-auto pb-24 px-4 lg:px-6">

        {/* ── DESKTOP SIDEBAR ─────────────────────────────────────────── */}
        <aside
          className="hidden lg:block sticky self-start flex-shrink-0 w-[280px]"
          style={{ top: '96px' }}
        >
          <div className="bg-white dark:bg-[#18181b] rounded-[20px] p-6 shadow-sm border border-gray-100 dark:border-white/5">
            <FilterPanel {...filterProps} />
          </div>
        </aside>

        {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 w-full">

          {/* Sort bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white dark:bg-[#18181b] p-4 lg:px-6 lg:py-4 rounded-[20px] shadow-sm border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-4">
              {/* Mobile filter button */}
              <button
                onClick={() => setFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 text-red-600" />
                Filtres
                {activeFilterCount > 0 && (
                  <span className="bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ml-1">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                <span className="font-bold text-gray-900 dark:text-white mr-1">{filtered.length}</span>
                produit{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm w-full sm:w-auto">
              <label className="font-medium text-gray-500 dark:text-gray-400 hidden sm:block">Trier par :</label>
              <div className="relative w-full sm:w-48">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-[#0f0f11] border border-transparent dark:border-white/5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 outline-none transition-all cursor-pointer"
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
              {niveauFilter !== 'all' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100">
                  <span>Niveau: {titleCase(niveauFilter)}</span>
                  <button onClick={() => setNiveauFilter('all')} className="text-red-400 hover:text-red-700 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {categoryFilter !== 'all' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100">
                  <span>Cat: {titleCase(categoryFilter)}</span>
                  <button onClick={() => setCategoryFilter('all')} className="text-red-400 hover:text-red-700 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {brandFilter !== 'all' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100">
                  <span>Marque: {titleCase(brandFilter)}</span>
                  <button onClick={() => setBrandFilter('all')} className="text-red-400 hover:text-red-700 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Products grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-[#18181b] rounded-[20px] border border-gray-100 dark:border-white/5">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-[#0f0f11] flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Aucun produit trouvé</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Aucun produit ne correspond à vos filtres.
              </p>
              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p as any} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE BOTTOM SHEET ───────────────────────────────────────── */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setFilterOpen(false)}
          />
          <div
            className="relative mr-auto h-full w-[310px] max-w-[85vw] flex flex-col shadow-2xl animate-slide-in-left"
            style={{ background: 'var(--bg)', borderRight: '1px solid var(--border)' }}
          >
            {/* Mobile drawer header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal style={{ width: '18px', height: '18px', color: '#ef233c' }} strokeWidth={2.2} />
                <span className="font-bold text-base text-gray-900 dark:text-white tracking-tight">Filtres</span>
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
                  background: 'var(--bg2)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)',
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
    </div>
  )
}
