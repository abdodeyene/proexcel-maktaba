import webpush from 'web-push'
import { prisma } from '@/lib/prisma'

let configured = false

function ensureConfigured() {
  if (configured) return
  const email     = process.env.VAPID_EMAIL
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  if (!email || !publicKey || !privateKey) {
    console.error('[push] VAPID env vars missing — notifications disabled')
    return
  }
  webpush.setVapidDetails(`mailto:${email}`, publicKey, privateKey)
  configured = true
}

type PushPayload = {
  title: string
  body:  string
  url:   string
}

export async function sendPushToAll(payload: PushPayload): Promise<void> {
  ensureConfigured()
  if (!configured) return

  let subscriptions: { id: string; endpoint: string; p256dh: string; auth: string }[]
  try {
    subscriptions = await prisma.pushSubscription.findMany({
      select: { id: true, endpoint: true, p256dh: true, auth: true },
    })
  } catch (e) {
    console.error('[push] Failed to load subscriptions:', e)
    return
  }

  if (subscriptions.length === 0) return

  const message = JSON.stringify(payload)

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          message,
        )
      } catch (e: unknown) {
        const status = (e as { statusCode?: number }).statusCode
        if (status === 404 || status === 410) {
          // Subscription expired or unsubscribed — remove it
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
          console.log('[push] Removed stale subscription:', sub.id)
        } else {
          console.error('[push] Failed to send to', sub.id, e)
        }
      }
    }),
  )
}

export async function sendOrderPushNotification(order: {
  name:  string
  city:  string
  total: number
}): Promise<void> {
  await sendPushToAll({
    title: '🛒 Nouvelle commande — ProExcel',
    body:  `${order.name} • ${order.city}\nTotal: ${order.total} DH`,
    url:   '/admin/orders',
  })
}
