'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [shippingFee, setShippingFee] = useState(25)
  const [freeShippingMin, setFreeShippingMin] = useState(499)

  useEffect(() => {
    const loadedCart = JSON.parse(localStorage.getItem('proexcel_cart') || '[]')
    const normalized = loadedCart.map((item: any) => ({
      ...item,
      qty: item.qty || item.quantity || 1
    }))
    setCart(normalized)
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data.delivery_fee) setShippingFee(Number(data.delivery_fee))
      if (data.free_delivery_min) setFreeShippingMin(Number(data.free_delivery_min))
    }).catch(() => {})
  }, [])

  const updateCart = (updated: CartItem[]) => {
    setCart(updated)
    localStorage.setItem('proexcel_cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('cart-updated'))
  }

  const changeQty = (key: string, amount: number) => {
    const updated = cart.map(item => {
      if (item.key === key || `${item.id}_${item.variant}` === key) {
        return { ...item, qty: Math.max(1, item.qty + amount) }
      }
      return item
    })
    updateCart(updated)
  }

  const removeItem = (key: string) => {
    const updated = cart.filter(item => item.key !== key && `${item.id}_${item.variant}` !== key)
    updateCart(updated)
  }

  const emptyCart = () => {
    if (confirm('Voulez-vous vraiment vider votre panier ?')) {
      updateCart([])
    }
  }

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'PROMO2026') {
      setDiscount(0.1) // 10% discount
      alert('Code promo appliqué avec succès (-10%) !')
    } else {
      alert('Code promo invalide.')
      setDiscount(0)
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
  const discountAmount = subtotal * discount
  const shipping = subtotal >= freeShippingMin || subtotal === 0 ? 0 : shippingFee
  const total = subtotal - discountAmount + shipping

  if (cart.length === 0) {
    return (
      <>
        <div className="page-hero">
          <div className="page-hero-inner">
            <div className="breadcrumb-nav">
              <Link href="/">Accueil</Link>
              <span>›</span>
              <span>Mon Panier</span>
            </div>
            <h1>🛒 Mon Panier</h1>
            <p>Vérifiez vos articles et procédez au paiement</p>
          </div>
        </div>

        <div className="empty-cart" style={{ display: 'block', margin: '4rem auto', maxWidth: '600px' }}>
          <div className="empty-icon">🛒</div>
          <h3>Votre panier est vide</h3>
          <p>Ajoutez des livres à votre panier pour commencer vos achats</p>
          <Link href="/best-offers" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
            Parcourir le catalogue ›
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="breadcrumb-nav">
            <Link href="/">Accueil</Link>
            <span>›</span>
            <span>Mon Panier</span>
          </div>
          <h1>🛒 Mon Panier</h1>
          <p>Vérifiez vos articles et procédez au paiement</p>
        </div>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div>
          <div className="cart-items-head">
            <h2>Articles</h2>
            <span className="cart-count-text">
              {cart.reduce((sum, i) => sum + i.qty, 0)} livre{cart.reduce((sum, i) => sum + i.qty, 0) > 1 && 's'}
            </span>
          </div>

          <div id="cartItems">
            {cart.map(item => (
              <div className="cart-item" key={item.key || `${item.id}_${item.variant}`}>
                {item.image ? (
                  <div className="ci-img">
                    <img src={item.image} alt={item.title} />
                  </div>
                ) : (
                  <div className="ci-img-fallback">
                    {item.emoji || '📦'}
                  </div>
                )}
                
                <div className="ci-details">
                  <div className="ci-title">{item.title}</div>
                  <div className="ci-variant">Format: {item.variant}</div>
                  <div className="ci-price-mob">{item.price} DH</div>
                </div>
                
                <div className="ci-controls">
                  <div className="qty-wrap" style={{ margin: 0 }}>
                    <button className="q-btn" onClick={() => changeQty(item.key || `${item.id}_${item.variant}`, -1)}>−</button>
                    <input className="q-input" type="number" value={item.qty} readOnly />
                    <button className="q-btn" onClick={() => changeQty(item.key || `${item.id}_${item.variant}`, 1)}>+</button>
                  </div>
  
                  <div className="ci-total">
                    {(item.price * item.qty).toFixed(2)} DH
                  </div>
  
                  <button 
                    className="ci-remove"
                    onClick={() => removeItem(item.key || `${item.id}_${item.variant}`)}
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/best-offers" className="btn-primary" style={{ padding: '.65rem 1.4rem', fontSize: '.9rem', fontWeight: 700, textDecoration: 'none' }}>
              ‹ Continuer les achats
            </Link>
            <button 
              className="btn-outline" 
              onClick={emptyCart} 
              style={{ padding: '.6rem 1.25rem', fontSize: '.85rem', borderColor: 'rgba(229,62,62,0.3)', color: '#fc8181' }}
            >
              🗑 Vider le panier
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Récapitulatif</h3>

          <div className="sum-line">
            <span className="sum-lbl">Sous-total</span>
            <span className="sum-val">{subtotal.toFixed(2)} DH</span>
          </div>

          {discountAmount > 0 && (
            <div className="sum-line" style={{ color: '#22c55e' }}>
              <span className="sum-lbl">Remise (-10%)</span>
              <span className="sum-val">-{discountAmount.toFixed(2)} DH</span>
            </div>
          )}

          <div className="sum-line">
            <span className="sum-lbl">Livraison</span>
            <span className="sum-val">{shipping === 0 ? 'Gratuit 🎉' : `${shipping} DH`}</span>
          </div>

          {subtotal < freeShippingMin && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text2)', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '0.5rem', borderRadius: '8px', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              💡 Ajoutez <strong>{(freeShippingMin - subtotal).toFixed(2)} DH</strong> pour avoir la <strong>livraison gratuite</strong>!
            </div>
          )}

          <div className="sum-total">
            <span className="sum-total-lbl">Total à payer</span>
            <span className="sum-total-val">{total.toFixed(2)} DH</span>
          </div>

          {/* Coupon */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.5rem' }}>Code Promo</div>
            <div className="coupon-row">
              <input 
                className="coupon-input" 
                placeholder="PROMO2026" 
                type="text" 
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
              />
              <button className="btn-coupon" onClick={applyCoupon}>Appliquer</button>
            </div>
          </div>

          <button className="btn-checkout" onClick={() => router.push('/checkout')}>
            Valider la commande →
          </button>
          <button className="btn-continue" onClick={() => router.push('/best-offers')}>
            ‹ Continuer les achats
          </button>

          {/* Trust badges */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            <div style={{ fontSize: '.72rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>🔒 Paiement 100% sécurisé</div>
            <div style={{ fontSize: '.72rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>🚚 Livraison 24-48h au Maroc</div>
            <div style={{ fontSize: '.72rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>🔄 Retour facile sous 7 jours</div>
          </div>
        </div>
      </div>
    </>
  )
}
