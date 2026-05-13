'use client'
import { useEffect, useState } from 'react'

type OrderItem = {
  title: string
  qty: number
  price: number
  variant?: string
}

type Order = {
  id: number
  orderNum: string
  name: string
  phone: string
  address: string
  city: string
  total: number
  status: string
  date: string
  cart: unknown // Will cast as OrderItem[]
}

const STATUSES = ['pending', 'processing', 'shipped', 'completed', 'cancelled']

const STATUS_LABEL: Record<string, string> = {
  completed: 'Complété',
  processing: 'En cours',
  pending: 'En attente',
  shipped: 'Expédié',
  cancelled: 'Annulé'
}

const STATUS_CLASS: Record<string, string> = {
  completed: 'status-completed',
  processing: 'status-processing',
  pending: 'status-pending',
  shipped: 'status-shipped',
  cancelled: 'status-cancelled'
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)

  // Filters
  const [currentTab, setCurrentTab] = useState('all')
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [sort, setSort] = useState('date-desc')

  function token() { return localStorage.getItem('proexcel_admin_token') || '' }

  async function load() {
    try {
      const data = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token()}` }
      }).then(r => r.json())
      setOrders(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id: number, status: string) {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`
        },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        await load()
        if (selectedOrder?.id === id) {
          setSelectedOrder(prev => prev ? { ...prev, status } : null)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function delOrder(id: number) {
    if (!confirm('Supprimer cette commande ?')) return
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` }
      })
      setSelectedOrder(null)
      await load()
    } catch (e) {
      console.error(e)
    }
  }

  // Filter and sort logic
  const filteredOrders = orders.filter(o => {
    if (currentTab !== 'all' && o.status !== currentTab) return false
    if (search && !(
      o.name.toLowerCase().includes(search.toLowerCase()) || 
      o.orderNum.toLowerCase().includes(search.toLowerCase()) || 
      o.city.toLowerCase().includes(search.toLowerCase())
    )) return false
    if (city && o.city !== city) return false
    return true
  })

  if (sort === 'date-desc') filteredOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  else if (sort === 'date-asc') filteredOrders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  else if (sort === 'amount-desc') filteredOrders.sort((a, b) => b.total - a.total)
  else if (sort === 'amount-asc') filteredOrders.sort((a, b) => a.total - b.total)

  const summary = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  }

  return (
    <div>
      {/* TOPBAR */}
      <div className="admin-topbar">
        <div className="topbar-title">Commandes <span>Gestion des commandes</span></div>
        <div className="topbar-actions">
          <span style={{ fontSize: '0.82rem', color: 'var(--a-text2)' }}>
            Total: {filteredOrders.length} commande(s)
          </span>
        </div>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 0, padding: '0 1.5rem', background: 'var(--a-card)', borderBottom: '1px solid var(--a-border)', overflowX: 'auto' }}>
        <button className={`order-tab ${currentTab === 'all' ? 'active' : ''}`} onClick={() => setCurrentTab('all')}>Toutes</button>
        {STATUSES.map(s => (
          <button 
            key={s} 
            className={`order-tab ${currentTab === s ? 'active' : ''}`} 
            onClick={() => setCurrentTab(s)}
          >
            {STATUS_LABEL[s] || s}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input 
          className="filter-input" 
          placeholder="🔍 Rechercher par nom, ID, ville…" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
        <select className="filter-select" value={city} onChange={e => setCity(e.target.value)}>
          <option value="">Toutes les villes</option>
          <option>Casablanca</option><option>Rabat</option><option>Fès</option>
          <option>Marrakech</option><option>Agadir</option><option>Tanger</option>
          <option>Meknès</option><option>Oujda</option>
        </select>
        <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="date-desc">Plus récentes</option>
          <option value="date-asc">Plus anciennes</option>
          <option value="amount-desc">Montant décroissant</option>
          <option value="amount-asc">Montant croissant</option>
        </select>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--a-border)' }}>
        {[
          { label: 'Total', val: summary.all, color: 'var(--a-primary)', icon: '📦' },
          { label: 'En attente', val: summary.pending, color: 'var(--a-yellow)', icon: '⏳' },
          { label: 'En cours', val: summary.processing, color: 'var(--a-orange)', icon: '⚙️' },
          { label: 'Complétées', val: summary.completed, color: 'var(--a-green)', icon: '✅' },
          { label: 'Revenus', val: `${summary.revenue.toLocaleString()} DH`, color: 'var(--a-primary)', icon: '💰' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--a-card)', border: '1.5px solid var(--a-border)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem' }}>{c.icon}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: c.color, marginTop: '0.3rem' }}>{c.val}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--a-text2)', marginTop: '0.15rem' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="a-card" style={{ margin: '1.5rem', borderRadius: 'var(--a-r)', overflow: 'hidden' }}>
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <th>Commande</th>
                <th>Client</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => {
                const items = (o.cart as OrderItem[]) || []
                const itemSnippet = items.map(i => `${i.title.substring(0, 16)}…`).join(', ') || '–'
                const d = new Date(o.date)
                return (
                  <tr key={o.id}>
                    <td><span className="order-id">#{o.orderNum}</span></td>
                    <td>
                      <div className="cust-name">{o.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--a-text2)' }}>{o.phone} · {o.city}</div>
                    </td>
                    <td style={{ color: 'var(--a-text2)', fontSize: '0.8rem' }}>
                      {d.toLocaleDateString('fr-FR')}
                      <br />
                      <span style={{ fontSize: '0.72rem' }}>{d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td><span className="order-amount">{o.total} DH</span></td>
                    <td>
                      <select 
                        value={o.status} 
                        onChange={e => updateStatus(o.id, e.target.value)}
                        style={{ padding: '0.25rem 0.5rem', borderRadius: '7px', border: '1.5px solid var(--a-border)', background: 'transparent', color: 'var(--a-text)', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{STATUS_LABEL[s] || s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn-action proexcel-btn-admin-secondary-action" onClick={() => setSelectedOrder(o)}>👁️ Voir</button>
                        <button className="btn-action proexcel-btn-admin-secondary-action" onClick={() => window.open(`/admin/orders/${o.id}/receipt`, '_blank')}>🖨️ Bon</button>
                        <button className="btn-action btn-action-red proexcel-btn-admin-danger-action" onClick={() => delOrder(o.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--a-text2)' }}>
              Aucune commande trouvée.
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div 
          id="orderModal" 
          style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedOrder(null) }}
        >
          <div style={{ background: 'var(--a-card)', borderRadius: '16px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--a-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Commande #{selectedOrder.orderNum}</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--a-text2)' }}>✕</button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--a-bg)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--a-text2)', marginBottom: '0.5rem' }}>Client</div>
                  <div style={{ fontWeight: 700 }}>{selectedOrder.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--a-text2)', marginTop: '0.25rem' }}>📞 {selectedOrder.phone}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--a-text2)', marginTop: '0.15rem' }}>📍 {selectedOrder.address}, {selectedOrder.city}</div>
                </div>
                <div style={{ background: 'var(--a-bg)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--a-text2)', marginBottom: '0.5rem' }}>Détails</div>
                  <div style={{ fontSize: '0.82rem' }}>📅 {new Date(selectedOrder.date).toLocaleDateString('fr-FR')}</div>
                  <div style={{ marginTop: '0.4rem' }}>
                    <span className={`status-badge ${STATUS_CLASS[selectedOrder.status]}`}>
                      ● {STATUS_LABEL[selectedOrder.status] || selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--a-text2)', marginBottom: '0.75rem' }}>Produits commandés</div>
              {((selectedOrder.cart as OrderItem[]) || []).map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--a-border)', fontSize: '0.85rem' }}>
                  <div>{item.title}</div>
                  <div style={{ color: 'var(--a-text2)' }}>{item.variant ? `${item.variant} ×` : ''} {item.qty}</div>
                  <div style={{ fontWeight: 700, color: 'var(--a-primary)' }}>{item.price * item.qty} DH</div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0 0', fontSize: '1rem', fontWeight: 800, borderTop: '2px solid var(--a-border)', marginTop: '0.5rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--a-primary)' }}>{selectedOrder.total} DH</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn-action proexcel-btn-admin-secondary-action" 
                  style={{ flex: 1, padding: '0.7rem', borderRadius: '9px', background: 'var(--a-card)', border: '1px solid var(--a-border)' }}
                  onClick={() => window.open(`/admin/orders/${selectedOrder.id}/receipt`, '_blank')}
                >
                  🖨️ Imprimer Bon
                </button>
                <button 
                  className="btn-save proexcel-btn-admin-save-action" 
                  style={{ flex: 1, position: 'static', padding: '0.7rem', background: 'var(--a-green)', borderRadius: '9px', boxShadow: 'none' }}
                  onClick={() => { updateStatus(selectedOrder.id, 'completed'); setSelectedOrder(null) }}
                >
                  ✅ Marquer complété
                </button>
                <button 
                  className="btn-action btn-action-red proexcel-btn-admin-danger-action" 
                  style={{ flex: 1, padding: '0.7rem', borderRadius: '9px' }}
                  onClick={() => { updateStatus(selectedOrder.id, 'cancelled'); setSelectedOrder(null) }}
                >
                  ❌ Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
