import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const settingsList = await prisma.setting.findMany({
      where: { key: { in: ['store_emoji', 'col_primary', 'site_favicon'] } }
    })
    
    const settings = settingsList.reduce((acc: any, s) => {
      acc[s.key] = s.value
      return acc
    }, { store_emoji: '📚', col_primary: '#3b82f6', site_favicon: '' })

    const favicon = settings.site_favicon
    if (favicon && (favicon.startsWith('http') || favicon.startsWith('/'))) {
      // Wrap in a square SVG so the favicon is always 1:1 regardless of original image dimensions
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100"><image href="${favicon}" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice"/></svg>`
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        }
      })
    }

    const emoji = settings.store_emoji || '📚'
    
    // Generate a simple SVG favicon with the emoji
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="20" fill="transparent" />
        <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="70">${emoji}</text>
      </svg>
    `.trim()

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (err) {
    return new NextResponse('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📚</text></svg>', {
      headers: { 'Content-Type': 'image/svg+xml' }
    })
  }
}
