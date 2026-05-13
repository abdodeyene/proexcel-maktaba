'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles
} from '@/components/LucideIcons'

type SelectedVariant = {
  name: string
  type: 'color' | 'text'
  colorHex?: string
}

type CartItem = {
  key: string
  productId: number
  id: number
  title: string
  variant: string
  selectedVariant?: SelectedVariant | null
  price: number
  qty: number
  emoji?: string
  image?: string
}

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
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



  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
  const shipping = subtotal >= freeShippingMin || subtotal === 0 ? 0 : shippingFee
  const total = subtotal + shipping

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
            <h1><ShoppingBag size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '10px' }} /> Mon Panier</h1>
            <p>Vérifiez vos articles et procédez au paiement</p>
          </div>
        </div>

        <div className="empty-cart" style={{ display: 'block', margin: '4rem auto', maxWidth: '600px' }}>
          <div className="empty-icon"><ShoppingBag size={64} /></div>
          <h3>Votre panier est vide</h3>
          <p>Ajoutez des livres à votre panier pour commencer vos achats</p>
          <Link href="/best-offers" className="btn-primary proexcel-btn-cart-empty-browse" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
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
          <h1><ShoppingBag size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '10px' }} /> Mon Panier</h1>
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
                  <div className="ci-variant" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {item.selectedVariant?.type === 'color' && item.selectedVariant.colorHex && (
                      <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: item.selectedVariant.colorHex, border: '1.5px solid rgba(0,0,0,0.12)', flexShrink: 0 }} />
                    )}
                    {item.selectedVariant ? item.selectedVariant.name : item.variant || 'Standard'}
                  </div>
                  <div className="ci-price-mob">{item.price} DH</div>
                </div>
                
                <div className="ci-controls">
                  <div className="qty-wrap" style={{ margin: 0 }}>
                    <button className="q-btn proexcel-btn-cart-quantity" onClick={() => changeQty(item.key || `${item.id}_${item.variant}`, -1)}><Minus size={14} /></button>
                    <input className="q-input" type="number" value={item.qty} readOnly />
                    <button className="q-btn proexcel-btn-cart-quantity" onClick={() => changeQty(item.key || `${item.id}_${item.variant}`, 1)}><Plus size={14} /></button>
                  </div>
  
                  <div className="ci-total">
                    {(item.price * item.qty).toFixed(2)} DH
                  </div>
  
                  <button 
                    className="ci-remove proexcel-btn-cart-remove"
                    onClick={() => removeItem(item.key || `${item.id}_${item.variant}`)}
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/best-offers" className="btn-primary proexcel-btn-cart-continue" style={{ padding: '.65rem 1.4rem', fontSize: '.9rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChevronLeft size={18} />
              Continuer les achats
            </Link>
            <button 
              className="btn-outline proexcel-btn-cart-empty" 
              onClick={emptyCart} 
              style={{ padding: '.6rem 1.25rem', fontSize: '.85rem', borderColor: 'rgba(229,62,62,0.3)', color: '#fc8181', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Trash2 size={16} />
              Vider le panier
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


          <div className="sum-line">
            <span className="sum-lbl">Livraison</span>
            <span className="sum-val">{shipping === 0 ? <span style={{ color: 'var(--green)' }}>Gratuit <Sparkles size={14} style={{ display: 'inline', marginLeft: '4px' }} /></span> : `${shipping} DH`}</span>
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



          <button className="btn-checkout proexcel-btn-cart-checkout" onClick={() => router.push('/checkout')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <span>Valider la commande</span>
            <ChevronRight size={18} />
          </button>
          <button className="btn-continue proexcel-btn-cart-summary-continue" onClick={() => router.push('/best-offers')}>
            ‹ Continuer les achats
          </button>

          {/* Trust badges */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '.75rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--green)' }} />
              Paiement 100% sécurisé
            </div>
            <div style={{ fontSize: '.75rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              <Truck size={16} style={{ color: 'var(--primary)' }} />
              Livraison 24-48h au Maroc
            </div>
            <div style={{ fontSize: '.75rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              <RotateCcw size={16} style={{ color: 'var(--primary)' }} />
              Retour facile sous 7 jours
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
