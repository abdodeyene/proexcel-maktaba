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
import { useLang } from '@/components/LangContext'

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
      className={`filter-check-row ${selected ? 'selected' : ''}`}
    >
      <div className="filter-checkbox">
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
    <p className="filter-section-title">
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
  const { lang } = useLang()
  const isAr = lang === 'ar'

  return (
    <div className="flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="filter-header">
        <div className="filter-header-left">
          <SlidersHorizontal style={{ width: '18px', height: '18px', color: 'var(--primary)', flexShrink: 0 }} strokeWidth={2.2} />
          <span className="filter-title">{isAr ? 'تصفية' : 'Filtres'}</span>
          {activeFilterCount > 0 && (
            <span className="filter-active-badge">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={clearFilters}
          className="filter-reset-btn"
          style={{
            color: hasActiveFilters ? 'var(--primary)' : 'var(--text2)',
            pointerEvents: hasActiveFilters ? 'auto' : 'none',
            cursor: hasActiveFilters ? 'pointer' : 'default',
          }}
        >
          <RotateCcw style={{ width: '13px', height: '13px' }} strokeWidth={2.3} />
          {isAr ? 'إعادة ضبط' : 'Réinitialiser'}
        </button>
      </div>

      {/* ── Search ──────────────────────────────────────────────────────── */}
      <div className="filter-search-wrapper">
        <Search className="filter-search-icon" strokeWidth={2} />
        <input
          type="text"
          placeholder={isAr ? 'بحث...' : 'Rechercher...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="filter-search-input"
          style={{ paddingRight: searchQuery ? '40px' : '16px' }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="filter-search-clear"
          >
            <X style={{ width: '14px', height: '14px' }} />
          </button>
        )}
      </div>

      {/* ── Categories ──────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <div className="filter-section-wrapper">
          <SectionTitle>{isAr ? 'الفئة' : 'Catégorie'}</SectionTitle>
          <div>
            {categories.map((cat) => {
              const selected = isCatSelected(cat.name)
              const count = cat.count ?? cat._count?.products ?? 0
              return (
                <CheckRow key={cat.id} selected={selected} onClick={() => toggleCategory(cat.name)}>
                  {/* Thumbnail */}
                  <div className="filter-cat-thumb">
                    {cat.image ? (
                      <Image src={cat.image} alt={cat.name} width={34} height={34} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    ) : cat.emoji ? (
                      <span className="text-base leading-none">{cat.emoji}</span>
                    ) : (
                      <span className="text-sm text-[var(--text2)]">📁</span>
                    )}
                  </div>
                  {/* Name */}
                  <span className="filter-cat-name">
                    {titleCase(cat.name)}
                  </span>
                  {/* Count */}
                  {count > 0 && (
                    <span className="filter-cat-count">
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
      <div className="filter-section-wrapper">
        <SectionTitle>{isAr ? 'السعر' : 'Prix'}</SectionTitle>
        <div className="filter-price-wrapper" dir="ltr">
          <input
            type="number"
            value={priceMin === 0 ? '' : priceMin}
            min={0}
            max={9999}
            placeholder="0"
            onChange={(e) => setPriceMin(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
            className="filter-price-input"
          />
          <span className="filter-price-sep">—</span>
          <input
            type="number"
            value={priceMax === 9999 ? '' : priceMax}
            min={0}
            max={9999}
            placeholder="9 999"
            onChange={(e) => setPriceMax(e.target.value === '' ? 9999 : Math.max(0, Number(e.target.value)))}
            className="filter-price-input"
          />
        </div>
        <p className="filter-price-range-text" dir="ltr" style={{ textAlign: 'right' }}>
          {priceMin > 0 ? priceMin : 0} DH — {priceMax === 9999 ? '9 999' : priceMax} DH
        </p>
      </div>

      {/* ── Availability ────────────────────────────────────────────────── */}
      <div className="filter-section-wrapper" style={{ marginBottom: '8px' }}>
        <SectionTitle>{isAr ? 'التوفر' : 'Disponibilité'}</SectionTitle>
        {[
          { id: 'inStock', label: isAr ? 'متوفر في المخزون' : 'En stock uniquement', value: inStockOnly, set: setInStockOnly },
          { id: 'onSale',  label: isAr ? 'في تخفيض' : 'En promotion',        value: promoOnly,   set: setPromoOnly  },
        ].map((opt) => (
          <CheckRow key={opt.id} selected={opt.value} onClick={() => opt.set(!opt.value)}>
            <span className="filter-cat-name">
              {opt.label}
            </span>
          </CheckRow>
        ))}
      </div>

      {/* ── Active filters ───────────────────────────────────────────────── */}
      {hasActiveFilters && (
        <div className="filter-active-chips-container">
          <SectionTitle>{isAr ? 'عوامل التصفية النشطة' : 'Filtres actifs'}</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selectedCats.map((catName) => (
              <span key={catName} className="filter-active-chip">
                {titleCase(catName)}
                <button onClick={() => toggleCategory(catName)}>
                  <X style={{ width: '12px', height: '12px' }} strokeWidth={2.5} />
                </button>
              </span>
            ))}
            {priceMin > 0 && (
              <span key="active-min" className="filter-active-chip">
                {isAr ? `الأدنى ${priceMin} درهم` : `Min ${priceMin} DH`}
                <button onClick={() => setPriceMin(0)}>
                  <X style={{ width: '12px', height: '12px' }} strokeWidth={2.5} />
                </button>
              </span>
            )}
            {priceMax < 9999 && (
              <span key="active-max" className="filter-active-chip">
                {isAr ? `الأقصى ${priceMax} درهم` : `Max ${priceMax} DH`}
                <button onClick={() => setPriceMax(9999)}>
                  <X style={{ width: '12px', height: '12px' }} strokeWidth={2.5} />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span key="active-stock" className="filter-active-chip">
                {isAr ? 'متوفر' : 'En stock'}
                <button onClick={() => setInStockOnly(false)}>
                  <X style={{ width: '12px', height: '12px' }} strokeWidth={2.5} />
                </button>
              </span>
            )}
            {promoOnly && (
              <span key="active-promo" className="filter-active-chip">
                {isAr ? 'في تخفيض' : 'En promo'}
                <button onClick={() => setPromoOnly(false)}>
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
          {isAr ? 'تطبيق الفلاتر' : 'Appliquer les filtres'}
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
  const { lang } = useLang()
  const isAr = lang === 'ar'

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
  const [sortOpen,     setSortOpen]     = useState(false)

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
          <div className="breadcrumb-nav" dir={isAr ? 'rtl' : 'ltr'}>
            <Link href="/">{isAr ? 'الرئيسية' : 'Accueil'}</Link>
            <span>›</span>
            <span>{pageTitle || (isAr ? 'أفضل العروض' : 'Meilleures Offres')}</span>
          </div>
          <h1 dir={isAr ? 'rtl' : 'ltr'}>{pageTitle || (isAr ? 'أفضل العروض' : 'Meilleures Offres')}</h1>
          <p dir={isAr ? 'rtl' : 'ltr'}>
            {pageSubtitle ||
              (isAr ? 'اكتشف تشكيلتنا الكاملة من الكتب المدرسية بأفضل الأسعار' : 'Découvrez toute notre sélection de livres scolaires avec les meilleurs prix')}
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
          <div className="sort-bar" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="sort-bar-left">
              {/* Mobile filter button */}
              <button
                onClick={() => setFilterOpen(true)}
                className="mobile-filter-trigger"
              >
                <SlidersHorizontal style={{ width: '16px', height: '16px', color: 'var(--primary)' }} strokeWidth={2.2} />
                <span>{isAr ? 'تصفية' : 'Filtres'}</span>
                {activeFilterCount > 0 && (
                  <span className="mobile-filter-count">{activeFilterCount}</span>
                )}
              </button>

              <p className="sort-bar-count">
                <span className="sort-bar-count-num">{filtered.length}</span>{' '}
                {isAr ? 'منتج تم العثور عليه' : `produit${filtered.length !== 1 ? 's' : ''} trouvé${filtered.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="sort-bar-right">
              <label className="sort-label-text">{isAr ? 'ترتيب حسب :' : 'Trier par :'}</label>
              <div className="sort-dropdown-wrapper">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className={`sort-trigger-btn ${sortOpen ? 'open' : ''}`}
                  dir={isAr ? 'rtl' : 'ltr'}
                >
                  <span>
                    {sort === 'price_asc' || sort === 'price-asc'
                      ? (isAr ? 'السعر تصاعدي' : 'Prix croissant')
                      : sort === 'price_desc' || sort === 'price-desc'
                      ? (isAr ? 'السعر تنازلي' : 'Prix décroissant')
                      : sort === 'newest' || sort === 'new'
                      ? (isAr ? 'الأحدث' : 'Nouveautés')
                      : sort === 'popular' || sort === 'rating'
                      ? (isAr ? 'الأكثر شعبية' : 'Popularité')
                      : (isAr ? 'الافتراضي' : 'Par défaut')}
                  </span>
                  <ChevronDown
                    style={{
                      width: '15px', height: '15px',
                      transition: 'transform 0.25s ease',
                      transform: sortOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                    strokeWidth={2.5}
                  />
                </button>

                {sortOpen && (
                  <>
                    <div className="sort-dropdown-backdrop" onClick={() => setSortOpen(false)} />
                    <div className="sort-dropdown-menu" dir={isAr ? 'rtl' : 'ltr'}>
                      {[
                        { value: 'default', label: isAr ? 'الافتراضي' : 'Par défaut' },
                        { value: 'price_asc', label: isAr ? 'السعر تصاعدي' : 'Prix croissant' },
                        { value: 'price_desc', label: isAr ? 'السعر تنازلي' : 'Prix décroissant' },
                        { value: 'newest', label: isAr ? 'الأحدث' : 'Nouveautés' },
                        { value: 'popular', label: isAr ? 'الأكثر شعبية' : 'Popularité' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSort(opt.value)
                            setSortOpen(false)
                          }}
                          className={`sort-dropdown-item ${sort === opt.value ? 'active' : ''}`}
                        >
                          <span>{opt.label}</span>
                          {sort === opt.value && (
                            <Check style={{ width: '14px', height: '14px', color: 'var(--primary)' }} strokeWidth={2.5} />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="active-chips-bar" dir={isAr ? 'rtl' : 'ltr'}>
              {selectedCats.map((cat) => (
                <div key={`chip-cat-${cat}`} className="filter-chip">
                  <span>{titleCase(cat)}</span>
                  <button onClick={() => toggleCategory(cat)}>
                    <X style={{ width: '14px', height: '14px' }} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
              {priceMin > 0 && (
                <div className="filter-chip">
                  <span>{isAr ? `الأدنى ${priceMin} درهم` : `Min ${priceMin} DH`}</span>
                  <button onClick={() => setPriceMin(0)}>
                    <X style={{ width: '14px', height: '14px' }} strokeWidth={2.5} />
                  </button>
                </div>
              )}
              {priceMax < 9999 && (
                <div className="filter-chip">
                  <span>{isAr ? `الأقصى ${priceMax} درهم` : `Max ${priceMax} DH`}</span>
                  <button onClick={() => setPriceMax(9999)}>
                    <X style={{ width: '14px', height: '14px' }} strokeWidth={2.5} />
                  </button>
                </div>
              )}
              {inStockOnly && (
                <div className="filter-chip">
                  <span>{isAr ? 'متوفر' : 'En stock'}</span>
                  <button onClick={() => setInStockOnly(false)}>
                    <X style={{ width: '14px', height: '14px' }} strokeWidth={2.5} />
                  </button>
                </div>
              )}
              {promoOnly && (
                <div className="filter-chip">
                  <span>{isAr ? 'في تخفيض' : 'En promotion'}</span>
                  <button onClick={() => setPromoOnly(false)}>
                    <X style={{ width: '14px', height: '14px' }} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Products grid */}
          {filtered.length === 0 ? (
            <div className="empty-state-container">
              <div className="empty-state-icon">
                <Search style={{ width: '28px', height: '28px', color: 'var(--text2)' }} />
              </div>
              <h3 className="empty-state-title">{isAr ? 'لم يتم العثور على أي منتج' : 'Aucun produit trouvé'}</h3>
              <p className="empty-state-text">
                {isAr ? 'لا توجد منتجات تطابق عوامل التصفية الخاصة بك.' : 'Aucun produit ne correspond à vos filtres.'}
              </p>
              <button
                onClick={clearFilters}
                className="empty-state-reset"
              >
                <RotateCcw style={{ width: '14px', height: '14px' }} strokeWidth={2.2} />
                {isAr ? 'إعادة ضبط عوامل التصفية' : 'Réinitialiser les filtres'}
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
