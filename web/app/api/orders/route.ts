import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { sendOrderPushNotification } from '@/lib/push'

export async function GET(req: NextRequest) {
  try {
    requireAuth(req)
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const where = status ? { status } : {}
    const orders = await prisma.order.findMany({ where, orderBy: { date: 'desc' } })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const dto = await req.json()

    // Validate and sanitise required fields
    const { cart, promoCode } = dto
    const name    = typeof dto.name    === 'string' ? dto.name.trim()    : ''
    const phone   = typeof dto.phone   === 'string' ? dto.phone.trim()   : ''
    const address = typeof dto.address === 'string' ? dto.address.trim() : ''
    const city    = typeof dto.city    === 'string' ? dto.city.trim()    : ''

    if (name.length < 2 || name.length > 120) {
      return NextResponse.json({ message: 'Veuillez saisir votre nom complet (2–120 caractères).' }, { status: 400 })
    }
    // Accept Moroccan phone formats: 06/07 mobile, 05 landline, +212, 00212
    if (!/^[\d\s+\-().]{7,25}$/.test(phone)) {
      return NextResponse.json({ message: 'Numéro de téléphone invalide (7–25 chiffres/caractères autorisés).' }, { status: 400 })
    }
    // Accept any real address: letters (latin + Arabic), digits, spaces, commas,
    // hyphens, slashes, apostrophes, dots, parentheses — just enforce length.
    if (address.length < 5 || address.length > 300) {
      return NextResponse.json({ message: 'Adresse invalide (5–300 caractères requis).' }, { status: 400 })
    }
    if (city.length < 2 || city.length > 100) {
      return NextResponse.json({ message: 'Ville invalide.' }, { status: 400 })
    }
    if (!Array.isArray(cart) || cart.length === 0 || cart.length > 50) {
      return NextResponse.json({ message: 'Panier invalide' }, { status: 400 })
    }

    // Validate cart items structure
    // Product.id is Int in Prisma — accept number or numeric string from any cart source
    const cartItems = cart as Array<{ productId: unknown; qty: unknown; variant?: unknown }>
    for (const item of cartItems) {
      const pid = Number(item.productId)
      if (!Number.isFinite(pid) || !Number.isInteger(pid) || pid <= 0) {
        return NextResponse.json({ message: 'Identifiant produit invalide.' }, { status: 400 })
      }
      const qty = Number(item.qty)
      if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
        return NextResponse.json({ message: 'Quantité invalide (1–100).' }, { status: 400 })
      }
    }

    // Recalculate prices server-side
    const productIds = [...new Set(cartItems.map(i => Number(i.productId)))]
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, title: true, emoji: true },
    })
    const productMap = new Map(products.map(p => [p.id, p]))

    let subtotal = 0
    const verifiedCart: Array<Record<string, unknown>> = []
    for (const item of cartItems) {
      const product = productMap.get(Number(item.productId))
      if (!product) {
        return NextResponse.json({ message: `Produit ${item.productId} introuvable` }, { status: 400 })
      }
      const qty = Number(item.qty)
      subtotal += product.price * qty
      verifiedCart.push({
        productId: product.id,
        title: product.title,
        emoji: product.emoji,
        price: product.price,
        qty,
        variant: typeof item.variant === 'string' ? item.variant.slice(0, 100) : '',
      })
    }

    // Validate and apply promo code server-side
    let discount = 0
    let appliedPromoCode: string | null = null
    if (promoCode && typeof promoCode === 'string') {
      const promoSetting = await prisma.setting.findUnique({ where: { key: 'promo_codes' } })
      if (promoSetting?.value) {
        try {
          const codes = JSON.parse(promoSetting.value) as Array<{
            code: string; type: 'percent' | 'fixed'; discount: number
          }>
          const match = codes.find(c => c.code.toUpperCase() === promoCode.trim().toUpperCase())
          if (match) {
            discount = match.type === 'percent'
              ? subtotal * (match.discount / 100)
              : match.discount
            appliedPromoCode = match.code
          }
        } catch {
          // invalid promo_codes JSON in DB — ignore
        }
      }
    }

    const subtotalAfterDiscount = Math.max(0, subtotal - discount)

    // Get shipping settings
    const [deliveryFeeSetting, freeMinSetting] = await Promise.all([
      prisma.setting.findUnique({ where: { key: 'delivery_fee' } }),
      prisma.setting.findUnique({ where: { key: 'free_delivery_min' } }),
    ])
    const deliveryFee = Number(deliveryFeeSetting?.value ?? 25)
    const freeMin = Number(freeMinSetting?.value ?? 499)
    const shipping = subtotalAfterDiscount >= freeMin ? 0 : deliveryFee

    const total = subtotalAfterDiscount + shipping

    const orderNum = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
    const order = await prisma.order.create({
      data: {
        orderNum,
        name,
        phone,
        address,
        city,
        total,
        cart: verifiedCart as unknown as import('@prisma/client').Prisma.JsonArray,
      },
    })

    try {
      console.log('[push-order] order created', order.id)
      console.log('[push-order] sending notification')
      const result = await sendOrderPushNotification(order as unknown as Record<string, unknown>)
      console.log('[push-order] result', result)
    } catch (error) {
      console.error('[push-order] failed', error)
    }

    return NextResponse.json(order, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}
