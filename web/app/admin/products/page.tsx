'use client'
import { useEffect, useState } from 'react'

type Product = { id: number; title: string; price: number; category?: string | null; stock: number; isPromo: boolean; isBestOffer: boolean; isNew: boolean; emoji?: string | null }
const EMPTY = { title: '', author: '', price: '', compareAtPrice: '', category: '', emoji: '📦', g1: '#1a237e', g2: '#3949ab', stock: '0', isPromo: false, isBestOffer: false, isNew: false, description: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<typeof EMPTY>(EMPTY)
  const [loading, setLoading] = useState(false)

  function token() { return localStorage.getItem('proexcel_admin_token') || '' }

  async function load() {
    const data = await fetch('/api/products').then(r => r.json())
    setProducts(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  function openCreate() { setEditing(null); setForm(EMPTY); setModal(true) }
  function openEdit(p: Product & Record<string, unknown>) {
    setEditing(p.id)
    setForm({ title: p.title, author: String(p.author || ''), price: String(p.price), compareAtPrice: String(p.compareAtPrice || ''), category: String(p.category || ''), emoji: String(p.emoji || '📦'), g1: String(p.g1 || '#1a237e'), g2: String(p.g2 || '#3949ab'), stock: String(p.stock), isPromo: !!p.isPromo, isBestOffer: !!p.isBestOffer, isNew: !!p.isNew, description: String(p.description || '') })
    setModal(true)
  }

  async function save() {
    setLoading(true)
    const body = { ...form, price: Number(form.price), compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null, stock: Number(form.stock) }
    const url = editing ? `/api/products/${editing}` : '/api/products'
    const method = editing ? 'PATCH' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify(body) })
    await load(); setModal(false); setLoading(false)
  }

  async function del(id: number) {
    if (!confirm('Supprimer ce produit ?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
    await load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#eef0f5' }}>Produits</h1>
        <button onClick={openCreate} style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', border: 'none', padding: '.6rem 1.25rem', borderRadius: 9999, fontWeight: 600, cursor: 'pointer', fontSize: '.85rem' }}>
          + Ajouter
        </button>
      </div>
      <div style={{ background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.15)', borderRadius: 16, overflow: 'hidden' }}>
        {products.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#8b96b0' }}>Aucun produit. Ajoutez-en un !</div>
        ) : products.map(p => (
          <div key={p.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(59,130,246,.08)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.5rem' }}>{p.emoji}</span>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontWeight: 600, color: '#eef0f5', fontSize: '.88rem' }}>{p.title}</div>
              <div style={{ fontSize: '.72rem', color: '#8b96b0' }}>{p.category}</div>
            </div>
            <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {p.isPromo && <span style={{ fontSize: '.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 9999, background: 'rgba(239,68,68,.15)', color: '#ef4444' }}>PROMO</span>}
              {p.isNew && <span style={{ fontSize: '.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 9999, background: 'rgba(34,197,94,.15)', color: '#22c55e' }}>NEW</span>}
            </div>
            <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '.9rem', minWidth: 70, textAlign: 'right' }}>{p.price} DH</span>
            <span style={{ color: '#8b96b0', fontSize: '.78rem', minWidth: 60 }}>Stock: {p.stock}</span>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <button onClick={() => openEdit(p as Product & Record<string, unknown>)} style={{ background: 'rgba(59,130,246,.1)', border: 'none', color: '#3b82f6', cursor: 'pointer', borderRadius: 8, padding: '.3rem .6rem', fontSize: '.8rem' }}>✏️</button>
              <button onClick={() => del(p.id)} style={{ background: 'rgba(239,68,68,.1)', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: 8, padding: '.3rem .6rem', fontSize: '.8rem' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,9,26,.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div style={{ background: '#0c1028', border: '1px solid rgba(59,130,246,.2)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#eef0f5', marginBottom: '1.5rem' }}>{editing ? 'Modifier' : 'Ajouter'} un Produit</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {([['title', 'Titre', 'text'], ['author', 'Auteur', 'text'], ['price', 'Prix (DH)', 'number'], ['compareAtPrice', 'Prix barré (DH)', 'number'], ['category', 'Catégorie', 'text'], ['emoji', 'Emoji', 'text'], ['g1', 'Couleur 1', 'color'], ['g2', 'Couleur 2', 'color'], ['stock', 'Stock', 'number']] as [string, string, string][]).map(([field, label, type]) => (
                <div key={field} style={field === 'title' || field === 'description' ? { gridColumn: '1/-1' } : {}}>
                  <label style={{ display: 'block', fontSize: '.78rem', color: '#8b96b0', marginBottom: '.3rem' }}>{label}</label>
                  <input type={type} value={String(form[field as keyof typeof form])} onChange={e => setForm({ ...form, [field]: e.target.value })}
                    style={{ width: '100%', background: 'rgba(6,9,26,.5)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 8, padding: '.55rem .75rem', color: '#eef0f5', fontSize: '.85rem', outline: 'none' }} />
                </div>
              ))}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '.78rem', color: '#8b96b0', marginBottom: '.3rem', display: 'block' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                  style={{ width: '100%', background: 'rgba(6,9,26,.5)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 8, padding: '.55rem .75rem', color: '#eef0f5', fontSize: '.85rem', outline: 'none', resize: 'vertical' }} />
              </div>
              <div style={{ gridColumn: '1/-1', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {(['isPromo', 'isBestOffer', 'isNew'] as const).map(f => (
                  <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer', fontSize: '.85rem', color: '#8b96b0' }}>
                    <input type="checkbox" checked={!!form[f]} onChange={e => setForm({ ...form, [f]: e.target.checked })} />
                    {f === 'isPromo' ? 'Promo' : f === 'isBestOffer' ? 'Best Offer' : 'Nouveau'}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: '1px solid rgba(59,130,246,.2)', color: '#8b96b0', borderRadius: 9999, padding: '.55rem 1.25rem', cursor: 'pointer', fontSize: '.85rem' }}>Annuler</button>
              <button onClick={save} disabled={loading} style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 9999, padding: '.55rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '.85rem' }}>
                {loading ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
