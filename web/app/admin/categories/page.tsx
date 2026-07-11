'use client'
import { useEffect, useRef, useState } from 'react'
import { Edit2, Trash2, Camera, Loader2, Save, X, Plus } from 'lucide-react'

type Category = {
  id: number
  name: string
  emoji?: string | null
  color?: string | null
  image?: string | null
  count: number
}

const EMPTY = { name: '', emoji: '📚', color: '#c0392b', image: '' }

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([])
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [imgUploading, setImgUploading] = useState(false)
  const [imgError, setImgError] = useState('')
  const imgRef = useRef<HTMLInputElement>(null)

  function token() { return localStorage.getItem('proexcel_admin_token') || '' }

  async function load() {
    try {
      const data = await fetch('/api/categories', { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json())
      setCats(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) }
  }

  useEffect(() => { load() }, [])

  function openCreate() { setEditingId(null); setForm(EMPTY); setModal(true) }

  function openEdit(c: Category) {
    setEditingId(c.id)
    setForm({ name: c.name, emoji: c.emoji || '📚', color: c.color || '#c0392b', image: c.image || '' })
    setModal(true)
  }

  async function uploadImage(file: File) {
    setImgUploading(true)
    setImgError('')
    try {
      const fd = new FormData()
      fd.append('files', file)
      const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || `HTTP ${res.status}`)
      }
      const { urls } = await res.json()
      if (urls[0]) setForm(f => ({ ...f, image: urls[0] }))
    } catch (e) { setImgError(e instanceof Error ? e.message : 'Erreur upload') }
    finally { setImgUploading(false) }
  }

  async function saveCat() {
    setLoading(true)
    const url = editingId ? `/api/categories/${editingId}` : '/api/categories'
    const method = editingId ? 'PATCH' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ name: form.name, emoji: form.emoji, color: form.color, image: form.image || null })
      })
      if (res.ok) { await load(); setModal(false) }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function delCat(id: number) {
    if (!confirm('Supprimer cette catégorie ?')) return
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
      await load()
    } catch (e) { console.error(e) }
  }

  const emojiList = ['📚', '📐', '⚗️', '🔬', '📖', '🗺️', '📈', '💻', '🧠', '⚙️', '🎒', '🌍', '🌐', '✏️', '📝', '🔭', '🎨', '🏫', '🧮', '🎓', '🔑', '📌', '🗂️', '📦']
  const colorPalette = [
    '#c0392b', '#e74c3c', '#e67e22', '#f39c12', '#f1c40f',
    '#2ecc71', '#27ae60', '#1abc9c', '#16a085', '#3498db',
    '#2980b9', '#9b59b6', '#8e44ad', '#34495e', '#2c3e50',
    '#e91e63', '#ff5722', '#795548', '#607d8b', '#000000',
  ]

  return (
    <div>
      <div className="admin-topbar">
        <div className="topbar-title">Catégories <span>Gérer les catégories</span></div>
        <div className="topbar-actions">
          <button className="btn-new proexcel-btn-admin-primary-action" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> Nouvelle catégorie
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="categories-admin-grid">
          {cats.map(c => (
            <div key={c.id} className="cat-admin-card" onClick={() => openEdit(c)}>
              <div className="cat-admin-img" style={{ background: c.image ? 'transparent' : `linear-gradient(135deg, ${c.color || '#c0392b'}33, ${c.color || '#c0392b'}11)` }}>
                {c.image
                  ? <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  : <span style={{ fontSize: '2.8rem' }}>{c.emoji || '📚'}</span>
                }
                <div className="cat-admin-img-overlay"><Edit2 size={24} color="white" /></div>
              </div>
              <div className="cat-admin-body">
                <div className="cat-admin-name">{c.name}</div>
                <div className="cat-admin-count">{c.count} produit{c.count !== 1 ? 's' : ''}</div>
                <div className="cat-admin-actions" onClick={e => e.stopPropagation()}>
                  <button className="btn-action proexcel-btn-admin-secondary-action" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }} onClick={() => openEdit(c)}>
                    <Edit2 size={14} /> Modifier
                  </button>
                  <button className="btn-action btn-action-red proexcel-btn-admin-danger-action" onClick={() => delCat(c.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cats.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--a-text2)' }}>Aucune catégorie disponible.</div>
        )}
      </div>

      {modal && (
        <div
          style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200, alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(false) }}
        >
          <div style={{ background: 'var(--a-card)', borderRadius: '16px', maxWidth: '480px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.35)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--a-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{editingId ? 'Modifier catégorie' : 'Nouvelle catégorie'}</h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--a-text2)' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              {/* Circle image preview + upload */}
              <div>
                <div className="s-label">Image du cercle</div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                    border: '2px solid var(--a-border)',
                    background: form.image ? 'transparent' : `linear-gradient(135deg, ${form.color}55, ${form.color}22)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {form.image
                      ? <img src={form.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '2rem' }}>{form.emoji || '📚'}</span>
                    }
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ cursor: 'pointer' }}>
                      <input ref={imgRef} type="file" accept="image/*" hidden onChange={e => { if (e.target.files?.[0]) uploadImage(e.target.files[0]); e.target.value = '' }} />
                      <span className="btn-action proexcel-btn-admin-upload-action" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                        {imgUploading ? <><Loader2 size={14} className="animate-spin" /> Upload…</> : <><Camera size={14} /> Choisir image</>}
                      </span>
                    </label>
                    {imgError && <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>{imgError}</div>}
                    {form.image && (
                      <button className="btn-action btn-action-red proexcel-btn-admin-danger-action" style={{ fontSize: '0.78rem' }} onClick={() => setForm(f => ({ ...f, image: '' }))}>
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <div className="s-label">Nom *</div>
                <input className="s-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Mathématiques" />
              </div>

              {/* Emoji fallback */}
              <div>
                <div className="s-label">Emoji (si pas d&apos;image)</div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {emojiList.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setForm({ ...form, emoji })}
                      style={{
                        fontSize: '1.5rem',
                        width: '42px', height: '42px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '8px', cursor: 'pointer',
                        border: form.emoji === emoji ? `2px solid ${form.color || '#c0392b'}` : '2px solid transparent',
                        background: form.emoji === emoji ? `${form.color || '#c0392b'}22` : 'var(--a-bg)',
                        transition: 'all 0.15s',
                        lineHeight: 1,
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <div className="s-label">Couleur de fond</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  {colorPalette.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, color: c })}
                      style={{
                        width: '28px', height: '28px',
                        borderRadius: '6px',
                        background: c,
                        border: form.color === c ? '3px solid var(--a-text)' : '2px solid transparent',
                        cursor: 'pointer',
                        outline: form.color === c ? `2px solid ${c}` : 'none',
                        outlineOffset: '2px',
                        transition: 'all 0.15s',
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ width: '40px', height: '34px', borderRadius: '6px', border: '2px solid var(--a-border)', cursor: 'pointer', padding: '2px' }} />
                  <input className="s-input" style={{ fontFamily: 'monospace', flex: 1 }} value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="#c0392b" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
                <button className="btn-action proexcel-btn-admin-secondary-action" style={{ flex: 1, padding: '0.75rem', borderRadius: '10px' }} onClick={() => setModal(false)}>Annuler</button>
                <button className="btn-save proexcel-btn-admin-save-action" style={{ flex: 2, padding: '0.75rem', borderRadius: '10px', position: 'static', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={saveCat} disabled={loading}>
                  <Save size={18} /> {loading ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
