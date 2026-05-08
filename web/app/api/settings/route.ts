import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const settings = await prisma.setting.findMany()
    const map: Record<string, string | null> = {}
    settings.forEach(s => { map[s.key] = s.value })
    return NextResponse.json(map)
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    requireAuth(req)
    const dto = await req.json()
    const ops = Object.entries(dto).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
    await Promise.all(ops)
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    const msg = e instanceof Error ? e.message : String(e)
    console.error('Settings PATCH error:', e)
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
