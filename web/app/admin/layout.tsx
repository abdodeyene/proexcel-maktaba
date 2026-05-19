'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  MessageSquare,
  Settings,
  ExternalLink,
  Sun,
  Moon,
  LogOut,
  BookOpen,
  Layers
} from '@/components/LucideIcons'
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
              // Play notification beep via Web Audio API (no external dependency)
              try {
                const ctx = new AudioContext()
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()
                osc.connect(gain)
                gain.connect(ctx.destination)
                osc.frequency.value = 880
                gain.gain.setValueAtTime(0.3, ctx.currentTime)
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
                osc.start()
                osc.stop(ctx.currentTime + 0.5)
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
        <BookOpen size={32} color="#64748b" />
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
            <span className="sl-icon"><LayoutDashboard size={16} /></span>
            Dashboard
          </Link>
          <Link href="/admin/products" className={`sidebar-link ${pathname.startsWith('/admin/products') ? 'active' : ''}`}>
            <span className="sl-icon"><Package size={16} /></span>
            Produits
          </Link>
          <Link href="/admin/orders" className={`sidebar-link ${pathname.startsWith('/admin/orders') ? 'active' : ''}`}>
            <span className="sl-icon"><ShoppingCart size={16} /></span>
            Commandes
            {pendingCount > 0 && <span className="sl-badge">{pendingCount}</span>}
          </Link>
          <Link href="/admin/categories" className={`sidebar-link ${pathname.startsWith('/admin/categories') ? 'active' : ''}`}>
            <span className="sl-icon"><FolderTree size={16} /></span>
            Catégories
          </Link>

          <Link href="/admin/reviews" className={`sidebar-link ${pathname.startsWith('/admin/reviews') ? 'active' : ''}`}>
            <span className="sl-icon"><MessageSquare size={16} /></span>
            Avis clients
          </Link>

          <div className="sidebar-section-label">Configuration</div>
          <Link href="/admin/slider" className={`sidebar-link ${pathname.startsWith('/admin/slider') ? 'active' : ''}`}>
            <span className="sl-icon"><Layers size={16} /></span>
            Hero Slider
          </Link>
          <Link href="/admin/settings" className={`sidebar-link ${pathname.startsWith('/admin/settings') ? 'active' : ''}`}>
            <span className="sl-icon"><Settings size={16} /></span>
            Paramètres
          </Link>
          <Link href="/" className="sidebar-link" target="_blank" rel="noopener noreferrer">
            <span className="sl-icon"><ExternalLink size={16} /></span>
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
          <button className="sidebar-theme-btn proexcel-btn-admin-theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? <><Sun size={14} /> Mode clair</> : <><Moon size={14} /> Mode sombre</>}
          </button>
          <button className="sidebar-logout proexcel-btn-admin-logout" onClick={logout}>
            <LogOut size={14} />
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
