'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type CartItem = { key: string; id: number; title: string; variant: string; price: number; qty: number; emoji: string }

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem('proexcel_cart') || '[]')
    if (c.length === 0) router.push('/cart')
    setCart(c)
  }, [router])

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address || !form.city) { setError('Remplissez tous les champs.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, total, cart }),
      })
      if (!res.ok) throw new Error()
      const order = await res.json()
      localStorage.removeItem('proexcel_cart')
      window.dispatchEvent(new Event('cart-updated'))
      router.push(`/thank-you?order=${order.orderNum}`)
    } catch {
      setError('Erreur lors de la commande. Réessayez.')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#eef0f5', marginBottom: '2rem' }}>Commander</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <form onSubmit={submit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[['name', 'Nom complet', 'text'], ['phone', 'Téléphone', 'tel'], ['address', 'Adresse', 'text'], ['city', 'Ville', 'text']].map(([field, label, type]) => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: '.82rem', color: '#8b96b0', marginBottom: '.35rem' }}>{label}</label>
                <input
                  type={type}
                  value={form[field as keyof typeof form]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  style={{ width: '100%', background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 10, padding: '.65rem 1rem', color: '#eef0f5', fontSize: '.9rem', outline: 'none' }}
                />
              </div>
            ))}
            {error && <p style={{ color: '#ef4444', fontSize: '.82rem' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', border: 'none', padding: '.85rem', borderRadius: 9999, fontWeight: 600, fontSize: '.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1 }}>
              {loading ? 'Envoi…' : 'Confirmer la commande →'}
            </button>
          </div>
        </form>
        <div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#eef0f5', marginBottom: '1rem' }}>Récapitulatif</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginBottom: '1.25rem' }}>
            {cart.map(i => (
              <div key={i.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem' }}>
                <span style={{ color: '#8b96b0' }}>{i.emoji} {i.title} × {i.qty}</span>
                <span style={{ color: '#eef0f5', fontWeight: 600 }}>{(i.price * i.qty).toFixed(2)} DH</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(59,130,246,.15)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#8b96b0' }}>Livraison</span>
            <span style={{ color: total >= 499 ? '#22c55e' : '#eef0f5', fontWeight: 600 }}>{total >= 499 ? 'Gratuite' : '35 DH'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '.75rem' }}>
            <span style={{ color: '#eef0f5', fontWeight: 600 }}>Total</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#3b82f6' }}>{(total + (total >= 499 ? 0 : 35)).toFixed(2)} DH</span>
          </div>
        </div>
      </div>
    </div>
  )
}
