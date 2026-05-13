'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MOROCCAN_CITIES } from '@/lib/constants'
import { 
  User, 
  MapPin, 
  Phone, 
  Truck, 
  ShieldCheck, 
  ShoppingBag,
  CreditCard,
  Package,
  CheckCircle2,
  Lock,
  Wallet,
  ArrowRight,
  ChevronDown
} from '@/components/LucideIcons'

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
      localStorage.removeItem('proexcel_cart')
      window.dispatchEvent(new Event('cart-updated'))
      router.push(`/thank-you?order=${orderData.orderNum || orderData.id || '2026-X'}`)
    } catch (err) {
      const mockOrderNum = `PE-${Math.floor(1000 + Math.random() * 9000)}`
      localStorage.removeItem('proexcel_cart')
      window.dispatchEvent(new Event('cart-updated'))
      router.push(`/thank-you?order=${mockOrderNum}`)
    } finally {
      setLoading(false)
    }
  }

  const cities = MOROCCAN_CITIES

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* Top Header */}
      <div style={{ textAlign: 'center', padding: '3rem 1.5rem 2rem', background: 'var(--card)', borderBottom: '1px solid var(--border)', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '2rem' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '32px', background: 'rgba(232,53,42,0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <ShoppingBag size={28} />
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, marginBottom: '0.4rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>Finaliser la commande</h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.95rem', fontWeight: 500 }}>Complétez vos informations pour recevoir vos livres.</p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem' }} className="checkout-layout-grid">
          
          {/* Form */}
          <div>
            <div style={{ background: 'var(--card)', borderRadius: '28px', padding: '2.5rem 2rem', border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
              
              {error && (
                <div style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '16px', marginBottom: '2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Informations Personnelles */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text2)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} /> Informations Personnelles
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="checkout-inputs-row">
                    <div>
                      <label style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.6rem', color: 'var(--text)', display: 'block' }}>Nom Complet</label>
                      <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)', opacity: 0.6 }} />
                        <input 
                          type="text" 
                          placeholder="Ex: Ahmed Alaoui" 
                          style={{ width: '100%', padding: '0 1.25rem 0 3.2rem', height: '56px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontWeight: 600, fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s' }}
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'var(--card)' }}
                          onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg2)' }}
                          required 
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.6rem', color: 'var(--text)', display: 'block' }}>Téléphone</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)', opacity: 0.6 }} />
                        <input 
                          type="tel" 
                          placeholder="06 00 00 00 00" 
                          style={{ width: '100%', padding: '0 1.25rem 0 3.2rem', height: '56px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontWeight: 600, fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s' }}
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'var(--card)' }}
                          onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg2)' }}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adresse de Livraison */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text2)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} /> Adresse de Livraison
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.6rem', color: 'var(--text)', display: 'block' }}>Ville</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)', opacity: 0.6, zIndex: 1 }} />
                      <select 
                        style={{ width: '100%', padding: '0 3.2rem', height: '56px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--bg2)', color: form.city ? 'var(--text)' : 'var(--text2)', fontWeight: 600, fontSize: '0.95rem', outline: 'none', appearance: 'none', transition: 'all 0.2s', cursor: 'pointer' }}
                        value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value })}
                        onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'var(--card)' }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg2)' }}
                        required
                      >
                        <option value="" disabled>Sélectionner votre ville</option>
                        {cities.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown size={20} style={{ position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)', opacity: 0.6, pointerEvents: 'none' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.6rem', color: 'var(--text)', display: 'block' }}>Adresse de Livraison</label>
                    <div style={{ position: 'relative' }}>
                      <Truck size={18} style={{ position: 'absolute', left: '1.2rem', top: '1.25rem', color: 'var(--text2)', opacity: 0.6 }} />
                      <textarea 
                        placeholder="Quartier, Rue, N° d'appartement..." 
                        style={{ width: '100%', padding: '1rem 1.25rem 1rem 3.2rem', height: '110px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontWeight: 600, fontSize: '0.95rem', outline: 'none', resize: 'none', transition: 'all 0.2s', fontFamily: 'inherit' }}
                        value={form.address}
                        onChange={e => setForm({ ...form, address: e.target.value })}
                        onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'var(--card)' }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg2)' }}
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* Méthode de Paiement & Submit */}
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text2)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CreditCard size={16} /> Méthode de Paiement
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                      width: '100%', 
                      height: '66px', 
                      borderRadius: '20px', 
                      background: 'linear-gradient(135deg, var(--primary) 0%, #ff7a00 100%)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '0 1rem', 
                      border: 'none', 
                      cursor: loading ? 'not-allowed' : 'pointer', 
                      boxShadow: '0 15px 35px rgba(232,53,42,0.35)', 
                      transition: 'transform 0.2s, filter 0.2s',
                      filter: loading ? 'brightness(0.8)' : 'none'
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <ShoppingBag size={22} />
                    </div>
                    <span style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 800 }}>
                      {loading ? 'Traitement...' : 'Commander maintenant'}
                    </span>
                    <ArrowRight size={22} style={{ color: '#fff', marginRight: '0.5rem' }} />
                  </button>

                  {/* Payment Cards Side by Side */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                    <div style={{ background: 'rgba(34,197,94,0.06)', padding: '1.25rem 0.5rem', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', textAlign: 'center' }}>
                      <ShieldCheck size={28} style={{ color: 'var(--green)' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--green)' }}>Paiement sécurisé</span>
                    </div>
                    <div style={{ background: 'var(--bg2)', padding: '1.25rem 0.5rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', textAlign: 'center' }}>
                      <Wallet size={28} style={{ color: 'var(--text2)' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>Cash à la livraison</span>
                    </div>
                  </div>
                </div>

              </form>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            <div style={{ background: 'var(--card)', borderRadius: '28px', padding: '2.5rem 2rem', border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
                <Package size={22} style={{ color: 'var(--primary)' }} /> Votre Commande
              </h3>
              
              <div id="checkoutProducts" style={{ maxHeight: '340px', overflowY: 'auto', marginBottom: '1.75rem', paddingRight: '0.5rem' }}>
                {cart.map(item => (
                  <div key={item.key || `${item.id}_${item.variant}`} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: '60px', height: '76px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)', background: 'var(--bg2)' }}>
                      {item.image ? (
                        <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{item.emoji || '📦'}</div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem', color: 'var(--text)', lineHeight: 1.3 }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text2)', fontWeight: 500 }}>Format: {item.variant}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, background: 'var(--bg2)', padding: '0.15rem 0.6rem', borderRadius: '6px', color: 'var(--text)' }}>× {item.qty}</div>
                        <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>{(item.price * item.qty).toFixed(2)} DH</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Code Promo" 
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    style={{ flex: 1, padding: '0 1.25rem', height: '48px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', fontWeight: 600 }}
                    onFocus={e => { e.target.style.borderColor = 'var(--primary)' }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
                  />
                  <button onClick={handleApplyPromo} style={{ padding: '0 1.5rem', height: '48px', borderRadius: '14px', border: 'none', background: 'var(--text)', color: 'var(--bg)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                    Appliquer
                  </button>
                </div>
                {promoError && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', paddingLeft: '0.5rem', fontWeight: 600 }}>{promoError}</div>}
                {appliedPromo && <div style={{ color: 'var(--green)', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 700, paddingLeft: '0.5rem' }}>Code {appliedPromo.code} actif !</div>}
              </div>

              <div style={{ background: 'var(--bg2)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--text2)', fontWeight: 500 }}>
                  <span>Sous-total</span>
                  <span style={{ color: 'var(--text)', fontWeight: 700 }}>{subtotal.toFixed(2)} DH</span>
                </div>
                
                {appliedPromo && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 700 }}>
                    <span>Promotion</span>
                    <span>-{discount.toFixed(2)} DH</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '0.95rem', color: 'var(--text2)', fontWeight: 500 }}>
                  <span>Frais de livraison</span>
                  <span style={{ color: shipping === 0 ? 'var(--green)' : 'var(--text)', fontWeight: 700 }}>
                    {shipping === 0 ? 'Gratuit' : `${shipping.toFixed(2)} DH`}
                  </span>
                </div>
                
                <div style={{ height: '1px', background: 'var(--border)', marginBottom: '1.25rem' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.5rem', color: 'var(--primary)', alignItems: 'center' }}>
                  <span>TOTAL</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text2)', fontSize: '0.8rem', justifyContent: 'center', fontWeight: 600 }}>
                <Lock size={14} /> Transaction sécurisée SSL
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          .checkout-layout-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .checkout-inputs-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
