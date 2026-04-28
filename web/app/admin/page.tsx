'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type Stats = { total: number; pending: number; completed: number; revenue: number }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [orders, setOrders] = useState<{ id: number; orderNum: string; name: string; total: number; status: string; date: string }[]>([])

  useEffect(() => {
    const token = localStorage.getItem('proexcel_admin_token')
    const h = { Authorization: `Bearer ${token}` }
    fetch('/api/orders/stats', { headers: h }).then(r => r.json()).then(setStats)
    fetch('/api/orders?limit=5', { headers: h }).then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d.slice(0, 5) : []))
  }, [])

  const STATUS_COLOR: Record<string, string> = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', completed: '#22c55e', cancelled: '#ef4444' }

  return (
    <div>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#eef0f5', marginBottom: '2rem' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Commandes', value: stats?.total ?? '—', icon: '📦', color: '#3b82f6' },
          { label: 'En attente', value: stats?.pending ?? '—', icon: '⏳', color: '#f59e0b' },
          { label: 'Complétées', value: stats?.completed ?? '—', icon: '✅', color: '#22c55e' },
          { label: 'Revenus', value: stats ? `${stats.revenue.toFixed(0)} DH` : '—', icon: '💰', color: '#8b5cf6' },
        ].map(card => (
          <div key={card.label} style={{ background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.15)', borderRadius: 16, padding: '1.5rem' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '.5rem' }}>{card.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: card.color, marginBottom: '.25rem' }}>{card.value}</div>
            <div style={{ fontSize: '.78rem', color: '#8b96b0' }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { href: '/admin/products', label: 'Gérer les Produits', icon: '📚', desc: 'Ajouter, modifier, supprimer' },
          { href: '/admin/categories', label: 'Gérer les Catégories', icon: '🏷️', desc: 'Organiser le catalogue' },
          { href: '/admin/orders', label: 'Gérer les Commandes', icon: '📦', desc: 'Voir et traiter les commandes' },
          { href: '/admin/settings', label: 'Paramètres', icon: '⚙️', desc: 'Config du site' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{ background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.15)', borderRadius: 16, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'border-color .2s' }}>
            <span style={{ fontSize: '2rem' }}>{item.icon}</span>
            <div>
              <div style={{ fontWeight: 600, color: '#eef0f5', fontSize: '.9rem' }}>{item.label}</div>
              <div style={{ fontSize: '.75rem', color: '#8b96b0', marginTop: '.2rem' }}>{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {orders.length > 0 && (
        <div style={{ background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.15)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(59,130,246,.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#eef0f5', fontSize: '1rem' }}>Dernières Commandes</h3>
            <Link href="/admin/orders" style={{ fontSize: '.78rem', color: '#3b82f6' }}>Voir tout →</Link>
          </div>
          <div>
            {orders.map(o => (
              <div key={o.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(59,130,246,.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '.85rem', fontWeight: 600, color: '#eef0f5' }}>{o.name}</div>
                  <div style={{ fontSize: '.72rem', color: '#8b96b0' }}>{o.orderNum}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '.88rem', fontWeight: 600, color: '#3b82f6' }}>{o.total.toFixed(2)} DH</span>
                  <span style={{ fontSize: '.72rem', fontWeight: 600, padding: '2px 10px', borderRadius: 9999, background: `${STATUS_COLOR[o.status]}20`, color: STATUS_COLOR[o.status] }}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
