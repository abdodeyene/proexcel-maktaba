import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

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

    if (Object.keys(dto).length === 1 && dto.button_styles !== undefined) {
      const savedSetting = await prisma.setting.upsert({
        where: { key: "button_styles" },
        update: { value: String(dto.button_styles) },
        create: { key: "button_styles", value: String(dto.button_styles) },
      })
      return NextResponse.json({ ok: true, savedSetting })
    }

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
