'use client'
import Link from 'next/link'

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
  rating: number
  isPromo: boolean
  isNew: boolean
  isBestOffer: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem('proexcel_cart') || '[]')
    const idx = cart.findIndex((i: { id: number }) => i.id === product.id)
    if (idx >= 0) cart[idx].qty += 1
    else cart.push({ id: product.id, title: product.title, price: product.price, qty: 1, emoji: product.emoji })
    localStorage.setItem('proexcel_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  return (
    <div style={{
      background: 'rgba(12,18,45,0.65)', backdropFilter: 'blur(16px)',
      border: '1px solid rgba(59,130,246,0.15)', borderRadius: 16,
      overflow: 'hidden', transition: 'transform .25s, box-shadow .25s',
      cursor: 'pointer',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(59,130,246,0.15)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}
    >
      <Link href={`/product/${product.id}`}>
        <div style={{
          height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(135deg, ${product.g1 || '#1a237e'}, ${product.g2 || '#3949ab'})`,
          fontSize: '3.5rem', position: 'relative',
        }}>
          {product.emoji || '📦'}
          {product.isPromo && discount > 0 && (
            <span style={{ position: 'absolute', top: 10, right: 10, background: '#ef4444', color: '#fff', borderRadius: 9999, fontSize: '.65rem', fontWeight: 700, padding: '2px 8px' }}>
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span style={{ position: 'absolute', top: 10, left: 10, background: '#22c55e', color: '#fff', borderRadius: 9999, fontSize: '.65rem', fontWeight: 700, padding: '2px 8px' }}>
              Nouveau
            </span>
          )}
        </div>
      </Link>
      <div style={{ padding: '1rem' }}>
        <div style={{ fontSize: '.7rem', color: '#8b96b0', marginBottom: '.25rem', fontWeight: 500 }}>
          {product.category || ''}
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 style={{ fontSize: '.9rem', fontFamily: 'Playfair Display, serif', fontWeight: 600, lineHeight: 1.3, marginBottom: '.35rem', color: '#eef0f5' }}>
            {product.title}
          </h3>
        </Link>
        {product.author && <p style={{ fontSize: '.72rem', color: '#8b96b0', marginBottom: '.5rem' }}>{product.author}</p>}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.75rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#3b82f6' }}>{product.price} DH</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span style={{ fontSize: '.78rem', color: '#8b96b0', textDecoration: 'line-through' }}>{product.compareAtPrice} DH</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button onClick={addToCart} style={{
            flex: 1, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
            color: '#fff', border: 'none', borderRadius: 9999,
            padding: '.45rem .75rem', fontSize: '.8rem', fontWeight: 600, cursor: 'pointer',
          }}>
            🛒 Ajouter
          </button>
          <Link href={`/product/${product.id}`} style={{
            padding: '.45rem .75rem', borderRadius: 9999,
            border: '1px solid rgba(59,130,246,0.4)', color: '#3b82f6',
            fontSize: '.8rem', fontWeight: 600,
          }}>
            Voir
          </Link>
        </div>
      </div>
    </div>
  )
}
