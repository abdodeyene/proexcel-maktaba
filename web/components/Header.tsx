'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [lang, setLang] = useState<'fr' | 'ar'>('fr')
  const [logoSrc, setLogoSrc] = useState('/logo.png')
  const pathname = usePathname()
  const router = useRouter()

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

    const savedLang = localStorage.getItem('proexcel_lang') as 'fr' | 'ar' | null
    if (savedLang) {
      setLang(savedLang)
      document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr')
      document.documentElement.setAttribute('lang', savedLang)
    }

    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d?.site_logo) setLogoSrc(d.site_logo) })
      .catch(() => {})

    return () => {
      window.removeEventListener('cart-updated', updateCart)
      window.removeEventListener('storage', updateCart)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('proexcel_theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const toggleLang = () => {
    const newLang = lang === 'fr' ? 'ar' : 'fr'
    setLang(newLang)
    localStorage.setItem('proexcel_lang', newLang)
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', newLang)
    window.location.reload()
  }

  const t = {
    fr: { home: 'Accueil', offers: 'Meilleures Offres', about: 'À Propos', contact: 'Contact', login: 'Connexion', search: 'Rechercher...', lang: 'عربي' },
    ar: { home: 'الرئيسية', offers: 'أفضل العروض', about: 'من نحن', contact: 'اتصل بنا', login: 'دخول', search: 'بحث...', lang: 'Français' }
  }
  const currentT = t[lang]

  return (
    <>
      <header>
        <div className="header-inner">
          <button className="mobile-menu-btn" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <Link href="/" className="logo">
            <img
              src={logoSrc}
              alt="ProExcel Maktaba"
              className="logo-img"
            />
          </Link>

          <nav className="header-nav-center">
            <Link href="/" className={pathname === '/' ? 'active' : ''}>{currentT.home}</Link>
            <Link href="/best-offers" className={pathname === '/best-offers' ? 'active' : ''}>{currentT.offers}</Link>
            <Link href="/about" className={pathname === '/about' ? 'active' : ''}>{currentT.about}</Link>
            <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>{currentT.contact}</Link>
          </nav>

          <div className="header-actions">
            <button className="btn-icon" title="Rechercher" onClick={() => setSearchOpen(true)}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>

            <button className="btn-icon desk-only" title="Thème" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            <button className="btn-icon desk-only" title="Langue" onClick={toggleLang}>
               {lang === 'fr' ? (
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
               ) : (
                 <span style={{ fontSize: '11px', fontWeight: 'bold' }}>AR</span>
               )}
            </button>

            <Link href="/cart" className="btn-icon" title="Panier">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>

            <Link href="/login" className="btn-icon desk-only" title={currentT.login}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '17px', height: '17px', flexShrink: 0 }}>
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} id="mobileNav">
        <Link href="/" onClick={() => setMenuOpen(false)}>{currentT.home}</Link>
        <Link href="/best-offers" onClick={() => setMenuOpen(false)}>{currentT.offers}</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>{currentT.about}</Link>
        <Link href="/contact" onClick={() => setMenuOpen(false)}>{currentT.contact}</Link>
        <div className="mobile-nav-extras">
          <button className="btn-theme btn-theme-mob" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <button className="btn-lang btn-lang-mob" onClick={() => { toggleLang(); setMenuOpen(false) }}>{currentT.lang}</button>
          <Link href="/login" className="btn-icon" style={{ display: 'flex', marginLeft: 'auto' }} onClick={() => setMenuOpen(false)} title={currentT.login}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '15px', height: '15px' }}>
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </Link>
        </div>
      </nav>

      <div className={`search-overlay ${searchOpen ? 'open' : ''}`}>
        <div className="search-modal">
           <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
             <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
             </button>
           </div>
           <input type="text" className="search-modal-input" placeholder={currentT.search} autoFocus={searchOpen} />
           <div className="search-results">
             {/* Dynamic search results can go here */}
           </div>
        </div>
      </div>
    </>
  )
}
