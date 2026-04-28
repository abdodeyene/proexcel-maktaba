'use client'
import { useEffect, useState } from 'react'

type Category = { id: number; name: string; emoji?: string | null; color?: string | null; count: number }
const EMPTY = { name: '', emoji: '📚', color: '#1e40af', glow: '', image: '' }

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)

  function token() { return localStorage.getItem('proexcel_admin_token') || '' }
  async function load() {
    const data = await fetch('/api/categories').then(r => r.json())
    setCats(Array.isArray(data) ? data : [])
  }
  useEffect(() => { load() }, [])

  function openCreate() { setEditing(null); setForm(EMPTY); setModal(true) }
  function openEdit(c: Category) { setEditing(c.id); setForm({ name: c.name, emoji: c.emoji || '📚', color: c.color || '#1e40af', glow: '', image: '' }); setModal(true) }

  async function save() {
    setLoading(true)
    const url = editing ? `/api/categories/${editing}` : '/api/categories'
    await fetch(url, { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify(form) })
    await load(); setModal(false); setLoading(false)
  }

  async function del(id: number) {
    if (!confirm('Supprimer cette catégorie ?')) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
    await load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#eef0f5' }}>Catégories</h1>
        <button onClick={openCreate} style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', border: 'none', padding: '.6rem 1.25rem', borderRadius: 9999, fontWeight: 600, cursor: 'pointer', fontSize: '.85rem' }}>+ Ajouter</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {cats.map(c => (
          <div key={c.id} style={{ background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.15)', borderRadius: 16, padding: '1.25rem', textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>{c.emoji}</div>
            <div style={{ fontWeight: 600, color: '#eef0f5', fontSize: '.9rem', marginBottom: '.25rem' }}>{c.name}</div>
            <div style={{ fontSize: '.72rem', color: '#8b96b0', marginBottom: '1rem' }}>{c.count} livres</div>
            <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center' }}>
              <button onClick={() => openEdit(c)} style={{ background: 'rgba(59,130,246,.1)', border: 'none', color: '#3b82f6', cursor: 'pointer', borderRadius: 8, padding: '.3rem .6rem', fontSize: '.8rem' }}>✏️</button>
              <button onClick={() => del(c.id)} style={{ background: 'rgba(239,68,68,.1)', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: 8, padding: '.3rem .6rem', fontSize: '.8rem' }}>🗑️</button>
            </div>
          </div>
        ))}
        {cats.length === 0 && <div style={{ gridColumn: '1/-1', padding: '3rem', textAlign: 'center', color: '#8b96b0' }}>Aucune catégorie.</div>}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,9,26,.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div style={{ background: '#0c1028', border: '1px solid rgba(59,130,246,.2)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 420 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#eef0f5', marginBottom: '1.5rem' }}>{editing ? 'Modifier' : 'Ajouter'} une Catégorie</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[['name', 'Nom', 'text'], ['emoji', 'Emoji', 'text'], ['color', 'Couleur', 'color']].map(([f, l, t]) => (
                <div key={f}>
                  <label style={{ display: 'block', fontSize: '.78rem', color: '#8b96b0', marginBottom: '.3rem' }}>{l}</label>
                  <input type={t} value={form[f as keyof typeof form]} onChange={e => setForm({ ...form, [f]: e.target.value })}
                    style={{ width: '100%', background: 'rgba(6,9,26,.5)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 8, padding: '.55rem .75rem', color: '#eef0f5', fontSize: '.85rem', outline: 'none' }} />
                </div>
              ))}
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
