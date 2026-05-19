import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const maxDuration = 60

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
])
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp'])
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

async function uploadToSupabase(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const supabaseUrl = process.env.SUPABASE_URL!.replace(/\/$/, '')

  const res = await fetch(
    `${supabaseUrl}/storage/v1/object/uploads/${filename}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: buffer,
    }
  )
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Supabase: ${res.status} – ${errText}`)
  }
  return `${supabaseUrl}/storage/v1/object/public/uploads/${filename}`
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

    if (files.length === 0) {
      return NextResponse.json({ message: 'No files provided' }, { status: 400 })
    }
    if (files.length > 10) {
      return NextResponse.json({ message: 'Too many files (max 10)' }, { status: 400 })
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ message: `File too large: ${file.name} (max 5 MB)` }, { status: 400 })
      }

      const mimeType = file.type.toLowerCase()
      if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        return NextResponse.json({ message: `Invalid file type: ${mimeType}` }, { status: 400 })
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json({ message: `Invalid file extension: .${ext}` }, { status: 400 })
      }
    }

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
    if (e instanceof Error && e.message.startsWith('Supabase:'))
      return NextResponse.json({ message: 'Upload failed' }, { status: 500 })
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
