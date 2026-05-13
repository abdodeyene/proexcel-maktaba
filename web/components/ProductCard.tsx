'use client'

import { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatMoroccanPrice } from '@/lib/format'
import { ShoppingCart } from '@/components/LucideIcons'

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
  isPromo?: boolean | null
  isNew?: boolean | null
  isBestOffer?: boolean | null
  variants?: unknown | null
  media?: unknown | null
  colors?: unknown | null
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)

  const disc = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0

  const images = Array.isArray(product.media) ? (product.media as string[]) : []
  const mainImage = images[0] || null

  // Scroll-in animation with stagger
  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const show = () => {
      el.style.transitionDelay = `${index * 80}ms`
      el.classList.add('card-visible')
      setTimeout(() => { if (el) el.style.transitionDelay = '0ms' }, 450 + index * 80)
    }

    // If already in viewport (e.g. page load), show immediately
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight + 100) {
      show()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show()
          observer.unobserve(el)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  let badgeText: string | null = null
  if (disc > 0) badgeText = `-${disc}%`
  else if (product.isNew) badgeText = 'NOUVEAUTÉ'
  else if (product.isBestOffer) badgeText = 'PREMIUM'
  else if (product.isPromo) badgeText = 'PROMO'

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const cart = JSON.parse(localStorage.getItem('proexcel_cart') || '[]')
    const variants = Array.isArray(product.variants) ? (product.variants as string[]) : []
    const variant = variants.length > 0 ? variants[0] : 'Standard'
    const key = `${product.id}_${variant}`
    const existingIdx = cart.findIndex((i: { key: string; id: number; variant: string }) =>
      i.key === key || (i.id === product.id && i.variant === variant)
    )
    if (existingIdx >= 0) {
      cart[existingIdx].qty += 1
    } else {
      cart.push({ key, productId: product.id, id: product.id, title: product.title, price: product.price, qty: 1, variant, image: mainImage || null })
    }
    localStorage.setItem('proexcel_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  return (
    <div
      ref={cardRef}
      className="pcard product-card-anim"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      {/* Image section — edge-to-edge */}
      <div className="pcard-img">
        {mainImage ? (
          <img src={mainImage} alt={product.title} className="pcard-img-el" />
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
        {badgeText && <span className="pcard-badge">{badgeText}</span>}
      </div>

      {/* Card body */}
      <div className="pcard-body">
        {product.category && <div className="pcard-cat">{product.category}</div>}
        <div className="pcard-name">{product.title}</div>
        <div className="pcard-price-row">
          <div className="pcard-prices">
            <span className="pcard-price">{formatMoroccanPrice(product.price)}</span>
            {disc > 0 && product.compareAtPrice && (
              <span className="pcard-compare">{formatMoroccanPrice(product.compareAtPrice)}</span>
            )}
          </div>
          <button
            className="pcard-cart-btn proexcel-btn-home-product-card-add"
            onClick={addToCart}
            title="Ajouter au panier"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
