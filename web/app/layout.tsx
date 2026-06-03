import type { Metadata } from 'next'
import './globals.css'
import SettingsProvider from '@/components/SettingsProvider'

import { prisma } from '@/lib/prisma'

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl = '/favicon.ico'
  let seoTitle = 'ProExcel – Maktaba | Livres Scolaires & Parascolaires'
  let seoDesc = 'Livres scolaires et parascolaires au Maroc. Primaire, collège, lycée. Livraison 48h partout au Maroc.'

  try {
    const faviconSetting = await prisma.setting.findUnique({ where: { key: 'site_favicon' } })
    const logoSetting = await prisma.setting.findUnique({ where: { key: 'site_logo' } })
    
    faviconUrl = faviconSetting?.value
               || logoSetting?.value
               || '/favicon.ico'

    const titleSetting = await prisma.setting.findUnique({ where: { key: 'seo_title' } })
    if (titleSetting?.value) {
      seoTitle = titleSetting.value
    }
    const descSetting = await prisma.setting.findUnique({ where: { key: 'seo_desc' } })
    if (descSetting?.value) {
      seoDesc = descSetting.value
    }
  } catch (err) {
    console.error('Failed to load SEO / favicon settings in root layout:', err)
  }

  return {
    title: seoTitle,
    description: seoDesc,
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
      shortcut: faviconUrl,
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        {/* Apply saved theme + dir BEFORE first paint to prevent flash */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: `try{var _t=localStorage.getItem('proexcel_theme');if(_t){document.documentElement.setAttribute('data-theme',_t);if(_t==='dark')document.documentElement.classList.add('dark');}else{document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}var _l=localStorage.getItem('proexcel_lang');if(!_l)_l='ar';if(_l==='ar'){document.documentElement.setAttribute('dir','rtl');document.documentElement.setAttribute('lang','ar');}else{document.documentElement.setAttribute('dir','ltr');document.documentElement.setAttribute('lang',_l);}}catch(e){}` }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#050505" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SettingsProvider />
        {children}
      </body>
    </html>
  )
}
