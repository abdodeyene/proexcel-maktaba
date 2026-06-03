'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
    name: item.title,
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] pb-28 md:pb-0">
      
      {/* Page Header */}
      <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/[.08] px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center gap-3 max-w-5xl mx-auto">
          <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/25 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-red-600" />
          </div>
          <h1 className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
            Finaliser la commande
          </h1>
        </div>
      </div>

      {/* Main content wrapper */}
      <div className="max-w-5xl mx-auto px-4 py-5 md:py-8 flex flex-col md:flex-row gap-5 md:gap-8 items-start">
        
        {/* LEFT: Customer Form (shown below summary on mobile, on the left on desktop) */}
        <form id="checkout-form" onSubmit={handleSubmit} className="w-full md:flex-1 order-2 md:order-1">
          <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/[.08] rounded-2xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-white/[.06]">
              <User className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="font-bold text-[.95rem] text-gray-900 dark:text-white">
                Informations Client
              </span>
            </div>

            <div className="px-5 py-5 space-y-5">
              {error && (
                <div className="text-red-500 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-sm flex items-center gap-2 font-semibold">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* NAME */}
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Votre nom et prénom"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-white/[.07] border border-gray-200 dark:border-white/[.12] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 dark:focus:ring-red-900/20 transition-all"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none" />
                  <input
                    type="tel"
                    name="phone"
                    inputMode="tel"
                    placeholder="06 00 00 00 00"
                    required
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-white/[.07] border border-gray-200 dark:border-white/[.12] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 dark:focus:ring-red-900/20 transition-all"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>

              {/* ADDRESS */}
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                  Adresse complète <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-[14px] w-[18px] h-[18px] text-gray-400 pointer-events-none" />
                  <textarea
                    name="address"
                    rows={2}
                    placeholder="Rue, numéro, quartier..."
                    required
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-white/[.07] border border-gray-200 dark:border-white/[.12] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 dark:focus:ring-red-900/20 transition-all resize-none"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>

              {/* CITY */}
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                  Ville <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none z-10" />
                  <select
                    name="city"
                    required
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full pl-11 pr-10 py-3 rounded-xl text-sm bg-gray-50 dark:bg-white/[.07] border border-gray-200 dark:border-white/[.12] text-gray-900 dark:text-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 dark:focus:ring-red-900/20 transition-all appearance-none cursor-pointer"
                    style={{ fontSize: '16px' }}
                  >
                    <option value="">Sélectionner votre ville</option>
                    {moroccanCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* DESKTOP SUBMIT — hidden on mobile */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="hidden md:flex w-full items-center justify-center gap-2.5 bg-gray-900 dark:bg-red-600 text-white font-bold text-sm py-4 rounded-xl mt-1 hover:bg-gray-700 dark:hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Traitement...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Commander maintenant
                  </>
                )}
              </button>

            </div>
          </div>
        </form>

        {/* RIGHT: Order Summary (shown above form on mobile, on the right on desktop) */}
        <div className="w-full md:w-[360px] flex-shrink-0 order-1 md:order-2 md:sticky md:top-[72px]">
          <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/[.08] rounded-2xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-white/[.06]">
              <ShoppingBag className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="font-bold text-[.95rem] text-gray-900 dark:text-white">
                Votre Commande
              </span>
              <span className="ml-auto text-xs font-semibold text-gray-400 dark:text-gray-500">
                {items.length} article{items.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100 dark:divide-white/[.05]">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-4">
                  
                  {/* Image */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-white/[.06]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight text-gray-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    {item.variant && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Format: {item.variant}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-semibold bg-gray-100 dark:bg-white/[.08] text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md">
                        × {item.quantity}
                      </span>
                      <span className="text-sm font-extrabold text-red-600">
                        {(item.price * item.quantity).toFixed(2)} DH
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Promo */}
            <div className="px-5 py-4 border-t border-gray-100 dark:border-white/[.06]">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code Promo"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-white/[.07] border border-gray-200 dark:border-white/[.12] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 dark:focus:ring-red-900/20 transition-all"
                  style={{ fontSize: '16px' }}
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="px-4 py-2.5 bg-gray-900 dark:bg-white/[.12] text-white text-sm font-bold rounded-xl hover:bg-gray-700 dark:hover:bg-white/[.2] transition-colors whitespace-nowrap"
                >
                  Appliquer
                </button>
              </div>
              {promoDiscount > 0 && (
                <p className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-green-600">
                  <Check className="w-3.5 h-3.5" />
                  Réduction appliquée: -{promoDiscount.toFixed(2)} DH
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="px-5 py-4 space-y-2.5 border-t border-gray-100 dark:border-white/[.06]">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Sous-total</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {subtotal.toFixed(2)} DH
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">Réduction promo</span>
                  <span className="font-semibold text-green-600">
                    -{promoDiscount.toFixed(2)} DH
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Frais de livraison
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {shipping === 0
                    ? <span className="text-green-600 font-bold">Gratuit</span>
                    : `${shipping.toFixed(2)} DH`}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-gray-200 dark:border-white/[.08]">
                <span className="font-extrabold text-base text-gray-900 dark:text-white">
                  TOTAL
                </span>
                <span className="font-extrabold text-xl text-red-600">
                  {total.toFixed(2)} DH
                </span>
              </div>
            </div>

            {/* Payment badge */}
            <div className="px-5 pb-5">
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/15 border border-green-100 dark:border-green-800/25 rounded-xl px-4 py-2.5">
                <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                  Paiement sécurisé à la livraison
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* FIXED BOTTOM BAR — MOBILE ONLY */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-white/[.08] px-4 py-3">
          
          {/* Mini total row */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-gray-400">Total à payer</span>
            <span className="text-base font-extrabold text-red-600">
              {total.toFixed(2)} DH
            </span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2.5 bg-red-600 text-white font-bold text-[.92rem] py-[14px] rounded-xl hover:bg-red-700 active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-900/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Traitement...
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Commander maintenant
              </>
            )}
          </button>

        </div>
      </div>

    </div>
  )
}
