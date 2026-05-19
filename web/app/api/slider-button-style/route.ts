import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const style = await prisma.sliderButtonStyle.findUnique({ where: { id: 'default' } })
    return NextResponse.json(style ?? {})
  } catch {
    return NextResponse.json({})
  }
}

export async function PATCH(req: NextRequest) {
  try {
    requireAuth(req)
    const dto = await req.json() as Prisma.SliderButtonStyleUpdateInput
    const style = await prisma.sliderButtonStyle.upsert({
      where: { id: 'default' },
      create: { id: 'default', ...(dto as Prisma.SliderButtonStyleCreateInput) },
      update: dto,
    })
    return NextResponse.json(style)
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
