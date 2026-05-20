'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useLang } from '@/components/LangContext'
import { 
  Search, 
  ShoppingCart, 
  User, 
  Globe, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ChevronDown, 
  Check,
  Backpack,
  BookOpen,
  GraduationCap
} from '@/components/LucideIcons'

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [logoSrc, setLogoSrc] = useState('')
  const [logoReady, setLogoReady] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/' || (typeof window !== 'undefined' && window.location.pathname === '/')
  const { lang, setLang } = useLang()
  const langRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('proexcel_cart') || '[]')
      const count = cart.reduce((sum: number, item: any) => sum + (item.qty || item.quantity || 1), 0)
      setCartCount(count)
    }
    updateCart()
    window.addEventListener('cart-updated', updateCart)
    window.addEventListener('storage', updateCart)

    const savedTheme = localStorage.getItem('proexcel_theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
    }

    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        const src = d?.site_logo || '/logo.png'
        const img = new Image()
        img.onload = () => { setLogoSrc(src); setLogoReady(true) }
        img.onerror = () => { setLogoSrc(''); setLogoReady(false) }
        img.src = src
      })
      .catch(() => {})

    return () => {
      window.removeEventListener('cart-updated', updateCart)
      window.removeEventListener('storage', updateCart)
    }
  }, [])

  // Transparent-header: track scroll position (only matters on homepage)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close lang dropdown on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  // Focus search input when panel opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 80)
    } else {
      setSearchQuery('')
      setSearchResults([])
    }
  }, [searchOpen])

  // Close search on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
  
  // Search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`)
        if (res.ok) {
          const data = await res.json()
          setSearchResults(Array.isArray(data) ? data : (data?.products ?? []))
        }
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setIsSearching(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('proexcel_theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  // Transparent when at the top of the home page and no panels are open
  const atHero = isHome && !scrolled && !menuOpen && !searchOpen

  const LANGS = [
    { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
    { code: 'ar' as const, label: 'العربية', flag: '🇲🇦' },
  ]

  const t = {
    fr: { home: 'Accueil', offers: 'Meilleures Offres', levels: 'Niveaux', primaire: 'Primaire', college: 'Collège', lycee: 'Lycée', about: 'À Propos', contact: 'Contact', login: 'Connexion', search: 'Rechercher...' },
    ar: { home: 'الرئيسية', offers: 'أفضل العروض', levels: 'المستويات', primaire: 'ابتدائي', college: 'إعدادي', lycee: 'ثانوي', about: 'من نحن', contact: 'اتصل بنا', login: 'دخول', search: 'بحث...' },
  }
  const currentT = t[lang as keyof typeof t] ?? t.fr
  const isAr = lang === 'ar'

  const headerClass = [
    isHome ? 'header-home' : '',
    atHero ? 'at-hero' : '',
  ].filter(Boolean).join(' ')

  return (
    <>
      <header
        className={headerClass}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 1000 }}
      >
        <div className="header-inner">
          {/* Mobile: cart on left */}
          <Link href="/cart" className="btn-icon mob-only" title="Panier" style={{ position: 'relative' }}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          <Link href="/" className="logo">
            {logoReady && logoSrc ? (
              <img
                src={logoSrc}
                alt="ProExcel Maktaba"
                className="logo-img"
                style={{ animation: 'logo-fadein 0.3s ease' }}
                onError={() => setLogoReady(false)}
              />
            ) : (
              <span className="logo-text-fallback">ProExcel</span>
            )}
          </Link>

          <nav className="header-nav-center">
            <Link href="/" className={pathname === '/' ? 'active' : ''}>{currentT.home}</Link>
            <Link href="/best-offers" className={pathname === '/best-offers' ? 'active' : ''}>{currentT.offers}</Link>
            <div className={`nav-dropdown-wrap ${['/primaire', '/college', '/lycee', '/niveaux/primaire', '/niveaux/college', '/niveaux/lycee'].some(p => pathname.startsWith(p)) ? 'active' : ''}`}>
              <button className="nav-dropdown-btn">
                {currentT.levels}
                <ChevronDown size={14} style={{ marginLeft: '4px' }} />
              </button>
              <div className="nav-dropdown-menu">
                <Link href="/niveaux/primaire" className={pathname.includes('primaire') ? 'active' : ''}>
                  <span className="nav-dropdown-icon"><Backpack size={18} /></span>
                  {currentT.primaire}
                </Link>
                <Link href="/niveaux/college" className={pathname.includes('college') ? 'active' : ''}>
                  <span className="nav-dropdown-icon"><BookOpen size={18} /></span>
                  {currentT.college}
                </Link>
                <Link href="/niveaux/lycee" className={pathname.includes('lycee') ? 'active' : ''}>
                  <span className="nav-dropdown-icon"><GraduationCap size={18} /></span>
                  {currentT.lycee}
                </Link>
              </div>
            </div>
            <Link href="/about" className={pathname === '/about' ? 'active' : ''}>{currentT.about}</Link>
            <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>{currentT.contact}</Link>
          </nav>

          <div className="header-actions">
            <button className="btn-icon proexcel-btn-home-search-btn" title="Rechercher" onClick={() => setSearchOpen(v => !v)}>
              <Search size={20} />
            </button>

            <button className="btn-icon" title="Thème" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Premium Language Switcher */}
            <div className="lang-switcher desk-only" ref={langRef}>
              <button
                className={`lang-btn ${langOpen ? 'open' : ''}`}
                onClick={() => setLangOpen(v => !v)}
                title="Langue / اللغة / Language"
              >
                <Globe size={18} className="lang-globe-icon" />
                <span className="lang-current">{lang.toUpperCase()}</span>
                <ChevronDown size={14} className="lang-chevron" />
              </button>
              <div className={`lang-dropdown ${langOpen ? 'open' : ''}`}>
                {LANGS.map(opt => (
                  <button
                    key={opt.code}
                    className={`lang-option ${lang === opt.code ? 'active' : ''}`}
                    onClick={() => { setLang(opt.code); setLangOpen(false); setMenuOpen(false) }}
                  >
                    <span className="lang-flag">{opt.flag}</span>
                    {opt.label}
                    {lang === opt.code && <Check size={14} className="lang-check" />}
                  </button>
                ))}
              </div>
            </div>

            <Link href="/cart" className="btn-icon desk-only" title="Panier">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>

            <Link href="/login" className="btn-icon desk-only" title={currentT.login}>
              <User size={20} />
            </Link>

            {/* Mobile: hamburger on right */}
            <button className="mobile-menu-btn" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} id="mobileNav">
        <Link href="/" onClick={() => setMenuOpen(false)}>{currentT.home}</Link>
        <Link href="/best-offers" onClick={() => setMenuOpen(false)}>{currentT.offers}</Link>
        <div className="mobile-nav-section">{currentT.levels}</div>
        <Link href="/niveaux/primaire" onClick={() => setMenuOpen(false)} style={{ paddingLeft: '1.5rem' }}>🎒 {currentT.primaire}</Link>
        <Link href="/niveaux/college" onClick={() => setMenuOpen(false)} style={{ paddingLeft: '1.5rem' }}>📚 {currentT.college}</Link>
        <Link href="/niveaux/lycee" onClick={() => setMenuOpen(false)} style={{ paddingLeft: '1.5rem' }}>🎓 {currentT.lycee}</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>{currentT.about}</Link>
        <Link href="/contact" onClick={() => setMenuOpen(false)}>{currentT.contact}</Link>
        <div className="mobile-nav-extras">
          <button className="btn-theme btn-theme-mob" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile lang buttons */}
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {LANGS.map(opt => (
              <button
                key={opt.code}
                className={`lang-mob-btn ${lang === opt.code ? 'active' : ''}`}
                onClick={() => { setLang(opt.code); setMenuOpen(false) }}
              >
                {opt.flag} {opt.code.toUpperCase()}
              </button>
            ))}
          </div>

          <Link href="/login" className="btn-icon" style={{ display: 'flex', marginLeft: 'auto' }} onClick={() => setMenuOpen(false)} title={currentT.login}>
            <User size={18} />
          </Link>
        </div>
      </nav>

      {/* Search backdrop */}
      {searchOpen && (
        <div
          onClick={() => setSearchOpen(false)}
          style={{
            position: 'fixed', inset: 0, top: '68px', zIndex: 9997,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
            animation: 'sdFadeIn 0.2s ease',
          }}
        />
      )}

      {/* Search dropdown — slides down from navbar */}
      <div
        ref={searchPanelRef}
        style={{
          position: 'fixed', top: '68px', left: 0, right: 0, zIndex: 9998,
          background: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          transform: searchOpen ? 'translateY(0)' : 'translateY(-12px)',
          opacity: searchOpen ? 1 : 0,
          pointerEvents: searchOpen ? 'all' : 'none',
          transition: 'transform 0.28s cubic-bezier(0.16,1,0.3,1), opacity 0.22s ease',
          maxHeight: 'calc(100vh - 68px)',
          overflowY: 'auto',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '1.25rem 1.5rem 1.5rem' }}>
          {/* Input row */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={isAr ? 'ابحث عن منتج...' : 'Rechercher un produit…'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              dir={isAr ? 'rtl' : 'ltr'}
              style={{
                width: '100%', background: 'var(--bg2)',
                border: '2px solid var(--border)', borderRadius: '14px',
                padding: isAr ? '0.9rem 2.8rem 0.9rem 1rem' : '0.9rem 2.8rem 0.9rem 3rem',
                fontSize: '1rem', color: 'var(--text)',
                outline: 'none', fontWeight: 600, fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--primary)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
            />
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                <X size={16} />
              </button>
            ) : (
              <button onClick={() => setSearchOpen(false)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                <X size={16} />
              </button>
            )}
          </div>

          {/* Results */}
          {isSearching && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text2)' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid rgba(232,53,42,0.15)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 0.75rem', animation: 'sdSpin 0.8s linear infinite' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{isAr ? 'جاري البحث...' : 'Recherche en cours…'}</div>
            </div>
          )}

          {!isSearching && searchQuery && searchResults.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text2)' }}>
              <Search size={36} style={{ opacity: 0.18, display: 'block', margin: '0 auto 0.75rem' }} />
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>{isAr ? 'لا توجد نتائج' : 'Aucun produit trouvé'}</div>
              <div style={{ fontSize: '0.85rem' }}>{isAr ? 'جرب كلمة مختلفة' : 'Essayez avec d\'autres mots'}</div>
            </div>
          )}

          {!isSearching && !searchQuery && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0 0.5rem', color: 'var(--text2)', fontSize: '0.88rem' }}>
              {isAr ? 'اكتب للبحث في الكتالوج…' : 'Tapez pour rechercher dans le catalogue…'}
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                {searchResults.length} {isAr ? 'نتيجة' : 'résultat(s)'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {searchResults.slice(0, 8).map(p => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    onClick={() => setSearchOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '0.75rem', borderRadius: '12px',
                      border: '1px solid var(--border)', background: 'var(--bg)',
                      textDecoration: 'none', transition: 'border-color 0.18s, background 0.18s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLElement).style.background = 'var(--card)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg)' }}
                  >
                    <div style={{ width: '52px', height: '64px', borderRadius: '8px', overflow: 'hidden', background: 'var(--card)', flexShrink: 0, border: '1px solid var(--border)' }}>
                      {Array.isArray(p.media) && p.media[0] ? (
                        <img src={p.media[0]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{p.emoji || '📚'}</div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: '0.25rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {lang === 'ar' && p.titleAr ? p.titleAr : p.title}
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {p.category && (
                          <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 700, background: 'rgba(232,53,42,0.08)', padding: '0.1rem 0.45rem', borderRadius: '5px' }}>
                            {p.category}
                          </span>
                        )}
                        {p.author && <span style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>{p.author}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{p.price} DH</div>
                      {p.compareAtPrice > p.price && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text2)', textDecoration: 'line-through' }}>{p.compareAtPrice} DH</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes sdFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes sdSpin { to { transform: rotate(360deg) } }
      `}</style>
    </>
  )
}
