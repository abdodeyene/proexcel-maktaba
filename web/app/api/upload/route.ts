import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

async function uploadToSupabase(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const res = await fetch(
    `${process.env.SUPABASE_URL}/storage/v1/object/uploads/${filename}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: bytes,
    }
  )
  if (!res.ok) throw new Error('Supabase upload failed')
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${filename}`
}

async function uploadToLocal(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  await writeFile(path.join(uploadDir, filename), buffer)
  return `/uploads/${filename}`
}

export async function POST(req: NextRequest) {
  try {
    requireAuth(req)
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    const urls: string[] = []
    for (const file of files) {
      const url = process.env.SUPABASE_URL
        ? await uploadToSupabase(file)
        : await uploadToLocal(file)
      urls.push(url)
    }

    return NextResponse.json({ urls })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    if (e instanceof Error && e.message === 'Supabase upload failed')
      return NextResponse.json({ message: 'Image upload failed' }, { status: 500 })
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
