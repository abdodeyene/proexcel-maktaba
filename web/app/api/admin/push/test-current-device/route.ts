import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { sendPushToOne } from '@/lib/push'

export async function POST(req: NextRequest) {
  try {
    requireAuth(req)

    const body     = await req.json()
    const endpoint = typeof body?.endpoint === 'string' ? body.endpoint.trim() : ''

    if (!endpoint) {
      return NextResponse.json({ message: 'endpoint required' }, { status: 400 })
    }

    console.log('[pushed-test-current] endpoint received')

    const result = await sendPushToOne(endpoint, {
      title: '🔔 Test ProExcel — cet appareil',
      body:  'La notification push fonctionne sur cet appareil ✓',
      url:   '/admin/orders',
    })

    console.log('[pushed-test-current] found', result.found)
    console.log('[pushed-test-current] sent', result.sent === 1)
    if (result.error) console.log('[pushed-test-current] error', result.error)

    if (!result.found) {
      return NextResponse.json({
        success: false,
        found:   false,
        message: 'Current device subscription not found',
      })
    }

    return NextResponse.json({
      success:   true,
      found:     true,
      attempted: result.attempted,
      sent:      result.sent,
      ...(result.error ? { error: result.error } : {}),
    })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    console.error('[pushed-test-current]', e)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
