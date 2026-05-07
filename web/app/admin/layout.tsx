'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import './admin.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)
  const [theme, setTheme] = useState('light')
  const [pendingCount, setPendingCount] = useState(0)
  const [logoSrc, setLogoSrc] = useState('/logo.png')
  const [showToast, setShowToast] = useState(false)
  const [lastCount, setLastCount] = useState<number | null>(null)
  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => { if(d?.site_logo) setLogoSrc(d.site_logo) }).catch(()=>{})
    // Load and apply theme immediately
    const t = localStorage.getItem('admin_theme') || 'light'
    setTheme(t)
    document.documentElement.setAttribute('data-admin-theme', t)

    // Auth check
    const token = localStorage.getItem('proexcel_admin_token')
    if (!token) { router.push('/login'); return }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) {
          localStorage.removeItem('proexcel_admin_token')
          router.push('/login')
        } else {
          setChecked(true)
          // Fetch pending orders count for sidebar badge
            fetch('/api/orders/stats', { headers: { Authorization: `Bearer ${token}` } })
              .then(res => res.json())
              .then(data => {
                if (data && typeof data.pending === 'number') {
                  setPendingCount(data.pending)
                  setLastCount(data.pending)
                }
              })
              .catch(console.error)
          }
        })
        .catch(() => router.push('/login'))
  }, [router])

  useEffect(() => {
    if (!checked) return
    const token = localStorage.getItem('proexcel_admin_token')
    
    let currentLastCount = lastCount

    const interval = setInterval(() => {
      fetch('/api/orders/stats', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (data && typeof data.pending === 'number') {
            if (currentLastCount !== null && data.pending > currentLastCount) {
              // Play notification sound
              try {
                const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3')
                audio.play().catch(()=>{})
              } catch(e) {}
              setShowToast(true)
              setTimeout(() => setShowToast(false), 5000)
            }
            currentLastCount = data.pending
            setPendingCount(data.pending)
            setLastCount(data.pending)
          }
        })
        .catch(console.error)
    }, 10000)

    return () => clearInterval(interval)
  }, [checked, lastCount])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('admin_theme', next)
    document.documentElement.setAttribute('data-admin-theme', next)
  }

  async function logout() {
    if (confirm('Voulez-vous vous déconnecter ?')) {
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
      localStorage.removeItem('proexcel_admin_token')
      localStorage.removeItem('proexcel_admin')
      router.push('/login')
    }
  }

  if (!checked) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--a-bg, #f1f5f9)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        <div style={{ color: 'var(--a-text2, #64748b)', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>Chargement…</div>
      </div>
    </div>
  )

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src={logoSrc} alt="ProExcel Admin" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Panel</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Principale</div>
          <Link href="/admin" className={`sidebar-link ${pathname === '/admin' ? 'active' : ''}`}>
            <span className="sl-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </span>
            Dashboard
          </Link>
          <Link href="/admin/products" className={`sidebar-link ${pathname.startsWith('/admin/products') ? 'active' : ''}`}>
            <span className="sl-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </span>
            Produits
          </Link>
          <Link href="/admin/orders" className={`sidebar-link ${pathname.startsWith('/admin/orders') ? 'active' : ''}`}>
            <span className="sl-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </span>
            Commandes
            {pendingCount > 0 && <span className="sl-badge">{pendingCount}</span>}
          </Link>
          <Link href="/admin/categories" className={`sidebar-link ${pathname.startsWith('/admin/categories') ? 'active' : ''}`}>
            <span className="sl-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            </span>
            Catégories
          </Link>

          <Link href="/admin/reviews" className={`sidebar-link ${pathname.startsWith('/admin/reviews') ? 'active' : ''}`}>
            <span className="sl-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </span>
            Avis clients
          </Link>

          <div className="sidebar-section-label">Configuration</div>
          <Link href="/admin/settings" className={`sidebar-link ${pathname.startsWith('/admin/settings') ? 'active' : ''}`}>
            <span className="sl-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </span>
            Paramètres
          </Link>
          <Link href="/" className="sidebar-link" target="_blank" rel="noopener noreferrer">
            <span className="sl-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </span>
            Voir la boutique
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-admin">
            <div className="sidebar-avatar">A</div>
            <div>
              <div className="sidebar-admin-name">Admin ProExcel</div>
              <div className="sidebar-admin-role">Super Admin</div>
            </div>
          </div>
          <button className="sidebar-theme-btn" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> Mode clair</>
            ) : (
              <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Mode sombre</>
            )}
          </button>
          <button className="sidebar-logout" onClick={logout}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        {children}
      </main>

      {/* NEW ORDER NOTIFICATION TOAST */}
      <div style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        background: '#22c55e',
        color: '#fff',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        transform: showToast ? 'translateX(0)' : 'translateX(150%)',
        opacity: showToast ? 1 : 0,
        transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        zIndex: 9999
      }}>
        <div style={{ fontSize: '1.5rem' }}>🔔</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>Nouvelle Commande !</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Vérifiez l'onglet Commandes.</div>
        </div>
      </div>
    </div>
  )
}
