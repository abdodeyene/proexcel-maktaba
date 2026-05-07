'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Product = {
  id: number
  title: string
  price: number
  category: string
  stock: number
  g1: string
  g2: string
  media?: unknown | null
}

type Order = {
  id: number
  orderNum: string
  name: string
  city: string
  total: number
  status: string
  date: string
}

type Stats = {
  total: number
  pending: number
  completed: number
  revenue: number
}

const STATUS_CLASS: Record<string, string> = {
  completed: 'status-completed',
  processing: 'status-processing',
  pending: 'status-pending',
  shipped: 'status-shipped',
  cancelled: 'status-cancelled'
}

const STATUS_LABEL: Record<string, string> = {
  completed: 'Complété',
  processing: 'En cours',
  pending: 'En attente',
  shipped: 'Expédié',
  cancelled: 'Annulé'
}

function computeChartData(
  orders: Order[],
  period: 'week' | 'month' | 'year' | 'custom',
  customFrom: string,
  customTo: string
): { labels: string[]; values: number[]; counts: number[] } {
  const now = new Date()

  if (period === 'week') {
    const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    const values = Array(7).fill(0)
    const counts = Array(7).fill(0)
    const dow = now.getDay() === 0 ? 6 : now.getDay() - 1
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - dow)
    weekStart.setHours(0, 0, 0, 0)
    orders.forEach(o => {
      const d = new Date(o.date)
      const diff = Math.floor((d.getTime() - weekStart.getTime()) / 86400000)
      if (diff >= 0 && diff < 7) { values[diff] += o.total; counts[diff]++ }
    })
    return { labels, values, counts }
  }

  if (period === 'month') {
    const labels = ['S1', 'S2', 'S3', 'S4']
    const values = Array(4).fill(0)
    const counts = Array(4).fill(0)
    orders.forEach(o => {
      const d = new Date(o.date)
      if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
        const week = Math.min(Math.floor((d.getDate() - 1) / 7), 3)
        values[week] += o.total; counts[week]++
      }
    })
    return { labels, values, counts }
  }

  if (period === 'year') {
    const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    const values = Array(12).fill(0)
    const counts = Array(12).fill(0)
    const year = now.getFullYear()
    orders.forEach(o => {
      const d = new Date(o.date)
      if (d.getFullYear() === year) { values[d.getMonth()] += o.total; counts[d.getMonth()]++ }
    })
    return { labels, values, counts }
  }

  if (period === 'custom' && customFrom && customTo) {
    const start = new Date(customFrom); start.setHours(0, 0, 0, 0)
    const end = new Date(customTo); end.setHours(23, 59, 59, 999)
    const diffDays = Math.min(Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1, 60)
    const labels: string[] = []
    const values: number[] = []
    const counts: number[] = []
    for (let i = 0; i < diffDays; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i)
      labels.push(`${d.getDate()}/${d.getMonth() + 1}`)
      values.push(0); counts.push(0)
    }
    orders.forEach(o => {
      const d = new Date(o.date)
      if (d >= start && d <= end) {
        const diff = Math.floor((d.getTime() - start.getTime()) / 86400000)
        if (diff >= 0 && diff < diffDays) { values[diff] += o.total; counts[diff]++ }
      }
    })
    return { labels, values, counts }
  }

  return { labels: [], values: [], counts: [] }
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year' | 'custom'>('week')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [visitors, setVisitors] = useState<number[]>([])

  useEffect(() => {
    const t = localStorage.getItem('proexcel_admin_token')
    const h = { Authorization: `Bearer ${t}` }

    fetch('/api/orders/stats', { headers: h })
      .then(r => r.json()).then(setStats).catch(console.error)

    fetch('/api/orders', { headers: h })
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(console.error)

    fetch('/api/products', { headers: h })
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(console.error)

    setVisitors(Array.from({ length: 14 }, () => Math.floor(Math.random() * 80 + 20)))
  }, [])

  const chartData = useMemo(
    () => computeChartData(orders, period, customFrom, customTo),
    [orders, period, customFrom, customTo]
  )

  const lowStockProducts = products.filter(p => p.stock <= 8)
  const topProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 5)

  const chartMax = Math.max(...chartData.values, 1)
  const chartTotal = chartData.values.reduce((s, v) => s + v, 0)
  const chartOrderCount = chartData.counts.reduce((s, v) => s + v, 0)
  const visitorTotal = visitors.reduce((s, v) => s + v, 0)

  return (
    <div>
      {/* TOP BAR */}
      <div className="admin-topbar">
        <div className="topbar-title">
          Dashboard <span>Vue d&apos;ensemble</span>
        </div>
        <div className="topbar-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input placeholder="Rechercher…" />
        </div>
        <div className="topbar-actions">
          <div className="topbar-btn topbar-notif" title="Notifications">
            🔔 <span className="notif-dot"></span>
          </div>
          <Link href="/admin/products" className="btn-new">
            + Nouveau produit
          </Link>
        </div>
      </div>

      <div className="admin-content">

        {/* PERIOD FILTER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Aperçu des ventes</h2>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {(['week', 'month', 'year', 'custom'] as const).map(p => (
              <button
                key={p}
                className={`chart-filter ${period === p ? 'active' : ''}`}
                onClick={() => setPeriod(p)}
              >
                {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : p === 'year' ? 'Année' : '📅 Personnalisé'}
              </button>
            ))}
            {period === 'custom' && (
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginLeft: '0.25rem' }}>
                <input
                  type="date"
                  value={customFrom}
                  onChange={e => setCustomFrom(e.target.value)}
                  style={{
                    padding: '0.3rem 0.5rem', borderRadius: '6px',
                    border: '1px solid var(--a-border)', background: 'var(--a-card)',
                    color: 'var(--a-text)', fontSize: '0.8rem', cursor: 'pointer'
                  }}
                />
                <span style={{ color: 'var(--a-text2)', fontSize: '0.85rem' }}>→</span>
                <input
                  type="date"
                  value={customTo}
                  onChange={e => setCustomTo(e.target.value)}
                  style={{
                    padding: '0.3rem 0.5rem', borderRadius: '6px',
                    border: '1px solid var(--a-border)', background: 'var(--a-card)',
                    color: 'var(--a-text)', fontSize: '0.8rem', cursor: 'pointer'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* STATS ROW */}
        <div className="stats-row">
          <div className="stat-card fade-up" style={{ animationDelay: '0s' }}>
            <div className="stat-card-header">
              <span className="stat-label">Revenus totaux</span>
              <div className="stat-icon si-blue">💰</div>
            </div>
            <div className="stat-value">
              {stats ? `${stats.revenue.toLocaleString('fr-FR')} DH` : '—'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="stat-trend trend-up">▲ 4.2%</span>
              <span className="stat-sub">vs. période précédente</span>
            </div>
          </div>

          <div className="stat-card fade-up" style={{ animationDelay: '0.08s' }}>
            <div className="stat-card-header">
              <span className="stat-label">Commandes</span>
              <div className="stat-icon si-green">🛒</div>
            </div>
            <div className="stat-value">{stats?.total ?? '—'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="stat-trend trend-up">▲ 7.1%</span>
              <span className="stat-sub">ce mois</span>
            </div>
          </div>

          <div className="stat-card fade-up" style={{ animationDelay: '0.16s' }}>
            <div className="stat-card-header">
              <span className="stat-label">Clients</span>
              <div className="stat-icon si-purple">👥</div>
            </div>
            <div className="stat-value">
              {orders.length > 0
                ? orders.map(o => o.name).filter((v, i, a) => a.indexOf(v) === i).length
                : '—'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="stat-trend trend-up">▲ 2.8%</span>
              <span className="stat-sub">nouveaux ce mois</span>
            </div>
          </div>

          <div className="stat-card fade-up" style={{ animationDelay: '0.24s' }}>
            <div className="stat-card-header">
              <span className="stat-label">Stock faible</span>
              <div className="stat-icon si-red">⚠️</div>
            </div>
            <div className="stat-value text-red">{lowStockProducts.length}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="stat-trend trend-down">▼ {lowStockProducts.length} produits</span>
              <span className="stat-sub">à réapprovisionner</span>
            </div>
          </div>
        </div>

        {/* CHARTS + TOP PRODUCTS */}
        <div className="grid-2col" style={{ marginBottom: '1.5rem' }}>

          {/* Sales Chart */}
          <div className="a-card">
            <div className="a-card-header">
              <span className="a-card-title">Tendances des ventes</span>
              <div className="chart-filters">
                {(['week', 'month', 'year'] as const).map(p => (
                  <button
                    key={p}
                    className={`chart-filter ${period === p ? 'active' : ''}`}
                    onClick={() => setPeriod(p)}
                  >
                    {p === 'week' ? 'Sem.' : p === 'month' ? 'Mois' : 'Année'}
                  </button>
                ))}
                <button
                  className={`chart-filter ${period === 'custom' ? 'active' : ''}`}
                  onClick={() => setPeriod('custom')}
                  title="Plage de dates personnalisée"
                >📅</button>
              </div>
            </div>

            {/* Custom date inputs inside chart card */}
            {period === 'custom' && (
              <div style={{ padding: '0 1rem 0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--a-text2)' }}>Du</span>
                <input
                  type="date"
                  value={customFrom}
                  onChange={e => setCustomFrom(e.target.value)}
                  style={{
                    padding: '0.3rem 0.5rem', borderRadius: '6px',
                    border: '1px solid var(--a-border)', background: 'var(--a-bg)',
                    color: 'var(--a-text)', fontSize: '0.78rem'
                  }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--a-text2)' }}>au</span>
                <input
                  type="date"
                  value={customTo}
                  onChange={e => setCustomTo(e.target.value)}
                  style={{
                    padding: '0.3rem 0.5rem', borderRadius: '6px',
                    border: '1px solid var(--a-border)', background: 'var(--a-bg)',
                    color: 'var(--a-text)', fontSize: '0.78rem'
                  }}
                />
              </div>
            )}

            <div className="a-card-body">
              {chartData.labels.length === 0 ? (
                <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--a-text2)', fontSize: '0.85rem' }}>
                  {period === 'custom' && (!customFrom || !customTo)
                    ? 'Sélectionnez une plage de dates'
                    : 'Aucune donnée pour cette période'}
                </div>
              ) : (
                <div className="chart-area">
                  {chartData.values.map((v, i) => {
                    const pct = (v / chartMax) * 100
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: 0 }}>
                        <div style={{ position: 'relative', width: '100%', height: `${Math.max(pct, v > 0 ? 4 : 0)}%`, minHeight: v > 0 ? '6px' : '0' }} className="chart-bar">
                          {v > 0 && (
                            <div className="chart-bar-tooltip">
                              {v.toLocaleString()} DH
                              {chartData.counts[i] > 0 && <><br />{chartData.counts[i]} cmd</>}
                            </div>
                          )}
                        </div>
                        <div className="chart-label" style={{ fontSize: chartData.labels.length > 14 ? '0.55rem' : undefined }}>
                          {chartData.labels[i]}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              <div className="chart-stats-row">
                <div className="chart-stat">
                  <div className="chart-stat-val text-primary">{chartTotal.toLocaleString()} DH</div>
                  <div className="chart-stat-lbl">Chiffre d&apos;affaires</div>
                </div>
                <div className="chart-stat">
                  <div className="chart-stat-val text-green">
                    {chartOrderCount > 0 ? Math.round(chartTotal / chartOrderCount) : 0} DH
                  </div>
                  <div className="chart-stat-lbl">Panier moyen</div>
                </div>
                <div className="chart-stat">
                  <div className="chart-stat-val">{chartOrderCount}</div>
                  <div className="chart-stat-lbl">Commandes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="a-card">
            <div className="a-card-header">
              <span className="a-card-title">Meilleurs produits</span>
              <Link href="/admin/products" className="a-card-action">Voir tout →</Link>
            </div>
            <div className="a-card-body" style={{ paddingTop: '0.5rem' }}>
              {topProducts.length > 0 ? topProducts.map((p, i) => {
                const maxStock = Math.max(...topProducts.map(x => x.stock), 1)
                const pct = (p.stock / maxStock) * 100
                const images = Array.isArray(p.media) ? (p.media as string[]) : []
                const mainImg = images[0] || null

                return (
                  <div key={p.id} className="top-product-item">
                    <div className={`tp-rank ${i === 0 ? 'tp-rank-1' : i === 1 ? 'tp-rank-2' : i === 2 ? 'tp-rank-3' : ''}`}>
                      {i + 1}
                    </div>
                    <div className="tp-img">
                      <div style={{
                        width: '38px', height: '48px',
                        borderRadius: '3px 5px 5px 3px',
                        overflow: 'hidden',
                        background: `linear-gradient(145deg, ${p.g1 || '#1a237e'}, ${p.g2 || '#3949ab'})`,
                        flexShrink: 0,
                      }}>
                        {mainImg ? (
                          <img src={mainImg} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : null}
                      </div>
                    </div>
                    <div className="tp-info">
                      <div className="tp-name">{p.title}</div>
                      <div className="tp-cat">{p.category}</div>
                      <div className="tp-bar-wrap">
                        <div className="tp-bar" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                    <div className="tp-right">
                      <div className="tp-sales">{p.stock} en stock</div>
                      <div className="tp-revenue">{p.price} DH</div>
                    </div>
                  </div>
                )
              }) : (
                <div style={{ color: 'var(--a-text2)', fontSize: '0.85rem', padding: '1rem', textAlign: 'center' }}>
                  Aucun produit.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RECENT ORDERS + VISITORS */}
        <div className="grid-2col">

          <div className="a-card">
            <div className="a-card-header">
              <span className="a-card-title">Commandes récentes</span>
              <Link href="/admin/orders" className="a-card-action">Voir tout →</Link>
            </div>
            <div className="a-table-wrap">
              <table className="a-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map(o => (
                    <tr key={o.id}>
                      <td><span className="order-id">#{o.orderNum}</span></td>
                      <td>
                        <span className="cust-name">{o.name}</span>
                        <br />
                        <span style={{ fontSize: '0.72rem', color: 'var(--a-text2)' }}>{o.city}</span>
                      </td>
                      <td style={{ color: 'var(--a-text2)', fontSize: '0.8rem' }}>
                        {new Date(o.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td><span className="order-amount">{o.total} DH</span></td>
                      <td>
                        <span className={`status-badge ${STATUS_CLASS[o.status] || 'status-pending'}`}>
                          ● {STATUS_LABEL[o.status] || o.status}
                        </span>
                      </td>
                      <td>
                        <Link href="/admin/orders" className="btn-action">Voir</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div style={{ color: 'var(--a-text2)', fontSize: '0.85rem', padding: '2rem', textAlign: 'center' }}>
                  Aucune commande récente.
                </div>
              )}
            </div>
          </div>

          {/* Visitors Widget */}
          <div className="a-card">
            <div className="a-card-header">
              <span className="a-card-title">Visiteurs (14j)</span>
              <span className="a-card-action" style={{ cursor: 'default' }}>{visitorTotal} visites</span>
            </div>
            <div className="a-card-body">
              <div className="visitors-row">
                {visitors.map((v, i) => {
                  const max = Math.max(...visitors, 1)
                  return (
                    <div
                      key={i}
                      className="visitor-bar"
                      style={{ height: `${(v / max) * 100}%` }}
                      title={`${v} visiteurs`}
                    />
                  )
                })}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ background: 'var(--a-bg)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--a-primary)' }}>
                    {visitors.length > 0 ? Math.round(visitorTotal / visitors.length) : 0}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--a-text2)', marginTop: '0.25rem' }}>Moy./jour</div>
                </div>
                <div style={{ background: 'var(--a-bg)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--a-green)' }}>
                    {visitorTotal > 0 ? ((orders.length / visitorTotal) * 100).toFixed(1) : 0}%
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--a-text2)', marginTop: '0.25rem' }}>Taux conversion</div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--a-red)', marginBottom: '0.5rem' }}>
                  ⚠️ Stocks faibles
                </div>
                {lowStockProducts.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--a-text2)' }}>Aucun stock faible. ✅</div>
                ) : lowStockProducts.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--a-text)' }}>📚 {p.title.substring(0, 24)}…</span>
                    <span style={{ color: 'var(--a-red)', fontWeight: 700 }}>{p.stock} unités</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
