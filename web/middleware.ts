import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('admin_token')?.value
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('from', 'admin')
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
