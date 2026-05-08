import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

async function uploadToCloudinary(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const blob = new Blob([bytes], { type: file.type })

  const fd = new FormData()
  fd.append('file', blob, file.name)
  fd.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET!)
  fd.append('folder', 'proexcel')

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: fd }
  )
  if (!res.ok) throw new Error('Cloudinary upload failed')
  const data = await res.json()
  return data.secure_url as string
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
      const url = process.env.CLOUDINARY_CLOUD_NAME
        ? await uploadToCloudinary(file)
        : await uploadToLocal(file)
      urls.push(url)
    }

    return NextResponse.json({ urls })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    if (e instanceof Error && e.message === 'Cloudinary upload failed')
      return NextResponse.json({ message: 'Image upload failed' }, { status: 500 })
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
