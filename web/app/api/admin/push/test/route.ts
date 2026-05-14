import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { sendPushToAll } from '@/lib/push'

export async function POST(req: NextRequest) {
  try {
    requireAuth(req)

    const result = await sendPushToAll({
      title: 'Test ProExcel',
      body:  'Push notifications are working ✓',
      url:   '/admin/orders',
    })

    return NextResponse.json({ success: true, ...result })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    console.error('[push/test]', e)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
