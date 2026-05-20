'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { LangProvider } from '@/components/LangContext'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/' || (typeof window !== 'undefined' && window.location.pathname === '/')

  // Reset scroll on homepage so at-hero transparency is guaranteed
  useEffect(() => {
    if (isHome) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [isHome])

  // Apply home page class to body for background styling
  useEffect(() => {
    if (isHome) {
      document.body.classList.add('is-home-page')
    } else {
      document.body.classList.remove('is-home-page')
    }
    return () => {
      document.body.classList.remove('is-home-page')
    }
  }, [isHome])

  if (pathname === '/login') {
    return <>{children}</>
  }

  return (
    <LangProvider>
      {/* Header is fixed-position — rendered outside the flex column so it never
          participates in flow layout, not even during initial HTML parse */}
      <Header />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: isHome ? 'var(--home-bg, #030712)' : undefined }}>
        <div
          key={pathname}
          className={isHome ? 'store-main-home' : 'store-main-page'}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {children}
        </div>
        <Footer />
      </div>
    </LangProvider>
  )
}
