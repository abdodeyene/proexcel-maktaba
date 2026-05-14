import webpush from 'web-push'
import { prisma } from '@/lib/prisma'

let configured = false

function ensureConfigured() {
  if (configured) return
  const email      = process.env.VAPID_EMAIL
  const publicKey  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  console.log('[push] VAPID_PUBLIC_KEY exists:', !!publicKey)
  console.log('[push] VAPID_PRIVATE_KEY exists:', !!privateKey)
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

export type PushResult = {
  subscriptionsCount: number
  attempted:          number
  sent:               number
  deletedStale:       number
}

export async function sendPushToAll(payload: PushPayload): Promise<PushResult> {
  ensureConfigured()

  const result: PushResult = { subscriptionsCount: 0, attempted: 0, sent: 0, deletedStale: 0 }

  if (!configured) return result

  let subscriptions: { id: string; endpoint: string; p256dh: string; auth: string }[]
  try {
    subscriptions = await prisma.pushSubscription.findMany({
      select: { id: true, endpoint: true, p256dh: true, auth: true },
    })
  } catch (e) {
    console.error('[push] Failed to load subscriptions:', e)
    return result
  }

  result.subscriptionsCount = subscriptions.length
  console.log('[push] subscriptions count:', subscriptions.length)

  if (subscriptions.length === 0) return result

  const message = JSON.stringify(payload)

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      result.attempted++
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          message,
        )
        result.sent++
        console.log('[push] sent to subscription:', sub.id)
      } catch (e: unknown) {
        const status = (e as { statusCode?: number }).statusCode
        if (status === 404 || status === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
          result.deletedStale++
          console.log('[push] removed stale subscription:', sub.id)
        } else {
          console.error('[push] failed to send to', sub.id, e)
        }
      }
    }),
  )

  return result
}

export async function sendOrderPushNotification(
  order: Record<string, unknown>,
): Promise<PushResult> {
  const customerName =
    (order.customerName as string | undefined) ||
    (order.name        as string | undefined) ||
    ((order.customer as Record<string, unknown> | undefined)?.name as string | undefined) ||
    'Client'

  const city =
    (order.city         as string | undefined) ||
    (order.customerCity as string | undefined) ||
    'Ville non définie'

  const total = Number(
    order.total       ??
    order.totalAmount ??
    order.finalTotal  ??
    0,
  )

  return sendPushToAll({
    title: '🛒 Nouvelle commande — ProExcel',
    body:  `${customerName} • ${city}\nTotal: ${total} DH`,
    url:   '/admin/orders',
  })
}
