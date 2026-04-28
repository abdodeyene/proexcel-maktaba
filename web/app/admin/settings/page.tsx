'use client'
import { useEffect, useState } from 'react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({ storeName: 'ProExcel Maktaba', phone: '+212 6 12 34 56 78', email: 'contact@proexcel.ma', address: 'Avenue Mohammed V, Rabat', facebook: '', instagram: '', freeShippingMin: '499' })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  function token() { return localStorage.getItem('proexcel_admin_token') || '' }

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data && typeof data === 'object') setSettings(prev => ({ ...prev, ...data }))
    })
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify(settings) })
    setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const fields: [string, string, string][] = [
    ['storeName', 'Nom du magasin', 'text'],
    ['phone', 'Téléphone', 'text'],
    ['email', 'Email', 'email'],
    ['address', 'Adresse', 'text'],
    ['facebook', 'Facebook URL', 'url'],
    ['instagram', 'Instagram URL', 'url'],
    ['freeShippingMin', 'Livraison gratuite dès (DH)', 'number'],
  ]

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#eef0f5', marginBottom: '2rem' }}>Paramètres</h1>
      <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {fields.map(([key, label, type]) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: '.82rem', color: '#8b96b0', marginBottom: '.35rem' }}>{label}</label>
            <input type={type} value={settings[key as keyof typeof settings]} onChange={e => setSettings({ ...settings, [key]: e.target.value })}
              style={{ width: '100%', background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 10, padding: '.65rem 1rem', color: '#eef0f5', fontSize: '.9rem', outline: 'none' }} />
          </div>
        ))}
        <button type="submit" disabled={loading} style={{ background: saved ? '#22c55e' : 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', border: 'none', padding: '.75rem', borderRadius: 9999, fontWeight: 600, cursor: 'pointer', transition: 'all .3s' }}>
          {loading ? 'Enregistrement…' : saved ? '✓ Enregistré !' : 'Enregistrer les paramètres'}
        </button>
      </form>
    </div>
  )
}
