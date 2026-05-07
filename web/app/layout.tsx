import type { Metadata } from 'next'
import './globals.css'
import SettingsProvider from '@/components/SettingsProvider'

export const metadata: Metadata = {
  title: 'ProExcel – Maktaba | Livres Scolaires & Parascolaires',
  description: 'Livres scolaires et parascolaires au Maroc. Primaire, collège, lycée. Livraison 48h partout au Maroc.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700;800&family=Tajawal:wght@300;400;500;700&family=Readex+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SettingsProvider />
        {children}
      </body>
    </html>
  )
}
