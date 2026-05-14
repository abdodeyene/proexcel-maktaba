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
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a237e" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=IBM+Plex+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SettingsProvider />
        {children}
      </body>
    </html>
  )
}
