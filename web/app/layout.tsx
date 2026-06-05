import type { Metadata } from 'next'
import './globals.css'
import SettingsProvider from '@/components/SettingsProvider'

export const metadata: Metadata = {
  title: 'ProExcel – Maktaba | Livres Scolaires & Parascolaires',
  description: 'Livres scolaires et parascolaires au Maroc. Primaire, collège, lycée. Livraison 48h partout au Maroc.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Apply saved theme + dir BEFORE first paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{var _t=localStorage.getItem('proexcel_theme');if(_t)document.documentElement.setAttribute('data-theme',_t);var _l=localStorage.getItem('proexcel_lang');if(_l==='ar'){document.documentElement.setAttribute('dir','rtl');document.documentElement.setAttribute('lang','ar');}}catch(e){}` }} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#050505" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SettingsProvider />
        {children}
      </body>
    </html>
  )
}
