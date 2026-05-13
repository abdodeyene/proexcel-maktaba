import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    requireAuth(req)

    const body = await req.json()

    const endpoint = typeof body?.endpoint === 'string' ? body.endpoint.trim() : ''
    const p256dh   = typeof body?.keys?.p256dh === 'string' ? body.keys.p256dh.trim() : ''
    const auth     = typeof body?.keys?.auth   === 'string' ? body.keys.auth.trim()   : ''

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ message: 'Invalid subscription payload' }, { status: 400 })
    }

    const userAgent = req.headers.get('user-agent')?.slice(0, 512) ?? null

    await prisma.pushSubscription.upsert({
      where:  { endpoint },
      update: { p256dh, auth, userAgent },
      create: { endpoint, p256dh, auth, userAgent },
    })

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    console.error('[push/subscribe]', e)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
