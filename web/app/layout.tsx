import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ProExcel – Maktaba | Livres Scolaires & Parascolaires',
  description: 'Livres scolaires et parascolaires au Maroc. Primaire, collège, lycée. Livraison 48h partout au Maroc.',
  themeColor: '#3b82f6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
