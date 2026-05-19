'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { LangProvider } from '@/components/LangContext'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/login') {
    return <>{children}</>
  }

  return (
    <LangProvider>
      {/* Header is fixed-position — rendered outside the flex column so it never
          participates in flow layout, not even during initial HTML parse */}
      <Header />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div key={pathname} style={{ paddingTop: pathname === '/' ? '0' : 'calc(68px + min(env(safe-area-inset-top, 0px), 60px))', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
        <Footer />
      </div>
    </LangProvider>
  )
}
