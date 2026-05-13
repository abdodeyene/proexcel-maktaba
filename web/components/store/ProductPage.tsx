'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  ShoppingCart, ShoppingBag, Minus, Plus,
  Truck, RotateCcw, ShieldCheck, Package,
  Check, Flame, ImageIcon, Loader2, Star, CheckCircle2
} from '@/components/LucideIcons'

function getProductImages(images: unknown): string[] {
  if (!images) return []
  if (Array.isArray(images)) return (images as string[]).filter(Boolean)
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images)
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [images]
    } catch {
      return images.split(',').map((s: string) => s.trim()).filter(Boolean)
    }
  }
  return []
}

type Review = {
  id: string
  name: string
  rating: number
  comment: string
  date: string
  approved?: boolean
}

interface ProductPageProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice: number | null
    images: unknown
    category: { name: string; slug: string }
    stock: number
    sku: string
    rating: number
    reviewCount: number
    soldCount: number
    description: string
    isFeatured: boolean
    reviews?: Review[]
    ratingBreakdown?: Record<number, number>
  }
  relatedProducts: any[]
}

const DEFAULT_TRUST = [
  { icon: Truck,       lKey: 'trust_livraison_label', vKey: 'trust_livraison_val', label: 'Livraison',  value: '24–48h au Maroc' },
  { icon: Package,     lKey: 'trust_format_label',    vKey: 'trust_format_val',    label: 'Format',     value: 'Standard / Express' },
  { icon: RotateCcw,   lKey: 'trust_retours_label',   vKey: 'trust_retours_val',   label: 'Retours',    value: '7 jours satisfait' },
  { icon: ShieldCheck, lKey: 'trust_paiement_label',  vKey: 'trust_paiement_val',  label: 'Paiement',   value: 'CMI / Virement / Cash' },
]

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', lineHeight: 1 }}
        >
          <Star
            className="pp-star"
            style={{ width: '1.5rem', height: '1.5rem', transition: 'transform 0.1s' }}
            fill={(hovered || value) >= n ? '#fbbf24' : 'none'}
            stroke={(hovered || value) >= n ? '#fbbf24' : 'var(--border)'}
          />
        </button>
      ))}
    </div>
  )
}

export default function ProductPage({ product }: ProductPageProps) {
  const router = useRouter()
  const productImages = getProductImages(product.images)

  const [currentImage, setCurrentImage]     = useState(0)
  const [direction, setDirection]           = useState<'left' | 'right'>('right')
  const [quantity, setQuantity]             = useState(1)
  const [descOpen, setDescOpen]             = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [toast, setToast]                   = useState<string | null>(null)
  const [siteSettings, setSiteSettings]     = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d && typeof d === 'object') setSiteSettings(d)
    }).catch(() => {})
  }, [])

  const trustItems = DEFAULT_TRUST.map(item => ({
    icon: item.icon,
    label: siteSettings[item.lKey] || item.label,
    value: siteSettings[item.vKey] || item.value,
  }))

  const btnGrad = siteSettings.home_bg1 && siteSettings.home_bg2
    ? `linear-gradient(135deg, ${siteSettings.home_bg1}, ${siteSettings.home_bg2})`
    : undefined
  const btnBorder = siteSettings.home_bg1 || undefined

  // reviews
  const [liveReviews, setLiveReviews]       = useState<Review[]>(
    (product.reviews ?? []).filter(r => r.approved !== false)
  )
  const [showForm, setShowForm]             = useState(false)
  const [reviewForm, setReviewForm]         = useState({ name: '', rating: 5, comment: '' })
  const [submitting, setSubmitting]         = useState(false)
  const [submitted, setSubmitted]           = useState(false)

  const hasDiscount     = product.compareAtPrice != null && product.compareAtPrice > product.price
  const discountPercent = hasDiscount ? Math.round((1 - product.price / product.compareAtPrice!) * 100) : 0
  const savings         = hasDiscount ? (product.compareAtPrice! - product.price).toFixed(2) : '0'
  const isDescriptionEmpty =
    !product.description ||
    product.description.trim() === '' ||
    product.description.toUpperCase() === 'GOOD'

  // live rating computed from visible reviews
  const avgRating    = liveReviews.length > 0
    ? liveReviews.reduce((s, r) => s + r.rating, 0) / liveReviews.length
    : (product.rating ?? 0)
  const totalReviews = liveReviews.length || product.reviewCount || 0

  function goNext() {
    setDirection('right')
    setCurrentImage(p => (p + 1) % productImages.length)
  }
  function goPrev() {
    setDirection('left')
    setCurrentImage(p => (p - 1 + productImages.length) % productImages.length)
  }
  function handleQty(delta: number) {
    setQuantity(p => Math.max(1, Math.min(product.stock ?? 99, p + delta)))
  }

  function addToCartLocal(item: { productId: string; quantity: number; price: number; name: string; image: string | null }) {
    const cart = JSON.parse(localStorage.getItem('proexcel_cart') || '[]')
    const key  = `${item.productId}_standard`
    const idx  = cart.findIndex((i: any) => i.key === key)
    if (idx >= 0) {
      cart[idx].qty += item.quantity
    } else {
      cart.push({ key, ...item, qty: item.quantity, variant: 'Standard', emoji: '📚' })
    }
    localStorage.setItem('proexcel_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  async function handleAddToCart() {
    setIsAddingToCart(true)
    try {
      addToCartLocal({ productId: product.id, quantity, price: product.price, name: product.name, image: productImages[0] ?? null })
      setToast('Produit ajouté au panier !')
      setTimeout(() => setToast(null), 3000)
    } finally {
      setIsAddingToCart(false)
    }
  }

  function handleBuyNow() {
    addToCartLocal({ productId: product.id, quantity, price: product.price, name: product.name, image: productImages[0] ?? null })
    router.push('/checkout')
  }

  async function submitReview() {
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, ...reviewForm }),
      })
      if (res.ok) {
        const newRev: Review = await res.json()
        setLiveReviews(prev => [newRev, ...prev])
        setSubmitted(true)
        setShowForm(false)
        setReviewForm({ name: '', rating: 5, comment: '' })
      }
    } catch { /* silent */ }
    setSubmitting(false)
  }

  // rating breakdown from live reviews
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: liveReviews.filter(r => r.rating === star).length,
  }))

  return (
    <div className="pp-root">

      <div className="pp-container">

        {/* Breadcrumb */}
        <nav className="pp-breadcrumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <a href={`/categories/${product.category?.slug}`} className="capitalize">{product.category?.name}</a>
          <span>/</span>
          <span className="pp-breadcrumb-current">{product.name}</span>
        </nav>

        {/* ═══ PRODUCT GRID ═══ */}
        <div className="pp-grid">

          {/* ── GALLERY ── */}
          <div className="pp-gallery">
            <div className="adaptive-gallery-container">
              {/* Adaptive Glow (Dark Mode only) */}
              {productImages.length > 0 && (
                <div className="adaptive-glow-wrapper">
                  <img
                    key={`glow-${currentImage}`}
                    src={productImages[currentImage]}
                    className="adaptive-glow"
                    alt=""
                    aria-hidden="true"
                  />
                </div>
              )}

              {/* Main Image */}
              {productImages.length > 0 ? (
                <img
                  key={`main-${currentImage}`}
                  src={productImages[currentImage]}
                  className={`adaptive-main-img ${direction === 'right' ? 'animate-slideRight' : 'animate-slideLeft'}`}
                  alt={product.name}
                />
              ) : (
                <div className="pp-img-placeholder" style={{ minHeight: '400px' }}>
                  <ImageIcon className="pp-img-placeholder-icon" />
                </div>
              )}

              {productImages.length > 1 && (
                <>
                  <button className="pp-gallery-arrow pp-gallery-arrow-left proexcel-btn-product-gallery-arrow" onClick={goPrev}>
                    <ChevronLeft className="pp-arrow-icon" />
                  </button>
                  <button className="pp-gallery-arrow pp-gallery-arrow-right proexcel-btn-product-gallery-arrow" onClick={goNext}>
                    <ChevronRight className="pp-arrow-icon" />
                  </button>
                </>
              )}

              {hasDiscount && <div className="pp-discount-badge">-{discountPercent}%</div>}
            </div>

            {productImages.length > 1 && (
              <div className="pp-thumbs">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > currentImage ? 'right' : 'left'); setCurrentImage(i) }}
                    className={`pp-thumb ${currentImage === i ? 'active' : ''}`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <Image src={img} alt={`Vue ${i + 1}`} fill className="pp-thumb-img" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className="pp-info">

            <div className="pp-badges-row">
              <span className="pp-category-tag">{product.category?.name}</span>
              {(product.soldCount ?? 0) > 0 && (
                <span className="pp-sold-tag">
                  <Flame className="pp-flame-icon" />
                  {product.soldCount} vendus
                </span>
              )}
            </div>

            <h1 className="pp-title">{product.name}</h1>

            <div className="pp-rating-row">
              <div className="pp-stars">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="pp-star"
                    fill={s <= Math.round(avgRating) ? '#fbbf24' : 'none'}
                    stroke={s <= Math.round(avgRating) ? '#fbbf24' : 'var(--border)'} />
                ))}
              </div>
              <span className="pp-rating-val">{avgRating.toFixed(1)}</span>
              <span className="pp-rating-count">({totalReviews} avis)</span>
            </div>

            <div className="pp-divider" />

            {/* Price */}
            <div className="pp-price-block">
              <div className="pp-price-row">
                <span className="pp-price">{product.price}</span>
                <span className="pp-currency">DH</span>
                {hasDiscount && <span className="pp-old-price">{product.compareAtPrice} DH</span>}
                {hasDiscount && <span className="pp-disc-pill">-{discountPercent}%</span>}
              </div>
              {hasDiscount && (
                <div className="pp-savings">
                  <Check className="pp-check-icon" />
                  Vous économisez {savings} DH
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="pp-stock-row">
              <span className={`pp-stock-dot ${product.stock > 0 ? 'in' : 'out'}`} />
              <span className={`pp-stock-label ${product.stock > 0 ? 'in' : 'out'}`}>
                {product.stock > 0
                  ? `En stock${product.stock <= 5 ? ` — Plus que ${product.stock} dispo` : ''}`
                  : 'Rupture de stock'}
              </span>
            </div>

            {/* ── PURCHASE AREA ── */}
            {/* Mobile layout — cart button only (buy now is in sticky bar) */}
            <div className="pp-purchase-mobile">
              <span className="pp-qty-label">Quantité</span>
              <div className="pp-mob-row1">
                <div className="pp-qty-ctrl">
                  <button className="pp-qty-btn proexcel-btn-product-quantity" onClick={() => handleQty(-1)} disabled={quantity <= 1}>
                    <Minus className="pp-qty-icon" />
                  </button>
                  <span className="pp-qty-val">{quantity}</span>
                  <button className="pp-qty-btn proexcel-btn-product-quantity" onClick={() => handleQty(1)} disabled={quantity >= (product.stock ?? 99)}>
                    <Plus className="pp-qty-icon" />
                  </button>
                </div>
                <button className="pp-btn-cart proexcel-btn-product-add-cart pp-mob-cart" onClick={handleAddToCart} disabled={isAddingToCart || product.stock === 0}
                  style={btnBorder ? { borderColor: btnBorder, color: btnBorder } : undefined}>
                  {isAddingToCart ? <Loader2 className="pp-btn-icon animate-spin" /> : <ShoppingCart className="pp-btn-icon" />}
                  Ajouter au panier
                </button>
              </div>
            </div>

            {/* Desktop layout — cart + buy buttons */}
            <div className="pp-purchase-desktop">
              <div className="pp-qty-row">
                <span className="pp-qty-label">Quantité</span>
                <div className="pp-qty-ctrl">
                  <button className="pp-qty-btn proexcel-btn-product-quantity" onClick={() => handleQty(-1)} disabled={quantity <= 1}>
                    <Minus className="pp-qty-icon" />
                  </button>
                  <span className="pp-qty-val">{quantity}</span>
                  <button className="pp-qty-btn proexcel-btn-product-quantity" onClick={() => handleQty(1)} disabled={quantity >= (product.stock ?? 99)}>
                    <Plus className="pp-qty-icon" />
                  </button>
                </div>
              </div>
              <div className="pp-cta-btns">
                <button className="pp-btn-cart proexcel-btn-product-add-cart" onClick={handleAddToCart} disabled={isAddingToCart || product.stock === 0}
                  style={btnBorder ? { borderColor: btnBorder, color: btnBorder } : undefined}>
                  {isAddingToCart ? <Loader2 className="pp-btn-icon animate-spin" /> : <ShoppingCart className="pp-btn-icon" />}
                  {isAddingToCart ? 'Ajout...' : 'Ajouter au panier'}
                </button>
                <button className="pp-btn-buy proexcel-btn-product-buy-now" onClick={handleBuyNow} disabled={product.stock === 0}
                  style={btnGrad ? { background: btnGrad, borderColor: btnBorder } : undefined}>
                  <ShoppingBag className="pp-btn-icon" />
                  {siteSettings.sticky_buy_label || 'Commander maintenant'}
                </button>
              </div>
            </div>

            {/* Trust grid */}
            <div className="pp-trust-grid">
              {trustItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="pp-trust-card">
                  <div className="pp-trust-icon-wrap"><Icon className="pp-trust-icon" /></div>
                  <div>
                    <p className="pp-trust-label">{label}</p>
                    <p className="pp-trust-val">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Meta */}
            <div className="pp-meta">
              <span>Réf: <strong>{product.sku}</strong></span>
            </div>
          </div>
        </div>

        {/* ═══ DESCRIPTION ═══ */}
        <div className="pp-accordion">
          <button className="pp-acc-trigger" onClick={() => setDescOpen(p => !p)}>
            <h2 className="pp-acc-title">Description du produit</h2>
            <div className="pp-acc-chevron">
              {descOpen ? <ChevronUp className="pp-chevron-icon" /> : <ChevronDown className="pp-chevron-icon" />}
            </div>
          </button>
          {descOpen && (
            <div className="pp-acc-body">
              {isDescriptionEmpty
                ? <em className="pp-no-desc">Aucune description disponible pour ce produit.</em>
                : <div dangerouslySetInnerHTML={{ __html: product.description }} />}
            </div>
          )}
        </div>

        {/* ═══ REVIEWS ═══ */}
        <div className="pp-reviews">
          <div className="pp-reviews-header">
            <h2 className="pp-reviews-title">Avis &amp; Évaluations</h2>
            {submitted && (
              <div className="pp-review-success">
                <CheckCircle2 style={{ width: '1rem', height: '1rem', color: 'var(--green)', flexShrink: 0 }} />
                Merci pour votre avis !
              </div>
            )}
          </div>

          {/* Summary row */}
          <div className="pp-reviews-inner">
            <div className="pp-score-box">
              <span className="pp-score-num">{avgRating.toFixed(1)}</span>
              <span className="pp-score-denom">/5</span>
              <div className="pp-score-stars">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="pp-star"
                    fill={s <= Math.round(avgRating) ? '#fbbf24' : 'none'}
                    stroke={s <= Math.round(avgRating) ? '#fbbf24' : 'var(--border)'} />
                ))}
              </div>
              <span className="pp-score-count">{totalReviews} avis</span>
            </div>

            <div className="pp-reviews-sep" />

            <div className="pp-bars">
              {ratingCounts.map(({ star, count }) => {
                const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
                return (
                  <div key={star} className="pp-bar-row">
                    <span className="pp-bar-label">{star}</span>
                    <Star className="pp-bar-star" fill="#fbbf24" stroke="#fbbf24" />
                    <div className="pp-bar-track">
                      <div className="pp-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="pp-bar-count">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Individual reviews */}
          {liveReviews.length > 0 && (
            <div className="pp-review-list">
              {liveReviews.map(rev => (
                <div key={rev.id} className="pp-review-card">
                  <div className="pp-review-top">
                    <div className="pp-review-avatar">{rev.name.charAt(0).toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="pp-review-name">{rev.name}</div>
                      <div className="pp-review-stars">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} style={{ width: '0.75rem', height: '0.75rem' }}
                            fill={s <= rev.rating ? '#fbbf24' : 'none'}
                            stroke={s <= rev.rating ? '#fbbf24' : 'var(--border)'} />
                        ))}
                      </div>
                    </div>
                    <span className="pp-review-date">{rev.date}</span>
                  </div>
                  <p className="pp-review-comment">{rev.comment}</p>
                  <div className="pp-review-verified">
                    <CheckCircle2 style={{ width: '0.7rem', height: '0.7rem', color: 'var(--green)' }} />
                    Achat vérifié
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Write review button / form */}
          {!showForm ? (
            <div className="pp-write-review-wrap">
              <button className="pp-btn-buy pp-write-review-btn" onClick={() => setShowForm(true)}>
                ✍ Laisser un avis
              </button>
            </div>
          ) : (
            <div className="pp-review-form">
              <h3 className="pp-review-form-title">Votre avis</h3>
              <div className="pp-review-form-grid">
                <div>
                  <label className="pp-form-label">Votre nom</label>
                  <input
                    className="pp-form-input"
                    placeholder="Ex: Amine B."
                    value={reviewForm.name}
                    onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="pp-form-label">Votre note</label>
                  <StarPicker value={reviewForm.rating} onChange={n => setReviewForm(f => ({ ...f, rating: n }))} />
                </div>
              </div>
              <label className="pp-form-label">Votre commentaire</label>
              <textarea
                className="pp-form-input"
                rows={4}
                placeholder="Qu'avez-vous pensé de ce produit ?"
                value={reviewForm.comment}
                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                style={{ resize: 'none' }}
              />
              <div className="pp-review-form-actions">
                <button className="pp-btn-buy" onClick={submitReview} disabled={submitting || !reviewForm.name.trim() || !reviewForm.comment.trim()}>
                  {submitting ? <Loader2 className="pp-btn-icon animate-spin" /> : null}
                  {submitting ? 'Publication…' : 'Publier mon avis'}
                </button>
                <button className="pp-btn-cart" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </div>
          )}
        </div>

      </div>{/* /pp-container */}

      {/* ═══ MOBILE STICKY BAR ═══ */}
      <div className="pp-mobile-bar">
        <div className="pp-mobile-price">
          <span className="pp-mobile-price-val">{product.price} DH</span>
          {hasDiscount && <span className="pp-mobile-old-price">{product.compareAtPrice} DH</span>}
        </div>
        <button
          className="pp-mobile-cart-only proexcel-btn-product-buy-now"
          onClick={handleBuyNow}
          disabled={product.stock === 0}
        >
          <ShoppingBag className="pp-btn-icon" />
          {siteSettings.sticky_buy_label || 'Commander maintenant'}
        </button>
      </div>

      {/* ═══ TOAST ═══ */}
      {toast && (
        <div className="pp-toast">
          <Check className="pp-toast-icon" />
          {toast}
        </div>
      )}

      <style jsx>{`
        /* ROOT */
        .pp-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-latin);
          padding-bottom: 96px;
        }
        @media (min-width: 768px) { .pp-root { padding-bottom: 0; } }

        /* CONTAINER */
        .pp-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.75rem 1rem 4rem;
        }
        @media (min-width: 640px)  { .pp-container { padding: 2rem 1.5rem 4rem; } }
        @media (min-width: 1024px) { .pp-container { padding: 2.5rem 2.5rem 5rem; } }

        /* BREADCRUMB */
        .pp-breadcrumb {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.78rem; color: var(--text2); margin-bottom: 2rem; flex-wrap: wrap;
        }
        .pp-breadcrumb a { transition: color 0.2s; }
        .pp-breadcrumb a:hover { color: var(--primary); }
        .pp-breadcrumb-current { color: var(--text); font-weight: 500; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* GRID */
        .pp-grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; align-items: start; }
        @media (min-width: 1024px) { .pp-grid { grid-template-columns: minmax(0, 560px) 1fr; gap: 4rem; } }
        @media (min-width: 1280px) { .pp-grid { gap: 5rem; } }

        /* GALLERY */
        .pp-gallery { display: flex; flex-direction: column; gap: 0.875rem; }
        @media (min-width: 1024px) { .pp-gallery { position: sticky; top: 88px; } }

        .adaptive-gallery-container {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
        }
        
        .adaptive-glow-wrapper {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
          pointer-events: none;
        }
        
        .adaptive-glow {
          width: 85%;
          height: 85%;
          object-fit: contain;
          filter: blur(50px) saturate(180%) opacity(0.5);
          transform: translateY(5%);
          animation: fadeUp 0.4s ease forwards;
        }
        
        [data-theme="light"] .adaptive-glow {
          display: none;
        }
        
        .adaptive-main-img {
          position: relative;
          z-index: 2;
          width: 100%;
          max-height: 600px;
          object-fit: contain;
          border-radius: 20px;
          transition: transform 0.4s ease;
        }
        
        [data-theme="light"] .adaptive-main-img {
          filter: drop-shadow(0 25px 45px rgba(0,0,0,0.12));
        }
        
        @media (max-width: 767px) {
          .adaptive-main-img {
            max-height: 400px;
            border-radius: 0;
          }
        }
        
        .pp-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .pp-img-placeholder-icon { width: 4rem; height: 4rem; color: var(--text2); opacity: 0.3; }

        .pp-gallery-arrow {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 10;
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--glass); border: 1px solid var(--border); color: var(--text);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; backdrop-filter: blur(12px); transition: all 0.2s;
        }
        .pp-gallery-arrow:hover { background: var(--primary); border-color: var(--primary); color: #fff; transform: translateY(-50%) scale(1.08); }
        .pp-gallery-arrow-left { left: 0.875rem; }
        .pp-gallery-arrow-right { right: 0.875rem; }
        .pp-arrow-icon { width: 1rem; height: 1rem; }

        .pp-discount-badge {
          position: absolute; top: 1rem; left: 1rem; z-index: 10;
          background: var(--primary); color: #fff;
          font-size: 0.72rem; font-weight: 800; padding: 0.35rem 0.75rem;
          border-radius: 100px; letter-spacing: 0.04em;
        }

        .pp-thumbs { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; padding: 8px 0 4px; }
        .pp-thumbs::-webkit-scrollbar { display: none; }
        .pp-thumb {
          position: relative; flex-shrink: 0; width: 72px; height: 72px;
          border-radius: 10px; overflow: hidden; background: transparent;
          border: 2px solid transparent; cursor: pointer;
          transition: all 0.2s ease;
          animation: fadeUp 0.4s ease forwards;
          opacity: 0;
        }
        .pp-thumb.active { border-color: var(--primary); opacity: 1; }
        .pp-thumb:hover { opacity: 1; }
        @media (prefers-color-scheme: dark) { .pp-thumb.active { border-color: var(--primary); } }
        [data-theme="dark"] .pp-thumb.active { border-color: var(--primary); }
        .pp-thumb-img { object-fit: cover; }

        /* INFO */
        .pp-info { display: flex; flex-direction: column; gap: 1.375rem; }

        .pp-badges-row { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; }
        .pp-category-tag {
          font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--primary); background: rgba(232,53,42,0.08); border: 1px solid rgba(232,53,42,0.2);
          padding: 0.3rem 0.85rem; border-radius: 100px;
        }
        .pp-sold-tag {
          font-size: 0.72rem; font-weight: 700; color: #f97316;
          background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.2);
          padding: 0.3rem 0.85rem; border-radius: 100px;
          display: flex; align-items: center; gap: 0.35rem;
        }
        .pp-flame-icon { width: 0.8rem; height: 0.8rem; }

        .pp-title { font-size: clamp(1.4rem, 3.5vw, 2rem); font-weight: 800; line-height: 1.22; color: var(--text); letter-spacing: -0.01em; }

        .pp-rating-row { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
        .pp-stars { display: flex; gap: 2px; }
        .pp-star { width: 1rem; height: 1rem; }
        .pp-rating-val { font-weight: 800; font-size: 0.9rem; color: var(--text); }
        .pp-rating-count { font-size: 0.85rem; color: var(--text2); }

        .pp-divider { height: 1px; background: var(--border); margin: 0.25rem 0; }

        /* PRICE */
        .pp-price-block { display: flex; flex-direction: column; gap: 0.5rem; }
        .pp-price-row { display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap; }
        .pp-price { font-size: 2.4rem; font-weight: 900; line-height: 1; color: var(--primary); letter-spacing: -0.02em; }
        .pp-currency { font-size: 1.1rem; font-weight: 600; color: var(--text2); }
        .pp-old-price {
          font-size: 1.2rem; font-weight: 600;
          text-decoration: line-through;
          color: #9ca3af;
          align-self: center;
        }
        .pp-disc-pill { font-size: 0.72rem; font-weight: 800; background: var(--primary); color: #fff; padding: 0.25rem 0.7rem; border-radius: 100px; align-self: center; }
        .pp-savings { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; color: var(--green); }
        .pp-check-icon { width: 0.9rem; height: 0.9rem; }

        /* STOCK */
        .pp-stock-row { display: flex; align-items: center; gap: 0.6rem; }
        .pp-stock-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .pp-stock-dot.in { background: var(--green); box-shadow: 0 0 0 3px rgba(34,197,94,0.18); }
        .pp-stock-dot.out { background: var(--red); }
        .pp-stock-label { font-size: 0.875rem; font-weight: 600; }
        .pp-stock-label.in { color: var(--green); }
        .pp-stock-label.out { color: var(--red); }

        /* QUANTITY */
        .pp-qty-row { display: flex; align-items: center; gap: 1.25rem; }
        .pp-qty-label { font-size: 0.875rem; font-weight: 600; color: var(--text2); white-space: nowrap; }
        .pp-qty-ctrl { display: flex; align-items: center; border: 2px solid var(--border); border-radius: 16px; overflow: hidden; background: var(--card); }
        .pp-qty-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; color: var(--text); cursor: pointer; transition: all 0.2s; }
        .pp-qty-btn:hover:not(:disabled) { background: var(--bg); }
        .pp-qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .pp-qty-icon { width: 1rem; height: 1rem; }
        .pp-qty-val { width: 44px; text-align: center; font-size: 1rem; font-weight: 700; color: var(--text); border-left: 1px solid var(--border); border-right: 1px solid var(--border); }

        /* PURCHASE AREA */
        /* Mobile: qty label, then [qty ctrl][cart btn] row, then [buy full-width] */
        .pp-purchase-mobile { display: flex; flex-direction: column; gap: 0.75rem; }
        .pp-purchase-desktop { display: none; }
        .pp-mob-row1 { display: flex; align-items: center; gap: 0.75rem; }
        .pp-mob-cart { flex: 1; min-width: 0; font-size: 0.88rem; }
        .pp-mob-buy { width: 100%; flex: none; height: 60px; font-size: 1rem; border-radius: 18px; }

        @media (min-width: 1024px) {
          .pp-purchase-mobile { display: none; }
          .pp-purchase-desktop { display: flex; flex-direction: column; gap: 1.375rem; }
        }

        /* CTA BUTTONS */
        .pp-cta-btns { display: flex; gap: 0.875rem; }

        .pp-btn-cart, .pp-btn-buy {
          flex: 1; height: 54px; border-radius: 16px; font-weight: 700; font-size: 0.93rem;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          cursor: pointer; transition: all 0.22s; white-space: nowrap; font-family: var(--font-latin);
        }
        .pp-btn-cart:disabled, .pp-btn-buy:disabled { opacity: 0.4; cursor: not-allowed; }
        .pp-btn-cart { background: transparent; border: 2px solid var(--primary); color: var(--primary); }
        .pp-btn-cart:hover:not(:disabled) { background: var(--primary); color: #fff; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,53,42,0.25); }
        .pp-btn-buy { background: var(--primary); border: 2px solid var(--primary); color: #fff; }
        .pp-btn-buy:hover:not(:disabled) { background: var(--primary2); border-color: var(--primary2); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,53,42,0.3); }
        .pp-btn-icon { width: 1rem; height: 1rem; flex-shrink: 0; }

        /* TRUST */
        .pp-trust-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.625rem; }
        .pp-trust-card {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem;
          border-radius: 14px; background: var(--card); border: 1px solid var(--border); transition: border-color 0.2s;
        }
        .pp-trust-card:hover { border-color: var(--primary); }
        .pp-trust-icon-wrap {
          width: 36px; height: 36px; border-radius: 10px; background: var(--bg); border: 1px solid var(--border);
          color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .pp-trust-icon { width: 1rem; height: 1rem; }
        .pp-trust-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text2); margin-bottom: 0.1rem; }
        .pp-trust-val { font-size: 0.78rem; font-weight: 600; color: var(--text); }

        /* META */
        .pp-meta { display: flex; align-items: center; justify-content: space-between; font-size: 0.78rem; color: var(--text2); padding-top: 0.75rem; border-top: 1px solid var(--border); }
        .pp-meta strong { color: var(--text); font-weight: 700; }

        /* ACCORDION */
        .pp-accordion { margin-top: 2.5rem; border-radius: 18px; overflow: hidden; background: var(--card); border: 1px solid var(--border); }
        .pp-acc-trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 1.375rem 1.5rem; cursor: pointer; color: var(--text); transition: background 0.2s; }
        .pp-acc-trigger:hover { background: var(--bg); }
        .pp-acc-title { font-size: 1rem; font-weight: 700; color: var(--text); }
        .pp-acc-chevron { width: 32px; height: 32px; border-radius: 10px; background: var(--bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pp-chevron-icon { width: 1rem; height: 1rem; color: var(--text2); }
        .pp-acc-body { padding: 0 1.5rem 1.5rem; font-size: 0.92rem; line-height: 1.75; color: var(--text2); max-width: 800px; }
        .pp-no-desc { opacity: 0.6; font-style: italic; }

        /* REVIEWS */
        .pp-reviews { margin-top: 1.5rem; border-radius: 18px; background: var(--card); border: 1px solid var(--border); padding: 1.75rem; }
        .pp-reviews-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.5rem; }
        .pp-reviews-title { font-size: 1rem; font-weight: 700; color: var(--text); }
        .pp-review-success { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; font-weight: 600; color: var(--green); }

        .pp-reviews-inner { display: flex; flex-direction: column; align-items: flex-start; gap: 1.5rem; }
        @media (min-width: 560px) { .pp-reviews-inner { flex-direction: row; align-items: center; gap: 2rem; } }

        .pp-score-box { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; min-width: 90px; }
        .pp-score-num { font-size: 3.5rem; font-weight: 900; line-height: 1; color: var(--text); letter-spacing: -0.04em; }
        .pp-score-denom { font-size: 0.85rem; color: var(--text2); margin-bottom: 0.5rem; }
        .pp-score-stars { display: flex; gap: 2px; }
        .pp-score-count { font-size: 0.72rem; color: var(--text2); margin-top: 0.4rem; }

        .pp-reviews-sep { display: none; width: 1px; height: 80px; background: var(--border); flex-shrink: 0; align-self: center; }
        @media (min-width: 560px) { .pp-reviews-sep { display: block; } }

        .pp-bars { flex: 1; width: 100%; display: flex; flex-direction: column; gap: 0.625rem; }
        .pp-bar-row { display: flex; align-items: center; gap: 0.5rem; }
        .pp-bar-label { font-size: 0.75rem; font-weight: 600; color: var(--text2); width: 14px; text-align: right; flex-shrink: 0; }
        .pp-bar-star { width: 0.7rem; height: 0.7rem; flex-shrink: 0; }
        .pp-bar-track { flex: 1; height: 7px; border-radius: 100px; overflow: hidden; background: var(--bg); min-width: 0; }
        .pp-bar-fill { height: 100%; border-radius: 100px; background: #fbbf24; transition: width 0.5s; }
        .pp-bar-count { font-size: 0.72rem; color: var(--text2); width: 18px; text-align: right; flex-shrink: 0; }

        /* REVIEW CARDS */
        .pp-review-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.75rem; }
        .pp-review-card {
          padding: 1.25rem; border-radius: 14px;
          background: var(--bg); border: 1px solid var(--border);
        }
        .pp-review-top { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem; }
        .pp-review-avatar {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          background: var(--primary); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 1rem;
        }
        .pp-review-name { font-weight: 700; font-size: 0.88rem; color: var(--text); margin-bottom: 0.2rem; }
        .pp-review-stars { display: flex; gap: 2px; }
        .pp-review-date { font-size: 0.72rem; color: var(--text2); white-space: nowrap; flex-shrink: 0; }
        .pp-review-comment { font-size: 0.88rem; line-height: 1.6; color: var(--text2); margin: 0 0 0.5rem; }
        .pp-review-verified { display: flex; align-items: center; gap: 0.3rem; font-size: 0.68rem; font-weight: 700; color: var(--green); }

        /* WRITE REVIEW */
        .pp-write-review-wrap { margin-top: 1.5rem; display: flex; justify-content: center; }
        .pp-write-review-btn { flex: none; width: auto; padding: 0 2rem; }
        .pp-review-form {
          margin-top: 1.5rem; padding: 1.5rem; border-radius: 16px;
          background: var(--bg); border: 1px solid var(--border);
          display: flex; flex-direction: column; gap: 1rem;
        }
        .pp-review-form-title { font-size: 1rem; font-weight: 700; color: var(--text); }
        .pp-review-form-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 560px) { .pp-review-form-grid { grid-template-columns: 1fr 1fr; } }
        .pp-form-label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text2); margin-bottom: 0.4rem; }
        .pp-form-input {
          width: 100%; background: var(--card); border: 1px solid var(--border);
          border-radius: 12px; padding: 0.75rem 1rem; color: var(--text);
          font-size: 0.9rem; font-family: var(--font-latin); transition: border-color 0.2s;
        }
        .pp-form-input:focus { outline: none; border-color: var(--primary); }
        .pp-form-input::placeholder { color: var(--text2); opacity: 0.6; }
        .pp-review-form-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .pp-review-form-actions .pp-btn-cart,
        .pp-review-form-actions .pp-btn-buy { flex: none; padding: 0 1.5rem; width: auto; }

        /* MOBILE STICKY BAR */
        .pp-mobile-bar {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem 1rem;
          padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
          background: var(--glass); border-top: 1px solid var(--border);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 -4px 24px rgba(0,0,0,0.12);
        }
        @media (min-width: 768px) { .pp-mobile-bar { display: none; } }

        .pp-mobile-price { display: flex; flex-direction: column; flex-shrink: 0; }
        .pp-mobile-price-val { font-size: 1.05rem; font-weight: 900; color: var(--primary); line-height: 1; }
        .pp-mobile-old-price { font-size: 0.65rem; text-decoration: line-through; color: var(--text2); margin-top: 1px; }

        .pp-mobile-cart-only {
          flex: 1; height: 52px; border-radius: 14px; font-size: 0.9rem; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          border: 1.5px solid #111827; background: transparent; color: #111827;
          cursor: pointer; transition: all 0.2s; min-width: 0;
        }
        [data-theme="dark"] .pp-mobile-cart-only {
          border-color: var(--border); color: var(--text);
        }
        .pp-mobile-cart-only:hover:not(:disabled) { background: rgba(0,0,0,0.05); }
        [data-theme="dark"] .pp-mobile-cart-only:hover:not(:disabled) { background: var(--card); }
        .pp-mobile-cart-only:disabled { opacity: 0.45; cursor: not-allowed; }

        /* TOAST */
        .pp-toast {
          position: fixed; bottom: 7rem; left: 50%; transform: translateX(-50%); z-index: 200;
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.75rem 1.25rem; border-radius: 16px;
          background: var(--card); border: 1px solid var(--border);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          font-size: 0.875rem; font-weight: 600; color: var(--text); white-space: nowrap;
          animation: fadeInUp 0.3s ease;
        }
        @media (min-width: 768px) { .pp-toast { bottom: 2.5rem; } }
        .pp-toast-icon { width: 1rem; height: 1rem; color: var(--green); flex-shrink: 0; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
