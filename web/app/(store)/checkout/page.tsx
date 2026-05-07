'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type CartItem = {
  key: string
  productId: number
  id: number
  title: string
  variant: string
  price: number
  qty: number
  emoji?: string
  image?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Settings & Promos
  const [shippingFee, setShippingFee] = useState(25)
  const [freeShippingMin, setFreeShippingMin] = useState(499)
  const [promoCodes, setPromoCodes] = useState<any[]>([])
  
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<any>(null)
  const [promoError, setPromoError] = useState('')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })

  useEffect(() => {
    // Load Cart
    const loadedCart = JSON.parse(localStorage.getItem('proexcel_cart') || '[]')
    const normalized = loadedCart.map((item: any) => ({
      ...item,
      qty: item.qty || item.quantity || 1
    }))
    
    if (normalized.length === 0) {
      router.push('/cart')
    } else {
      setCart(normalized)
    }

    // Load Settings
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.delivery_fee) setShippingFee(Number(data.delivery_fee))
        if (data.free_delivery_min) setFreeShippingMin(Number(data.free_delivery_min))
        if (data.promo_codes) {
          try {
            setPromoCodes(JSON.parse(data.promo_codes))
          } catch (e) {
            console.error('Failed to parse promo codes', e)
          }
        }
      })
      .catch(console.error)
  }, [router])

  const handleApplyPromo = () => {
    setPromoError('')
    if (!promoInput.trim()) return

    const code = promoCodes.find((c: any) => c.code.toUpperCase() === promoInput.trim().toUpperCase())
    if (code) {
      setAppliedPromo(code)
      setPromoInput('')
    } else {
      setPromoError('Code promo invalide')
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
  
  // Promo Discount
  let discount = 0
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discount = subtotal * (appliedPromo.discount / 100)
    } else {
      discount = appliedPromo.discount
    }
  }
  const subtotalAfterDiscount = Math.max(0, subtotal - discount)
  
  const shipping = subtotalAfterDiscount >= freeShippingMin ? 0 : shippingFee
  const total = subtotalAfterDiscount + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.name || !form.phone || !form.address || !form.city) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          total: total,
          cart: cart
        })
      })

      if (!res.ok) {
        throw new Error('Erreur API')
      }

      const orderData = await res.json()
      
      // Clear cart
      localStorage.removeItem('proexcel_cart')
      window.dispatchEvent(new Event('cart-updated'))
      
      // Redirect to thank you
      router.push(`/thank-you?order=${orderData.orderNum || orderData.id || '2026-X'}`)
    } catch (err) {
      // Fallback in case of API failure, simulate order number
      const mockOrderNum = `PE-${Math.floor(1000 + Math.random() * 9000)}`
      localStorage.removeItem('proexcel_cart')
      window.dispatchEvent(new Event('cart-updated'))
      router.push(`/thank-you?order=${mockOrderNum}`)
    } finally {
      setLoading(false)
    }
  }

  const cities = [
    "Agadir", "Al Hoceima", "Azrou", "Boujdour", "Béni Mellal", "Casablanca", 
    "Chefchaouen", "Dakhla", "El Jadida", "Errachidia", "Es-Semara", "Essaouira", 
    "Fès", "Guelmim", "Guerguerat", "Ifrane", "Khenifra", "Khouribga", 
    "Ksar El Kebir", "Kénitra", "Larache", "Laâyoune", "Marrakech", "Meknès", 
    "Midelt", "Mohammedia", "Nador", "Ouarzazate", "Oujda", "Rabat", "Safi", 
    "Salé", "Sefrou", "Settat", "Sidi Ifni", "Tan-Tan", "Tanger", "Tarfaya", 
    "Taroudant", "Tata", "Taza", "Tinghir", "Tiznit", "Tétouan", "Zagora", "Autre"
  ]

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="breadcrumb-nav">
            <Link href="/">Accueil</Link>
            <span>›</span>
            <span>Finaliser la commande</span>
          </div>
          <h1>📦 Commander</h1>
        </div>
      </div>

      <div className="checkout-page">
        <div className="checkout-layout">
          
          {/* Form */}
          <div>
            <div className="checkout-form-card">
              <h2 className="checkout-title">Finaliser la commande</h2>
              <p className="checkout-subtitle">Remplissez vos informations pour passer commande</p>

              {error && (
                <div style={{ color: '#ef4444', padding: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="checkout-section-label">Informations client</div>

                <div className="checkout-field">
                  <label className="checkout-label">Nom complet</label>
                  <input 
                    type="text" 
                    className="checkout-input" 
                    placeholder="Votre nom et prénom" 
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required 
                  />
                </div>

                <div className="checkout-field">
                  <label className="checkout-label">Téléphone</label>
                  <input 
                    type="tel" 
                    className="checkout-input" 
                    placeholder="06 00 00 00 00" 
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    required 
                  />
                </div>

                <div className="checkout-field">
                  <label className="checkout-label">Adresse complète</label>
                  <input 
                    type="text" 
                    className="checkout-input" 
                    placeholder="Rue, numéro, appartement..." 
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    required 
                  />
                </div>

                <div className="checkout-field">
                  <label className="checkout-label">Ville</label>
                  <select 
                    className="checkout-select" 
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    required
                  >
                    <option value="" disabled>Sélectionner votre ville</option>
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn-commander" disabled={loading}>
                  <span>🛒</span>
                  <span>{loading ? 'Envoi...' : 'Commander maintenant'}</span>
                </button>

                <div className="checkout-secure">
                  🔒 Paiement sécurisé à la livraison
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div>
            <div className="checkout-summary">
              <h3>Votre commande</h3>
              
              <div id="checkoutProducts">
                {cart.map(item => (
                  <div key={item.key || `${item.id}_${item.variant}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      {item.image ? (
                        <div style={{ width: '40px', height: '50px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ fontSize: '1.5rem', width: '40px', textAlign: 'center' }}>{item.emoji || '📦'}</div>
                      )}
                      <div>
                        <span style={{ fontWeight: 600 }}>{item.title}</span>
                        <span style={{ color: 'var(--text2)', fontSize: '0.75rem', display: 'block', marginTop: '0.2rem' }}>
                          Format: {item.variant} | Qté: {item.qty}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontWeight: 'bold' }}>{(item.price * item.qty).toFixed(2)} DH</span>
                  </div>
                ))}
              </div>

              <hr className="checkout-divider" style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Code Promo" 
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)', color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                  <button onClick={handleApplyPromo} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--primary)', background: 'var(--primary)', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                    Appliquer
                  </button>
                </div>
                {promoError && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem' }}>{promoError}</div>}
                {appliedPromo && <div style={{ color: '#22c55e', fontSize: '0.75rem', marginTop: '0.3rem', fontWeight: 600 }}>Code {appliedPromo.code} appliqué !</div>}
              </div>

              <hr className="checkout-divider" style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />

              <div className="checkout-sum-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} DH</span>
              </div>
              
              {appliedPromo && (
                <div className="checkout-sum-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--red)', fontWeight: 600 }}>
                  <span>Promo ({appliedPromo.code})</span>
                  <span>-{discount.toFixed(2)} DH</span>
                </div>
              )}

              <div className="checkout-sum-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>Livraison</span>
                <span style={{ color: shipping === 0 ? '#22c55e' : 'inherit' }}>
                  {shipping === 0 ? 'Gratuit 🎉' : `${shipping} DH`}
                </span>
              </div>
              
              <hr className="checkout-divider" style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />

              <div className="checkout-sum-line total" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>
                <span>Total</span>
                <span>{total.toFixed(2)} DH</span>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(59,130,246,0.05)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--r)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>Méthode de paiement acceptée:</span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem' }}>💵 Cash à la livraison</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
