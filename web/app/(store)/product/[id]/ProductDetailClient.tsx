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
      freeShipping: 'Livraison gratuite dès 499 DH',
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
    <div className="product-page-wrapper" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Breadcrumb */}
      <nav className="bo-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{T.home}</Link>
        <span className="bc-sep">/</span>
        <Link href={`/best-offers?cat=${encodeURIComponent(product.category || '')}`} className="bc-cat">
          {product.category || 'Shop'}
        </Link>
        <span className="bc-sep">/</span>
        <span className="bc-current">{displayTitle}</span>
      </nav>

      {/* Hero Product Area */}
      <div className="bo-product-hero">
        {/* GALLERY COLUMN (LEFT) */}
        <div className="bo-gallery-col">
          <div className="bo-main-image-container">
            {/* Ambient Background Glow matching the main image (dark mode only) */}
            <div className="bo-image-glow-wrap" aria-hidden="true">
              <img
                src={mediaImages[activeImg] || '/placeholder.jpg'}
                alt=""
                className="bo-image-glow"
              />
            </div>

            <div className="bo-main-image-inner">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={mediaImages[activeImg] || '/placeholder.jpg'}
                  alt={displayTitle || 'Product Image'}
                  className="bo-main-image"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </AnimatePresence>

              {product.isPromo && (
                <div className="bo-gallery-badge">
                  PROMO
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {mediaImages.length > 1 && (
            <div className="bo-thumbnails-row">
              {mediaImages.map((img, i) => (
                <button
                  key={i}
                  className={`bo-thumb-btn ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={img} alt="" className="bo-thumb-img" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO & CONTROLS COLUMN (RIGHT) */}
        <div className="bo-info-col">
          {/* Category & Sharing */}
          <div className="bo-info-meta-top">
            <span className="bo-category-badge">
              {product.category || 'PREMIUM'}
            </span>
            <div className="bo-meta-actions">
              <button className="bo-action-btn" title={T.share}>
                <Share2 size={16} />
              </button>
              <button className="bo-action-btn" title={T.wishlist}>
                <Heart size={16} />
              </button>
            </div>
          </div>

          {/* Product Title */}
          <h1 className="bo-product-title">{displayTitle}</h1>

          {/* Rating, Reviews & Sales Counter */}
          <div className="bo-rating-popularity-row">
            <div className="bo-rating-group">
              <div className="bo-stars-wrap">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(avgRating) ? "var(--gold)" : "none"}
                    stroke="var(--gold)"
                    strokeWidth={2}
                  />
                ))}
              </div>
              <span className="bo-rating-avg">{avgRating.toFixed(1)}</span>
              <span className="bo-reviews-count">({T.reviews_count(totalReviews)})</span>
            </div>
            
            {/* flame popularity badge */}
            <div className="bo-popularity-badge">
              <span className="fire-emoji">🔥</span>
              <span>21 {isAr ? 'تم بيعها' : 'vendus'}</span>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bo-price-container">
            <div className="bo-price-main">
              <span className="bo-price-value">{product.price}</span>
              <span className="bo-price-currency">DH</span>
            </div>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <div className="bo-price-discount-wrap">
                <span className="bo-price-old">{product.compareAtPrice} DH</span>
                <span className="bo-discount-percent">-{disc}%</span>
              </div>
            )}
          </div>

          {/* Savings Highlight */}
          {savings > 0 && (
            <div className="bo-savings-banner">
              <Zap size={14} className="zap-icon" />
              <span>{T.savings(savings)}</span>
            </div>
          )}

          {/* Stock Indicator */}
          <div className="bo-stock-indicator">
            <span className={`bo-stock-dot ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`} />
            <span className="bo-stock-text">
              {product.stock > 0 ? T.inStock : T.outStock}
            </span>
          </div>

          {/* Variant / Format Selector */}
          {parsedVariants.length > 0 && (
            <div className="bo-variant-section">
              <label className="bo-section-label">{T.format}</label>
              <div ref={pillContainerRef} className="bo-variant-pill-container">
                {sliderBox && (
                  <div
                    className="bo-pill-slider-active"
                    style={{
                      left: sliderBox.left,
                      top: sliderBox.top,
                      width: sliderBox.width,
                      height: sliderBox.height,
                    }}
                  />
                )}
                {parsedVariants.map((v: string, i: number) => (
                  <button
                    key={v}
                    ref={el => { pillBtnRefs.current[i] = el }}
                    className={`bo-variant-pill-btn ${selectedVariant === v ? 'selected' : ''}`}
                    onClick={() => setSelectedVariant(v)}
                    onMouseEnter={() => setHoverVariant(v)}
                    onMouseLeave={() => setHoverVariant(null)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Purchase System (Quantity + Action Buttons) */}
          <div className="bo-purchase-system">
            <label className="bo-section-label">{T.qty}</label>
            <div className="bo-purchase-actions-row">
              {/* Quantity Selector */}
              <div className="bo-qty-selector">
                <button
                  className="bo-qty-btn"
                  onClick={() => setQty(p => Math.max(1, p - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="bo-qty-value">{qty}</span>
                <button
                  className="bo-qty-btn"
                  onClick={() => setQty(p => p + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add To Cart (Blue/Purple Accent) */}
              <button className="bo-btn-add-to-cart" onClick={addToCart}>
                <ShoppingCart size={18} />
                <span>{T.atc}</span>
              </button>
            </div>

            {/* Buy Now (High Conversion Orange/Red Accent) */}
            <button
              className="bo-btn-buy-now"
              onClick={() => { addToCart(); router.push('/checkout'); }}
            >
              <Zap size={18} />
              <span>{T.buyNow}</span>
            </button>
          </div>

          {/* Product Reference */}
          <div className="bo-product-reference">
            <span>{T.sku}:</span>
            <span className="ref-val">PE-{product.id}</span>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="bo-benefits-section">
        <div className="bo-benefits-grid">
          <div className="bo-benefit-card">
            <span className="benefit-icon">🚚</span>
            <div className="benefit-content">
              <h3 className="benefit-title">{T.delivery}</h3>
              <p className="benefit-desc">{T.deliveryVal}</p>
            </div>
          </div>
          <div className="bo-benefit-card">
            <span className="benefit-icon">↩</span>
            <div className="benefit-content">
              <h3 className="benefit-title">{T.returns}</h3>
              <p className="benefit-desc">{T.returnsVal}</p>
            </div>
          </div>
          <div className="bo-benefit-card">
            <span className="benefit-icon">💳</span>
            <div className="benefit-content">
              <h3 className="benefit-title">{T.payment}</h3>
              <p className="benefit-desc">{T.paymentVal}</p>
            </div>
          </div>
          <div className="bo-benefit-card">
            <span className="benefit-icon">📦</span>
            <div className="benefit-content">
              <h3 className="benefit-title">{isAr ? 'شكل الشحن' : 'Format d\'envoi'}</h3>
              <p className="benefit-desc">{isAr ? 'شحن قياسي / سريع' : 'Standard / Express'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description Section */}
      <div className="bo-details-accordion-section">
        {[
          { id: 'desc', title: T.desc, content: displayDesc || T.noDesc },
          { id: 'info', title: T.addInfo, content: isAr ? 'معلومات إضافية عن جودة ومصدر كتبنا المدرسية والأدوات المكتبية الموثوقة.' : 'Détails supplémentaires sur l’origine et la qualité de nos fournitures et ouvrages.' },
          { id: 'faq', title: T.faq, content: isAr ? 'أجوبة على الأسئلة الشائعة حول طرق الدفع عند الاستلام، سرعة التوصيل في المغرب وإرجاع السلع.' : 'Réponses aux questions courantes sur la livraison rapide, les retours et les transactions sécurisées.' },
        ].map((sec) => {
          const isOpen = openAcc === sec.id
          return (
            <div key={sec.id} className="bo-accordion-item">
              <button
                className="bo-accordion-trigger"
                onClick={() => setOpenAcc(isOpen ? null : sec.id)}
                aria-expanded={isOpen}
              >
                <span>{sec.title}</span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                  }}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="bo-accordion-content"
                  >
                    <div className="accordion-text-wrapper" dangerouslySetInnerHTML={{ __html: sec.content }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Reviews Section */}
      <section className="bo-reviews-section">
        <h2 className="bo-section-heading">{T.reviews}</h2>

        <div className="bo-reviews-summary-row">
          {/* Average Rating */}
          <div className="bo-reviews-summary-left">
            <span className="bo-big-rating">{avgRating.toFixed(1)}</span>
            <div className="bo-stars-wrap center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < Math.round(avgRating) ? "var(--gold)" : "none"}
                  stroke="var(--gold)"
                  strokeWidth={2}
                />
              ))}
            </div>
            <span className="bo-reviews-count-sub">{T.reviews_count(totalReviews)}</span>
          </div>

          {/* Star Distribution */}
          <div className="bo-reviews-summary-right">
            {ratingCounts.map((rc, i) => {
              const pct = totalReviews > 0 ? (rc.count / totalReviews) * 100 : 0
              return (
                <div key={i} className="bo-distribution-row">
                  <span className="dist-stars">{rc.stars} ★</span>
                  <div className="dist-bar-bg">
                    <div className="dist-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="dist-count">{rc.count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Reviews List */}
        {liveReviews.length > 0 ? (
          <div className="bo-reviews-list-grid">
            {liveReviews.map((rev) => (
              <div key={rev.id} className="bo-review-card">
                <div className="review-card-header">
                  <div className="reviewer-avatar">
                    {rev.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="reviewer-info">
                    <span className="reviewer-name">{rev.name}</span>
                    <span className="reviewer-badge">
                      <CheckCircle2 size={11} className="badge-icon" />
                      <span>{isAr ? 'مشتري مؤكد' : 'ACHETEUR VÉRIFIÉ'}</span>
                    </span>
                  </div>
                  <span className="review-date">{rev.date}</span>
                </div>
                <div className="review-card-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      fill={i < rev.rating ? "var(--gold)" : "none"}
                      stroke="var(--gold)"
                    />
                  ))}
                </div>
                <p className="review-card-comment">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bo-reviews-empty-state">
            <span className="empty-icon">✍️</span>
            <p className="empty-text">{T.noReviews}</p>
          </div>
        )}

        {/* Write a review toggle */}
        {!showReviewForm ? (
          <div className="bo-write-review-actions">
            <button className="bo-btn-write-review" onClick={() => setShowReviewForm(true)}>
              {T.writeReview}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bo-write-review-form-panel"
          >
            <h3 className="form-panel-title">{T.yourReview}</h3>
            <div className="form-panel-grid">
              <div className="form-group">
                <label>{T.yourName}</label>
                <input
                  type="text"
                  placeholder={T.namePlaceholder}
                  value={reviewForm.name}
                  onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                  className="bo-form-input"
                />
              </div>
              <div className="form-group">
                <label>{T.rating}</label>
                <select
                  value={reviewForm.rating}
                  onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))}
                  className="bo-form-input select"
                >
                  {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>
                      {'★'.repeat(n) + '☆'.repeat(5 - n)} ({n}/5)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group area">
              <label>{T.comment}</label>
              <textarea
                rows={4}
                placeholder={T.commentPlaceholder}
                value={reviewForm.comment}
                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                className="bo-form-textarea"
              />
            </div>
            <div className="form-panel-actions">
              <button
                className="bo-form-submit-btn"
                onClick={submitReview}
                disabled={submitting}
              >
                {submitting ? T.publishing : T.publish}
              </button>
              <button
                className="bo-form-cancel-btn"
                onClick={() => setShowReviewForm(false)}
              >
                {T.cancel}
              </button>
            </div>
          </motion.div>
        )}
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="bo-related-products-section">
          <div className="bo-related-header">
            <div className="header-titles">
              <span className="subtitle">{T.relatedTag}</span>
              <h2 className="title">{T.related}</h2>
            </div>
            <Link href="/best-offers" className="bo-view-all-btn">
              <span>{isAr ? 'عرض الكل' : 'VOIR TOUT'}</span>
              <ArrowRight size={14} className="arrow-icon" />
            </Link>
          </div>
          <div className="bo-related-grid">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p as any} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* RECENTLY VIEWED PRODUCTS */}
      <RecentlyViewed currentId={product.id} />

      {/* MOBILE STICKY PURCHASE BAR */}
      <div className="bo-mobile-sticky-action-bar">
        <div className="sticky-price-info">
          <span className="sticky-price">{product.price} DH</span>
          <span className="sticky-variant">{selectedVariant}</span>
        </div>
        <button onClick={addToCart} className="sticky-cart-btn" aria-label="Add to cart">
          <ShoppingCart size={20} />
        </button>
        <button
          onClick={() => { addToCart(); router.push('/checkout'); }}
          className="sticky-buy-btn"
        >
          {T.buyNow}
        </button>
      </div>

      <style jsx>{`
        /* Reset and main styles */
        .product-page-wrapper {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 6rem;
          color: #f8fafc;
        }

        /* Breadcrumb */
        .bo-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }
        .bo-breadcrumb a {
          text-decoration: none;
          color: #94a3b8;
          transition: color 0.15s ease;
        }
        .bo-breadcrumb a:hover {
          color: #e11d2e;
        }
        .bc-sep {
          color: #475569;
        }
        .bc-current {
          color: #f8fafc;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 250px;
        }

        /* Two Column Hero Grid */
        .bo-product-hero {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: start;
          margin-bottom: 4rem;
        }
        @media (min-width: 1024px) {
          .bo-product-hero {
            grid-template-columns: 53% 47%;
          }
        }

        /* GALLERY COLUMN (LEFT) */
        .bo-gallery-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .bo-main-image-container {
          position: relative;
          background: rgba(30, 41, 59, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          aspect-ratio: 1 / 1;
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
          transition: border-color 0.3s ease;
        }
        .bo-main-image-container:hover {
          border-color: rgba(225, 29, 46, 0.25);
        }
        .bo-image-glow-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.35;
          pointer-events: none;
          z-index: 1;
        }
        .bo-image-glow {
          width: 85%;
          height: 85%;
          object-fit: contain;
          filter: blur(60px) saturate(160%);
        }
        .bo-main-image-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bo-main-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .bo-main-image:hover {
          transform: scale(1.05);
        }
        .bo-gallery-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(135deg, #e11d2e 0%, #b91c1c 100%);
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 8px;
          letter-spacing: 1px;
          box-shadow: 0 4px 12px rgba(225, 29, 46, 0.3);
          z-index: 10;
        }
        [dir="rtl"] .bo-gallery-badge {
          left: auto;
          right: 1rem;
        }

        /* Thumbnails Strip */
        .bo-thumbnails-row {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
          scrollbar-width: thin;
        }
        .bo-thumb-btn {
          width: 76px;
          height: 76px;
          border-radius: 12px;
          border: 1.5px solid rgba(255, 255, 255, 0.05);
          background: rgba(30, 41, 59, 0.15);
          cursor: pointer;
          padding: 6px;
          flex-shrink: 0;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bo-thumb-btn:hover {
          border-color: rgba(225, 29, 46, 0.3);
          transform: translateY(-2px);
        }
        .bo-thumb-btn.active {
          border-color: #e11d2e;
          background: rgba(225, 29, 46, 0.06);
          box-shadow: 0 0 10px rgba(225, 29, 46, 0.15);
        }
        .bo-thumb-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }

        /* INFO & CONTROLS COLUMN (RIGHT) */
        .bo-info-col {
          display: flex;
          flex-direction: column;
        }
        .bo-info-meta-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .bo-category-badge {
          font-size: 0.75rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.1em;
        }
        .bo-meta-actions {
          display: flex;
          gap: 0.5rem;
        }
        .bo-action-btn {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cbd5e1;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .bo-action-btn:hover {
          background: rgba(225, 29, 46, 0.1);
          border-color: rgba(225, 29, 46, 0.3);
          color: #e11d2e;
          transform: translateY(-1px);
        }

        /* Product Title */
        .bo-product-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.25;
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
          text-align: left;
        }
        [dir="rtl"] .bo-product-title {
          text-align: right;
        }
        @media (min-width: 768px) {
          .bo-product-title {
            font-size: 2.2rem;
          }
        }

        /* Rating & Popularity Badge */
        .bo-rating-popularity-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 1.75rem;
          flex-wrap: wrap;
        }
        .bo-rating-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .bo-stars-wrap {
          display: flex;
          gap: 2px;
        }
        .bo-rating-avg {
          font-size: 0.88rem;
          font-weight: 800;
          color: #ffffff;
        }
        .bo-reviews-count {
          font-size: 0.82rem;
          color: #94a3b8;
          font-weight: 500;
        }
        .bo-popularity-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(249, 115, 22, 0.08);
          border: 1px solid rgba(249, 115, 22, 0.15);
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.76rem;
          font-weight: 700;
          color: #f97316;
        }

        /* Pricing Section */
        .bo-price-container {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .bo-price-main {
          display: flex;
          align-items: baseline;
          color: #e11d2e;
          font-weight: 900;
        }
        .bo-price-value {
          font-size: 2.2rem;
          line-height: 1;
        }
        .bo-price-currency {
          font-size: 1.1rem;
          margin-left: 4px;
        }
        [dir="rtl"] .bo-price-currency {
          margin-left: 0;
          margin-right: 4px;
        }
        .bo-price-discount-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .bo-price-old {
          font-size: 1.15rem;
          color: #64748b;
          text-decoration: line-through;
          font-weight: 500;
        }
        .bo-discount-percent {
          font-size: 0.72rem;
          font-weight: 800;
          background: rgba(225, 29, 46, 0.1);
          color: #e11d2e;
          border: 1px solid rgba(225, 29, 46, 0.15);
          padding: 2px 7px;
          border-radius: 6px;
        }

        /* Savings Banner */
        .bo-savings-banner {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #22c55e;
          font-weight: 700;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }
        .bo-savings-banner :global(.zap-icon) {
          animation: boPulse 1.8s infinite ease-in-out;
        }

        /* Stock Indicator */
        .bo-stock-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2rem;
        }
        .bo-stock-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .bo-stock-dot.in-stock {
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
        }
        .bo-stock-dot.out-of-stock {
          background: #ef4444;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
        }
        .bo-stock-text {
          font-size: 0.82rem;
          font-weight: 700;
          color: #cbd5e1;
        }

        /* Variant/Format Selector */
        .bo-variant-section {
          margin-bottom: 2rem;
          text-align: left;
        }
        [dir="rtl"] .bo-variant-section {
          text-align: right;
        }
        .bo-section-label {
          display: block;
          font-size: 0.74rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.65rem;
        }
        .bo-variant-pill-container {
          position: relative;
          display: inline-flex;
          background: rgba(30, 41, 59, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 4px;
          gap: 4px;
        }
        .bo-pill-slider-active {
          position: absolute;
          background: #e11d2e;
          border-radius: 8px;
          box-shadow: 0 3px 10px rgba(225, 29, 46, 0.35);
          transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
        }
        .bo-variant-pill-btn {
          position: relative;
          z-index: 2;
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 8px 18px;
          cursor: pointer;
          border-radius: 8px;
          font-family: inherit;
          transition: color 200ms ease;
        }
        .bo-variant-pill-btn.selected {
          color: #ffffff;
        }

        /* Purchase System */
        .bo-purchase-system {
          background: rgba(30, 41, 59, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 18px;
          padding: 1.25rem;
          margin-bottom: 2rem;
          text-align: left;
        }
        [dir="rtl"] .bo-purchase-system {
          text-align: right;
        }
        .bo-purchase-actions-row {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .bo-qty-selector {
          display: flex;
          align-items: center;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          height: 48px;
          padding: 0 4px;
        }
        .bo-qty-btn {
          background: none;
          border: none;
          color: #94a3b8;
          width: 36px;
          height: 36px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.15s ease;
        }
        .bo-qty-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }
        .bo-qty-value {
          font-size: 0.95rem;
          font-weight: 800;
          color: #ffffff;
          width: 32px;
          text-align: center;
        }

        /* Add to Cart Button (Indigo / Blue Accent) */
        .bo-btn-add-to-cart {
          flex: 1;
          height: 48px;
          background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.2);
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .bo-btn-add-to-cart:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.35);
          filter: brightness(1.05);
        }
        .bo-btn-add-to-cart:active {
          transform: translateY(0.5px);
        }

        /* Buy Now Button (Orange/Red High Conversion Accent) */
        .bo-btn-buy-now {
          width: 100%;
          height: 48px;
          background: linear-gradient(135deg, #e11d2e 0%, #b91c1c 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.92rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(225, 29, 46, 0.3);
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .bo-btn-buy-now:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 22px rgba(225, 29, 46, 0.45);
          filter: brightness(1.05);
        }
        .bo-btn-buy-now:active {
          transform: translateY(0.5px);
        }

        /* Product Reference */
        .bo-product-reference {
          display: flex;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #64748b;
          margin-top: 0.5rem;
          padding: 0 4px;
        }
        .bo-product-reference .ref-val {
          color: #94a3b8;
          font-weight: 700;
        }

        /* Benefits Section */
        .bo-benefits-section {
          margin-bottom: 4rem;
        }
        .bo-benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }
        .bo-benefit-card {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          background: rgba(30, 41, 59, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.03);
          padding: 1.15rem;
          border-radius: 16px;
          transition: border-color 0.2s ease;
        }
        .bo-benefit-card:hover {
          border-color: rgba(225, 29, 46, 0.12);
        }
        .benefit-icon {
          font-size: 1.3rem;
          line-height: 1;
        }
        .benefit-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }
        [dir="rtl"] .benefit-content {
          text-align: right;
        }
        .benefit-title {
          font-size: 0.82rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }
        .benefit-desc {
          font-size: 0.76rem;
          color: #94a3b8;
          font-weight: 500;
          margin: 0;
          line-height: 1.4;
        }

        /* Details Accordion Section */
        .bo-details-accordion-section {
          background: rgba(30, 41, 59, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 5rem;
        }
        .bo-accordion-item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .bo-accordion-item:last-child {
          border-bottom: none;
        }
        .bo-accordion-trigger {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          background: none;
          border: none;
          color: #ffffff;
          font-size: 0.92rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
        }
        [dir="rtl"] .bo-accordion-trigger {
          text-align: right;
        }
        .bo-accordion-content {
          background: rgba(15, 23, 42, 0.2);
        }
        .accordion-text-wrapper {
          padding: 0 1.5rem 1.5rem;
          font-size: 0.88rem;
          color: #cbd5e1;
          line-height: 1.6;
          text-align: left;
        }
        [dir="rtl"] .accordion-text-wrapper {
          text-align: right;
        }
        .accordion-text-wrapper :global(p) {
          margin-top: 0;
          margin-bottom: 0.75rem;
        }
        .accordion-text-wrapper :global(p:last-child) {
          margin-bottom: 0;
        }

        /* Reviews Section */
        .bo-reviews-section {
          margin-bottom: 5rem;
        }
        .bo-section-heading {
          font-size: 1.75rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 2rem;
          text-align: center;
        }
        .bo-reviews-summary-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          background: rgba(30, 41, 59, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 3rem;
          align-items: center;
        }
        @media (min-width: 768px) {
          .bo-reviews-summary-row {
            grid-template-columns: 35% 65%;
          }
        }
        .bo-reviews-summary-left {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .bo-big-rating {
          font-size: 3.2rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .bo-stars-wrap.center {
          justify-content: center;
          margin-bottom: 0.75rem;
        }
        .bo-reviews-count-sub {
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }
        .bo-reviews-summary-right {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .bo-distribution-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .dist-stars {
          font-size: 0.78rem;
          font-weight: 700;
          color: #94a3b8;
          width: 32px;
        }
        .dist-bar-bg {
          flex: 1;
          height: 6px;
          background: rgba(15, 23, 42, 0.4);
          border-radius: 99px;
          overflow: hidden;
        }
        .dist-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #e11d2e 0%, #ef4444 100%);
          border-radius: 99px;
        }
        .dist-count {
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          width: 24px;
          text-align: right;
        }
        [dir="rtl"] .dist-count {
          text-align: left;
        }

        /* Review Cards List */
        .bo-reviews-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .bo-review-card {
          background: rgba(30, 41, 59, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 1.5rem;
          transition: border-color 0.2s ease;
          text-align: left;
        }
        [dir="rtl"] .bo-review-card {
          text-align: right;
        }
        .bo-review-card:hover {
          border-color: rgba(225, 29, 46, 0.1);
        }
        .review-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          position: relative;
        }
        .reviewer-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e11d2e;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 0.9rem;
        }
        .reviewer-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
          text-align: left;
        }
        [dir="rtl"] .reviewer-info {
          text-align: right;
        }
        .reviewer-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .reviewer-badge {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.65rem;
          font-weight: 800;
          color: #22c55e;
        }
        .review-date {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 500;
        }
        [dir="rtl"] .review-date {
          right: auto;
          left: 0;
        }
        .review-card-rating {
          display: flex;
          gap: 2px;
          margin-bottom: 0.75rem;
        }
        .review-card-comment {
          font-size: 0.82rem;
          color: #cbd5e1;
          line-height: 1.5;
          margin: 0;
        }

        /* Review Empty State */
        .bo-reviews-empty-state {
          text-align: center;
          padding: 3rem 1.5rem;
          background: rgba(30, 41, 59, 0.1);
          border: 1px dashed rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          margin-bottom: 2.5rem;
        }
        .empty-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.75rem;
        }
        .empty-text {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 500;
          margin: 0;
        }

        /* Write a Review Button */
        .bo-write-review-actions {
          display: flex;
          justify-content: center;
        }
        .bo-btn-write-review {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffffff;
          padding: 10px 24px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .bo-btn-write-review:hover {
          background: rgba(225, 29, 46, 0.1);
          border-color: rgba(225, 29, 46, 0.3);
          color: #e11d2e;
          transform: translateY(-1.5px);
        }

        /* Write a Review Form Panel */
        .bo-write-review-form-panel {
          background: rgba(30, 41, 59, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 2rem;
          max-width: 720px;
          margin: 0 auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          text-align: left;
        }
        [dir="rtl"] .bo-write-review-form-panel {
          text-align: right;
        }
        .form-panel-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 1.5rem;
        }
        .form-panel-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }
        @media (min-width: 640px) {
          .form-panel-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.74rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
        }
        .bo-form-input, .bo-form-textarea {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffffff;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s ease;
        }
        .bo-form-input:focus, .bo-form-textarea:focus {
          border-color: #e11d2e;
        }
        .bo-form-input.select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 16px;
          padding-right: 32px;
        }
        [dir="rtl"] .bo-form-input.select {
          background-position: left 10px center;
          padding-right: 14px;
          padding-left: 32px;
        }
        .bo-form-textarea {
          resize: none;
        }
        .form-panel-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .bo-form-submit-btn {
          flex: 1;
          height: 42px;
          background: #e11d2e;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .bo-form-submit-btn:hover {
          background: #b91c1c;
          transform: translateY(-1px);
        }
        .bo-form-cancel-btn {
          flex: 1;
          height: 42px;
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .bo-form-cancel-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* RELATED PRODUCTS SECTION */
        .bo-related-products-section {
          margin-top: 6rem;
          margin-bottom: 5rem;
        }
        .bo-related-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }
        .header-titles {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
        }
        [dir="rtl"] .header-titles {
          text-align: right;
        }
        .header-titles .subtitle {
          color: #e11d2e;
          font-weight: 800;
          font-size: 0.74rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .header-titles .title {
          font-size: 1.6rem;
          font-weight: 900;
          color: #ffffff;
          margin: 0;
        }
        @media (min-width: 768px) {
          .header-titles .title {
            font-size: 2.2rem;
          }
        }
        .bo-view-all-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 99px;
          font-size: 0.74rem;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .bo-view-all-btn:hover {
          background: #e11d2e;
          border-color: #e11d2e;
          transform: translateY(-1.5px);
        }
        .arrow-icon {
          transition: transform 0.2s ease;
        }
        .bo-view-all-btn:hover .arrow-icon {
          transform: translateX(3px);
        }
        [dir="rtl"] .bo-view-all-btn:hover .arrow-icon {
          transform: translateX(-3px) rotate(180deg);
        }
        .bo-related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.25rem;
        }

        /* MOBILE STICKY BOTTOM BAR */
        .bo-mobile-sticky-action-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          z-index: 99;
          box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.4);
        }
        @media (min-width: 769px) {
          .bo-mobile-sticky-action-bar {
            display: none;
          }
        }
        .sticky-price-info {
          display: flex;
          flex-direction: column;
          min-width: 70px;
          text-align: left;
        }
        [dir="rtl"] .sticky-price-info {
          text-align: right;
        }
        .sticky-price {
          font-size: 1.05rem;
          font-weight: 900;
          color: #e11d2e;
        }
        .sticky-variant {
          font-size: 0.65rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          max-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sticky-cart-btn {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(79, 70, 229, 0.15);
          border: 1px solid rgba(79, 70, 229, 0.3);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .sticky-buy-btn {
          flex: 1;
          height: 44px;
          background: linear-gradient(135deg, #e11d2e 0%, #b91c1c 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
          font-family: inherit;
        }

        /* Animations */
        @keyframes boPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(0.95); }
        }
      `}</style>
    </div>
  )
}
