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

// ─── Subject definitions per niveau ──────────────────────────────────────────

const NIVEAU_SUBJECTS: Record<string, { id: string; label: string }[]> = {
  primaire: [
    { id: 'arabe',    label: 'Langue Arabe' },
    { id: 'francais', label: 'Langue Française' },
    { id: 'anglais',  label: 'Langue Anglaise' },
    { id: 'maths',    label: 'Mathématiques' },
    { id: 'sciences', label: 'Sciences' },
    { id: 'islamia',  label: 'Éducation Islamique' },
    { id: 'tarbia',   label: 'Éducation Civique' },
    { id: 'tchkila',  label: 'Arts Plastiques' },
    { id: 'histoire', label: 'Histoire-Géographie' },
  ],
  college: [
    { id: 'arabe',        label: 'Langue Arabe' },
    { id: 'francais',     label: 'Langue Française' },
    { id: 'anglais',      label: 'Langue Anglaise' },
    { id: 'maths',        label: 'Mathématiques' },
    { id: 'svt',          label: 'SVT' },
    { id: 'pc',           label: 'Physique-Chimie' },
    { id: 'histoire',     label: 'Histoire-Géo' },
    { id: 'islamia',      label: 'Éducation Islamique' },
    { id: 'tarbia',       label: 'Éducation Civique' },
    { id: 'informatique', label: 'Informatique' },
  ],
  lycee: [
    { id: 'arabe',        label: 'Langue Arabe' },
    { id: 'francais',     label: 'Langue Française' },
    { id: 'anglais',      label: 'Langue Anglaise' },
    { id: 'maths',        label: 'Mathématiques' },
    { id: 'svt',          label: 'SVT' },
    { id: 'pc',           label: 'Physique-Chimie' },
    { id: 'falsafa',      label: 'Philosophie' },
    { id: 'histoire',     label: 'Histoire-Géo' },
    { id: 'islamia',      label: 'Éducation Islamique' },
    { id: 'informatique', label: 'Informatique' },
    { id: 'economie',     label: 'Économie' },
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
      className={`check-row ${selected ? 'selected' : ''}`}
    >
      {/* Custom checkbox */}
      <div className="check-row-box">
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
  subjects: { id: string; label: string }[]
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal style={{ width: '18px', height: '18px', color: '#ef233c', flexShrink: 0 }} strokeWidth={2.2} />
          <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text)', letterSpacing: '-0.01em' }}>Filtres</span>
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
          className="filter-search-input"
          style={{
            paddingLeft: '44px',
            paddingRight: searchQuery ? '40px' : '16px',
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

      {/* ── Matière ─────────────────────────────────────────────────────── */}
      {subjects.length > 0 && (
        <div style={{ marginBottom: '26px' }}>
          <SectionTitle>Matière</SectionTitle>
          <div>
            {subjects.map((sub) => {
              const selected = selectedSubjects.includes(sub.id)
              return (
                <CheckRow key={sub.id} selected={selected} onClick={() => toggleSubject(sub.id)}>
                  <span style={{
                    fontSize: '15px', fontWeight: 700, flex: 1,
                    color: selected ? '#dc2626' : '#1e293b', transition: 'color 150ms',
                  }}>
                    {sub.label}
                  </span>
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
            {selectedSubjects.map((sid) => {
              const label = subjects.find(s => s.id === sid)?.label ?? sid
              return (
                <span key={sid} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: '#fff1f2', color: '#dc2626', border: '1px solid #fecdd3',
                  borderRadius: '999px', padding: '7px 10px', fontSize: '12px', fontWeight: 800,
                }}>
                  {label}
                  <button onClick={() => toggleSubject(sid)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', padding: 0 }}>
                    <X style={{ width: '12px', height: '12px' }} strokeWidth={2.5} />
                  </button>
                </span>
              )
            })}
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function NiveauPage({
  niveau,
  initialProducts,
}: {
  niveau: string
  initialProducts: Product[]
}) {
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
      <div className="niveau-banner">
        <div className="niveau-banner-glow" aria-hidden="true" />
        <div className="niveau-banner-grid" aria-hidden="true" />
        <div className="niveau-banner-inner">
          <nav className="niveau-breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/" className="niveau-breadcrumb-link">Accueil</Link>
            <span className="niveau-breadcrumb-sep" aria-hidden="true">›</span>
            <span className="niveau-breadcrumb-link">Niveaux</span>
            <span className="niveau-breadcrumb-sep" aria-hidden="true">›</span>
            <span className="niveau-breadcrumb-current">{meta.fr}</span>
          </nav>
          <div className="niveau-banner-content">
            <div className="niveau-banner-icon" aria-hidden="true">{meta.icon}</div>
            <div className="niveau-banner-text">
              <div className="niveau-banner-tag">Niveau scolaire</div>
              <h1 className="niveau-banner-title">{meta.fr}</h1>
              <p className="niveau-banner-years">{meta.years_fr}</p>
              <p className="niveau-banner-desc">{meta.desc_fr}</p>
            </div>
            <div className="niveau-banner-stat" aria-label={`${products.length} produits disponibles`}>
              <span className="niveau-banner-stat-num">{products.length}</span>
              <span className="niveau-banner-stat-label">Produits</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── LAYOUT ──────────────────────────────────────────────────────── */}
      <div className="niveau-layout">

        {/* ── DESKTOP SIDEBAR ─────────────────────────────────────────── */}
        <aside
          className="hidden md:block self-start flex-shrink-0"
          style={{ width: '300px', position: 'sticky', top: '88px' }}
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

        {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Sort bar */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
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
            <div className="flex items-center gap-2 text-sm">
              <label className="sort-label-custom font-medium hidden sm:block">Trier par :</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none sort-select-custom rounded-xl pl-3.5 pr-9 py-2 text-sm font-semibold outline-none cursor-pointer h-[38px]"
                >
                  <option value="default">Par défaut</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="newest">Nouveautés</option>
                  <option value="popular">Popularité</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sort-chevron-custom pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedSubjects.map((sid) => {
                const label = subjects.find(s => s.id === sid)?.label ?? sid
                return (
                  <div key={`chip-${sid}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100">
                    <span>{label}</span>
                    <button onClick={() => toggleSubject(sid)} className="text-red-400 hover:text-red-700 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
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
                {hasActiveFilters
                  ? 'Aucun produit ne correspond à vos filtres.'
                  : `Aucun produit pour le niveau ${meta.fr} pour le moment.`}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Réinitialiser les filtres
                </button>
              )}
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

      {/* ── MOBILE FILTER DRAWER ────────────────────────────────────────── */}
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

      <style>{`
        .niveau-page {
          min-height: 100vh;
          background: var(--bg);
        }

        /* ── Hero Banner ── */
        .niveau-banner {
          position: relative;
          overflow: hidden;
          padding: 3.5rem 0 2.75rem;
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
          .niveau-banner { padding: 2.25rem 0 2rem; }
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
