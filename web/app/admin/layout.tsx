'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Produits', icon: '📚' },
  { href: '/admin/categories', label: 'Catégories', icon: '🏷️' },
  { href: '/admin/orders', label: 'Commandes', icon: '📦' },
  { href: '/admin/settings', label: 'Paramètres', icon: '⚙️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('proexcel_admin_token')
    if (!token) { router.push('/login'); return }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) { localStorage.removeItem('proexcel_admin_token'); router.push('/login') } else setChecked(true) })
      .catch(() => router.push('/login'))
  }, [router])

  if (!checked) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06091a' }}>
      <div style={{ color: '#8b96b0' }}>Chargement…</div>
    </div>
  )

  function logout() {
    localStorage.removeItem('proexcel_admin_token')
    localStorage.removeItem('proexcel_admin')
    router.push('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#06091a' }}>
      <aside style={{ width: 240, background: '#0c1028', borderRight: '1px solid rgba(59,130,246,.15)', display: 'flex', flexDirection: 'column', padding: '1.5rem 0', flexShrink: 0 }}>
        <div style={{ padding: '0 1.25rem 1.5rem', borderBottom: '1px solid rgba(59,130,246,.1)' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: '#eef0f5' }}>
            Pro<span style={{ color: '#3b82f6' }}>Excel</span>
          </Link>
          <p style={{ fontSize: '.72rem', color: '#8b96b0', marginTop: '.25rem' }}>Administration</p>
        </div>
        <nav style={{ flex: 1, padding: '1rem .75rem', display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '.75rem',
              padding: '.65rem 1rem', borderRadius: 10, fontSize: '.88rem', fontWeight: 500,
              background: pathname === item.href ? 'rgba(59,130,246,.15)' : 'transparent',
              color: pathname === item.href ? '#3b82f6' : '#8b96b0',
              transition: 'all .2s',
            }}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '.75rem' }}>
          <button onClick={logout} style={{ width: '100%', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#ef4444', borderRadius: 10, padding: '.6rem', fontSize: '.82rem', fontWeight: 600, cursor: 'pointer' }}>
            🚪 Déconnexion
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>{children}</main>
    </div>
  )
}
