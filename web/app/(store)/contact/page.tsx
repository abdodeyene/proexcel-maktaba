export default function ContactPage() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ fontSize: '.75rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#3b82f6', background: 'rgba(59,130,246,.1)', padding: '.25rem .75rem', borderRadius: 9999, display: 'inline-block', marginBottom: '.75rem' }}>Contact</div>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#eef0f5', marginBottom: '2rem' }}>Nous Contacter</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {[['📞', 'Téléphone', '+212 6 12 34 56 78'], ['📧', 'Email', 'contact@proexcel.ma'], ['📍', 'Adresse', 'Avenue Mohammed V, Rabat'], ['🕐', 'Horaires', 'Lun-Ven: 08:30-19:00']].map(([icon, label, val]) => (
          <div key={label} style={{ background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.15)', borderRadius: 16, padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>{icon}</div>
            <div style={{ fontSize: '.78rem', color: '#8b96b0', marginBottom: '.25rem' }}>{label}</div>
            <div style={{ fontSize: '.88rem', color: '#eef0f5', fontWeight: 500 }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
