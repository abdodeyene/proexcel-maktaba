import { Suspense } from 'react'
import ThankYouClient from './ThankYouClient'

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text2)' }}>Chargement...</div>}>
      <ThankYouClient />
    </Suspense>
  )
}
