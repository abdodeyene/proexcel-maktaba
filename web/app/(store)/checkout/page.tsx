'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
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
  ChevronDown,
  Loader2,
  Check,
  Building2
} from '@/components/LucideIcons'

type CartItem = {
  key: string
  productId: number
  id: number
  title: string
  name?: string
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
          cart: cart,
          promoCode: appliedPromo?.code || ''
        })
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Erreur lors de la commande')
      }

      const orderData = await res.json()
      localStorage.removeItem('proexcel_cart')
      window.dispatchEvent(new Event('cart-updated'))
      router.push(`/thank-you?order=${orderData.orderNum || orderData.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const cities = MOROCCAN_CITIES
  const items = cart.map(item => ({
    id: item.key || `${item.id}_${item.variant}`,
    name: item.title || item.name || 'Produit',
    image: item.image,
    variant: item.variant,
    quantity: item.qty,
    price: item.price
  }))
  const promoCode = promoInput
  const setPromoCode = setPromoInput
  const applyPromo = handleApplyPromo
  const promoDiscount = discount
  const isSubmitting = loading
  const moroccanCities = cities

  return (
    <div 
      className="checkout-page py-12 md:py-20 text-[var(--text)] min-h-[100dvh] flex items-center justify-center transition-colors duration-300 bg-[var(--bg)]"
    >
      {/* Dynamic styles to enforce dark mode glassmorphism and variables overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        [data-theme="dark"] .checkout-card {
          background: rgba(13, 18, 32, 0.65) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4) !important;
        }
        [data-theme="dark"] .checkout-input,
        [data-theme="dark"] .checkout-select {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          color: #f1ede4 !important;
        }
        [data-theme="dark"] .checkout-input:focus,
        [data-theme="dark"] .checkout-select:focus {
          border-color: #e8352a !important;
          background: rgba(7, 11, 20, 0.8) !important;
          box-shadow: 0 0 0 3px rgba(232, 53, 42, 0.2) !important;
        }
        [data-theme="dark"] .checkout-input::placeholder {
          color: rgba(136, 150, 169, 0.4) !important;
        }
        [data-theme="dark"] .checkout-secure span {
          color: #8896a9 !important;
        }
        [data-theme="dark"] .checkout-product {
          border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
        }
        [data-theme="dark"] .checkout-sum-line.total {
          border-top: 2px solid rgba(255, 255, 255, 0.08) !important;
        }
      `}} />

      <div 
        style={{ perspective: '1200px' }}
        className="checkout-wrapper"
      >
        <div className="checkout-layout-grid">
          
          {/* LEFT: Checkout Form */}
          <motion.div 
            initial={{ opacity: 0, x: -60, rotateY: 10, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="checkout-form-col"
          >
            <form 
              id="checkout-form" 
              onSubmit={handleSubmit} 
              className="checkout-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-8">
                <h1 
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-3xl md:text-[34px] font-bold text-[var(--text)] mb-2 leading-tight"
                >
                  Finaliser la commande
                </h1>
                <p className="checkout-subtitle">
                  Remplissez vos informations pour passer commande
                </p>
              </div>

              {/* Section label (red, uppercase, spaced letters, with horizontal line) */}
              <div className="checkout-section-label">
                INFORMATIONS CLIENT
              </div>

              <div className="space-y-5">
                {error && (
                  <div className="text-[var(--primary)] p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* NOM COMPLET */}
                <div className="checkout-field flex flex-col gap-2.5">
                  <label className="checkout-label">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Votre nom et prénom"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="checkout-input"
                  />
                </div>

                {/* TÉLÉPHONE */}
                <div className="checkout-field flex flex-col gap-2.5">
                  <label className="checkout-label">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    inputMode="tel"
                    placeholder="06 00 00 00 00"
                    required
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="checkout-input"
                  />
                </div>

                {/* ADRESSE COMPLÈTE */}
                <div className="checkout-field flex flex-col gap-2.5">
                  <label className="checkout-label">
                    Adresse complète
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Rue, numéro, appartement..."
                    required
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className="checkout-input"
                  />
                </div>

                {/* VILLE */}
                <div className="checkout-field flex flex-col gap-2.5">
                  <label className="checkout-label">
                    Ville
                  </label>
                  <select
                    name="city"
                    required
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="checkout-select"
                  >
                    <option value="" className="text-gray-400">Sélectionner votre ville</option>
                    {moroccanCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-commander hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ShoppingBag className="w-5 h-5" />
                    )}
                    Commander maintenant
                  </button>
                </div>

                {/* Trust badge */}
                <div className="checkout-secure text-[#16a34a] mt-6">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[13px] font-medium text-[var(--text2)]">Paiement sécurisé à la livraison</span>
                </div>

              </div>
            </form>
          </motion.div>

          {/* RIGHT CARD — "Votre commande" */}
          <motion.div 
            initial={{ opacity: 0, x: 60, rotateY: -10, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="checkout-summary-wrap"
          >
            <div className="checkout-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <h2 
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                className="text-2xl font-bold text-[var(--text)] mb-6 text-left"
              >
                Votre commande
              </h2>

              {/* Items */}
              <div className="space-y-1 mb-6">
                {items.map((item, idx) => (
                  <div key={item.id} className="checkout-product">
                    <div className="checkout-prod-img border border-[#e5e7eb] dark:border-white/[0.08]">
                      <Image
                        src={item.image || `https://picsum.photos/seed/product-${idx}/100/100`}
                        alt={item.name || 'Produit'}
                        width={58}
                        height={72}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="checkout-prod-info">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="checkout-prod-name text-[var(--text)] uppercase tracking-wide leading-tight line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="text-sm font-bold text-[var(--text)] whitespace-nowrap">
                          {(item.price * item.quantity).toFixed(2)} DH
                        </div>
                      </div>
                      <p className="checkout-prod-var">
                        {item.variant ? `Format: ${item.variant}` : ''}
                      </p>
                      <p className="checkout-prod-qty">
                        Qté: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo code row */}
              <div className="flex gap-4 mb-8">
                <input
                  type="text"
                  placeholder="Code Promo"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  className="checkout-input px-5 py-3.5 text-[15px] w-full"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="shrink-0 min-w-[160px] px-8 py-3.5 bg-gradient-to-r from-[#e8352a] to-[#be2317] text-white text-[15px] font-bold tracking-wide rounded-[12px] hover:brightness-105 active:scale-[0.96] transition-all duration-200 border-none outline-none whitespace-nowrap shadow-md shadow-[#e8352a]/20"
                >
                  Appliquer
                </button>
              </div>
              
              {promoDiscount > 0 && (
                <p className="text-sm text-green-600 font-medium mb-4 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Réduction appliquée: -{promoDiscount.toFixed(2)} DH
                </p>
              )}

              {/* Price summary */}
              <div className="space-y-2.5 mb-6">
                <div className="checkout-sum-line">
                  <span>Sous-total</span>
                  <span className="font-medium text-[var(--text)]">{subtotal.toFixed(2)} DH</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="checkout-sum-line text-[#16a34a]">
                    <span>Réduction promo</span>
                    <span className="font-medium">-{promoDiscount.toFixed(2)} DH</span>
                  </div>
                )}
                <div className="checkout-sum-line">
                  <span>Livraison</span>
                  <span className="font-medium text-[var(--text)]">{shipping === 0 ? 'Gratuit' : `${shipping} DH`}</span>
                </div>
                <div className="checkout-sum-line total pt-4">
                  <span className="text-[var(--primary)] font-extrabold">Total</span>
                  <span className="text-[var(--primary)] font-extrabold">{total.toFixed(2)} DH</span>
                </div>
              </div>

              {/* Payment Method box */}
              <div className="bg-[#f9fafb] dark:bg-white/[0.02] border border-[#e5e7eb] dark:border-white/[0.06] rounded-[12px] p-5 mt-8">
                <p className="text-[12px] text-[#6b7280] dark:text-[#8896a9] mb-3">Méthode de paiement acceptée:</p>
                <div className="inline-flex items-center gap-2 bg-[#f3f4f6] dark:bg-white/[0.05] text-[var(--text)] px-4 py-2 rounded-[8px] text-[13px] font-bold border border-[#e5e7eb] dark:border-white/[0.08]">
                  💵 Cash à la livraison
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
