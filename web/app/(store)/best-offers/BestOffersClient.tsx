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
  ChevronUp,
  Truck,
  CreditCard,
  RotateCw,
  MessageCircle,
  ArrowUpDown,
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

// ─── CheckRow ─────────────────────────────────────────────────────────────────

function CheckRow({
  selected, onClick, children,
}: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`bo-filter-row ${selected ? 'selected' : ''}`}
    >
      <div className={`bo-checkbox ${selected ? 'checked' : ''}`}>
        {selected && <Check style={{ width: '10px', height: '10px', color: '#fff', strokeWidth: 3 }} />}
      </div>
      <span className="bo-filter-row-label">{children}</span>
    </div>
  )
}

// ─── FilterPanel ──────────────────────────────────────────────────────────────

function FilterPanel({
  categories,
  selectedCats,
  toggleCategory,
  isCatSelected,
  inStockOnly, setInStockOnly,
  promoOnly, setPromoOnly,
  priceMin, setPriceMin,
  priceMax, setPriceMax,
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
  promoOnly: boolean; setPromoOnly: (v: boolean) => void
  priceMin: number; setPriceMin: (v: number) => void
  priceMax: number; setPriceMax: (v: number) => void
  searchQuery: string; setSearchQuery: (v: string) => void
  clearFilters: () => void
  hasActiveFilters: boolean
  activeFilterCount: number
  onApply?: () => void
}) {
  const { lang } = useLang()
  const isAr = lang === 'ar'
  const [catExpanded, setCatExpanded] = useState(true)
  const [availExpanded, setAvailExpanded] = useState(true)
  const [priceExpanded, setPriceExpanded] = useState(true)

  const fT = {
    title: isAr ? 'الفلاتر والتصفية' : 'Filtres',
    reset: isAr ? 'إعادة ضبط' : 'Réinitialiser',
    search: isAr ? 'بحث عن منتج...' : 'Rechercher un produit…',
    category: isAr ? 'الفئات' : 'Catégorie',
    availability: isAr ? 'الحالة والوفرة' : 'Disponibilité',
    inStock: isAr ? 'المتوفر في المخزون فقط' : 'En stock uniquement',
    promo: isAr ? 'العروض والتخفيضات' : 'En promotion',
    price: isAr ? 'السعر (درهم)' : 'Prix (MAD)',
    min: isAr ? 'الأدنى' : 'Min',
    max: isAr ? 'الأقصى' : 'Max',
    apply: isAr ? 'تطبيق الفلاتر' : 'Appliquer',
  }

  return (
    <div className="bo-filter-panel" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bo-filter-header">
        <div className="bo-filter-header-left">
          <SlidersHorizontal size={16} strokeWidth={2.2} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span className="bo-filter-title">{fT.title}</span>
          {activeFilterCount > 0 && (
            <span className="bo-filter-badge">{activeFilterCount}</span>
          )}
        </div>
        <button
          onClick={clearFilters}
          className="bo-filter-reset"
          disabled={!hasActiveFilters}
          aria-label={fT.reset}
        >
          <RotateCcw size={12} strokeWidth={2.5} />
          {fT.reset}
        </button>
      </div>

      {/* Search */}
      <div className="bo-filter-search">
        <Search size={14} strokeWidth={2} style={{ color: 'var(--text2)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder={fT.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bo-filter-search-input"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="bo-filter-search-clear">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Catégories (Pure Text Only, No Thumbnails) */}
      {categories.length > 0 && (
        <div className="bo-filter-section">
          <button
            className="bo-filter-section-title"
            onClick={() => setCatExpanded(v => !v)}
            aria-expanded={catExpanded}
          >
            <span>{fT.category}</span>
            {catExpanded ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />}
          </button>
          {catExpanded && (
            <div className="bo-filter-section-body">
              {categories.map((cat) => {
                const count = cat.count ?? cat._count?.products ?? 0
                return (
                  <CheckRow key={cat.id} selected={isCatSelected(cat.name)} onClick={() => toggleCategory(cat.name)}>
                    <span className="bo-filter-cat-name">{titleCase(cat.name)}</span>
                    {count > 0 && <span className="bo-filter-cat-count">{count}</span>}
                  </CheckRow>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Disponibilité */}
      <div className="bo-filter-section">
        <button
          className="bo-filter-section-title"
          onClick={() => setAvailExpanded(v => !v)}
          aria-expanded={availExpanded}
        >
          <span>{fT.availability}</span>
          {availExpanded ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />}
        </button>
        {availExpanded && (
          <div className="bo-filter-section-body">
            <CheckRow selected={inStockOnly} onClick={() => setInStockOnly(!inStockOnly)}>
              {fT.inStock}
            </CheckRow>
            <CheckRow selected={promoOnly} onClick={() => setPromoOnly(!promoOnly)}>
              {fT.promo}
            </CheckRow>
          </div>
        )}
      </div>

      {/* Prix */}
      <div className="bo-filter-section" style={{ borderBottom: 'none' }}>
        <button
          className="bo-filter-section-title"
          onClick={() => setPriceExpanded(v => !v)}
          aria-expanded={priceExpanded}
        >
          <span>{fT.price}</span>
          {priceExpanded ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />}
        </button>
        {priceExpanded && (
          <div className="bo-filter-section-body">
            <div className="bo-price-inputs" dir="ltr">
              <div className="bo-price-input-wrap">
                <label className="bo-price-label">{fT.min}</label>
                <input
                  type="number"
                  value={priceMin === 0 ? '' : priceMin}
                  min={0} max={9999}
                  placeholder="0"
                  onChange={(e) => setPriceMin(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="bo-price-input"
                />
              </div>
              <span className="bo-price-sep">–</span>
              <div className="bo-price-input-wrap">
                <label className="bo-price-label">{fT.max}</label>
                <input
                  type="number"
                  value={priceMax === 9999 ? '' : priceMax}
                  min={0} max={9999}
                  placeholder="9 999"
                  onChange={(e) => setPriceMax(e.target.value === '' ? 9999 : Math.max(0, Number(e.target.value)))}
                  className="bo-price-input"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile apply */}
      {onApply && (
        <button onClick={onApply} className="bo-filter-apply-btn">
          <Check size={15} strokeWidth={2.5} />
          {fT.apply}{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
      )}
    </div>
  )
}

// ─── Trust Strip ──────────────────────────────────────────────────────────────

function TrustStrip() {
  const { lang } = useLang()
  const isAr = lang === 'ar'

  const items = [
    { 
      icon: <Truck size={20} strokeWidth={2.2} />, 
      label: isAr ? 'التوصيل لجميع مدن المغرب' : 'Livraison partout au Maroc', 
      sub: isAr ? 'خلال 24 – 48 ساعة' : '24 – 48h' 
    },
    { 
      icon: <CreditCard size={20} strokeWidth={2.2} />, 
      label: isAr ? 'الدفع عند الاستلام' : 'Paiement à la livraison', 
      sub: isAr ? 'آمن ومضمون 100%' : 'Sécurisé & flexible' 
    },
    { 
      icon: <RotateCw size={20} strokeWidth={2.2} />, 
      label: isAr ? 'إرجاع خلال 7 أيام' : 'Retour sous 7 jours', 
      sub: isAr ? 'بدون مصاريف إضافية' : 'Sans frais' 
    },
    { 
      icon: <MessageCircle size={20} strokeWidth={2.2} />, 
      label: isAr ? 'دعم عبر الواتساب' : 'Support WhatsApp', 
      sub: isAr ? 'متوفر 6 أيام / 7' : '6j/7 disponible' 
    },
  ]

  return (
    <div className="bo-trust-strip" dir={isAr ? 'rtl' : 'ltr'}>
      {items.map((item, i) => (
        <div key={i} className="bo-trust-item">
          <div className="bo-trust-icon">{item.icon}</div>
          <div className="bo-trust-text">
            <span className="bo-trust-label">{item.label}</span>
            <span className="bo-trust-sub">{item.sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Sort options ─────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: 'default',    label: 'Pertinence' },
  { value: 'price_asc',  label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'newest',     label: 'Nouveautés' },
  { value: 'popular',    label: 'Promotions' },
]

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

  // Filter state
  const [searchQuery,  setSearchQuery]  = useState('')
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [inStockOnly,  setInStockOnly]  = useState(false)
  const [promoOnly,    setPromoOnly]    = useState(false)
  const [priceMin,     setPriceMin]     = useState(0)
  const [priceMax,     setPriceMax]     = useState(9999)
  const [sort,         setSort]         = useState('default')
  const [filterOpen,   setFilterOpen]   = useState(false)
  const [sortOpen,     setSortOpen]     = useState(false)
  const [mobileSortOpen, setMobileSortOpen] = useState(false)

  // Read URL params on mount
  useEffect(() => {
    const catParam = searchParams.get('cat')
    if (catParam) setSelectedCats([catParam])
    const sortParam = searchParams.get('sort')
    if (sortParam) setSort(sortParam)
    const searchParam = searchParams.get('search')
    if (searchParam) setSearchQuery(searchParam)
  }, [searchParams])

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((cats) => { if (Array.isArray(cats)) setCategories(cats) })
      .catch(() => {})
  }, [])

  // Fetch products when filters change
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
        }
      })
      .catch(() => {})
  }, [selectedCats, searchQuery, priceMax, inStockOnly, promoOnly, sort])

  // Lock body scroll when filter drawer open
  useEffect(() => {
    document.body.style.overflow = (filterOpen || mobileSortOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [filterOpen, mobileSortOpen])

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

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? 'Pertinence'

  return (
    <>
      {/* ── PAGE HERO ──────────────────────────────────────────────────────── */}
      <div className="bo-hero">
        <div className="bo-hero-inner">
          <nav className="bo-breadcrumb" aria-label="Fil d'Ariane" dir={isAr ? 'rtl' : 'ltr'}>
            <Link href="/" className="bo-breadcrumb-link">
              {isAr ? 'الرئيسية' : 'Accueil'}
            </Link>
            <span className="bo-breadcrumb-sep">›</span>
            <span className="bo-breadcrumb-current">
              {pageTitle || (isAr ? 'أفضل العروض' : 'Meilleures Offres')}
            </span>
          </nav>
          <h1 className="bo-hero-title" dir={isAr ? 'rtl' : 'ltr'}>
            {pageTitle || (isAr ? 'أفضل العروض' : 'Meilleures Offres')}
          </h1>
          <p className="bo-hero-sub" dir={isAr ? 'rtl' : 'ltr'}>
            {pageSubtitle || (isAr
              ? 'اكتشف تشكيلتنا من الكتب المدرسية بأفضل الأسعار'
              : 'Découvrez notre sélection de fournitures scolaires aux meilleurs prix')}
          </p>
        </div>
      </div>

      {/* ── LAYOUT ───────────────────────────────────────────────────────── */}
      <div className="main-products-layout bo-layout">

        {/* ── DESKTOP SIDEBAR ─────────────────────────────────────────── */}
        <aside className="filter-sidebar bo-sidebar" aria-label="Filtres">
          <FilterPanel {...filterProps} />
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
        <div className="product-area bo-main">

          {/* Sort + count bar */}
          <div className="bo-sort-bar" dir={isAr ? 'rtl' : 'ltr'}>
            {/* Left: mobile filter/sort buttons + count */}
            <div className="bo-sort-bar-left">
              {/* Mobile filter button */}
              <button
                className="bo-mob-btn bo-mob-filter"
                onClick={() => setFilterOpen(true)}
                aria-label="Ouvrir les filtres"
              >
                <SlidersHorizontal size={15} strokeWidth={2.2} />
                <span>Filtrer</span>
                {activeFilterCount > 0 && (
                  <span className="bo-mob-btn-badge">{activeFilterCount}</span>
                )}
              </button>

              {/* Mobile sort button */}
              <button
                className="bo-mob-btn bo-mob-sort"
                onClick={() => setMobileSortOpen(true)}
                aria-label="Trier les produits"
              >
                <ArrowUpDown size={15} strokeWidth={2.2} />
                <span>Trier</span>
              </button>

              <p className="bo-product-count">
                <strong>{filtered.length}</strong>
                {' '}{isAr ? 'منتج' : `produit${filtered.length !== 1 ? 's' : ''} trouvé${filtered.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            {/* Right: desktop sort dropdown */}
            <div className="bo-sort-right">
              <span className="bo-sort-label">Trier par :</span>
              <div className="bo-sort-dropdown-wrap">
                <button
                  className={`bo-sort-btn ${sortOpen ? 'open' : ''}`}
                  onClick={() => setSortOpen(!sortOpen)}
                  aria-expanded={sortOpen}
                  aria-haspopup="listbox"
                >
                  <span>{currentSortLabel}</span>
                  <ChevronDown
                    size={14} strokeWidth={2.5}
                    style={{ transition: 'transform 0.2s', transform: sortOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
                {sortOpen && (
                  <>
                    <div className="bo-sort-backdrop" onClick={() => setSortOpen(false)} />
                    <div className="bo-sort-menu" role="listbox">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          role="option"
                          aria-selected={sort === opt.value}
                          className={`bo-sort-option ${sort === opt.value ? 'active' : ''}`}
                          onClick={() => { setSort(opt.value); setSortOpen(false) }}
                        >
                          {opt.label}
                          {sort === opt.value && <Check size={13} strokeWidth={2.5} style={{ color: 'var(--primary)' }} />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="bo-chips-bar" dir={isAr ? 'rtl' : 'ltr'}>
              {selectedCats.map((cat) => (
                <div key={`chip-cat-${cat}`} className="bo-chip">
                  <span>{titleCase(cat)}</span>
                  <button onClick={() => toggleCategory(cat)} aria-label={`Supprimer ${cat}`}>
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
              {priceMin > 0 && (
                <div className="bo-chip">
                  <span>Min {priceMin} DH</span>
                  <button onClick={() => setPriceMin(0)}><X size={12} strokeWidth={2.5} /></button>
                </div>
              )}
              {priceMax < 9999 && (
                <div className="bo-chip">
                  <span>Max {priceMax} DH</span>
                  <button onClick={() => setPriceMax(9999)}><X size={12} strokeWidth={2.5} /></button>
                </div>
              )}
              {inStockOnly && (
                <div className="bo-chip">
                  <span>En stock</span>
                  <button onClick={() => setInStockOnly(false)}><X size={12} strokeWidth={2.5} /></button>
                </div>
              )}
              {promoOnly && (
                <div className="bo-chip">
                  <span>Promotion</span>
                  <button onClick={() => setPromoOnly(false)}><X size={12} strokeWidth={2.5} /></button>
                </div>
              )}
              <button className="bo-chip-clear-all" onClick={clearFilters}>
                Tout effacer
              </button>
            </div>
          )}

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="bo-empty-state">
              <div className="bo-empty-icon">
                <Search size={28} strokeWidth={1.5} />
              </div>
              <h3 className="bo-empty-title">Aucun produit trouvé</h3>
              <p className="bo-empty-text">Aucun produit ne correspond à vos filtres.</p>
              <button onClick={clearFilters} className="bo-empty-reset">
                <RotateCcw size={14} strokeWidth={2.2} />
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="products-grid bo-products-grid">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p as any} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ────────────────────────────────────────────── */}
      {filterOpen && (
        <div className="bo-drawer-overlay" role="dialog" aria-modal="true" aria-label="Filtres">
          <div className="bo-drawer-backdrop" onClick={() => setFilterOpen(false)} />
          <div className="bo-drawer">
            <div className="bo-drawer-header">
              <div className="bo-drawer-title">
                <SlidersHorizontal size={17} strokeWidth={2.2} style={{ color: 'var(--primary)' }} />
                <span>Filtres</span>
                {activeFilterCount > 0 && (
                  <span className="bo-filter-badge">{activeFilterCount}</span>
                )}
              </div>
              <button
                className="bo-drawer-close"
                onClick={() => setFilterOpen(false)}
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="bo-drawer-body">
              <FilterPanel {...filterProps} onApply={() => setFilterOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE SORT DRAWER ─────────────────────────────────────────────── */}
      {mobileSortOpen && (
        <div className="bo-drawer-overlay" role="dialog" aria-modal="true" aria-label="Trier">
          <div className="bo-drawer-backdrop" onClick={() => setMobileSortOpen(false)} />
          <div className="bo-drawer bo-sort-drawer">
            <div className="bo-drawer-header">
              <div className="bo-drawer-title">
                <ArrowUpDown size={17} strokeWidth={2.2} style={{ color: 'var(--primary)' }} />
                <span>Trier par</span>
              </div>
              <button
                className="bo-drawer-close"
                onClick={() => setMobileSortOpen(false)}
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="bo-drawer-body">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`bo-sort-drawer-option ${sort === opt.value ? 'active' : ''}`}
                  onClick={() => { setSort(opt.value); setMobileSortOpen(false) }}
                >
                  {opt.label}
                  {sort === opt.value && <Check size={15} strokeWidth={2.5} style={{ color: 'var(--primary)' }} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
