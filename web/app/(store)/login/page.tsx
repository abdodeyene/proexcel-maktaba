'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { setError('Email ou mot de passe incorrect.'); setLoading(false); return }
      const data = await res.json()
      localStorage.setItem('proexcel_admin_token', data.access_token)
      localStorage.setItem('proexcel_admin', 'true')
      router.push('/admin')
    } catch {
      setError('Erreur serveur.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'radial-gradient(ellipse at 50% 50%, #0c1028 0%, #06091a 70%)' }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'rgba(12,18,45,.65)', backdropFilter: 'blur(16px)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 20, padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 700, color: '#eef0f5', marginBottom: '.5rem' }}>
            Pro<span style={{ color: '#3b82f6' }}>Excel</span>
          </div>
          <p style={{ color: '#8b96b0', fontSize: '.85rem' }}>Espace Administration</p>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '.82rem', color: '#8b96b0', marginBottom: '.35rem' }}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', background: 'rgba(6,9,26,.5)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 10, padding: '.65rem 1rem', color: '#eef0f5', fontSize: '.9rem', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.82rem', color: '#8b96b0', marginBottom: '.35rem' }}>Mot de passe</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', background: 'rgba(6,9,26,.5)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 10, padding: '.65rem 1rem', color: '#eef0f5', fontSize: '.9rem', outline: 'none' }} />
          </div>
          {error && <p style={{ color: '#ef4444', fontSize: '.82rem', textAlign: 'center' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', border: 'none', padding: '.85rem', borderRadius: 9999, fontWeight: 600, fontSize: '.95rem', cursor: 'pointer', opacity: loading ? .7 : 1 }}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
