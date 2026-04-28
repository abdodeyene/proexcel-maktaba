'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const update = () => {
      const cart = JSON.parse(localStorage.getItem('proexcel_cart') || '[]')
      setCartCount(cart.reduce((s: number, i: { qty: number }) => s + i.qty, 0))
    }
    update()
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(6,9,26,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(59,130,246,0.15)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: 64, gap: '2rem' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: '#eef0f5' }}>
            Pro<span style={{ color: '#3b82f6' }}>Excel</span>
          </Link>
          <nav style={{ display: 'flex', gap: '1.5rem', flex: 1, alignItems: 'center' }} className="hidden-mobile">
            <Link href="/" style={{ color: '#8b96b0', fontSize: '.9rem', fontWeight: 500, transition: 'color .2s' }} onMouseEnter={e => (e.currentTarget.style.color='#eef0f5')} onMouseLeave={e => (e.currentTarget.style.color='#8b96b0')}>Accueil</Link>
            <Link href="/best-offers" style={{ color: '#8b96b0', fontSize: '.9rem', fontWeight: 500, transition: 'color .2s' }} onMouseEnter={e => (e.currentTarget.style.color='#eef0f5')} onMouseLeave={e => (e.currentTarget.style.color='#8b96b0')}>Meilleures Offres</Link>
            <Link href="/contact" style={{ color: '#8b96b0', fontSize: '.9rem', fontWeight: 500, transition: 'color .2s' }} onMouseEnter={e => (e.currentTarget.style.color='#eef0f5')} onMouseLeave={e => (e.currentTarget.style.color='#8b96b0')}>Contact</Link>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
            <Link href="/cart" style={{ position: 'relative', color: '#eef0f5', fontSize: '1.3rem' }}>
              🛒
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -8,
                  background: '#3b82f6', color: '#fff',
                  borderRadius: '9999px', fontSize: '.65rem', fontWeight: 700,
                  padding: '1px 5px', minWidth: 16, textAlign: 'center',
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/login" style={{
              background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              color: '#fff', padding: '.4rem 1rem', borderRadius: 9999,
              fontSize: '.82rem', fontWeight: 600,
            }}>
              Connexion
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: '#eef0f5', fontSize: '1.4rem', cursor: 'pointer' }} className="show-mobile">
              ☰
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <nav style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
          background: 'rgba(6,9,26,0.97)', borderBottom: '1px solid rgba(59,130,246,0.2)',
          padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ color: '#eef0f5', fontWeight: 500 }}>Accueil</Link>
          <Link href="/best-offers" onClick={() => setMenuOpen(false)} style={{ color: '#eef0f5', fontWeight: 500 }}>Meilleures Offres</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ color: '#eef0f5', fontWeight: 500 }}>Contact</Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)} style={{ color: '#eef0f5', fontWeight: 500 }}>Panier {cartCount > 0 && `(${cartCount})`}</Link>
        </nav>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
