'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLang } from '@/components/LangContext'
import {
  Search,
  ShoppingCart,
  X,
  ChevronRight,
  Layout
} from '@/components/LucideIcons'

type Category = {
  id: number
  name: string
  emoji?: string | null
  count?: number
}

interface MobileSideMenuProps {
  isOpen: boolean
  onClose: () => void
  cartCount: number
}

export default function MobileSideMenu({ isOpen, onClose, cartCount }: MobileSideMenuProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang } = useLang()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeLang = mounted ? lang : 'ar'
  const isAr = activeLang === 'ar'

  const [categories, setCategories] = useState<Category[]>([])
  const [logoSrc, setLogoSrc] = useState('/logo.png')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch real categories and logo settings
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((cats) => {
        if (Array.isArray(cats)) {
          setCategories(cats)
        }
      })
      .catch(() => {})

    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d?.site_logo) setLogoSrc(d.site_logo)
      })
      .catch(() => {})
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle ESC key press to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/best-offers?search=${encodeURIComponent(searchQuery.trim())}`)
      onClose()
    }
  }

  // Fallback categories if database is loading
  const staticCategories = [
    'Accessoires',
    'Cahiers',
    'Cartables',
    'Outils scolaires',
    'Romans',
    'Trousses'
  ]

  // Determine active category in URL to highlight
  const activeCategoryParam = searchParams.get('cat')

  const t = {
    fr: {
      subtitle: 'Papeterie & fournitures scolaires',
      searchPlaceholder: 'Vous cherchez un produit ?',
      searchBtn: 'Rechercher',
      catTitle: 'CATÉGORIES DE PRODUITS',
      allCategories: 'Toutes les catégories',
      cart: 'Mon Panier',
    },
    ar: {
      subtitle: 'الوراقة والأدوات المدرسية',
      searchPlaceholder: 'ما الذي تبحث عنه؟',
      searchBtn: 'بحث',
      catTitle: 'فئات المنتجات',
      allCategories: 'جميع الفئات',
      cart: 'سلتي',
    }
  }

  const currentT = t[activeLang as keyof typeof t] ?? t.fr

  return (
    <>
      {/* Background Overlay */}
      <div
        onClick={onClose}
        suppressHydrationWarning
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 9998,
        }}
      />

      {/* Slide Drawer */}
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        suppressHydrationWarning
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: isAr ? 'auto' : 0,
          right: isAr ? 0 : 'auto',
          width: '88vw',
          maxWidth: '360px',
          height: '100vh',
          backgroundColor: '#ffffff',
          boxShadow: isAr
            ? '-12px 0 40px rgba(0, 0, 0, 0.15)'
            : '12px 0 40px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          transform: isOpen ? 'translateX(0)' : isAr ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#0f172a',
          borderRight: !isAr ? '1px solid #e2e8f0' : 'none',
          borderLeft: isAr ? '1px solid #e2e8f0' : 'none',
        }}
      >
        {/* Top Header Section */}
        <div
          style={{
            padding: '1.15rem 1.25rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Logo & Subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', minWidth: 0 }}>
            <Link href="/" onClick={onClose} style={{ display: 'block', maxWidth: '145px' }}>
              <img
                src={logoSrc}
                alt="ProExcel Maktaba"
                style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {currentT.subtitle}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Fermer le menu"
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
              transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
              flexShrink: 0,
            }}
            className="sidebar-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search form */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            padding: '1rem 1.25rem 0.5rem 1.25rem',
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder={currentT.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sidebar-search-input"
            />
            <Search
              size={16}
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                left: isAr ? 'auto' : '0.85rem',
                right: isAr ? '0.85rem' : 'auto',
                color: '#94a3b8',
                pointerEvents: 'none',
              }}
            />
          </div>
          <button
            type="submit"
            className="sidebar-search-btn"
          >
            {currentT.searchBtn}
          </button>
        </form>

        {/* Product Categories Section (Scrollable) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.75rem 1rem 2rem 1rem',
            WebkitOverflowScrolling: 'touch',
          }}
          className="thin-scrollbar"
        >
          <div className="sidebar-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Layout size={15} style={{ color: '#dc2626' }} />
            <span>{currentT.catTitle}</span>
          </div>

          {/* All Categories link */}
          <Link
            href="/best-offers"
            onClick={onClose}
            className={`sidebar-nav-item ${!activeCategoryParam ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
              <span className="cat-icon-badge">✨</span>
              <span className="item-label" style={{ fontWeight: 700 }}>{currentT.allCategories}</span>
            </div>
            <ChevronRight size={15} className="item-chevron" />
          </Link>

          {/* Dynamic Categories */}
          {categories.length > 0 ? (
            categories.map((cat) => {
              const isActive = activeCategoryParam === cat.name
              return (
                <Link
                  key={cat.id}
                  href={`/best-offers?cat=${encodeURIComponent(cat.name)}`}
                  onClick={onClose}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                    <span className="cat-icon-badge">
                      {cat.emoji || '📚'}
                    </span>
                    <span className="item-label">{cat.name}</span>
                  </div>
                  {cat.count !== undefined && cat.count > 0 && (
                    <span className="cat-count-pill">{cat.count}</span>
                  )}
                  <ChevronRight size={15} className="item-chevron" />
                </Link>
              )
            })
          ) : (
            /* Static Fallback Categories */
            staticCategories.map((name, idx) => {
              const isActive = activeCategoryParam === name
              return (
                <Link
                  key={idx}
                  href={`/best-offers?cat=${encodeURIComponent(name)}`}
                  onClick={onClose}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                    <span className="cat-icon-badge">📦</span>
                    <span className="item-label">{name}</span>
                  </div>
                  <ChevronRight size={15} className="item-chevron" />
                </Link>
              )
            })
          )}
        </div>

        {/* Footer Panier Quick Link */}
        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
          <Link
            href="/cart"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShoppingCart size={18} style={{ color: '#dc2626' }} />
              <span>{currentT.cart}</span>
            </div>
            {cartCount > 0 && (
              <span
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        .thin-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .thin-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 99px;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .sidebar-close-btn:hover {
          background-color: #f1f5f9 !important;
          color: #dc2626 !important;
          transform: scale(1.05);
        }

        .sidebar-search-input {
          width: 100%;
          padding: 0.6rem 0.85rem 0.6rem 2.4rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.83rem;
          color: #0f172a;
          outline: none;
          transition: all 200ms ease;
        }
        [dir="rtl"] .sidebar-search-input {
          padding: 0.6rem 2.4rem 0.6rem 0.85rem;
        }
        .sidebar-search-input:focus {
          background-color: #ffffff;
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
        }

        .sidebar-search-btn {
          background-color: #dc2626;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 0 1rem;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 150ms ease;
          flex-shrink: 0;
        }
        .sidebar-search-btn:hover {
          background-color: #b91c1c;
        }

        .sidebar-section-title {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #64748b;
          padding: 0.35rem 0.5rem;
          text-transform: uppercase;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.7rem 0.75rem;
          border-radius: 10px;
          text-decoration: none;
          color: #334155;
          font-size: 0.86rem;
          font-weight: 600;
          transition: all 180ms ease;
          margin-bottom: 2px;
        }
        .sidebar-nav-item:hover {
          background-color: #fff1f2;
          color: #dc2626;
        }
        .sidebar-nav-item.active {
          background-color: #fff1f2;
          color: #dc2626;
        }

        .cat-icon-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        .sidebar-nav-item:hover .cat-icon-badge,
        .sidebar-nav-item.active .cat-icon-badge {
          background: #ffe4e6;
          border-color: #fecdd3;
        }

        .cat-count-pill {
          font-size: 0.68rem;
          font-weight: 700;
          background: #f1f5f9;
          color: #64748b;
          padding: 1px 7px;
          border-radius: 999px;
          margin-right: 4px;
        }
        [dir="rtl"] .cat-count-pill {
          margin-right: 0;
          margin-left: 4px;
        }

        .item-chevron {
          color: #cbd5e1;
          transition: transform 180ms ease, color 180ms ease;
        }
        .sidebar-nav-item:hover .item-chevron,
        .sidebar-nav-item.active .item-chevron {
          color: #dc2626;
          transform: translateX(2px);
        }
        [dir="rtl"] .sidebar-nav-item:hover .item-chevron,
        [dir="rtl"] .sidebar-nav-item.active .item-chevron {
          transform: translateX(-2px) rotate(180deg);
        }
        [dir="rtl"] .item-chevron {
          transform: rotate(180deg);
        }
      `}</style>
    </>
  )
}
