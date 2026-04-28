'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type CartItem = { key: string; id: number; title: string; variant: string; price: number; qty: number; emoji: string }

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('proexcel_cart') || '[]'))
  }, [])

  function save(updated: CartItem[]) {
    setCart(updated)
    localStorage.setItem('proexcel_cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('cart-updated'))
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  if (cart.length === 0) return (
    <div style={{ textAlign: 'center', padding: '6rem 1.5rem', color: '#8b96b0' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#eef0f5', marginBottom: '1rem' }}>Panier vide</h2>
      <Link href="/best-offers" style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', padding: '.75rem 1.75rem', borderRadius: 9999, fontWeight: 600 }}>
        Voir les livres
      </Link>
    </div>
  )

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#eef0f5', marginBottom: '2rem' }}>Mon Panier</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {cart.map(item => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.15)', borderRadius: 16, padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '2rem', width: 48, textAlign: 'center' }}>{item.emoji || '📦'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, color: '#eef0f5', fontSize: '.9rem', marginBottom: '.2rem' }}>{item.title}</p>
              <p style={{ color: '#8b96b0', fontSize: '.75rem' }}>{item.variant}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <button onClick={() => save(cart.map(i => i.key === item.key ? { ...i, qty: Math.max(1, i.qty - 1) } : i))} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(59,130,246,.1)', border: 'none', color: '#eef0f5', cursor: 'pointer' }}>-</button>
              <span style={{ minWidth: 20, textAlign: 'center', color: '#eef0f5', fontWeight: 600 }}>{item.qty}</span>
              <button onClick={() => save(cart.map(i => i.key === item.key ? { ...i, qty: i.qty + 1 } : i))} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(59,130,246,.1)', border: 'none', color: '#eef0f5', cursor: 'pointer' }}>+</button>
            </div>
            <div style={{ minWidth: 80, textAlign: 'right', color: '#3b82f6', fontWeight: 700 }}>{(item.price * item.qty).toFixed(2)} DH</div>
            <button onClick={() => save(cart.filter(i => i.key !== item.key))} style={{ background: 'rgba(239,68,68,.1)', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: 8, padding: '.3rem .6rem', fontSize: '.8rem' }}>✕</button>
          </div>
        ))}
      </div>
      <div style={{ background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.15)', borderRadius: 16, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ color: '#8b96b0', fontSize: '.85rem' }}>Total</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#3b82f6' }}>{total.toFixed(2)} DH</p>
          {total >= 499 && <p style={{ color: '#22c55e', fontSize: '.78rem' }}>✓ Livraison gratuite !</p>}
        </div>
        <Link href="/checkout" style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', padding: '.85rem 2rem', borderRadius: 9999, fontWeight: 600, fontSize: '.95rem' }}>
          Commander →
        </Link>
      </div>
    </div>
  )
}
