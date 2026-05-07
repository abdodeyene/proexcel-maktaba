import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import HeroSlider from '@/components/HeroSlider'
import Link from 'next/link'
import { cookies } from 'next/headers'

export const revalidate = 60

export default async function HomePage() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'fr'

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  const featured = products.filter(p => p.isBestOffer).slice(0, 8)
  const promos = products.filter(p => p.isPromo).slice(0, 8)

  const t = {
    fr: {
      browse: 'Parcourir',
      ourCat: 'Nos Catégories',
      catSub: 'Des livres pour tous les niveaux et toutes les matières du système éducatif marocain',
      lto: 'Offre Limitée',
      freeShip: 'Livraison Gratuite',
      from: 'dès',
      shipSub: 'Commandez plus de livres et bénéficiez de la livraison gratuite partout au Maroc!',
      titles: 'Titres disponibles',
      clients: 'Clients satisfaits',
      savings: 'Économies max',
      seeAll: 'Voir toutes les offres ›',
      trend: 'Tendances',
      featBooks: 'Livres en Vedette',
      featSub: 'Les manuels les plus demandés cette saison',
      promoTag: 'Promotions',
      specialOff: 'Offres Spéciales',
      promoSub: 'Des prix réduits sur une sélection de livres scolaires',
      findUs: 'Nous Trouver',
      ourStore: 'Notre Boutique',
      address: 'Adresse',
      hours: 'Horaires',
      openMap: 'Ouvrir dans Maps',
      monFri: 'Lun – Ven',
      sat: 'Samedi',
      sun: 'Dimanche',
      holidays: 'Jours fériés',
      closed: 'Fermé',
      realAddr: 'Bouznika, Maroc'
    },
    ar: {
      browse: 'تصفح',
      ourCat: 'فئاتنا',
      catSub: 'كتب لجميع المستويات والمواد في النظام التعليمي المغربي',
      lto: 'عرض محدود',
      freeShip: 'توصيل مجاني',
      from: 'ابتداءً من',
      shipSub: 'اطلب المزيد من الكتب واستفد من التوصيل المجاني في جميع أنحاء المغرب!',
      titles: 'عناوين متوفرة',
      clients: 'عملاء راضون',
      savings: 'أقصى توفير',
      seeAll: 'عرض جميع العروض ›',
      trend: 'رائج',
      featBooks: 'كتب مميزة',
      featSub: 'الكتب الأكثر طلباً هذا الموسم',
      promoTag: 'تخفيضات',
      specialOff: 'عروض خاصة',
      promoSub: 'أسعار مخفضة على مجموعة مختارة من الكتب',
      findUs: 'موقعنا',
      ourStore: 'متجرنا',
      address: 'العنوان',
      hours: 'ساعات العمل',
      openMap: 'فتح في الخرائط',
      monFri: 'الاثنين - الجمعة',
      sat: 'السبت',
      sun: 'الأحد',
      holidays: 'أيام العطل',
      closed: 'مغلق',
      realAddr: 'بوزنيقة، المغرب'
    }
  }

  const currentT = t[locale as 'fr' | 'ar']

  return (
    <>
      {/* HERO SLIDER */}
      <HeroSlider />

      {/* CATEGORIES */}
      <div className="section">
        <div className="section-header">
          <div className="section-tag">{currentT.browse}</div>
          <h2 className="section-title">{currentT.ourCat}</h2>
          <p className="section-sub">{currentT.catSub}</p>
        </div>
        <div className="categories-grid" id="categoriesGrid">
          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat.name).length
            return (
              <Link key={cat.id} href={`/best-offers?cat=${encodeURIComponent(cat.name)}`} className="category-card">
                <div className="cat-circle" style={{
                  width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden',
                  background: cat.image ? 'transparent' : `linear-gradient(135deg, ${cat.color || '#c8102e'}55, ${cat.color || '#c8102e'}22)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  border: `2px solid ${cat.color || '#c8102e'}44`,
                  boxShadow: `0 4px 20px ${cat.color || '#c8102e'}33`,
                  position: 'relative'
                }}>
                  {cat.image
                    ? <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '2.8rem' }}>{cat.emoji || '📚'}</span>
                  }
                  <div className="cat-hover-overlay">
                    {cat.name}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* PROMO BANNER */}
      <div className="promo-wrap">
        <div className="promo-banner">
          <div className="promo-text">
            <div className="section-tag">{currentT.lto}</div>
            <h2>{currentT.freeShip}<br />{currentT.from} <span className="text-gold">499 DH</span></h2>
            <p>{currentT.shipSub}</p>
          </div>
          <div className="promo-stats">
            <div className="p-stat">
              <div className="p-stat-num">1200+</div>
              <div className="p-stat-label">{currentT.titles}</div>
            </div>
            <div className="p-stat">
              <div className="p-stat-num">15K+</div>
              <div className="p-stat-label">{currentT.clients}</div>
            </div>
            <div className="p-stat">
              <div className="p-stat-num">30%</div>
              <div className="p-stat-label">{currentT.savings}</div>
            </div>
          </div>
          <Link href="/best-offers" className="btn-primary">
            {currentT.seeAll}
          </Link>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <div className="section">
          <div className="section-header">
            <div className="section-tag">{currentT.trend}</div>
            <h2 className="section-title">{currentT.featBooks}</h2>
            <p className="section-sub">{currentT.featSub}</p>
          </div>
          <div>
            <div className="products-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PROMO PRODUCTS */}
      {promos.length > 0 && (
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <div className="section-tag">{currentT.promoTag}</div>
            <h2 className="section-title">{currentT.specialOff}</h2>
            <p className="section-sub">{currentT.promoSub}</p>
          </div>
          <div className="scroll-wrap" style={{ padding: '0 1rem' }}>
            <div className="products-grid">
              {promos.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/best-offers" className="btn-primary">
              {currentT.seeAll}
            </Link>
          </div>
        </div>
      )}

      {/* LOCATION & HOURS */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="section-header">
            <div className="section-tag">{currentT.findUs}</div>
            <h2 className="section-title">{currentT.ourStore}</h2>
          </div>
          <div className="location-grid" style={{ marginTop: '2.5rem' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                {currentT.address}
              </div>
              <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '0.9rem', marginBottom: '1rem' }}>
                {currentT.realAddr}
              </p>
              <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
                 <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207.26730226122532!2d-7.163565696074601!3d33.7793485957184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7a61535e16707%3A0x99a79e97743e3a!2sBouznika!5e0!3m2!1sen!2sma!4v1777733390873!5m2!1sen!2sma" width="100%" height="200" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary)' }}>🕐 {currentT.hours}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                {[[currentT.monFri, '08:30 – 19:00'], [currentT.sat, '09:00 – 18:00'], [currentT.sun, '10:00 – 14:00'], [currentT.holidays, currentT.closed]].map(([day, time]) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text2)' }}>{day}</span>
                    <span style={{ fontWeight: 600, color: time === currentT.closed ? 'var(--red)' : 'var(--text)' }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
