'use client'
import { useEffect, useState } from 'react'
import ConfirmModal from '@/components/admin/ConfirmModal'
import {
  Search, Package, Clock, Settings, CheckCircle, CircleDollarSign,
  Eye, Printer, Trash2, Phone, MapPin, Calendar, X, Tag, Copy, Circle
} from 'lucide-react'

type OrderItem = {
  title: string
  qty: number
  price: number
  variant?: string
  selectedVariant?: { name: string; type: 'color' | 'text'; colorHex?: string } | null
}

type Order = {
  id: number
  orderNum: string
  name: string
  phone: string
  address: string
  city: string
  total: number
  promoCode?: string | null
  discount?: number | null
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
  const [deleteTarget,  setDeleteTarget]  = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError,   setDeleteError]   = useState('')

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

  function delOrder(id: number) {
    setDeleteError('')
    setDeleteTarget(id)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    setDeleteError('')
    try {
      const res = await fetch(`/api/orders/${deleteTarget}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` }
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      setDeleteTarget(null)
      setSelectedOrder(null)
      await load()
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Erreur lors de la suppression')
    } finally {
      setDeleteLoading(false)
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
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--a-text2)' }} />
          <input 
            className="filter-input" 
            style={{ paddingLeft: '2.5rem', width: '100%' }}
            placeholder="Rechercher par nom, ID, ville…" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
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
          { label: 'Total', val: summary.all, color: 'var(--a-primary)', icon: <Package size={24} /> },
          { label: 'En attente', val: summary.pending, color: 'var(--a-yellow)', icon: <Clock size={24} /> },
          { label: 'En cours', val: summary.processing, color: 'var(--a-orange)', icon: <Settings size={24} /> },
          { label: 'Complétées', val: summary.completed, color: 'var(--a-green)', icon: <CheckCircle size={24} /> },
          { label: 'Revenus', val: `${summary.revenue.toLocaleString()} DH`, color: 'var(--a-primary)', icon: <CircleDollarSign size={24} /> },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--a-card)', border: '1.5px solid var(--a-border)', borderRadius: '10px', padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: c.color, marginBottom: '0.3rem' }}>{c.icon}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: c.color }}>{c.val}</div>
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
                    <td>
                      <span className="order-amount">{o.total} DH</span>
                      {o.promoCode && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--a-green)', fontWeight: 700, marginTop: '0.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Tag size={12} /> {o.promoCode}
                        </div>
                      )}
                    </td>
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
                        <button className="btn-action proexcel-btn-admin-secondary-action" onClick={() => setSelectedOrder(o)} title="Voir détails">
                          <Eye size={16} />
                        </button>
                        <button className="btn-action proexcel-btn-admin-secondary-action" onClick={() => window.open(`/admin/orders/${o.id}/receipt`, '_blank')} title="Imprimer le bon">
                          <Printer size={16} />
                        </button>
                        <button className="btn-action btn-action-red proexcel-btn-admin-danger-action" onClick={() => delOrder(o.id)} title="Supprimer">
                          <Trash2 size={16} />
                        </button>
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

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget !== null && (
        <ConfirmModal
          title="Supprimer la commande ?"
          message="Cette action est irréversible. Voulez-vous vraiment supprimer cette commande ?"
          confirmLabel="Supprimer"
          loading={deleteLoading}
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={() => { if (!deleteLoading) { setDeleteTarget(null); setDeleteError('') } }}
        />
      )}

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div 
          id="orderModal" 
          style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedOrder(null) }}
        >
          <div style={{ background: 'var(--a-card)', borderRadius: '16px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--a-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--a-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--a-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--a-text)' }}>Commande #{selectedOrder.orderNum}</h2>
                  <div style={{ fontSize: '0.8rem', color: 'var(--a-text2)', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={12} /> {new Date(selectedOrder.date).toLocaleDateString('fr-FR')} à {new Date(selectedOrder.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'var(--a-card)', border: '1px solid var(--a-border)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--a-text2)' }}>
                <X size={16} />
              </button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ border: '1px solid var(--a-border)', borderRadius: '12px', padding: '1.25rem', background: 'var(--a-bg)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--a-text2)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Circle size={8} fill="currentColor" /> Informations Client
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--a-text)' }}>{selectedOrder.name}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.8rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--a-text2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={14} color="var(--a-primary)" /> {selectedOrder.phone}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--a-text2)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.4 }}>
                      <MapPin size={14} color="var(--a-primary)" style={{ flexShrink: 0, marginTop: '2px' }} /> 
                      <span>{selectedOrder.address}<br/>{selectedOrder.city}</span>
                    </div>
                  </div>
                </div>

                <div style={{ border: '1px solid var(--a-border)', borderRadius: '12px', padding: '1.25rem', background: 'var(--a-bg)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--a-text2)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Circle size={8} fill="currentColor" /> Statut
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <span className={`status-badge ${STATUS_CLASS[selectedOrder.status]}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', alignSelf: 'flex-start' }}>
                      <Circle size={10} fill="currentColor" /> {STATUS_LABEL[selectedOrder.status] || selectedOrder.status}
                    </span>
                    
                    {selectedOrder.promoCode && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--a-green)', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '6px', alignSelf: 'flex-start' }}>
                        <Tag size={14} /> Code: {selectedOrder.promoCode}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ border: '1px solid var(--a-border)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', background: 'var(--a-bg)', borderBottom: '1px solid var(--a-border)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--a-text2)' }}>
                  Détail de la commande
                </div>
                <div style={{ padding: '0 1rem' }}>
                {((selectedOrder.cart as OrderItem[]) || []).map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--a-border)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--a-text)' }}>{item.title}</div>
                      <div style={{ color: 'var(--a-text2)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                        {item.selectedVariant?.type === 'color' && item.selectedVariant.colorHex && (
                          <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: item.selectedVariant.colorHex, border: '1px solid rgba(0,0,0,0.15)', flexShrink: 0 }} />
                        )}
                        {(item.selectedVariant?.name || item.variant) ? `${item.selectedVariant?.name || item.variant}` : 'Standard'}
                        <span style={{ margin: '0 0.3rem', color: 'var(--a-border)' }}>|</span>
                        <span>Qté: {item.qty}</span>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--a-text)', fontSize: '0.95rem' }}>{item.price * item.qty} DH</div>
                  </div>
                ))}

                <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedOrder.discount && selectedOrder.discount > 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--a-green)', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Tag size={14} /> Réduction</span>
                      <span>-{selectedOrder.discount} DH</span>
                    </div>
                  ) : null}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 900, color: 'var(--a-primary)', paddingTop: '0.5rem', borderTop: '2px dashed var(--a-border)' }}>
                    <span>Total</span>
                    <span>{selectedOrder.total} DH</span>
                  </div>
                </div>
              </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn-action proexcel-btn-admin-secondary-action" 
                  style={{ flex: 1, padding: '0.85rem', borderRadius: '10px', background: 'var(--a-card)', border: '1px solid var(--a-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--a-text)' }}
                  onClick={() => window.open(`/admin/orders/${selectedOrder.id}/receipt`, '_blank')}
                >
                  <Printer size={18} /> Imprimer Bon
                </button>
                <button 
                  className="btn-save proexcel-btn-admin-save-action" 
                  style={{ flex: 1, position: 'static', padding: '0.85rem', background: 'var(--a-green)', borderRadius: '10px', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}
                  onClick={() => { updateStatus(selectedOrder.id, 'completed'); setSelectedOrder(null) }}
                >
                  <CheckCircle size={18} /> Marquer complété
                </button>
                <button 
                  className="btn-action btn-action-red proexcel-btn-admin-danger-action" 
                  style={{ flex: 1, padding: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}
                  onClick={() => { updateStatus(selectedOrder.id, 'cancelled'); setSelectedOrder(null) }}
                >
                  <X size={18} /> Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
