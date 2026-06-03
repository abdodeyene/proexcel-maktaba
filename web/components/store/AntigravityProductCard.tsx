'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Star, ShoppingCart, Check, Eye } from 'lucide-react'
import { useLang } from '@/components/LangContext'

// NOTE: All CSS for this component is injected server-side via the <style> tag
// in app/(store)/antigravity/page.tsx using class prefix "pxcard-" and "pxcard".
// Do NOT add Tailwind classes or runtime style injection here.

interface ProductCardProps {
  id?: string | number
  name?: string
  title?: string
  titleAr?: string | null
  slug?: string
  price?: number
  compareAtPrice?: number | null
  images?: string[] | { url: string }[] | null
  media?: any
  stock?: number
  isFeatured?: boolean | null
  isNew?: boolean | null
  isBestOffer?: boolean | null
  isPromo?: boolean | null
  rating?: number | null
  reviewCount?: number | null
  category?: { name: string; slug: string } | string | null
  colors?: string[] | any
  product?: any
  index?: number
}

function resolveImageUrl(images: unknown): string | null {
  if (!images) return null
  if (typeof images === 'string') {
    if (images.startsWith('[') || images.startsWith('{')) {
      try { return resolveImageUrl(JSON.parse(images)) } catch { return images.startsWith('http') ? images : null }
    }
    return images.startsWith('http') ? images : null
  }
  if (Array.isArray(images)) {
    if (images.length === 0) return null
    const first = images[0]
    if (typeof first === 'string') return first.startsWith('http') ? first : null
    if (typeof first === 'object' && first !== null) {
      const obj = first as Record<string, unknown>
      const url = obj.url ?? obj.src ?? obj.imageUrl ?? obj.image
      if (typeof url === 'string') return url.startsWith('http') ? url : null
    }
  }
  return null
}

function getSubtitle(
  category: ProductCardProps['category'],
  isNew: boolean | null | undefined,
  isBestOffer: boolean | null | undefined,
  isPromo: boolean | null | undefined,
  t: (fr: string, ar: string) => string
): string {
  if (typeof category === 'object' && category !== null && 'name' in category) return (category as { name: string }).name
  if (typeof category === 'string' && category.trim()) return category
  if (isNew) return t('Nouveau Produit', 'منتج جديد')
  if (isBestOffer) return t('Meilleure Offre', 'أفضل عرض')
  if (isPromo) return t('Article Promo', 'عرض ترويجي')
  return t('Qualité Premium', 'جودة ممتازة')
}

export default function AntigravityProductCard(props: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { lang, t } = useLang()
  const router = useRouter()

  // ── Resolve props ────────────────────────────────────────────────────────────
  const product = props.product
  const id = product ? String(product.id) : String(props.id ?? '')
  const isAr = lang === 'ar'
  const baseName = props.name ?? props.title ?? product?.title ?? product?.name ?? ''
  const titleAr = props.titleAr ?? product?.titleAr
  const name = isAr && titleAr ? titleAr : baseName
  const slug = product ? String(product.id) : String(props.slug ?? props.id ?? '')
  const price = product ? (product.price ?? 0) : (props.price ?? 0)
  const compareAtPrice = product ? product.compareAtPrice : props.compareAtPrice
  const images = props.images ?? props.media ?? product?.media ?? product?.images ?? []
  const imgSrc = resolveImageUrl(images)
  const stock = product ? product.stock : (props.stock ?? 1)
  const isNew = product ? product.isNew : props.isNew
  const isBestOffer = product ? product.isBestOffer : props.isBestOffer
  const isPromo = product ? product.isPromo : props.isPromo
  const rating = (product ? product.rating : props.rating) ?? 0
  const reviewCount = (product ? product.reviewCount : props.reviewCount) ?? 0
  const category = product ? product.category : props.category

  // ── Color swatches ───────────────────────────────────────────────────────────
  let colorOptions: string[] = []
  const rawColors = props.colors ?? product?.colors
  if (Array.isArray(rawColors)) {
    colorOptions = rawColors
  } else if (typeof rawColors === 'string' && rawColors.trim()) {
    try { colorOptions = JSON.parse(rawColors) }
    catch { colorOptions = rawColors.split(',').map((c: string) => c.trim()) }
  }
  const [selectedColor, setSelectedColor] = useState<string | null>(colorOptions[0] ?? null)

  // ── Discount ─────────────────────────────────────────────────────────────────
  const hasDiscount = compareAtPrice != null && compareAtPrice > price
  const discountPct = hasDiscount ? Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100) : 0

  const productLink = `/product/${slug}`
  const currencyText = t('DH', 'د.م.')
  const subtitle = getSubtitle(category, isNew, isBestOffer, isPromo, t)

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button,a')) return
    router.push(productLink)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (stock === 0 || isAdding) return
    setIsAdding(true)
    try {
      const cart = JSON.parse(localStorage.getItem('proexcel_cart') ?? '[]')
      const variantName = selectedColor ? `Color: ${selectedColor}` : 'Standard'
      const key = `${id}_${selectedColor ? selectedColor.replace('#', '') : 'standard'}`
      const idx = cart.findIndex((item: any) => item.key === key)
      const cartItem = { key, productId: Number(id), price: Number(price), name, image: imgSrc, qty: 1, variant: variantName, selectedVariant: selectedColor ? { color: selectedColor } : null, emoji: '📚' }
      if (idx >= 0) cart[idx].qty += 1
      else cart.push(cartItem)
      localStorage.setItem('proexcel_cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('cart-updated'))
      window.dispatchEvent(new CustomEvent('toast-notification', { detail: { type: 'success', message: t('Produit ajouté au panier !', 'تمت إضافة المنتج إلى السلة!') } }))
    } catch (err) {
      console.error('Cart error:', err)
    } finally {
      setTimeout(() => setIsAdding(false), 500)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="pxcard" onClick={handleCardClick}>

      {/* ══ IMAGE BLOCK ══════════════════════════════════════════════════════ */}
      <div className="pxcard-img-wrap">

        {/* Clickable link fills the entire image area */}
        <Link
          href={productLink}
          style={{ position: 'absolute', inset: 0, display: 'block', zIndex: 1 }}
          tabIndex={-1}
          aria-label={name}
        >
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={name || 'Product'}
              fill
              style={{ objectFit: 'contain', padding: '12px' }}
              sizes="(max-width:560px) 100vw,(max-width:900px) 50vw,33vw"
              priority={props.index !== undefined && props.index < 3}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="52" height="52" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </Link>

        {/* ── Badge (top-left) ── */}
        {hasDiscount && (
          <span className="pxcard-badge pxcard-badge-discount">-{discountPct}%</span>
        )}
        {!hasDiscount && isNew && (
          <span className="pxcard-badge pxcard-badge-new">{t('Nouveau', 'جديد')}</span>
        )}
        {!hasDiscount && !isNew && (isBestOffer || isPromo) && (
          <span className="pxcard-badge pxcard-badge-hot">{t('Hot', 'رائج')}</span>
        )}

        {/* ── 3 Floating action icons (top-right, stacked) ── */}
        <div className="pxcard-actions">

          {/* 1. Wishlist */}
          <button
            type="button"
            className={`pxcard-icon pxcard-icon-wish${wishlisted ? ' wl-on' : ''}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(p => !p) }}
            aria-label={t('Favoris', 'المفضلة')}
          >
            <Heart
              size={16}
              fill={wishlisted ? 'currentColor' : 'none'}
              strokeWidth={wishlisted ? 0 : 2}
            />
          </button>

          {/* 2. Quick view */}
          <button
            type="button"
            className="pxcard-icon pxcard-icon-view"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(productLink) }}
            aria-label={t('Aperçu rapide', 'معاينة سريعة')}
          >
            <Eye size={16} />
          </button>

          {/* 3. Add to cart */}
          <button
            type="button"
            className={`pxcard-icon pxcard-icon-cart${isAdding ? ' cart-adding' : ''}`}
            onClick={handleAddToCart}
            disabled={stock === 0 || isAdding}
            aria-label={t('Ajouter au panier', 'أضف إلى السلة')}
          >
            <ShoppingCart size={16} />
          </button>
        </div>

        {/* ── Out of stock overlay ── */}
        {stock === 0 && (
          <div className="pxcard-oos">
            <span>{t('Épuisé', 'نفذ المخزون')}</span>
          </div>
        )}
      </div>
      {/* ══ end image block ══ */}

      {/* ══ PRODUCT INFO (open, below image) ════════════════════════════════ */}
      <div className="pxcard-info">

        {/* Bold brand subtitle / Category */}
        <p className="pxcard-subtitle">{subtitle}</p>

        {/* Row: product name left + star rating right */}
        <div className="pxcard-name-row">
          <Link href={productLink} className="pxcard-name">
            {name || t('Produit', 'منتج')}
          </Link>
          {rating > 0 && (
            <div className="pxcard-stars">
              <Star size={14} style={{ color: '#F5C542', fill: '#F5C542', display: 'block' }} />
              <span className="pxcard-stars-num">{(rating as number).toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Price row */}
        <div className="pxcard-prices">
          <span className="pxcard-price">
            {Number.isInteger(price) ? price.toFixed(0) : price.toFixed(2)}{' '}
            <span className="pxcard-currency">{currencyText}</span>
          </span>
          {hasDiscount && compareAtPrice != null && (
            <span className="pxcard-compare">
              {Number.isInteger(compareAtPrice) ? compareAtPrice.toFixed(0) : compareAtPrice.toFixed(2)} {currencyText}
            </span>
          )}
        </div>

        {/* Color swatches */}
        {colorOptions.length > 0 && (
          <div className="pxcard-swatches">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                className={`pxcard-swatch${selectedColor === color ? ' sw-active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedColor(color) }}
                title={color}
                aria-label={`Couleur ${color}`}
              >
                {selectedColor === color && (
                  <Check
                    size={9}
                    style={{ color: ['#ffffff','#fff','#ffff00','#fefefe'].includes(color.toLowerCase()) ? '#111' : '#fff', display: 'block' }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

      </div>
      {/* ══ end info ══ */}

    </div>
  )
}
