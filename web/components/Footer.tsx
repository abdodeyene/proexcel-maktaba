import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#0c1028', borderTop: '1px solid rgba(59,130,246,0.15)', marginTop: 'auto', padding: '3rem 1.5rem 1.5rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '.75rem' }}>
              Pro<span style={{ color: '#3b82f6' }}>Excel</span>
            </div>
            <p style={{ color: '#8b96b0', fontSize: '.82rem', lineHeight: 1.6 }}>Votre librairie scolaire de confiance au Maroc.</p>
          </div>
          <div>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '.85rem', fontWeight: 600, marginBottom: '1rem', color: '#eef0f5' }}>Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {[['/', 'Accueil'], ['/best-offers', 'Meilleures Offres'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}><Link href={href} style={{ color: '#8b96b0', fontSize: '.82rem', transition: 'color .2s' }}>{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '.85rem', fontWeight: 600, marginBottom: '1rem', color: '#eef0f5' }}>Infos</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {[['/politique-retour', 'Politique de retour'], ['/cgu', 'CGU'], ['/confidentialite', 'Confidentialité'], ['/shipping', 'Livraison'], ['/faq', 'FAQ']].map(([href, label]) => (
                <li key={href}><Link href={href} style={{ color: '#8b96b0', fontSize: '.82rem' }}>{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '.85rem', fontWeight: 600, marginBottom: '1rem', color: '#eef0f5' }}>Contact</h4>
            <p style={{ color: '#8b96b0', fontSize: '.82rem', lineHeight: 1.8 }}>
              📞 +212 6 12 34 56 78<br />
              📧 contact@proexcel.ma<br />
              📍 Avenue Mohammed V, Rabat
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(59,130,246,0.15)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.75rem' }}>
          <p style={{ color: '#8b96b0', fontSize: '.78rem' }}>© 2026 ProExcel Maktaba. Tous droits réservés.</p>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            {['💳 CMI', '🏦 Virement', '💵 Cash'].map(p => (
              <span key={p} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 6, padding: '.2rem .6rem', fontSize: '.72rem', color: '#8b96b0' }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
