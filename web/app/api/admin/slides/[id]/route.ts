import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req)
    const { id: idStr } = await params
    const id = parseInt(idStr)
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    const dto = await req.json()
    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        tag:             String(dto.tag ?? ''),
        tagAr:           String(dto.tagAr ?? ''),
        title:           String(dto.title ?? ''),
        titleAr:         String(dto.titleAr ?? ''),
        subtitle:        String(dto.subtitle ?? ''),
        subtitleAr:      String(dto.subtitleAr ?? ''),
        ctaText:         String(dto.ctaText ?? ''),
        ctaTextAr:       String(dto.ctaTextAr ?? ''),
        ctaLink:         String(dto.ctaLink ?? '/'),
        ctaText2:        String(dto.ctaText2 ?? ''),
        ctaLink2:        String(dto.ctaLink2 ?? '/'),
        imageUrl:        dto.imageUrl ? String(dto.imageUrl) : null,
        bgPosition:      String(dto.bgPosition ?? 'center'),
        textAlign:       String(dto.textAlign ?? 'center'),
        overlayStrength: String(dto.overlayStrength ?? 'medium'),
        titleColor:      String(dto.titleColor ?? ''),
        subtitleColor:   String(dto.subtitleColor ?? ''),
        tagColor:        String(dto.tagColor ?? ''),
        isActive:        Boolean(dto.isActive),
      },
    })
    return NextResponse.json(slide)
  } catch (e) {
    if (e instanceof Error && e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(req)
    const { id: idStr } = await params
    const id = parseInt(idStr)
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    await prisma.heroSlide.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    if (e instanceof Error && e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
