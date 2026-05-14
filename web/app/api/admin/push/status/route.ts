import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    requireAuth(req)

    const body = await req.json()
    const endpoint = typeof body?.endpoint === 'string' ? body.endpoint.trim() : ''

    if (!endpoint) {
      return NextResponse.json({ message: 'endpoint required' }, { status: 400 })
    }

    console.log('[pushed-status] browser endpoint received')

    const [record, subscriptionsCount] = await Promise.all([
      prisma.pushSubscription.findUnique({ where: { endpoint }, select: { id: true } }),
      prisma.pushSubscription.count(),
    ])

    const subscribed = !!record
    console.log('[pushed-status] subscribed', subscribed)

    return NextResponse.json({ success: true, subscribed, subscriptionsCount })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    console.error('[pushed-status]', e)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
