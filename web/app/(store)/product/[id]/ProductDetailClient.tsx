'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@prisma/client'

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter()
  const variants = (product.variants as { label: string; price: number }[] | null) || [{ label: 'Brochée', price: product.price }]
  const [selectedVariant, setSelectedVariant] = useState(variants[0])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem('proexcel_cart') || '[]')
    const key = `${product.id}-${selectedVariant.label}`
    const idx = cart.findIndex((i: { key: string }) => i.key === key)
    if (idx >= 0) cart[idx].qty += qty
    else cart.push({ key, id: product.id, title: product.title, variant: selectedVariant.label, price: selectedVariant.price, qty, emoji: product.emoji })
    localStorage.setItem('proexcel_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#8b96b0', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '.85rem' }}>
        ← Retour
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        {/* Image */}
        <div style={{
          height: 360, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '7rem', background: `linear-gradient(135deg, ${product.g1 || '#1a237e'}, ${product.g2 || '#3949ab'})`,
          position: 'relative',
        }}>
          {product.emoji || '📦'}
          {discount > 0 && (
            <span style={{ position: 'absolute', top: 16, right: 16, background: '#ef4444', color: '#fff', borderRadius: 9999, fontSize: '.75rem', fontWeight: 700, padding: '4px 10px' }}>
              -{discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <div style={{ fontSize: '.75rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#3b82f6', background: 'rgba(59,130,246,.1)', padding: '.25rem .75rem', borderRadius: 9999, display: 'inline-block', marginBottom: '.75rem' }}>
              {product.category}
            </div>
          )}
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#eef0f5', marginBottom: '.5rem', lineHeight: 1.25 }}>
            {product.title}
          </h1>
          {product.author && <p style={{ color: '#8b96b0', fontSize: '.9rem', marginBottom: '1rem' }}>par {product.author}</p>}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>{selectedVariant.price} DH</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span style={{ fontSize: '1.1rem', color: '#8b96b0', textDecoration: 'line-through' }}>{product.compareAtPrice} DH</span>
            )}
          </div>

          {/* Variants */}
          {variants.length > 1 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '.82rem', color: '#8b96b0', marginBottom: '.5rem' }}>Format:</p>
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                {variants.map(v => (
                  <button key={v.label} onClick={() => setSelectedVariant(v)} style={{
                    padding: '.4rem 1rem', borderRadius: 9999, fontSize: '.82rem', fontWeight: 600, cursor: 'pointer',
                    border: selectedVariant.label === v.label ? '2px solid #3b82f6' : '1px solid rgba(59,130,246,.3)',
                    background: selectedVariant.label === v.label ? 'rgba(59,130,246,.15)' : 'transparent',
                    color: selectedVariant.label === v.label ? '#3b82f6' : '#8b96b0',
                  }}>
                    {v.label} — {v.price} DH
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 9999, padding: '.25rem' }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(59,130,246,.1)', border: 'none', color: '#eef0f5', cursor: 'pointer', fontSize: '1rem' }}>-</button>
              <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600, color: '#eef0f5' }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(59,130,246,.1)', border: 'none', color: '#eef0f5', cursor: 'pointer', fontSize: '1rem' }}>+</button>
            </div>
            {product.stock > 0 ? (
              <span style={{ fontSize: '.78rem', color: '#22c55e' }}>✓ En stock ({product.stock})</span>
            ) : (
              <span style={{ fontSize: '.78rem', color: '#ef4444' }}>✗ Rupture de stock</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={addToCart} style={{
              background: added ? '#22c55e' : 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              color: '#fff', border: 'none', padding: '.75rem 2rem', borderRadius: 9999,
              fontSize: '.95rem', fontWeight: 600, cursor: 'pointer', transition: 'all .3s',
            }}>
              {added ? '✓ Ajouté !' : '🛒 Ajouter au panier'}
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.15)', borderRadius: 16 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', marginBottom: '.75rem', color: '#eef0f5' }}>Description</h3>
              <div style={{ color: '#8b96b0', fontSize: '.88rem', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
