'use client'
import { useEffect, useState } from 'react'

type Order = { id: number; orderNum: string; name: string; phone: string; city: string; total: number; status: string; date: string; cart: unknown[] }
const STATUSES = ['pending', 'processing', 'shipped', 'completed', 'cancelled']
const STATUS_COLOR: Record<string, string> = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', completed: '#22c55e', cancelled: '#ef4444' }

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selected, setSelected] = useState<Order | null>(null)

  function token() { return localStorage.getItem('proexcel_admin_token') || '' }
  async function load() {
    const data = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json())
    setOrders(Array.isArray(data) ? data : [])
  }
  useEffect(() => { load() }, [])

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify({ status }) })
    await load()
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  async function del(id: number) {
    if (!confirm('Supprimer cette commande ?')) return
    await fetch(`/api/orders/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
    setSelected(null); await load()
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#eef0f5', marginBottom: '2rem' }}>Commandes ({orders.length})</h1>
      <div style={{ background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.15)', borderRadius: 16, overflow: 'hidden' }}>
        {orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#8b96b0' }}>Aucune commande.</div>
        ) : orders.map(o => (
          <div key={o.id} onClick={() => setSelected(o)} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(59,130,246,.08)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', cursor: 'pointer', transition: 'background .2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = '')}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontWeight: 600, color: '#eef0f5', fontSize: '.88rem' }}>{o.name}</div>
              <div style={{ fontSize: '.72rem', color: '#8b96b0' }}>{o.orderNum} · {o.city}</div>
            </div>
            <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '.9rem' }}>{o.total.toFixed(2)} DH</span>
            <span style={{ fontSize: '.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 9999, background: `${STATUS_COLOR[o.status]}20`, color: STATUS_COLOR[o.status] }}>{o.status}</span>
            <select value={o.status} onClick={e => e.stopPropagation()} onChange={e => updateStatus(o.id, e.target.value)}
              style={{ background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 8, padding: '.3rem .5rem', color: '#eef0f5', fontSize: '.78rem', outline: 'none' }}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={e => { e.stopPropagation(); del(o.id) }} style={{ background: 'rgba(239,68,68,.1)', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: 8, padding: '.3rem .6rem', fontSize: '.8rem' }}>🗑️</button>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,9,26,.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}>
          <div style={{ background: '#0c1028', border: '1px solid rgba(59,130,246,.2)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#eef0f5', marginBottom: '1.5rem' }}>Détail Commande</h3>
            {[['N° Commande', selected.orderNum], ['Client', selected.name], ['Téléphone', selected.phone], ['Ville', selected.city], ['Total', `${selected.total.toFixed(2)} DH`], ['Statut', selected.status]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid rgba(59,130,246,.08)', fontSize: '.85rem' }}>
                <span style={{ color: '#8b96b0' }}>{k}</span>
                <span style={{ color: '#eef0f5', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '.78rem', color: '#8b96b0', marginBottom: '.5rem' }}>Articles:</p>
              {(selected.cart as { title: string; qty: number; price: number; variant: string }[]).map((item, i) => (
                <div key={i} style={{ fontSize: '.82rem', color: '#eef0f5', padding: '.35rem 0', borderBottom: '1px solid rgba(59,130,246,.06)' }}>
                  {item.title} × {item.qty} — {(item.price * item.qty).toFixed(2)} DH
                </div>
              ))}
            </div>
            <button onClick={() => setSelected(null)} style={{ marginTop: '1.5rem', width: '100%', background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.2)', color: '#3b82f6', borderRadius: 9999, padding: '.6rem', cursor: 'pointer', fontWeight: 600 }}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  )
}
