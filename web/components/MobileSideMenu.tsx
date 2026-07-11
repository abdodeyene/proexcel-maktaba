'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useLang } from '@/components/LangContext'
import {
  Search,
  ShoppingCart,
  User,
  X,
  ChevronRight,
  Phone,
  HelpCircle,
  LogIn,
  BookOpen
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
  const pathname = usePathname()
  const { lang } = useLang()
  const isAr = lang === 'ar'

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

  // Fallback static categories requested
  const staticCategories = [
    'Blocs, cahiers, carnets',
    'Bureautique',
    'Classement et archivage',
    'Consommables informatiques',
    'Correspondance',
    'Dessin et beaux-arts',
    'Environnement informatique',
    'Écriture et correction',
    'Équipement de bureau',
    'Les papiers',
    'Loisirs créatifs',
    'Matériel de bureau',
    'Matériels et jeux éducatifs',
    'Nathan maternelle',
    'Petites fournitures',
    'Services généraux et réception'
  ]

  // Determine active category in the URL to highlight it
  const activeCategoryParam = searchParams.get('cat')

  const t = {
    fr: {
      subtitle: 'Papeterie & fournitures scolaires',
      searchPlaceholder: 'Vous cherchez un produit ?',
      listTitle: 'LISTES',
      listsCol: 'Listes scolaires',
      catTitle: 'ACHETER PAR CATÉGORIE',
      helpTitle: 'AIDE ET PARAMÈTRES',
      profile: 'Mon profil',
      contact: 'Contact',
      login: 'Se connecter',
    },
    ar: {
      subtitle: 'الوراقة والأدوات المدرسية',
      searchPlaceholder: 'ما الذي تبحث عنه؟',
      listTitle: 'القوائم',
      listsCol: 'القوائم المدرسية',
      catTitle: 'تسوق حسب الفئة',
      helpTitle: 'المساعدة والإعدادات',
      profile: 'ملفي الشخصي',
      contact: 'اتصل بنا',
      login: 'تسجيل الدخول',
    }
  }

  const currentT = t[lang as keyof typeof t] ?? t.fr

  return (
    <>
      {/* Background Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 300ms ease-in-out',
          zIndex: 9998,
        }}
      />

      {/* Slide Drawer */}
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: isAr ? 'auto' : 0,
          right: isAr ? 0 : 'auto',
          width: '85vw',
          maxWidth: '380px',
          height: '100vh',
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          transform: isOpen ? 'translateX(0)' : isAr ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#0f172a',
        }}
      >
        {/* Top Header Section */}
        <div
          style={{
            padding: '1.25rem 1rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Logo & Subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', minWidth: 0 }}>
            <Link href="/" onClick={onClose} style={{ display: 'block', maxWidth: '140px' }}>
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
              color: '#334155',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9'
              e.currentTarget.style.color = '#ef233c'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc'
              e.currentTarget.style.color = '#334155'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Action Icons */}
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: '1rem',
          }}
        >
          <Link
            href="/contact"
            onClick={onClose}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              color: '#334155',
              fontSize: '0.72rem',
              fontWeight: 600,
              flex: 1,
              padding: '0.35rem 0',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <Phone size={18} style={{ color: '#ef233c' }} />
            <span>Contact</span>
          </Link>

          <Link
            href="/login"
            onClick={onClose}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              color: '#334155',
              fontSize: '0.72rem',
              fontWeight: 600,
              flex: 1,
              padding: '0.35rem 0',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <User size={18} style={{ color: '#ef233c' }} />
            <span>Compte</span>
          </Link>

          <Link
            href="/cart"
            onClick={onClose}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              color: '#334155',
              fontSize: '0.72rem',
              fontWeight: 600,
              flex: 1,
              padding: '0.35rem 0',
              borderRadius: '8px',
              transition: 'background 0.2s',
              position: 'relative',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <div style={{ position: 'relative', display: 'flex' }}>
              <ShoppingCart size={18} style={{ color: '#ef233c' }} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    backgroundColor: '#ef233c',
                    color: '#ffffff',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    minWidth: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 2px',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
            <span>Panier</span>
          </Link>
        </div>

        {/* Scrollable Content Container */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: '2.5rem',
            WebkitOverflowScrolling: 'touch',
          }}
          className="thin-scrollbar"
        >
          {/* Search form */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              padding: '1rem',
              display: 'flex',
              gap: '0.35rem',
            }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder={currentT.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: isAr ? '0 1rem 0 2.5rem' : '0 2.5rem 0 1rem',
                  fontSize: '0.85rem',
                  color: '#1e293b',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  outline: 'none',
                  fontWeight: 500,
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#ef233c' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1' }}
              />
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: isAr ? 'auto' : '0.85rem',
                  right: isAr ? '0.85rem' : 'auto',
                  color: '#64748b',
                  pointerEvents: 'none',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                height: '42px',
                padding: '0 1rem',
                backgroundColor: '#ef233c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d90429' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ef233c' }}
            >
              Search
            </button>
          </form>

          {/* Section: LISTES */}
          <div style={{ marginTop: '0.5rem' }}>
            <div
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#64748b',
                letterSpacing: '0.08em',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #f1f5f9',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              {currentT.listTitle}
            </div>

            <Link
              href="/best-offers?search=liste"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#0f172a',
                borderBottom: '1px solid #f1f5f9',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#ef233c' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0f172a' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <BookOpen size={16} />
                <span>{currentT.listsCol}</span>
              </div>
              <ChevronRight size={14} style={{ color: '#94a3b8' }} />
            </Link>
          </div>

          {/* Section: ACHETER PAR CATÉGORIE */}
          <div style={{ marginTop: '1.25rem' }}>
            <div
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#64748b',
                letterSpacing: '0.08em',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #f1f5f9',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              {currentT.catTitle}
            </div>

            {/* Dynamic Categories */}
            {categories.length > 0 ? (
              categories.map((cat) => {
                const isActive = activeCategoryParam === cat.name
                return (
                  <Link
                    key={cat.id}
                    href={`/best-offers?cat=${encodeURIComponent(cat.name)}`}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.1rem 1rem',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: isActive ? '#ef233c' : '#1e293b',
                      borderBottom: '1px solid #f1f5f9',
                      borderLeft: !isAr && isActive ? '4px solid #ef233c' : 'none',
                      borderRight: isAr && isActive ? '4px solid #ef233c' : 'none',
                      backgroundColor: isActive ? '#fef2f2' : 'transparent',
                      transition: 'all 200ms ease',
                      textTransform: 'uppercase',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#fef2f2'
                        e.currentTarget.style.color = '#ef233c'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#1e293b'
                      }
                    }}
                  >
                    <span>{cat.emoji || '📚'} {cat.name}</span>
                    <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                  </Link>
                )
              })
            ) : (
              /* Static Fallback Categories */
              staticCategories.map((name, idx) => {
                const isActive = activeCategoryParam === name
                const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
                return (
                  <Link
                    key={idx}
                    href={`/best-offers?cat=${encodeURIComponent(name)}`}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.1rem 1rem',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: isActive ? '#ef233c' : '#1e293b',
                      borderBottom: '1px solid #f1f5f9',
                      borderLeft: !isAr && isActive ? '4px solid #ef233c' : 'none',
                      borderRight: isAr && isActive ? '4px solid #ef233c' : 'none',
                      backgroundColor: isActive ? '#fef2f2' : 'transparent',
                      transition: 'all 200ms ease',
                      textTransform: 'uppercase',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#fef2f2'
                        e.currentTarget.style.color = '#ef233c'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#1e293b'
                      }
                    }}
                  >
                    <span>{name}</span>
                    <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                  </Link>
                )
              })
            )}
          </div>

          {/* Section: AIDE ET PARAMÈTRES */}
          <div style={{ marginTop: '1.25rem' }}>
            <div
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#64748b',
                letterSpacing: '0.08em',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #f1f5f9',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              {currentT.helpTitle}
            </div>

            <Link
              href="/login"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#0f172a',
                borderBottom: '1px solid #f1f5f9',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#ef233c' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0f172a' }}
            >
              <span>{currentT.profile}</span>
              <ChevronRight size={14} style={{ color: '#94a3b8' }} />
            </Link>

            <Link
              href="/contact"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#0f172a',
                borderBottom: '1px solid #f1f5f9',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#ef233c' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0f172a' }}
            >
              <span>{currentT.contact}</span>
              <ChevronRight size={14} style={{ color: '#94a3b8' }} />
            </Link>

            <Link
              href="/login"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#0f172a',
                borderBottom: '1px solid #f1f5f9',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#ef233c' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0f172a' }}
            >
              <span>{currentT.login}</span>
              <ChevronRight size={14} style={{ color: '#94a3b8' }} />
            </Link>
          </div>
        </div>
      </div>

      {/* Global thin scrollbar style */}
      <style jsx global>{`
        .thin-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .thin-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 99px;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  )
}
