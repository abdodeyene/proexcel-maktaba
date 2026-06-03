'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { useLang } from '@/components/LangContext'
import { formatMoroccanPrice } from '@/lib/format'
import { motion, AnimatePresence } from 'framer-motion'
import RecentlyViewed from '@/components/RecentlyViewed'
import { 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Star, 
  ChevronDown, 
  Plus, 
  Minus, 
  Heart, 
  Share2, 
  CheckCircle2,
  Package,
  Clock,
  ArrowRight,
  ShoppingCart,
  Zap
} from '@/components/LucideIcons'

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
  titleAr?: string | null
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
  descriptionAr?: string | null
  variants?: string[] | any
  media?: unknown | null
  reviews?: unknown | null
}

export default function ProductDetailClient({
  product,
  relatedProducts = [],
  settings = {}
}: {
  product: Product
  relatedProducts: Product[]
  settings: Record<string, string>
}) {
  const router = useRouter()
  const { lang } = useLang()

  // Format variants
  const parsedVariants = Array.isArray(product.variants)
    ? product.variants
    : typeof product.variants === 'string'
      ? JSON.parse(product.variants)
      : ['Standard', 'Pack Premium', 'Pack Éco']

  const [selectedVariant, setSelectedVariant] = useState(parsedVariants[0] || 'Standard')
  const [hoverVariant, setHoverVariant] = useState<string | null>(null)
  const sliderTarget = hoverVariant ?? selectedVariant

  const pillContainerRef = useRef<HTMLDivElement>(null)
  const pillBtnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [sliderBox, setSliderBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null)

  useLayoutEffect(() => {
    const idx = parsedVariants.indexOf(sliderTarget)
    const btn = pillBtnRefs.current[idx]
    const container = pillContainerRef.current
    if (!btn || !container) return
    const br = btn.getBoundingClientRect()
    const cr = container.getBoundingClientRect()
    setSliderBox({ left: br.left - cr.left, top: br.top - cr.top, width: br.width, height: br.height })
  }, [sliderTarget, parsedVariants])

  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [openAcc, setOpenAcc] = useState<string | null>('desc')
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

  const isAr = lang === 'ar'
  const displayTitle = isAr && product.titleAr ? product.titleAr : product.title
  const displayDesc = isAr && product.descriptionAr ? product.descriptionAr : product.description
  const savings = product.compareAtPrice ? product.compareAtPrice - product.price : 0
  const disc = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0

  const ui = {
    fr: {
      home: 'Accueil', format: 'Choisir le Format', qty: 'Quantité',
      atc: 'Ajouter au panier', buyNow: 'Acheter maintenant',
      inStock: `En stock (${product.stock} unités)`, outStock: 'Rupture de stock',
      delivery: 'Livraison Express', deliveryVal: '24-48h partout au Maroc',
      returns: 'Retours Faciles', returnsVal: '7 jours pour changer d’avis',
      payment: 'Paiement Sécurisé', paymentVal: 'CMI / Virement / Cash',
      desc: 'Description du Produit', reviews: 'Avis Clients',
      addInfo: 'Informations Complémentaires', faq: 'Questions Fréquentes',
      noDesc: 'Aucune description détaillée disponible pour le moment.',
      noReviews: 'Aucun avis pour ce produit. Soyez le premier à partager votre expérience !',
      writeReview: 'Laisser un avis', yourReview: 'Votre expérience',
      yourName: 'Votre nom complet', rating: 'Votre note', comment: 'Votre message',
      namePlaceholder: 'Ex: Amine B.',
      commentPlaceholder: 'Qu’avez-vous pensé de ce produit ?',
      publish: 'Publier mon avis', publishing: 'Publication...', cancel: 'Fermer',
      related: 'Complétez votre collection', relatedTag: 'Sélection ProExcel',
      savings: (n: number) => `Économisez ${formatMoroccanPrice(n)}`,
      reviews_count: (n: number) => `${n} avis vérifiés`,
      freeShipping: 'Livraison Gratuite dès 499 DH d\'achat',
      secureCheckout: 'Transactions sécurisées SSL',
      share: 'Partager', wishlist: 'Favoris', sku: 'Référence', categories: 'Catégories', stock: 'Disponibilité'
    },
    ar: {
      home: 'الرئيسية', format: 'اختر النوع', qty: 'الكمية',
      atc: 'إضافة إلى السلة', buyNow: 'اشتري الآن',
      inStock: `متوفر (${product.stock} قطع)`, outStock: 'نفد المخزون',
      delivery: 'توصيل سريع', deliveryVal: '24-48 ساعة في جميع أنحاء المغرب',
      returns: 'إرجاع سهل', returnsVal: '7 أيام لتغيير رأيك',
      payment: 'دفع آمن', paymentVal: 'بطاقة / تحويل / نقداً عند الاستلام',
      desc: 'وصف المنتج', reviews: 'آراء العملاء',
      addInfo: 'معلومات إضافية', faq: 'الأسئلة المتكررة',
      noDesc: 'لا يوجد وصف مفصل متاح حالياً.',
      noReviews: 'لا توجد آراء بعد. كن أول من يشارك تجربته!',
      writeReview: 'اترك رأياً', yourReview: 'تجربتك',
      yourName: 'اسمك الكامل', rating: 'تقييمك', comment: 'تعليقك',
      namePlaceholder: 'مثال: أمين ب.',
      commentPlaceholder: 'ما رأيك في هذا المنتج؟',
      publish: 'نشر رأيي', publishing: 'جارٍ النشر...', cancel: 'إغلاق',
      related: 'أكمل مجموعتك', relatedTag: 'اختيار برو إكسيل',
      savings: (n: number) => `أنت توفر ${formatMoroccanPrice(n)}`,
      reviews_count: (n: number) => `${n} تقييمات موثقة`,
      freeShipping: 'توصيل مجاني ابتداءً من 499 درهم',
      secureCheckout: 'معاملات آمنة SSL',
      share: 'مشاركة', wishlist: 'المفضلة', sku: 'المرجع', categories: 'الفئات', stock: 'التوفر'
    }
  }
  const T = ui[lang as keyof typeof ui] ?? ui.fr

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
        emoji: product.emoji || '📚',
        image: mediaImages.length > 0 ? mediaImages[0] : null
      })
    }
    localStorage.setItem('proexcel_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
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
        setLiveReviews(prev => [newRev, ...prev])
        setSubmitted(true)
        setShowReviewForm(false)
        setReviewForm({ name: '', rating: 5, comment: '' })
      }
    } catch { /* silent */ }
    setSubmitting(false)
  }

  // Review statistics
  const avgRating = product.rating || 5
  const totalReviews = liveReviews.length || product.reviewCount || 0
  const ratingCounts = [
    { stars: 5, count: Math.ceil(totalReviews * 0.8) },
    { stars: 4, count: Math.ceil(totalReviews * 0.15) },
    { stars: 3, count: Math.ceil(totalReviews * 0.05) },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ]

  return (
    <div className="product-page-container">
      {/* Premium Breadcrumb */}
      <nav className="breadcrumb-lux" style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)', marginBottom: '3rem' }}>
        <Link href="/" className="hover-primary transition-all">{T.home}</Link>
        <span>/</span>
        <span className="capitalize">{product.category || 'Shop'}</span>
        <span>/</span>
        <span style={{ color: 'var(--text)' }}>{displayTitle}</span>
      </nav>

      <div className="product-main-grid">
        {/* GALLERY SIDE */}
        <div className="gallery-wrap">
          <div className="adaptive-gallery-container">
            {/* Adaptive Glow (Dark Mode only) */}
            <div className="adaptive-glow-wrapper">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`glow-${activeImg}`}
                  src={mediaImages[activeImg] || '/placeholder.jpg'}
                  className="adaptive-glow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  alt=""
                  aria-hidden="true"
                />
              </AnimatePresence>
            </div>

            {/* Main Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={`main-${activeImg}`}
                src={mediaImages[activeImg] || '/placeholder.jpg'}
                className="adaptive-main-img"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                alt={displayTitle}
              />
            </AnimatePresence>
            
            {product.isPromo && <div className="product-badge-premium promo" style={{ top: '1rem', left: '1rem', zIndex: 10 }}>PROMO</div>}
          </div>

          <div className="thumbs-horizontal">
            {mediaImages.map((url, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`thumb-card-adaptive ${activeImg === i ? 'active' : ''}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={url} alt="" className="thumb-img-adaptive" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* INFO SIDE */}
        <div className="info-sticky-wrap">
          <div className="product-meta-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)' }}>
              {product.category || 'PREMIUM'}
            </span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="icon-btn-lux" title={T.share}><Share2 size={18} /></button>
              <button className="icon-btn-lux" title={T.wishlist}><Heart size={18} /></button>
            </div>
          </div>

          <h1 className="product-title-lux">{displayTitle}</h1>

          <div className="rating-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div className="stars" style={{ color: 'var(--gold)', display: 'flex', gap: '2px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < Math.round(avgRating) ? "var(--gold)" : "none"} />)}
            </div>
            <span style={{ fontWeight: 800, color: 'var(--text)' }}>{avgRating.toFixed(1)}</span>
            <span style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>({T.reviews_count(totalReviews)})</span>
          </div>

          <div className="price-box-lux">
            <span className="current-price-lux">{formatMoroccanPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="old-price-lux">{formatMoroccanPrice(product.compareAtPrice)}</span>
                <span className="discount-tag-lux">-{disc}%</span>
              </>
            )}
          </div>

          {savings > 0 && (
            <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--green)', fontWeight: 700 }}>
              <Zap size={16} /> {T.savings(savings)}
            </div>
          )}

          {/* Variants — sliding pill selector */}
          {parsedVariants.length > 0 && (
            <div className="variant-selector">
              <div className="v-title">{T.format}</div>
              <div
                ref={pillContainerRef}
                className="pill-grid"
                onMouseLeave={() => setHoverVariant(null)}
              >
                {sliderBox && (
                  <div
                    className="pill-slider"
                    style={{ left: sliderBox.left, top: sliderBox.top, width: sliderBox.width, height: sliderBox.height }}
                  />
                )}
                {parsedVariants.map((v: string, i: number) => (
                  <button
                    key={v}
                    ref={el => { pillBtnRefs.current[i] = el }}
                    className={`pill-btn${selectedVariant === v ? ' pill-selected' : ''}${sliderTarget === v ? ' pill-lit' : ''}`}
                    onClick={() => setSelectedVariant(v)}
                    onMouseEnter={() => setHoverVariant(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Buy Actions */}
          <div className="buy-actions-wrap" style={{ marginBottom: '3rem' }}>
            <div className="v-title">{T.qty}</div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="qty-wrap" style={{ height: '64px', border: '2.5px solid var(--border)', borderRadius: '20px' }}>
                <button className="q-btn" onClick={() => setQty(p => Math.max(1, p - 1))}><Minus size={18} /></button>
                <input className="q-input" value={qty} readOnly style={{ fontSize: '1.2rem' }} />
                <button className="q-btn" onClick={() => setQty(p => p + 1)}><Plus size={18} /></button>
              </div>
              <button className="btn-atc-lux" onClick={addToCart} style={{ flex: 1 }}>{T.atc}</button>
            </div>
            <button className="btn-buy-now-lux" onClick={() => { addToCart(); router.push('/checkout'); }} style={{ width: '100%', marginTop: '1rem' }}>
              {T.buyNow}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="trust-cards-grid">
            <div className="trust-card-lux">
              <div className="tc-icon-wrap"><Truck /></div>
              <div className="tc-info">
                <div className="tc-title">{T.delivery}</div>
                <div className="tc-sub">{T.deliveryVal}</div>
              </div>
            </div>
            <div className="trust-card-lux">
              <div className="tc-icon-wrap"><RotateCcw /></div>
              <div className="tc-info">
                <div className="tc-title">{T.returns}</div>
                <div className="tc-sub">{T.returnsVal}</div>
              </div>
            </div>
            <div className="trust-card-lux">
              <div className="tc-icon-wrap"><ShieldCheck /></div>
              <div className="tc-info">
                <div className="tc-title">{T.payment}</div>
                <div className="tc-sub">{T.paymentVal}</div>
              </div>
            </div>
          </div>

          {/* Additional Meta */}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'grid', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text2)', fontWeight: 600 }}>{T.sku}</span>
              <span style={{ fontWeight: 800 }}>#PE-{product.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text2)', fontWeight: 600 }}>{T.categories}</span>
              <span style={{ fontWeight: 800 }}>{product.category || 'ProExcel'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text2)', fontWeight: 600 }}>{T.stock}</span>
              <span style={{ color: product.stock > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 800 }}>
                {product.stock > 0 ? T.inStock : T.outStock}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED CONTENT SECTIONS */}
      <div className="content-sections-lux">
        {[
          { id: 'desc', title: T.desc, content: displayDesc },
          { id: 'info', title: T.addInfo, content: isAr ? 'معلومات إضافية عن جودة ومصدر كتبنا...' : 'Détails supplémentaires sur l’origine et la qualité de nos ouvrages.' },
          { id: 'faq', title: T.faq, content: isAr ? 'أسئلة حول التوصيل، الإرجاع، وطرق الدفع...' : 'Réponses aux questions courantes sur la livraison, les retours et les moyens de paiement.' },
        ].map((sec) => (
          <div key={sec.id} className="accordion-lux">
            <button className="acc-trigger" onClick={() => setOpenAcc(openAcc === sec.id ? null : sec.id)}>
              <span>{sec.title}</span>
              <motion.div animate={{ rotate: openAcc === sec.id ? 180 : 0 }}><ChevronDown size={32} /></motion.div>
            </button>
            <AnimatePresence>
              {openAcc === sec.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="acc-content"
                  style={{ overflow: 'hidden' }}
                >
                  <div dangerouslySetInnerHTML={{ __html: sec.content || T.noDesc }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* REVIEWS SECTION */}
      <section className="reviews-lux" style={{ marginTop: '10rem' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '4rem', textAlign: 'center' }}>{T.reviews}</h2>
        
        <div className="review-summary-lux">
          <div className="rating-score-box">
            <div className="big-rating-num">{avgRating.toFixed(1)}</div>
            <div className="stars" style={{ color: 'var(--gold)', justifyContent: 'center', display: 'flex', gap: '4px', marginBottom: '1rem' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={24} fill={i < Math.round(avgRating) ? "var(--gold)" : "none"} />)}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text2)', fontWeight: 600 }}>{T.reviews_count(totalReviews)}</div>
          </div>
          
          <div className="progress-grid">
            {ratingCounts.map((rc, i) => (
              <div key={i} className="progress-row">
                <span style={{ fontSize: '0.85rem', fontWeight: 800, width: '30px' }}>{rc.stars}★</span>
                <div className="p-bar-bg">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: totalReviews > 0 ? `${(rc.count / totalReviews) * 100}%` : '0%' }}
                    className="p-bar-fill" 
                  />
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text2)', width: '40px', textAlign: 'right' }}>{rc.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Cards */}
        <div className="reviews-grid-lux" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {liveReviews.map((rev) => (
            <motion.div 
              key={rev.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel" 
              style={{ padding: '2.5rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800 }}>{rev.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--green)', fontWeight: 800 }}>
                      <CheckCircle2 size={12} /> VERIFIED BUYER
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{rev.date}</span>
              </div>
              <div className="stars" style={{ color: 'var(--gold)', display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < rev.rating ? "var(--gold)" : "none"} />)}
              </div>
              <p style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>{rev.comment}</p>
            </motion.div>
          ))}
        </div>

        {!showReviewForm ? (
          <div style={{ textAlign: 'center' }}>
            <button className="btn-buy-now-lux" style={{ width: 'auto', padding: '0 3rem' }} onClick={() => setShowReviewForm(true)}>
              {T.writeReview}
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }}>{T.yourReview}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>{T.yourName}</label>
                <input
                  className="checkout-input"
                  style={{ background: 'var(--bg)', borderRadius: '14px' }}
                  placeholder={T.namePlaceholder}
                  value={reviewForm.name}
                  onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>{T.rating}</label>
                <select
                  className="checkout-input"
                  style={{ background: 'var(--bg)', borderRadius: '14px' }}
                  value={reviewForm.rating}
                  onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))}
                >
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n}/5)</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>{T.comment}</label>
              <textarea
                rows={4}
                className="checkout-input"
                style={{ background: 'var(--bg)', borderRadius: '14px', resize: 'none', paddingTop: '1rem' }}
                placeholder={T.commentPlaceholder}
                value={reviewForm.comment}
                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-buy-now-lux" style={{ flex: 1 }} onClick={submitReview} disabled={submitting}>
                {submitting ? T.publishing : T.publish}
              </button>
              <button className="btn-atc-lux" style={{ flex: 1 }} onClick={() => setShowReviewForm(false)}>{T.cancel}</button>
            </div>
          </motion.div>
        )}
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '10rem' }} className="bg-white dark:bg-[#0a0a0a]">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{T.relatedTag}</div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900 }}>{T.related}</h2>
            </div>
            <Link href="/best-offers" className="icon-btn-lux" style={{ width: 'auto', borderRadius: '100px', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              VOIR TOUT <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed currentId={product.id} />

      {/* MOBILE STICKY BAR */}
      <div className="mobile-action-bar">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>{formatMoroccanPrice(product.price)}</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>{selectedVariant}</div>
        </div>
        <button onClick={addToCart} className="icon-btn-lux" style={{ width: '56px', height: '56px', borderRadius: '16px' }}>
          <ShoppingCart size={22} />
        </button>
        <button onClick={() => { addToCart(); router.push('/checkout'); }} className="btn-buy-now-lux" style={{ flex: 2, height: '56px', fontSize: '0.95rem', borderRadius: '16px', boxShadow: 'none' }}>
          {T.buyNow}
        </button>
      </div>

      <style jsx>{`
        .breadcrumb-lux a:hover { color: var(--primary); }
        .icon-btn-lux {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: var(--text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .icon-btn-lux:hover {
          background: var(--primary);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(var(--primary-rgb), 0.2);
        }
        .transition-all { transition: all 0.3s ease; }
        .hover-primary:hover { color: var(--primary); }

        /* Adaptive Gallery Styles */
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
        }
        
        [data-theme="light"] .adaptive-glow {
          display: none; /* Disable glow in light mode, rely on shadow */
        }
        
        .adaptive-main-img {
          position: relative;
          z-index: 2;
          width: 100%;
          max-height: 600px;
          object-fit: contain;
          border-radius: 20px;
          cursor: zoom-in;
          transition: transform 0.4s ease;
        }
        
        [data-theme="light"] .adaptive-main-img {
          filter: drop-shadow(0 25px 45px rgba(0,0,0,0.12));
        }
        
        .adaptive-main-img:hover {
          transform: scale(1.03);
        }
        
        /* Thumbnails Styling */
        .thumb-card-adaptive {
          width: 90px;
          height: 110px;
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.25s ease;
          background: transparent;
          padding: 4px;
        }
        
        .thumb-card-adaptive.active {
          border-color: var(--primary);
          background: rgba(var(--primary-rgb), 0.05);
        }
        
        .thumb-img-adaptive {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}
