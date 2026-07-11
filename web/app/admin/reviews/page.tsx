'use client'
import { useEffect, useState } from 'react'
import { Check, Edit2, Eye, EyeOff, Trash2, Plus } from 'lucide-react'

type Review = {
  id: string
  name: string
  rating: number
  comment: string
  date: string
  approved?: boolean
}

type ProductReviews = {
  productId: number
  title: string
  rating: number
  reviewCount: number
  reviews: Review[]
}

const STAR = (n: number, filled: number) =>
  Array.from({ length: 5 }, (_, i) => (i < filled ? '★' : '☆')).join('')

export default function AdminReviews() {
  const [data, setData]         = useState<ProductReviews[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [editId, setEditId]     = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', rating: 5, comment: '' })
  const [saving, setSaving]     = useState(false)
  const [addFor, setAddFor]     = useState<number | null>(null)
  const [addForm, setAddForm]   = useState({ name: '', rating: 5, comment: '' })

  function token() { return localStorage.getItem('proexcel_admin_token') || '' }

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/reviews', { headers: { Authorization: `Bearer ${token()}` } })
      if (res.ok) setData(await res.json())
    } catch { /* silent */ }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // ── ADD ──
  async function addReview(productId: number) {
    if (!addForm.name.trim() || !addForm.comment.trim()) return
    setSaving(true)
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, ...addForm }),
    })
    setSaving(false)
    setAddFor(null)
    setAddForm({ name: '', rating: 5, comment: '' })
    load()
  }

  // ── EDIT ──
  function startEdit(rev: Review) {
    setEditId(rev.id)
    setEditForm({ name: rev.name, rating: rev.rating, comment: rev.comment })
  }

  async function saveEdit(productId: number, reviewId: string) {
    setSaving(true)
    await fetch('/api/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ productId, reviewId, ...editForm }),
    })
    setSaving(false)
    setEditId(null)
    load()
  }

  // ── APPROVE / HIDE ──
  async function toggleApprove(productId: number, rev: Review) {
    await fetch('/api/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ productId, reviewId: rev.id, approved: rev.approved === false }),
    })
    load()
  }

  // ── DELETE ──
  async function deleteReview(productId: number, reviewId: string) {
    if (!confirm('Supprimer cet avis ?')) return
    await fetch(`/api/reviews?productId=${productId}&reviewId=${reviewId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token()}` },
    })
    load()
  }

  const filtered = data.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
  const totalReviews = data.reduce((s, p) => s + p.reviews.length, 0)

  return (
    <div>
      <div className="admin-topbar">
        <div className="topbar-title">
          Avis clients <span>{totalReviews} avis au total</span>
        </div>
        <div className="topbar-actions">
          <input
            style={{ background: 'var(--a-card)', border: '1px solid var(--a-border)', borderRadius: '8px', padding: '0.5rem 1rem', color: 'var(--a-text)', fontSize: '0.85rem', width: '220px' }}
            placeholder="Filtrer par produit…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--a-text2)' }}>Chargement…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--a-text2)' }}>
            {search ? 'Aucun produit trouvé.' : 'Aucun avis pour l\'instant.'}
          </div>
        ) : (
          filtered.map(p => (
            <div key={p.productId} style={{ background: 'var(--a-card)', border: '1px solid var(--a-border)', borderRadius: '14px', marginBottom: '1.5rem', overflow: 'hidden' }}>

              {/* Product header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid var(--a-border)', background: 'rgba(192,57,43,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.title}</span>
                  <span style={{ background: 'rgba(192,57,43,0.1)', color: 'var(--a-primary)', borderRadius: '20px', padding: '0.15rem 0.6rem', fontSize: '0.75rem', fontWeight: 600 }}>
                    {p.reviews.length} avis · ★ {p.rating.toFixed(1)}
                  </span>
                </div>
                <button
                  className="btn-new proexcel-btn-admin-primary-action"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  onClick={() => setAddFor(addFor === p.productId ? null : p.productId)}
                >
                  <Plus size={14} /> Ajouter un avis
                </button>
              </div>

              {/* Add form */}
              {addFor === p.productId && (
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--a-border)', background: 'rgba(192,57,43,0.02)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem' }}>Nouvel avis</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div className="s-label">Nom du client</div>
                      <input className="s-input" placeholder="Ex: Youssef M." value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <div className="s-label">Note</div>
                      <select className="s-input" value={addForm.rating} onChange={e => setAddForm(f => ({ ...f, rating: Number(e.target.value) }))}>
                        {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)} {n}/5</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="s-label">Commentaire</div>
                  <textarea className="s-input" rows={3} placeholder="Commentaire…" value={addForm.comment} onChange={e => setAddForm(f => ({ ...f, comment: e.target.value }))} style={{ resize: 'vertical', marginBottom: '0.75rem' }} />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-new proexcel-btn-admin-save-action" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} disabled={saving || !addForm.name || !addForm.comment} onClick={() => addReview(p.productId)}>
                      {saving ? 'Ajout…' : <><Check size={14} /> Publier</>}
                    </button>
                    <button className="btn-action proexcel-btn-admin-secondary-action" onClick={() => { setAddFor(null); setAddForm({ name: '', rating: 5, comment: '' }) }}>Annuler</button>
                  </div>
                </div>
              )}

              {/* Reviews list */}
              {p.reviews.length === 0 ? (
                <div style={{ padding: '1rem 1.25rem', color: 'var(--a-text2)', fontSize: '0.85rem' }}>Aucun avis pour ce produit.</div>
              ) : (
                p.reviews.map(rev => (
                  <div key={rev.id} style={{ borderBottom: '1px solid var(--a-border)', padding: '1rem 1.25rem', opacity: rev.approved === false ? 0.5 : 1, transition: 'opacity 0.2s' }}>

                    {editId === rev.id ? (
                      /* ─ Edit mode ─ */
                      <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <div>
                            <div className="s-label">Nom</div>
                            <input className="s-input" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                          </div>
                          <div>
                            <div className="s-label">Note</div>
                            <select className="s-input" value={editForm.rating} onChange={e => setEditForm(f => ({ ...f, rating: Number(e.target.value) }))}>
                              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)} {n}/5</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="s-label">Commentaire</div>
                        <textarea className="s-input" rows={3} value={editForm.comment} onChange={e => setEditForm(f => ({ ...f, comment: e.target.value }))} style={{ resize: 'vertical', marginBottom: '0.75rem' }} />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-new proexcel-btn-admin-save-action" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} disabled={saving} onClick={() => saveEdit(p.productId, rev.id)}>
                            {saving ? '…' : <><Check size={14} /> Sauvegarder</>}
                          </button>
                          <button className="btn-action proexcel-btn-admin-secondary-action" onClick={() => setEditId(null)}>Annuler</button>
                        </div>
                      </div>
                    ) : (
                      /* ─ Display mode ─ */
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{rev.name}</span>
                            <span style={{ color: '#f59e0b', letterSpacing: '1px', fontSize: '0.85rem' }}>{STAR(5, rev.rating)}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--a-text2)' }}>{rev.date}</span>
                            {rev.approved === false && (
                              <span style={{ background: 'rgba(231,76,60,0.12)', color: 'var(--a-red)', borderRadius: '6px', padding: '0.1rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>Masqué</span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--a-text2)', margin: 0, wordBreak: 'break-word' }}>{rev.comment}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          <button
                            className="btn-action proexcel-btn-admin-secondary-action"
                            style={{ fontSize: '0.75rem', padding: '0.4rem', minWidth: 'unset' }}
                            onClick={() => startEdit(rev)}
                            title="Modifier"
                          ><Edit2 size={14} /></button>
                          <button
                            className="btn-action proexcel-btn-admin-secondary-action"
                            style={{ fontSize: '0.75rem', minWidth: '95px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            onClick={() => toggleApprove(p.productId, rev)}
                            title={rev.approved === false ? 'Afficher' : 'Masquer'}
                          >
                            {rev.approved === false ? <><Eye size={14} /> Afficher</> : <><EyeOff size={14} /> Masquer</>}
                          </button>
                          <button
                            className="btn-action btn-action-red proexcel-btn-admin-danger-action"
                            style={{ fontSize: '0.75rem', padding: '0.4rem', minWidth: 'unset' }}
                            onClick={() => deleteReview(p.productId, rev.id)}
                            title="Supprimer"
                          ><Trash2 size={14} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
