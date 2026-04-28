import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    requireAuth(req)
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const where = status ? { status } : {}
    const orders = await prisma.order.findMany({ where, orderBy: { date: 'desc' } })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const dto = await req.json()
    const orderNum = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
    const order = await prisma.order.create({ data: { ...dto, orderNum } })
    return NextResponse.json(order, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
