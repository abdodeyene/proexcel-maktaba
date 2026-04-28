import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    requireAuth(req)
    const [total, pending, completed, revenue] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'completed' } }),
      prisma.order.aggregate({ _sum: { total: true } }),
    ])
    return NextResponse.json({
      total,
      pending,
      completed,
      revenue: revenue._sum.total || 0,
    })
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
}
