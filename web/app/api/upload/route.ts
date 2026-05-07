import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    requireAuth(req)
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const urls: string[] = []
    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      await writeFile(path.join(uploadDir, filename), buffer)
      urls.push(`/uploads/${filename}`)
    }

    return NextResponse.json({ urls })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
