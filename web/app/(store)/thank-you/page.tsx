import Link from 'next/link'

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams
  return (
    <div style={{ textAlign: 'center', padding: '6rem 1.5rem', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎉</div>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#eef0f5', marginBottom: '1rem' }}>Merci pour votre commande !</h1>
      {order && <p style={{ color: '#8b96b0', marginBottom: '2rem', fontSize: '.9rem' }}>N° de commande: <strong style={{ color: '#3b82f6' }}>{order}</strong></p>}
      <p style={{ color: '#8b96b0', lineHeight: 1.7, marginBottom: '2.5rem' }}>
        Votre commande a été reçue. Nous vous contacterons dans les 24h pour confirmer la livraison.
      </p>
      <Link href="/" style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', padding: '.85rem 2rem', borderRadius: 9999, fontWeight: 600 }}>
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
