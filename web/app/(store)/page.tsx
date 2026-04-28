import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export const revalidate = 60

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  const featured = products.filter(p => p.isBestOffer).slice(0, 8)
  const promos = products.filter(p => p.isPromo).slice(0, 8)

  return (
    <>
      {/* HERO */}
      <section style={{
        minHeight: '85vh', display: 'flex', alignItems: 'center',
        background: 'radial-gradient(ellipse at 70% 50%, #1a237e 0%, #06091a 65%)',
        padding: '4rem 1.5rem',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          <div style={{ maxWidth: 600 }}>
            <div style={{ fontSize: '.75rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#3b82f6', background: 'rgba(59,130,246,.1)', padding: '.25rem .75rem', borderRadius: 9999, display: 'inline-block', marginBottom: '1rem' }}>
              Rentrée Scolaire 2026
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '1.25rem', color: '#eef0f5' }}>
              Tous vos manuels<br />
              <span style={{ color: '#f59e0b' }}>en un seul endroit</span>
            </h1>
            <p style={{ color: '#8b96b0', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Découvrez notre sélection complète de livres scolaires pour le primaire, collège et lycée au Maroc.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/best-offers" style={{
                background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                color: '#fff', padding: '.75rem 1.75rem', borderRadius: 9999,
                fontWeight: 600, fontSize: '.95rem',
              }}>
                Explorer le catalogue ›
              </Link>
              <a href="#about" style={{
                border: '1px solid rgba(59,130,246,.4)', color: '#3b82f6',
                padding: '.75rem 1.75rem', borderRadius: 9999, fontWeight: 600, fontSize: '.95rem',
              }}>
                En savoir plus
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section style={{ padding: '4rem 1.5rem', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '.75rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#3b82f6', background: 'rgba(59,130,246,.1)', padding: '.25rem .75rem', borderRadius: 9999, display: 'inline-block', marginBottom: '.75rem' }}>Parcourir</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: '#eef0f5' }}>Nos Catégories</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {categories.map(cat => (
              <Link key={cat.id} href={`/best-offers?cat=${encodeURIComponent(cat.name)}`} style={{
                background: 'rgba(12,18,45,0.65)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(59,130,246,0.15)', borderRadius: 16,
                padding: '1.25rem 1rem', textAlign: 'center', transition: 'transform .25s',
                display: 'block',
              }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.transform = '')}
              >
                <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>{cat.emoji}</div>
                <div style={{ fontSize: '.82rem', fontWeight: 600, color: '#eef0f5' }}>{cat.name}</div>
                {cat.count > 0 && <div style={{ fontSize: '.7rem', color: '#8b96b0', marginTop: '.25rem' }}>{cat.count} livres</div>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* PROMO BANNER */}
      <section style={{ padding: '0 1.5rem 4rem', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,.15), rgba(139,92,246,.15))',
          border: '1px solid rgba(59,130,246,.2)', borderRadius: 20,
          padding: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '.75rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#3b82f6', background: 'rgba(59,130,246,.1)', padding: '.25rem .75rem', borderRadius: 9999, display: 'inline-block', marginBottom: '.75rem' }}>Offre Limitée</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.3rem,3vw,1.8rem)', color: '#eef0f5' }}>
              Livraison Gratuite dès <span style={{ color: '#f59e0b' }}>499 DH</span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[['1200+', 'Titres'], ['15K+', 'Clients'], ['30%', 'Économies']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>{num}</div>
                <div style={{ fontSize: '.75rem', color: '#8b96b0' }}>{label}</div>
              </div>
            ))}
          </div>
          <Link href="/best-offers" style={{
            background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
            color: '#fff', padding: '.75rem 1.5rem', borderRadius: 9999, fontWeight: 600, fontSize: '.9rem',
          }}>
            Voir toutes les offres ›
          </Link>
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section style={{ padding: '0 1.5rem 4rem', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '.75rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#3b82f6', background: 'rgba(59,130,246,.1)', padding: '.25rem .75rem', borderRadius: 9999, display: 'inline-block', marginBottom: '.75rem' }}>Tendances</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: '#eef0f5' }}>Livres en Vedette</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* PROMOS */}
      {promos.length > 0 && (
        <section style={{ padding: '0 1.5rem 4rem', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '.75rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#3b82f6', background: 'rgba(59,130,246,.1)', padding: '.25rem .75rem', borderRadius: 9999, display: 'inline-block', marginBottom: '.75rem' }}>Promotions</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: '#eef0f5' }}>Offres Spéciales</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {promos.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/best-offers" style={{
              background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              color: '#fff', padding: '.75rem 1.75rem', borderRadius: 9999, fontWeight: 600,
            }}>
              Voir toutes les offres ›
            </Link>
          </div>
        </section>
      )}

      {/* ABOUT */}
      <section id="about" style={{ padding: '4rem 1.5rem', background: '#0c1028' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: '.75rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#3b82f6', background: 'rgba(59,130,246,.1)', padding: '.25rem .75rem', borderRadius: 9999, display: 'inline-block', marginBottom: '.75rem' }}>Notre Histoire</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem,3vw,2.2rem)', marginBottom: '1rem', color: '#eef0f5' }}>
                ProExcel<br /><span style={{ color: '#f59e0b' }}>Votre Maktaba</span>
              </h2>
              <p style={{ color: '#8b96b0', lineHeight: 1.7, marginBottom: '1rem', fontSize: '.9rem' }}>
                Depuis plus de 10 ans, ProExcel est la référence en matière de livres scolaires et parascolaires au Maroc.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                {[['10+', 'Années'], ['1200+', 'Titres'], ['15K+', 'Clients'], ['48h', 'Livraison']].map(([n, l]) => (
                  <div key={l} style={{ background: 'rgba(59,130,246,.07)', border: '1px solid rgba(59,130,246,.15)', borderRadius: 12, padding: '.75rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3b82f6' }}>{n}</div>
                    <div style={{ fontSize: '.72rem', color: '#8b96b0' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(12,18,45,.65)', border: '1px solid rgba(59,130,246,.15)', borderRadius: 16, padding: '1.5rem' }}>
              <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '.9rem', fontWeight: 600, marginBottom: '1rem', color: '#eef0f5' }}>🕐 Horaires d&apos;Ouverture</h4>
              {[['Lundi – Vendredi', '08:30 – 19:00'], ['Samedi', '09:00 – 18:00'], ['Dimanche', '10:00 – 14:00'], ['Jours fériés', 'Fermé']].map(([day, time]) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid rgba(59,130,246,.1)', fontSize: '.85rem' }}>
                  <span style={{ color: '#8b96b0' }}>{day}</span>
                  <span style={{ color: '#eef0f5', fontWeight: 500 }}>{time}</span>
                </div>
              ))}
              <div style={{ marginTop: '1rem', fontSize: '.82rem', color: '#8b96b0', lineHeight: 1.7 }}>
                📞 +212 6 12 34 56 78<br />
                📧 contact@proexcel.ma
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
