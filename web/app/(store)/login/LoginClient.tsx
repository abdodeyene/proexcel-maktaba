'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginClient({ 
  initialBgImage, 
  initialLogoSrc 
}: { 
  initialBgImage: string, 
  initialLogoSrc: string 
}) {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' })
  const [logoError, setLogoError] = useState(false)

  const bgImage = initialBgImage
  const logoSrc = initialLogoSrc

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.access_token) {
          localStorage.setItem('proexcel_admin_token', data.access_token)
          localStorage.setItem('proexcel_admin', 'true')
          router.push('/admin')
        } else {
          setError('Connexion réussie mais aucun token reçu.')
        }
      } else {
        const data = await res.json().catch(() => ({}))
        // Try localStorage accounts (regular users)
        const accounts = JSON.parse(localStorage.getItem('proexcel_accounts') || '[]')
        const found = accounts.find((a: { email: string; password: string }) =>
          a.email === loginForm.email && a.password === loginForm.password
        )
        if (found) {
          localStorage.setItem('proexcel_user', JSON.stringify({ email: found.email, name: found.name }))
          router.push('/')
        } else if (res.status === 500) {
          setError(`Erreur serveur: ${data.message || 'vérifiez les variables d\'environnement Vercel'}`)
        } else {
          setError('Email ou mot de passe incorrect.')
        }
      }
    } catch {
      setError('Erreur lors de la connexion.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (regForm.password !== regForm.passwordConfirm) {
      setError('Les mots de passe ne correspondent pas.')
      setLoading(false)
      return
    }
    const accounts = JSON.parse(localStorage.getItem('proexcel_accounts') || '[]')
    if (accounts.find((a: { email: string }) => a.email === regForm.email)) {
      setError('Cet email est déjà utilisé.')
      setLoading(false)
      return
    }
    accounts.push({ name: regForm.name, email: regForm.email, password: regForm.password })
    localStorage.setItem('proexcel_accounts', JSON.stringify(accounts))
    localStorage.setItem('proexcel_user', JSON.stringify({ email: regForm.email, name: regForm.name }))
    setLoading(false)
    router.push('/')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.85rem 1rem', borderRadius: '10px',
    border: '1.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)',
    color: '#ffffff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.73rem', fontWeight: 600,
    color: 'rgba(255,255,255,0.85)', marginBottom: '0.4rem',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: bgImage ? `url(${bgImage}) no-repeat center center / cover` : 'linear-gradient(160deg, #060c1a 0%, #0c1a30 40%, #08122a 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      {/* Overlay for better readability if there is an image */}
      {bgImage && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.62)', zIndex: 0 }} />
      )}
      
      {/* Brand above card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative', zIndex: 1 }}
      >
        {!logoError ? (
          <img
            src={logoSrc}
            alt="ProExcel Maktaba"
            style={{ height: '80px', width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto 0.5rem' }}
            onError={() => setLogoError(true)}
          />
        ) : (
          <div style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
            fontSize: '2rem', fontWeight: 700, color: '#c8102e',
            letterSpacing: '0.03em', marginBottom: '0.5rem'
          }}>
            ProExcel Maktaba
          </div>
        )}
      </motion.div>

      {/* Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
        style={{
          background: bgImage ? 'rgba(6, 10, 24, 0.92)' : 'rgba(10, 18, 40, 0.75)',
          backdropFilter: bgImage ? 'blur(8px)' : 'blur(20px)',
          WebkitBackdropFilter: bgImage ? 'blur(8px)' : 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '2.25rem 2rem',
          width: '100%', maxWidth: '420px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px', marginBottom: '1.75rem', gap: '4px' }}>
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              style={{
                flex: 1, padding: '0.6rem', borderRadius: '7px', border: 'none',
                background: mode === m ? 'var(--btn-normal, #c8102e)' : 'transparent',
                color: mode === m ? 'var(--btn-text, #fff)' : 'rgba(255,255,255,0.55)',
                fontWeight: mode === m ? 700 : 500, fontSize: '0.88rem', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {m === 'login' ? 'Connexion' : 'S\'inscrire'}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ color: '#ff8080', background: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,80,80,0.25)', padding: '0.7rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.84rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email" required placeholder="votre@email.com"
                value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Mot de passe</label>
              <input
                type="password" required placeholder="••••••••"
                value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
                Mot de passe oublié ?
              </a>
            </div>
            <button type="submit" disabled={loading} style={{
              padding: '0.9rem', background: 'var(--btn-normal, #c8102e)', color: 'var(--btn-text, #fff)', border: 'none',
              borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
              transition: 'background 0.2s', letterSpacing: '0.5px', opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {[
              { label: 'Nom complet', type: 'text', ph: 'Votre nom', key: 'name' },
              { label: 'Email', type: 'email', ph: 'votre@email.com', key: 'email' },
              { label: 'Mot de passe', type: 'password', ph: '••••••••', key: 'password' },
              { label: 'Confirmer', type: 'password', ph: '••••••••', key: 'passwordConfirm' },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input
                  type={f.type} placeholder={f.ph} required
                  minLength={f.key === 'password' || f.key === 'passwordConfirm' ? 6 : undefined}
                  value={regForm[f.key as keyof typeof regForm]}
                  onChange={e => setRegForm({ ...regForm, [f.key]: e.target.value })}
                  style={inputStyle}
                />
              </div>
            ))}
            <button type="submit" disabled={loading} style={{
              padding: '0.9rem', background: 'var(--btn-normal, #c8102e)', color: 'var(--btn-text, #fff)', border: 'none',
              borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
              marginTop: '0.25rem', opacity: loading ? 0.7 : 1, transition: 'background 0.2s',
            }}>
              {loading ? 'Inscription…' : 'Créer mon compte'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
          © 2026 ProExcel Maktaba
        </div>
      </motion.div>

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Link href="/" style={{ display: 'block', marginTop: '1.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
          ← Retour à la boutique
        </Link>
      </motion.div>
    </div>
  )
}
