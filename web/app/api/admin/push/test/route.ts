import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendPushToAll } from '@/lib/push'

export async function POST(req: NextRequest) {
  try {
    requireAuth(req)

    const total = await prisma.pushSubscription.count()

    await sendPushToAll({
      title: 'Test ProExcel',
      body:  'Push notifications are working ✓',
      url:   '/admin/orders',
    })

    return NextResponse.json({ success: true, subscriptions: total, attempted: total })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    console.error('[push/test]', e)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
