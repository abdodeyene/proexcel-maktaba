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
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div style={{ paddingTop: '68px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
        <Footer />
      </div>
    </LangProvider>
  )
}
