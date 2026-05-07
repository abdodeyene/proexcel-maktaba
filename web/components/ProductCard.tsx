'use client'

import { useRouter } from 'next/navigation'

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

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const disc = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0

  const images = Array.isArray(product.media) ? (product.media as string[]) : []
  const colors = Array.isArray(product.colors) ? (product.colors as string[]) : []
  const mainImage = images[0] || null

  let badge = null
  if (product.isPromo) {
    badge = <span className="product-badge badge-promo">Promo</span>
  } else if (product.isNew) {
    badge = <span className="product-badge badge-new">Nouveau</span>
  } else if (product.isBestOffer) {
    badge = <span className="product-badge badge-best">Best</span>
  } else if (product.stock <= 5) {
    badge = <span className="product-badge badge-stock">Stock</span>
  }

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const cart = JSON.parse(localStorage.getItem('proexcel_cart') || '[]')
    const variants = Array.isArray(product.variants) ? (product.variants as string[]) : []
    const variant = variants.length > 0 ? variants[0] : 'Standard'
    const key = `${product.id}_${variant}`

    const existingIdx = cart.findIndex((i: { key: string; id: number; variant: string }) => i.key === key || (i.id === product.id && i.variant === variant))
    if (existingIdx >= 0) {
      cart[existingIdx].qty += 1
    } else {
      cart.push({
        key,
        productId: product.id,
        id: product.id,
        title: product.title,
        price: product.price,
        qty: 1,
        variant,
        image: mainImage || null
      })
    }

    localStorage.setItem('proexcel_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  return (
    <div className="product-card" onClick={() => router.push(`/product/${product.id}`)}>
      {badge}
      <div className="product-img-wrap">
        <div
          className="book-cover"
          style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}
        >
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: `linear-gradient(145deg, ${product.g1 || '#1a237e'}, ${product.g2 || '#3949ab'})`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '8px', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: '7px', background: 'rgba(0,0,0,0.25)',
                borderRadius: '4px 0 0 4px'
              }} />
              <div style={{
                color: 'white', fontWeight: 700, fontSize: '0.72rem',
                textAlign: 'center', zIndex: 1, lineHeight: 1.35, padding: '0 12px'
              }}>{product.title}</div>
              {product.author && (
                <div style={{
                  color: 'rgba(255,255,255,0.65)', fontSize: '0.62rem',
                  textAlign: 'center', marginTop: '6px', zIndex: 1
                }}>{product.author}</div>
              )}
            </div>
          )}
        </div>
        {/* Cart icon — fades in on hover, bottom-right of image */}
        <div className="quick-add">
          <button className="btn-quick" onClick={addToCart} title="Ajouter au panier">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="product-info">
        <div className="product-name">{product.title}</div>
        <div className="product-prices">
          <span className="p-current">{product.price} DH</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="p-compare">{product.compareAtPrice} DH</span>
            )}
            {disc > 0 && <span className="p-discount">-{disc}%</span>}
            {!disc && <span className="product-cat">{product.category}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
