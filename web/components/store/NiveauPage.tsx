'use client'

import { useState, useMemo, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import {
  SlidersHorizontal,
  Library,
  BookOpen,
  GraduationCap,
  Search,
  X,
  Check,
  RotateCcw,
  ChevronDown,
} from '@/components/LucideIcons'
import { useLang } from '@/components/LangContext'

// ─── Subject definitions per niveau ──────────────────────────────────────────

const NIVEAU_SUBJECTS: Record<string, { id: string; label: string }[]> = {
  primaire: [
    { id: 'arabe',    label: 'Langue Arabe', labelAr: 'اللغة العربية' },
    { id: 'francais', label: 'Langue Française', labelAr: 'اللغة الفرنسية' },
    { id: 'anglais',  label: 'Langue Anglaise', labelAr: 'اللغة الإنجليزية' },
    { id: 'maths',    label: 'Mathématiques', labelAr: 'الرياضيات' },
    { id: 'sciences', label: 'Sciences', labelAr: 'النشاط العلمي' },
    { id: 'islamia',  label: 'Éducation Islamique', labelAr: 'التربية الإسلامية' },
    { id: 'tarbia',   label: 'Éducation Civique', labelAr: 'التربية التشكيلية/المدنية' },
    { id: 'tchkila',  label: 'Arts Plastiques', labelAr: 'التربية التشكيلية' },
    { id: 'histoire', label: 'Histoire-Géographie', labelAr: 'الاجتماعيات' },
  ],
  college: [
    { id: 'arabe',        label: 'Langue Arabe', labelAr: 'اللغة العربية' },
    { id: 'francais',     label: 'Langue Française', labelAr: 'اللغة الفرنسية' },
    { id: 'anglais',      label: 'Langue Anglaise', labelAr: 'اللغة الإنجليزية' },
    { id: 'maths',        label: 'Mathématiques', labelAr: 'الرياضيات' },
    { id: 'svt',          label: 'SVT', labelAr: 'علوم الحياة والأرض' },
    { id: 'pc',           label: 'Physique-Chimie', labelAr: 'الفيزياء والكيمياء' },
    { id: 'histoire',     label: 'Histoire-Géo', labelAr: 'الاجتماعيات' },
    { id: 'islamia',      label: 'Éducation Islamique', labelAr: 'التربية الإسلامية' },
    { id: 'tarbia',       label: 'Éducation Civique', labelAr: 'التربية التشكيلية' },
    { id: 'informatique', label: 'Informatique', labelAr: 'المعلوميات' },
  ],
  lycee: [
    { id: 'arabe',        label: 'Langue Arabe', labelAr: 'اللغة العربية' },
    { id: 'francais',     label: 'Langue Française', labelAr: 'اللغة الفرنسية' },
    { id: 'anglais',      label: 'Langue Anglaise', labelAr: 'اللغة الإنجليزية' },
    { id: 'maths',        label: 'Mathématiques', labelAr: 'الرياضيات' },
    { id: 'svt',          label: 'SVT', labelAr: 'علوم الحياة والأرض' },
    { id: 'pc',           label: 'Physique-Chimie', labelAr: 'الفيزياء والكيمياء' },
    { id: 'falsafa',      label: 'Philosophie', labelAr: 'الفلسفة' },
    { id: 'histoire',     label: 'Histoire-Géo', labelAr: 'الاجتماعيات' },
    { id: 'islamia',      label: 'Éducation Islamique', labelAr: 'التربية الإسلامية' },
    { id: 'informatique', label: 'Informatique', labelAr: 'المعلوميات' },
    { id: 'economie',     label: 'Économie', labelAr: 'الاقتصاد' },
  ],
}

const NIVEAU_META: Record<string, {
  fr: string; ar: string
  years_fr: string; years_ar: string
  desc_fr: string; desc_ar: string
  icon: React.ReactNode
  emoji: string
}> = {
  primaire: {
    fr: 'Primaire', ar: 'الابتدائي',
    years_fr: '1ère – 6ème Année', years_ar: 'السنة الأولى – السادسة',
    desc_fr: 'Manuels officiels pour le cycle primaire, toutes matières du programme national marocain.',
    desc_ar: 'الكتب الرسمية للتعليم الابتدائي لجميع المواد في البرنامج الوطني المغربي.',
    icon: <Library size={28} />,
    emoji: '🎒',
  },
  college: {
    fr: 'Collège', ar: 'الإعدادي',
    years_fr: '1ère – 3ème Année Collège', years_ar: 'السنة الأولى – الثالثة إعدادي',
    desc_fr: 'Livres scolaires pour le cycle collégial, français et arabe, conformes au programme officiel.',
    desc_ar: 'الكتب المدرسية للسلك الإعدادي بالفرنسية والعربية وفق البرنامج الرسمي.',
    icon: <BookOpen size={28} />,
    emoji: '📚',
  },
  lycee: {
    fr: 'Lycée', ar: 'الثانوي',
    years_fr: 'Tronc Commun · 1ère · 2ème Bac', years_ar: 'الجذع المشترك · الأولى · الثانية باك',
    desc_fr: 'Manuels et livres parascolaires pour le baccalauréat, toutes filières.',
    desc_ar: 'الكتب المدرسية والبرامج للبكالوريا في جميع الشعب.',
    icon: <GraduationCap size={28} />,
    emoji: '🎓',
  },
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
  id: number
  title: string
  author?: string | null
  price: number
  compareAtPrice?: number | null
  category?: string | null
  emoji?: string | null
  stock: number
  rating?: number | null
  isPromo?: boolean | null
  isNew?: boolean | null
  isBestOffer?: boolean | null
  niveau?: string | null
  subject?: string | null
  variants?: unknown
}

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
      className={`flex items-center gap-3 rounded-[14px] px-3 py-2.5 mb-3 cursor-pointer select-none transition-all duration-200 border filter-check-row ${selected ? 'selected' : ''}`}
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
  subjects,
  selectedSubjects, toggleSubject,
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
  subjects: { id: string; label: string; labelAr?: string }[]
  selectedSubjects: string[]
  toggleSubject: (id: string) => void
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

      {/* ── Matière ─────────────────────────────────────────────────────── */}
      {subjects.length > 0 && (
        <div className="filter-section-wrapper">
          <SectionTitle>{isAr ? 'المادة' : 'Matière'}</SectionTitle>
          <div>
            {subjects.map((sub) => (
              <CheckRow key={sub.id} selected={selectedSubjects.includes(sub.id)} onClick={() => toggleSubject(sub.id)}>
                <span className="filter-cat-name">
                  {isAr && sub.labelAr ? sub.labelAr : sub.label}
                </span>
              </CheckRow>
            ))}
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
            {selectedSubjects.map((sid) => {
              const label = subjects.find(s => s.id === sid)?.label ?? sid
              return (
                <span key={sid} className="filter-active-chip">
                  {label}
                  <button onClick={() => toggleSubject(sid)}>
                    <X style={{ width: '12px', height: '12px' }} strokeWidth={2.5} />
                  </button>
                </span>
              )
            })}
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function NiveauPage({
  niveau,
  initialProducts,
}: {
  niveau: string
  initialProducts: Product[]
}) {
  const { lang } = useLang()
  const isAr = lang === 'ar'

  const [products, setProducts] = useState<Product[]>(initialProducts)

  // Filter state
  const [searchQuery,      setSearchQuery]      = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [inStockOnly,      setInStockOnly]      = useState(false)
  const [promoOnly,        setPromoOnly]        = useState(false)
  const [priceMin,         setPriceMin]         = useState(0)
  const [priceMax,         setPriceMax]         = useState(9999)
  const [sortBy,           setSortBy]           = useState('default')
  const [filterOpen,       setFilterOpen]       = useState(false)
  const [sortOpen,         setSortOpen]         = useState(false)

  const subjects = NIVEAU_SUBJECTS[niveau.toLowerCase()] ?? []
  const meta = NIVEAU_META[niveau.toLowerCase()] ?? {
    fr: niveau, ar: niveau,
    years_fr: '', years_ar: '',
    desc_fr: '', desc_ar: '',
    icon: <BookOpen size={28} />,
    emoji: '📘',
  }

  // Load products for this niveau
  useEffect(() => {
    fetch(`/api/products?niveau=${encodeURIComponent(niveau)}`)
      .then((r) => r.json())
      .then((data) => {
        const list: Product[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : []
        if (list.length > 0) setProducts(list)
      })
      .catch(() => {})
  }, [niveau])

  // Lock body scroll on mobile drawer
  useEffect(() => {
    document.body.style.overflow = filterOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [filterOpen])

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const clearFilters = () => {
    setSelectedSubjects([])
    setInStockOnly(false)
    setPromoOnly(false)
    setSearchQuery('')
    setPriceMin(0)
    setPriceMax(9999)
    setSortBy('default')
  }

  const hasActiveFilters =
    selectedSubjects.length > 0 || inStockOnly || promoOnly ||
    searchQuery.length > 0 || priceMin > 0 || priceMax < 9999

  const activeFilterCount =
    selectedSubjects.length +
    (inStockOnly ? 1 : 0) +
    (promoOnly ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (priceMin > 0 ? 1 : 0) +
    (priceMax < 9999 ? 1 : 0)

  const filtered = useMemo(() => {
    let list = [...products]
    if (selectedSubjects.length > 0) {
      list = list.filter((p) =>
        p.subject && selectedSubjects.includes(p.subject.toLowerCase())
      )
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        (p.author && p.author.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      )
    }
    if (priceMin > 0)   list = list.filter((p) => p.price >= priceMin)
    if (priceMax < 9999) list = list.filter((p) => p.price <= priceMax)
    if (inStockOnly)    list = list.filter((p) => p.stock > 0)
    if (promoOnly)      list = list.filter((p) => p.isPromo)
    if (sortBy === 'price_asc')  list.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price_desc') list.sort((a, b) => b.price - a.price)
    else if (sortBy === 'newest')  list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    else if (sortBy === 'popular') list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return list
  }, [products, selectedSubjects, searchQuery, priceMin, priceMax, inStockOnly, promoOnly, sortBy])

  const filterProps = {
    subjects,
    selectedSubjects, toggleSubject,
    inStockOnly, setInStockOnly,
    promoOnly,   setPromoOnly,
    priceMin,    setPriceMin,
    priceMax,    setPriceMax,
    searchQuery, setSearchQuery,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  }

  return (
    <div className="niveau-page">

      {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="breadcrumb-nav" dir={isAr ? 'rtl' : 'ltr'}>
            <Link href="/">{isAr ? 'الرئيسية' : 'Accueil'}</Link>
            <span>›</span>
            <span>{isAr ? 'المستويات' : 'Niveaux'}</span>
            <span>›</span>
            <span>{isAr ? meta.ar : meta.fr}</span>
          </div>
          <div dir={isAr ? 'rtl' : 'ltr'} style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
            <span style={{ color: 'var(--primary)' }}>{meta.icon}</span>
            <h1 style={{ margin: 0 }}>{isAr ? meta.ar : meta.fr}</h1>
          </div>
          <p dir={isAr ? 'rtl' : 'ltr'} style={{ marginBottom: '0.5rem', fontWeight: 600, color: 'var(--primary)' }}>
            {isAr ? meta.years_ar : meta.years_fr}
          </p>
          <p dir={isAr ? 'rtl' : 'ltr'}>
            {isAr ? meta.desc_ar : meta.desc_fr}
          </p>
        </div>
      </div>

      {/* ── LAYOUT ──────────────────────────────────────────────────────── */}
      <div className="offers-layout">

        {/* ── DESKTOP SIDEBAR ─────────────────────────────────────────── */}
        <aside
          className="hidden md:block self-start flex-shrink-0"
          style={{ width: '300px', position: 'sticky', top: '88px' }}
        >
          <div className="filter-card-container">
            <FilterPanel {...filterProps} />
          </div>
        </aside>

        {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
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
                    {sortBy === 'price_asc'
                      ? (isAr ? 'السعر تصاعدي' : 'Prix croissant')
                      : sortBy === 'price_desc'
                      ? (isAr ? 'السعر تنازلي' : 'Prix décroissant')
                      : sortBy === 'newest'
                      ? (isAr ? 'الأحدث' : 'Nouveautés')
                      : sortBy === 'popular'
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
                            setSortBy(opt.value)
                            setSortOpen(false)
                          }}
                          className={`sort-dropdown-item ${sortBy === opt.value ? 'active' : ''}`}
                        >
                          <span>{opt.label}</span>
                          {sortBy === opt.value && (
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

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="active-chips-bar" dir={isAr ? 'rtl' : 'ltr'}>
              {selectedSubjects.map((sid) => {
                const label = subjects.find(s => s.id === sid)?.label ?? sid
                return (
                  <div key={`chip-${sid}`} className="filter-chip">
                    <span>{label}</span>
                    <button onClick={() => toggleSubject(sid)}>
                      <X style={{ width: '14px', height: '14px' }} strokeWidth={2.5} />
                    </button>
                  </div>
                )
              })}
              {priceMin > 0 && (
                <div key="chip-min" className="filter-chip">
                  <span>{isAr ? `الأدنى ${priceMin} درهم` : `Min ${priceMin} DH`}</span>
                  <button onClick={() => setPriceMin(0)}>
                    <X style={{ width: '14px', height: '14px' }} strokeWidth={2.5} />
                  </button>
                </div>
              )}
              {priceMax < 9999 && (
                <div key="chip-max" className="filter-chip">
                  <span>{isAr ? `الأقصى ${priceMax} درهم` : `Max ${priceMax} DH`}</span>
                  <button onClick={() => setPriceMax(9999)}>
                    <X style={{ width: '14px', height: '14px' }} strokeWidth={2.5} />
                  </button>
                </div>
              )}
              {inStockOnly && (
                <div key="chip-stock" className="filter-chip">
                  <span>{isAr ? 'متوفر' : 'En stock'}</span>
                  <button onClick={() => setInStockOnly(false)}>
                    <X style={{ width: '14px', height: '14px' }} strokeWidth={2.5} />
                  </button>
                </div>
              )}
              {promoOnly && (
                <div key="chip-promo" className="filter-chip">
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
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">{isAr ? 'لم يتم العثور على أي منتج' : 'Aucun produit trouvé'}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {hasActiveFilters
                  ? (isAr ? 'لا توجد منتجات تطابق عوامل التصفية الخاصة بك.' : 'Aucun produit ne correspond à vos filtres.')
                  : (isAr ? `لا توجد منتجات لمستوى ${meta.ar} حاليا.` : `Aucun produit pour le niveau ${meta.fr} pour le moment.`)}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isAr ? 'إعادة ضبط عوامل التصفية' : 'Réinitialiser les filtres'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 md:gap-8 lg:gap-10">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p as any} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER (SLIDES FROM LEFT) ─────────────────── */}
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

      <style>{`
        .niveau-page {
          min-height: 100vh;
          background: var(--bg);
        }

        /* ── Hero Banner ── */
        .niveau-banner {
          position: relative;
          overflow: hidden;
          padding: 8rem 0 2.5rem;
          background: linear-gradient(135deg, var(--bg) 0%, var(--bg2) 60%, var(--bg) 100%);
          border-bottom: 1px solid var(--border);
        }
        .niveau-banner-glow {
          position: absolute; top: -60px; left: -80px;
          width: 480px; height: 480px; border-radius: 50%;
          background: radial-gradient(circle, rgba(232,53,42,0.14) 0%, transparent 65%);
          pointer-events: none;
        }
        .niveau-banner-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(232,53,42,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,53,42,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
        .niveau-banner-inner {
          position: relative;
          max-width: 1200px; margin: 0 auto; padding: 0 2rem;
        }
        .niveau-breadcrumb {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.75rem; margin-bottom: 1.75rem;
        }
        .niveau-breadcrumb-link { color: var(--text2); transition: color 0.15s; text-decoration: none; }
        .niveau-breadcrumb-link:hover { color: var(--text); }
        .niveau-breadcrumb-sep { color: var(--text2); opacity: 0.5; }
        .niveau-breadcrumb-current { color: var(--primary); font-weight: 600; }
        .niveau-banner-content {
          display: flex; align-items: flex-start; gap: 1.5rem;
        }
        .niveau-banner-icon {
          flex-shrink: 0; width: 68px; height: 68px; border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          color: var(--primary);
          background: rgba(232,53,42,0.12); border: 1px solid rgba(232,53,42,0.2);
          box-shadow: 0 0 24px rgba(232,53,42,0.12);
        }
        .niveau-banner-text { flex: 1; min-width: 0; }
        .niveau-banner-tag {
          font-size: 0.62rem; font-weight: 800; letter-spacing: 2.5px;
          text-transform: uppercase; color: var(--primary);
          margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;
        }
        .niveau-banner-tag::before {
          content: ''; display: inline-block; width: 16px; height: 1.5px;
          background: var(--primary); border-radius: 2px;
        }
        .niveau-banner-title {
          font-size: clamp(1.8rem,4vw,2.6rem); font-weight: 800; color: var(--text);
          line-height: 1.1; margin-bottom: 0.35rem; letter-spacing: -0.02em;
        }
        .niveau-banner-years {
          font-size: 0.8rem; font-weight: 600; color: var(--primary);
          opacity: 0.8; margin-bottom: 0.6rem; letter-spacing: 0.3px;
        }
        .niveau-banner-desc { font-size: 0.875rem; color: var(--text2); line-height: 1.6; max-width: 520px; }
        .niveau-banner-stat {
          flex-shrink: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background: rgba(232,53,42,0.08); border: 1px solid rgba(232,53,42,0.18);
          border-radius: 16px; padding: 1rem 1.5rem; text-align: center; min-width: 80px;
        }
        .niveau-banner-stat-num { font-size: 1.8rem; font-weight: 800; color: var(--text); line-height: 1; }
        .niveau-banner-stat-label {
          font-size: 0.62rem; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--text2); margin-top: 0.3rem;
        }

        /* ── Layout ── */
        .niveau-layout {
          max-width: 1200px; margin: 0 auto;
          padding: 2rem 2rem 4rem;
          display: flex; gap: 2rem; align-items: flex-start;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .niveau-banner { padding: 6rem 0 2rem; }
          .niveau-banner-inner { padding: 0 1.25rem; }
          .niveau-banner-content { flex-wrap: wrap; gap: 1rem; }
          .niveau-banner-icon { width: 54px; height: 54px; border-radius: 14px; }
          .niveau-banner-stat { display: none; }
          .niveau-layout { padding: 1.5rem 1rem 3rem; gap: 0; }
        }
        @media (max-width: 480px) {
          .niveau-banner-title { font-size: 1.6rem; }
          .niveau-banner-icon { width: 46px; height: 46px; border-radius: 12px; }
        }
      `}</style>
    </div>
  )
}
