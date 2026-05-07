'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '@/components/ProductCard'

type Review = {
  id: string
  name: string
  rating: number
  comment: string
  date: string
}

type Product = {
  id: number
  title: string
  author?: string | null
  price: number
  compareAtPrice?: number | null
  category?: string | null
  g1?: string | null
  g2?: string | null
  emoji?: string | null
  stock: number
  rating?: number | null
  reviewCount?: number | null
  isPromo?: boolean | null
  isNew?: boolean | null
  isBestOffer?: boolean | null
  description?: string | null
  variants?: string[] | any
  media?: unknown | null
  reviews?: unknown | null
}

export default function ProductDetailClient({ 
  product, 
  relatedProducts = [] 
}: { 
  product: Product
  relatedProducts: Product[] 
}) {
  const router = useRouter()
  
  // Format variants
  const parsedVariants = Array.isArray(product.variants) 
    ? product.variants 
    : typeof product.variants === 'string' 
      ? JSON.parse(product.variants) 
      : ['Brochée', 'Reliée', 'Numérique']

  const [selectedVariant, setSelectedVariant] = useState(parsedVariants[0] || 'Standard')
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc')
  const [activeImg, setActiveImg] = useState(0)
  const [dir, setDir] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [liveReviews, setLiveReviews] = useState<Review[]>(
    Array.isArray(product.reviews) ? (product.reviews as Review[]) : []
  )

  const mediaImages = Array.isArray(product.media)
    ? (product.media as string[]).filter(url => url && !url.match(/\.(mp4|webm|mov|avi)$/i))
    : []

  const nextImg = () => { setDir(1); setActiveImg((prev) => (prev + 1) % mediaImages.length); }
  const prevImg = () => { setDir(-1); setActiveImg((prev) => (prev - 1 + mediaImages.length) % mediaImages.length); }

  const disc = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('proexcel_cart') || '[]')
    const key = `${product.id}_${selectedVariant}`
    
    const existingIdx = cart.findIndex((i: any) => i.key === key)
    if (existingIdx >= 0) {
      cart[existingIdx].qty += qty
    } else {
      cart.push({
        key,
        productId: product.id,
        id: product.id,
        title: product.title,
        price: product.price,
        qty,
        variant: selectedVariant,
        emoji: product.emoji || '📦',
        image: mediaImages.length > 0 ? mediaImages[0] : null
      })
    }
    
    localStorage.setItem('proexcel_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    
    // Smooth scroll to cart or redirect?
    router.push('/cart')
  }

  async function submitReview() {
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, ...reviewForm })
      })
      if (res.ok) {
        const newRev: Review = await res.json()
        setLiveReviews(prev => [...prev, newRev])
        setSubmitted(true)
        setShowReviewForm(false)
        setReviewForm({ name: '', rating: 5, comment: '' })
      }
    } catch { /* silent */ }
    setSubmitting(false)
  }

  return (
    <div>
      <div className="product-page-wrap">
        
        {/* Breadcrumb */}
        <div className="breadcrumb-nav" style={{ marginBottom: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--text2)' }}>Accueil</Link>
          <span>›</span>
          <span style={{ color: 'var(--text2)' }}>{product.category || 'Livre'}</span>
          <span>›</span>
          <span style={{ color: 'var(--text2)' }}>{product.title}</span>
        </div>

        {/* Layout */}
        <div className="product-layout">
          
          {/* Gallery */}
          <div className="gallery-sticky">
            <div className="product-gallery-flex">
              {mediaImages.length > 1 && (
                <div className="thumbs-vertical">
                  {mediaImages.map((url, i) => (
                    <div
                      key={i}
                      className={`thumb ${activeImg === i ? 'active' : ''}`}
                      onClick={() => setActiveImg(i)}
                    >
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
              <div className="main-img" style={{ flex: 1 }}>
                {mediaImages.length > 0 ? (
                  <>
                    <img
                      key={activeImg}
                      src={mediaImages[activeImg]}
                      alt={product.title}
                      style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain', display: 'block' }}
                    />
                    {mediaImages.length > 1 && (
                      <div className="img-arrows">
                        <button className="img-arrow" onClick={prevImg}>‹</button>
                        <button className="img-arrow" onClick={nextImg}>›</button>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="book-cover"
                    style={{
                      width: '240px',
                      height: '340px',
                      background: `linear-gradient(145deg, ${product.g1 || '#1a237e'}, ${product.g2 || '#3949ab'})`
                    }}
                  >
                    <div className="book-spine"></div>
                    <div className="book-title-cover" style={{ fontSize: '1.4rem' }}>{product.title}</div>
                    <div className="book-author-cover" style={{ fontSize: '0.9rem' }}>{product.author}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="detail-info">
            <h1 className="product-detail-title" style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.1 }}>{product.title}</h1>

            {/* Rating */}
            <div className="rating-row" style={{ marginBottom: '1rem' }}>
              <span className="stars" style={{ color: 'var(--gold)', letterSpacing: '2px', fontSize: '1.2rem' }}>
                {'★'.repeat(Math.round(product.rating || 5))}{'☆'.repeat(5 - Math.round(product.rating || 5))}
              </span>
              <span className="r-count" style={{ fontWeight: 700, color: 'var(--gold)', marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                {product.rating || '5.0'}
              </span>
              <span className="r-count" style={{ color: 'var(--text2)', marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                ({liveReviews.length > 0 ? liveReviews.length : (product.reviewCount || 0)} avis)
              </span>
            </div>

            {/* Price */}
            <div className="detail-price-row" style={{ marginBottom: '1.5rem' }}>
              <span className="d-price" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>{product.price} DH</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="d-compare" style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--text2)' }}>{product.compareAtPrice} DH</span>
                  <span className="d-save" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700 }}>-{disc}%</span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p style={{ color: 'var(--text2)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '2rem' }}>
                {product.description}
              </p>
            )}

            {/* Variants */}
            {parsedVariants.length > 0 && (
              <div className="variant-group" style={{ marginBottom: '1.5rem' }}>
                <div className="v-label" style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.8rem' }}>Format</div>
                <div className="v-opts" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {parsedVariants.map((v: string) => (
                    <button 
                      key={v}
                      className={`v-opt ${selectedVariant === v ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + ATC side by side */}
            <div style={{ marginBottom: '1rem' }}>
              <div className="v-label" style={{ fontWeight: 700, fontSize: '0.75rem', marginBottom: '0.6rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Quantité</div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="qty-wrap" style={{ width: '126px', flexShrink: 0, margin: 0, background: 'transparent', border: '1px solid var(--border)' }}>
                  <button className="q-btn" onClick={() => setQty(prev => Math.max(1, prev - 1))} style={{ background: 'transparent' }}>−</button>
                  <input className="q-input" type="number" value={qty} readOnly style={{ height: '44px', background: 'transparent' }} />
                  <button className="q-btn" onClick={() => setQty(prev => prev + 1)} style={{ background: 'transparent' }}>+</button>
                </div>
                <button className="btn-atc" onClick={addToCart} style={{ flex: 1, minWidth: '160px', height: '44px', fontSize: '0.9rem' }}>
                  + Ajouter au panier
                </button>
              </div>
            </div>

            {/* Buy Now */}
            <div style={{ marginBottom: '2rem' }}>
              <button className="btn-buy" onClick={() => { addToCart(); router.push('/checkout'); }}>
                Acheter maintenant
              </button>
            </div>

            {/* Meta */}
            <div className="product-meta">
              <div className="meta-row">
                <span>Stock:</span>
                <strong>{product.stock > 0 ? `En stock (${product.stock})` : 'Rupture de stock'}</strong>
              </div>
              <div className="meta-row"><span>Livraison:</span> <strong>24-48h</strong> partout au Maroc</div>
              <div className="meta-row"><span>Retour:</span> <strong>7 jours</strong> satisfait ou remboursé</div>
              <div className="meta-row"><span>Paiement:</span> <strong>Sécurisé</strong> – CMI / Virement / Cash</div>
            </div>
          </div>

        </div>

        {/* TABS: Description, Reviews */}
        <div className="tabs-section">
          <div className="tab-nav">
            <button 
              className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`} 
              onClick={() => setActiveTab('desc')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} 
              onClick={() => setActiveTab('reviews')}
            >
              Avis clients
            </button>
          </div>
          
          {activeTab === 'desc' && (
            <div className="tab-pane active" id="tabDesc">
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : (
                <p>Aucune description détaillée disponible pour cet ouvrage.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tab-pane active" id="tabReviews">

              {/* Reviews list */}
              {liveReviews.length === 0 && !submitted && (
                <p style={{ color: 'var(--text2)', marginBottom: '1.5rem' }}>
                  Aucun avis pour ce produit. Soyez le premier à partager votre expérience !
                </p>
              )}
              {liveReviews.map((rev) => (
                <div key={rev.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{rev.name}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>{rev.date}</span>
                  </div>
                  <div style={{ color: 'var(--gold)', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                  <p style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{rev.comment}</p>
                </div>
              ))}

              {/* Add review button */}
              {!showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  style={{
                    padding: '0.65rem 1.4rem',
                    background: 'linear-gradient(135deg, #e6e6e6 0%, #ffffff 50%, #ececec 100%)',
                    color: '#1a1a1a', border: '1px solid #d0d0d0',
                    borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem',
                    cursor: 'pointer', transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(230,200,0,0.5)'
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#c8a400'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#d0d0d0'
                  }}
                >
                  ✍️ Écrire un avis
                </button>
              )}

              {/* Review form */}
              {showReviewForm && (
                <div style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '1.25rem', marginTop: '1rem'
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Votre avis</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text2)', display: 'block', marginBottom: '0.3rem' }}>Votre nom</label>
                      <input
                        style={{
                          width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px',
                          border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)',
                          fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box'
                        }}
                        placeholder="Ex: Youssef M."
                        value={reviewForm.name}
                        onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text2)', display: 'block', marginBottom: '0.3rem' }}>Note</label>
                      <select
                        style={{
                          width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px',
                          border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)',
                          fontSize: '0.88rem', outline: 'none', cursor: 'pointer'
                        }}
                        value={reviewForm.rating}
                        onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))}
                      >
                        {[5, 4, 3, 2, 1].map(n => (
                          <option key={n} value={n}>{'★'.repeat(n)} {n}/5</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text2)', display: 'block', marginBottom: '0.3rem' }}>Commentaire</label>
                    <textarea
                      rows={3}
                      style={{
                        width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px',
                        border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)',
                        fontSize: '0.88rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box'
                      }}
                      placeholder="Partagez votre expérience avec ce produit…"
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      disabled={submitting || !reviewForm.name.trim() || !reviewForm.comment.trim()}
                      onClick={submitReview}
                      style={{
                        padding: '0.6rem 1.25rem',
                        background: 'var(--primary)', color: '#fff',
                        border: 'none', borderRadius: '8px', fontWeight: 700,
                        fontSize: '0.88rem', cursor: 'pointer',
                        opacity: submitting ? 0.7 : 1
                      }}
                    >
                      {submitting ? 'Envoi…' : 'Publier'}
                    </button>
                    <button
                      onClick={() => { setShowReviewForm(false); setReviewForm({ name: '', rating: 5, comment: '' }) }}
                      style={{
                        padding: '0.6rem 1rem', background: 'transparent',
                        border: '1px solid var(--border)', borderRadius: '8px',
                        fontSize: '0.88rem', cursor: 'pointer', color: 'var(--text2)'
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="related-wrap">
            <div className="related-inner">
              <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <div className="section-tag">Vous pourriez aimer</div>
                <h2 className="section-title">Produits similaires</h2>
              </div>
              <div className="products-grid">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p as any} />
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
