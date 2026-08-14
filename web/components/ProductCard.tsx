'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatMoroccanPrice } from '@/lib/format'
import { ShoppingCart, Star } from '@/components/LucideIcons'

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
  variants?: unknown | null
  media?: unknown | null
  colors?: unknown | null
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <div className="product-rating pcard-stars" aria-label={`${rating} sur 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} size={11} className="pcard-star filled" />
      ))}
      {half && <Star key="h" size={11} className="pcard-star half" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} size={11} className="pcard-star empty" />
      ))}
    </div>
  )
}

export default function ProductCard({ product }: { product: Product; index?: number }) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const disc = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0

  const images = Array.isArray(product.media) ? (product.media as string[]) : []
  const mainImage = images[0] || null

  const parsedVariants = useMemo(() => {
    if (Array.isArray(product.variants)) return product.variants as string[]
    if (typeof product.variants === 'string') {
      try { return JSON.parse(product.variants) as string[] } catch { return [] }
    }
    return []
  }, [product.variants])

  let badgeLabel: string | null = null
  let badgeType: 'disc' | 'new' | 'promo' | 'best' | null = null
  if (disc > 0) { badgeLabel = `-${disc}%`; badgeType = 'disc' }
  else if (product.isNew) { badgeLabel = 'NOUVEAU'; badgeType = 'new' }
  else if (product.isPromo) { badgeLabel = 'PROMO'; badgeType = 'promo' }
  else if (product.isBestOffer) { badgeLabel = 'OFFRE'; badgeType = 'best' }

  const inStock = product.stock > 0
  const rating = typeof product.rating === 'number' ? product.rating : 4.5

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (adding) return
    setAdding(true)
    const cart = JSON.parse(localStorage.getItem('proexcel_cart') || '[]')
    const variant = parsedVariants.length > 0 ? parsedVariants[0] : 'Standard'
    const key = `${product.id}_${variant}`
    const existingIdx = cart.findIndex((i: { key: string; id: number; variant: string }) =>
      i.key === key || (i.id === product.id && i.variant === variant)
    )
    if (existingIdx >= 0) {
      cart[existingIdx].qty += 1
    } else {
      cart.push({
        key, productId: product.id, id: product.id,
        title: product.title, price: product.price,
        qty: 1, variant, image: mainImage || null
      })
    }
    localStorage.setItem('proexcel_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    setAdded(true)
    setTimeout(() => { setAdding(false); setAdded(false) }, 1400)
  }

  return (
    <div
      className="product-card pcard"
      onClick={() => router.push(`/product/${product.id}`)}
      role="article"
      aria-label={product.title}
    >
      {/* 1. IMAGE BOX */}
      <div className="product-card-image pcard-img-wrap">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.title}
            className="pcard-img"
            loading="lazy"
          />
        ) : (
          <div
            className="pcard-img-fallback"
            style={{ background: `linear-gradient(145deg, ${product.g1 || '#1a237e'}, ${product.g2 || '#3949ab'})` }}
          >
            <div className="pcard-fallback-spine" />
            <div className="pcard-fallback-title">{product.title}</div>
            {product.author && <div className="pcard-fallback-author">{product.author}</div>}
          </div>
        )}

        {/* PROMOTION BADGE */}
        {badgeLabel && (
          <span className={`pcard-badge pcard-badge--${badgeType}`}>
            {badgeLabel}
          </span>
        )}
      </div>

      {/* 2. CARD CONTENT */}
      <div className="product-card-content pcard-body">
        {/* Category */}
        {product.category && (
          <span className="product-category-text pcard-category">{product.category}</span>
        )}

        {/* PRODUCT NAME */}
        <h3 className="product-name pcard-title" dir="auto">{product.title}</h3>

        {/* RATING */}
        <div className="product-rating pcard-rating-row">
          <StarRating rating={rating} />
          <span className="pcard-rating-val">{rating.toFixed(1)}</span>
        </div>

        {/* PRICE */}
        <div className="product-price-row pcard-price-row">
          <span className="product-price-current pcard-price-current">
            {formatMoroccanPrice(product.price)}
          </span>
          {disc > 0 && product.compareAtPrice && (
            <span className="product-price-old pcard-price-old">
              {formatMoroccanPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* STOCK */}
        <div className={`product-stock-badge pcard-stock ${inStock ? 'in-stock in' : 'out-of-stock out'}`}>
          <span className="pcard-stock-dot" />
          {inStock ? 'En stock' : 'Rupture de stock'}
        </div>

        {/* ADD TO CART */}
        <button
          className={`product-add-to-cart-btn pcard-atc-mobile ${added ? 'added' : ''}`}
          onClick={addToCart}
          aria-label="Ajouter au panier"
          disabled={!inStock}
        >
          <ShoppingCart size={15} strokeWidth={2.2} />
          <span>{added ? 'Ajouté !' : 'Ajouter au panier'}</span>
        </button>
      </div>
    </div>
  )
}
