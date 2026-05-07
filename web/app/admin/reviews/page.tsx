'use client'
import { useEffect, useState } from 'react'

type Review = {
  id: string
  name: string
  rating: number
  comment: string
  date: string
}

type ProductReviews = {
  productId: number
  title: string
  rating: number
  reviewCount: number
  reviews: Review[]
}

export default function AdminReviews() {
  const [data, setData] = useState<ProductReviews[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

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

  async function deleteReview(productId: number, reviewId: string) {
    if (!confirm('Supprimer cet avis ?')) return
    setDeleting(reviewId)
    await fetch(`/api/reviews?productId=${productId}&reviewId=${reviewId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token()}` }
    })
    setDeleting(null)
    load()
  }

  async function addReview(productId: number) {
    if (!form.name || !form.comment) return
    setSaving(true)
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, ...form })
    })
    setSaving(false)
    setShowAdd(null)
    setForm({ name: '', rating: 5, comment: '' })
    load()
  }

  const filtered = data.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  const totalReviews = data.reduce((s, p) => s + p.reviews.length, 0)

  return (
    <div>
      <div className="admin-topbar">
        <div className="topbar-title">Avis clients <span>{totalReviews} avis au total</span></div>
        <div className="topbar-actions">
          <input
            style={{
              background: 'var(--a-card)', border: '1px solid var(--a-border)',
              borderRadius: '8px', padding: '0.5rem 1rem', color: 'var(--a-text)',
              fontSize: '0.85rem', width: '220px'
            }}
            placeholder="Rechercher un produit…"
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
            <div key={p.productId} style={{
              background: 'var(--a-card)', border: '1px solid var(--a-border)',
              borderRadius: '14px', marginBottom: '1.5rem', overflow: 'hidden'
            }}>
              {/* Product header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem', borderBottom: '1px solid var(--a-border)',
                background: 'rgba(192,57,43,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--a-text)' }}>{p.title}</span>
                  <span style={{
                    background: 'rgba(192,57,43,0.1)', color: 'var(--a-primary)',
                    borderRadius: '20px', padding: '0.15rem 0.6rem', fontSize: '0.75rem', fontWeight: 600
                  }}>
                    {p.reviews.length} avis · ★ {p.rating.toFixed(1)}
                  </span>
                </div>
                <button
                  className="btn-new"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={() => setShowAdd(showAdd === p.productId ? null : p.productId)}
                >
                  + Ajouter un avis
                </button>
              </div>

              {/* Add review form */}
              {showAdd === p.productId && (
                <div style={{
                  padding: '1.25rem', borderBottom: '1px solid var(--a-border)',
                  background: 'rgba(192,57,43,0.02)'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div className="s-label">Nom du client</div>
                      <input
                        className="s-input"
                        placeholder="Ex: Youssef M."
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <div className="s-label">Note (1-5)</div>
                      <select
                        className="s-input"
                        value={form.rating}
                        onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
                      >
                        {[5, 4, 3, 2, 1].map(n => (
                          <option key={n} value={n}>{'★'.repeat(n)} {n}/5</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="s-label">Commentaire</div>
                    <textarea
                      className="s-input"
                      rows={3}
                      placeholder="Commentaire du client…"
                      value={form.comment}
                      onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button
                      className="btn-new"
                      disabled={saving || !form.name || !form.comment}
                      onClick={() => addReview(p.productId)}
                    >
                      {saving ? 'Ajout…' : '✓ Publier'}
                    </button>
                    <button
                      className="btn-action"
                      onClick={() => { setShowAdd(null); setForm({ name: '', rating: 5, comment: '' }) }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* Reviews list */}
              {p.reviews.length === 0 ? (
                <div style={{ padding: '1rem 1.25rem', color: 'var(--a-text2)', fontSize: '0.85rem' }}>
                  Aucun avis pour ce produit.
                </div>
              ) : (
                p.reviews.map(rev => (
                  <div key={rev.id} style={{
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                    padding: '1rem 1.25rem', borderBottom: '1px solid var(--a-border)',
                    gap: '1rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--a-text)' }}>{rev.name}</span>
                        <span style={{ color: '#f59e0b', letterSpacing: '1px', fontSize: '0.85rem' }}>
                          {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--a-text2)' }}>{rev.date}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--a-text2)', margin: 0 }}>{rev.comment}</p>
                    </div>
                    <button
                      className="btn-action btn-action-red"
                      style={{ flexShrink: 0, fontSize: '0.75rem' }}
                      disabled={deleting === rev.id}
                      onClick={() => deleteReview(p.productId, rev.id)}
                    >
                      {deleting === rev.id ? '…' : 'Supprimer'}
                    </button>
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
