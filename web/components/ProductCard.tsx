'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { formatMoroccanPrice } from '@/lib/format'
import { ShoppingCart, Eye } from '@/components/LucideIcons'

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

  // Parse variants
  const parsedVariants = useMemo(() => {
    if (Array.isArray(product.variants)) return product.variants as string[]
    if (typeof product.variants === 'string') {
      try { return JSON.parse(product.variants) as string[] } catch { return [] }
    }
    return []
  }, [product.variants])

  const hasVariants = parsedVariants.length > 1

  // Scroll-in animation with stagger
  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const show = () => {
      el.style.transitionDelay = `${index * 80}ms`
      el.classList.add('opacity-100', 'translate-y-0')
      el.classList.remove('opacity-0', 'translate-y-4')
      setTimeout(() => { if (el) el.style.transitionDelay = '0ms' }, 450 + index * 80)
    }

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
    const variant = parsedVariants.length > 0 ? parsedVariants[0] : 'Standard'
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
      className="group relative flex flex-col gap-3 w-full cursor-pointer opacity-0 translate-y-4 transition-all duration-700 ease-out"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      {/* ── IMAGE FRAME (Cadre) ── */}
      <div 
        className="relative w-full aspect-[4/5] rounded-[20px] overflow-hidden transition-all duration-[400ms] group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
        style={{ backgroundColor: 'rgba(128, 128, 128, 0.05)' }}
      >
        {mainImage ? (
          <img 
            src={mainImage} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.08]" 
          />
        ) : (
          <div
            className="w-full h-full flex flex-col justify-end p-4 relative transition-transform duration-700 group-hover:scale-[1.08]"
            style={{ background: `linear-gradient(145deg, ${product.g1 || '#1a237e'}, ${product.g2 || '#3949ab'})` }}
          >
            <div className="absolute left-4 top-0 bottom-0 w-1 bg-black/20" />
            <div className="text-white font-bold text-sm line-clamp-3 leading-snug drop-shadow-md z-10">{product.title}</div>
            {product.author && <div className="text-white/80 text-xs mt-2 truncate z-10">{product.author}</div>}
          </div>
        )}

        {/* Badge */}
        {badgeText && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[0.65rem] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-md z-10">
            {badgeText}
          </span>
        )}

        {/* Desktop Hover Overlay (Hidden on Mobile) */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-500 hidden md:flex items-center justify-center gap-4 z-20">
          <button 
            className="w-12 h-12 rounded-full bg-white/95 text-gray-900 flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.15)] translate-y-6 group-hover:translate-y-0"
            onClick={(e) => { e.stopPropagation(); router.push(`/product/${product.id}`) }}
            title="Voir le produit"
          >
            <Eye size={22} />
          </button>
          <button 
            className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-500 hover:scale-110 transition-all duration-300 shadow-[0_8px_20px_rgba(220,38,38,0.35)] translate-y-6 group-hover:translate-y-0 delay-75"
            onClick={addToCart}
            title="Ajouter au panier"
          >
            <ShoppingCart size={22} />
          </button>
        </div>

        {/* Mobile Persistent Cart Icon (Hidden on Desktop) */}
        <button 
          className="absolute bottom-3 right-3 md:hidden w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform z-20"
          onClick={addToCart}
          title="Ajouter au panier"
        >
          <ShoppingCart size={18} />
        </button>
      </div>

      {/* ── TEXT & PRICE ── */}
      <div className="flex flex-col gap-1.5 px-1 pb-1">
        <h3 
          className="text-[0.95rem] md:text-[1rem] font-medium leading-[1.4] line-clamp-2 transition-colors duration-300 group-hover:text-red-600" 
          dir="auto" 
          style={{ color: 'var(--text)' }}
        >
          {product.title}
        </h3>

        {/* ── VARIANTS PILLS ── */}
        {hasVariants && (
          <div className="pcard-variants-row">
            {parsedVariants.slice(0, 3).map((v, i) => (
              <span key={i} className="pcard-variant-pill">{v}</span>
            ))}
            {parsedVariants.length > 3 && (
              <span className="pcard-variant-more">+{parsedVariants.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[1.1rem] font-bold text-red-600">
            {formatMoroccanPrice(product.price)}
          </span>
          {disc > 0 && product.compareAtPrice && (
            <span className="text-[0.8rem] line-through opacity-60" style={{ color: 'var(--text2)' }}>
              {formatMoroccanPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
