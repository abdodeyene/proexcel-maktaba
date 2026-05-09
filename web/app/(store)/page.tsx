'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import HeroSlider from '@/components/HeroSlider'
import Link from 'next/link'
import { useLang } from '@/components/LangContext'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { usePathname } from 'next/navigation'

type Feature = {
  icon: string
  titleFr: string
  titleAr: string
  subFr: string
  subAr: string
}

const DEFAULT_FEATURES: Feature[] = [
  { icon: 'delivery', titleFr: 'Livraison 48h', titleAr: 'توصيل خلال 48 ساعة', subFr: 'Partout au Maroc', subAr: 'في جميع أنحاء المغرب' },
  { icon: 'security', titleFr: 'Paiement Sécurisé', titleAr: 'دفع آمن', subFr: 'Transactions protégées', subAr: 'معاملات محمية' },
  { icon: 'catalog', titleFr: '1200+ Titres', titleAr: '+1200 عنوان', subFr: 'Catalogue complet', subAr: 'كتالوج شامل' },
  { icon: 'clients', titleFr: '15K+ Clients', titleAr: '+15000 عميل', subFr: 'Clients satisfaits', subAr: 'عملاء راضون' },
]

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  delivery: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  security: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  catalog: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  clients: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
}

type Product = {
  id: number
  title: string
  titleAr?: string | null
  author?: string | null
  price: number
  compareAtPrice?: number | null
  category?: string | null
  g1?: string | null
  g2?: string | null
  emoji?: string | null
  stock: number
  rating?: number | null
  reviewCount?: number | null
  isPromo?: boolean | null
  isNew?: boolean | null
  isBestOffer?: boolean | null
  description?: string | null
  variants?: unknown | null
  media?: unknown | null
  reviews?: unknown | null
}

type Category = {
  id: number
  name: string
  emoji?: string | null
  color?: string | null
  image?: string | null
}

const STAGGER = ['', 'reveal-d1', 'reveal-d2', 'reveal-d3', 'reveal-d4', 'reveal-d5', 'reveal-d6']

export default function HomePage() {
  const { lang } = useLang()
  const pathname = usePathname()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [features, setFeatures] = useState<Feature[]>(DEFAULT_FEATURES)

  useScrollAnimation()

  useEffect(() => {
    let alive = true

    const loadData = () => {
      fetch('/api/products').then(r => r.json()).then(d => {
        if (alive && Array.isArray(d)) setProducts(d)
      }).catch(() => {})
      fetch('/api/categories').then(r => r.json()).then(d => {
        if (alive && Array.isArray(d)) setCategories(d)
      }).catch(() => {})
      fetch('/api/settings').then(r => r.json()).then(d => {
        if (!alive) return
        if (d?.features_strip) {
          try {
            const parsed = JSON.parse(d.features_strip)
            if (Array.isArray(parsed) && parsed.length > 0) setFeatures(parsed)
          } catch { /* keep defaults */ }
        }
      }).catch(() => {})
    }

    loadData()

    const onVisible = () => { if (document.visibilityState === 'visible') loadData() }
    window.addEventListener('focus', loadData)
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      alive = false
      window.removeEventListener('focus', loadData)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [pathname])

  const featured = products.filter(p => p.isBestOffer).slice(0, 8)
  const promos = products.filter(p => p.isPromo).slice(0, 6)

  const t = {
    fr: {
      browse: 'Catalogue',
      ourCat: 'Nos Catégories',
      catSub: 'Tous les niveaux et matières du programme national marocain',
      levelsTag: 'Niveaux Scolaires',
      levelsTitle: 'Trouvez vos livres par niveau',
      levelsSub: 'Sélectionnez votre niveau pour accéder directement aux manuels adaptés',
      primaire: 'Primaire', primaireYears: '1ère – 6ème Année', primaireDesc: 'Manuels officiels pour le cycle primaire, toutes matières.',
      college: 'Collège', collegeYears: '1ère – 3ème Année Collège', collegeDesc: 'Livres scolaires pour le cycle collégial, français et arabe.',
      lycee: 'Lycée', lyceeYears: 'Tronc Commun · 1ère · 2ème Bac', lyceeDesc: 'Manuels et parascolaires pour le baccalauréat.',
      shopNow: 'Explorer',
      lto: 'Offre Spéciale',
      freeShip: 'Livraison Gratuite',
      freeShipEm: 'dès 499 DH',
      shipSub: 'Commandez plus de livres et profitez de la livraison offerte partout au Maroc.',
      titles: 'Titres disponibles',
      clients: 'Clients satisfaits',
      savings: 'Économies max',
      seeAll: 'Voir toutes les offres',
      trend: 'Tendances',
      featBooks: 'Livres en Vedette',
      featSub: 'Les manuels les plus demandés cette saison scolaire',
      promoTag: 'Promotions',
      specialOff: 'Offres Spéciales',
      promoSub: 'Prix réduits sur une sélection de livres scolaires',
      engageTag: 'Nos Engagements',
      engageTitle: 'Pourquoi choisir ProExcel ?',
      engageSub: 'La librairie scolaire de référence au Maroc depuis des années',
      e1Title: 'Programme Officiel Marocain',
      e1Desc: 'Tous nos manuels sont conformes au programme du Ministère de l\'Éducation Nationale.',
      e2Title: 'Livraison Rapide 48h',
      e2Desc: 'Livraison express partout au Maroc. Gratuite dès 499 DH d\'achat.',
      e3Title: 'Paiement 100% Sécurisé',
      e3Desc: 'CMI, virement bancaire ou paiement à la livraison. Vos données sont protégées.',
      e4Title: 'Retours Faciles',
      e4Desc: 'Retours acceptés sous 14 jours. Service client disponible 6j/7.',
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
      realAddr: 'Bouznika, Maroc',
    },
    ar: {
      browse: 'الفئات',
      ourCat: 'فئاتنا',
      catSub: 'جميع المستويات والمواد في البرنامج الوطني المغربي',
      levelsTag: 'المستويات الدراسية',
      levelsTitle: 'ابحث عن كتبك حسب المستوى',
      levelsSub: 'اختر مستواك للوصول مباشرة إلى الكتب المناسبة',
      primaire: 'الابتدائي', primaireYears: 'السنة الأولى – السادسة', primaireDesc: 'الكتب الرسمية للتعليم الابتدائي لجميع المواد.',
      college: 'الإعدادي', collegeYears: 'السنة الأولى – الثالثة إعدادي', collegeDesc: 'الكتب المدرسية للسلك الإعدادي بالفرنسية والعربية.',
      lycee: 'الثانوي', lyceeYears: 'الجذع المشترك · الأولى · الثانية باك', lyceeDesc: 'الكتب المدرسية والبرامج للبكالوريا.',
      shopNow: 'استكشاف',
      lto: 'عرض خاص',
      freeShip: 'توصيل مجاني',
      freeShipEm: 'ابتداءً من 499 درهم',
      shipSub: 'اطلب المزيد من الكتب واستفد من التوصيل المجاني في جميع أنحاء المغرب.',
      titles: 'عناوين متوفرة',
      clients: 'عملاء راضون',
      savings: 'أقصى توفير',
      seeAll: 'عرض جميع العروض',
      trend: 'رائج',
      featBooks: 'كتب مميزة',
      featSub: 'الكتب الأكثر طلباً هذا الموسم الدراسي',
      promoTag: 'تخفيضات',
      specialOff: 'عروض خاصة',
      promoSub: 'أسعار مخفضة على مجموعة مختارة من الكتب',
      engageTag: 'التزاماتنا',
      engageTitle: 'لماذا تختار برو إكسيل؟',
      engageSub: 'المكتبة المدرسية المرجعية في المغرب منذ سنوات',
      e1Title: 'البرنامج الوطني المغربي الرسمي',
      e1Desc: 'جميع كتبنا متوافقة مع برنامج وزارة التربية الوطنية.',
      e2Title: 'توصيل سريع خلال 48 ساعة',
      e2Desc: 'توصيل سريع في جميع أنحاء المغرب. مجاني من 499 درهم.',
      e3Title: 'دفع آمن 100%',
      e3Desc: 'CMI أو تحويل بنكي أو الدفع عند الاستلام. بياناتك محمية.',
      e4Title: 'إرجاع سهل',
      e4Desc: 'الإرجاع مقبول خلال 14 يوماً. خدمة العملاء متاحة 6 أيام/7.',
      findUs: 'موقعنا',
      ourStore: 'متجرنا',
      address: 'العنوان',
      hours: 'ساعات العمل',
      openMap: 'فتح في الخرائط',
      monFri: 'الاثنين – الجمعة',
      sat: 'السبت',
      sun: 'الأحد',
      holidays: 'أيام العطل',
      closed: 'مغلق',
      realAddr: 'بوزنيقة، المغرب',
    }
  }

  const T = t[lang]

  const LEVELS = [
    {
      key: 'primaire',
      name: T.primaire,
      years: T.primaireYears,
      desc: T.primaireDesc,
      href: '/primaire',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
    },
    {
      key: 'college',
      name: T.college,
      years: T.collegeYears,
      desc: T.collegeDesc,
      href: '/college',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="13" y2="11"/>
        </svg>
      ),
    },
    {
      key: 'lycee',
      name: T.lycee,
      years: T.lyceeYears,
      desc: T.lyceeDesc,
      href: '/lycee',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
        </svg>
      ),
    },
  ]

  const ENGAGEMENTS = [
    {
      key: 'prog',
      title: T.e1Title,
      desc: T.e1Desc,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>
        </svg>
      ),
    },
    {
      key: 'delivery',
      title: T.e2Title,
      desc: T.e2Desc,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
    },
    {
      key: 'secure',
      title: T.e3Title,
      desc: T.e3Desc,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
      ),
    },
    {
      key: 'returns',
      title: T.e4Title,
      desc: T.e4Desc,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
        </svg>
      ),
    },
  ]

  return (
    <>
      {/* ── HERO ── */}
      <HeroSlider />

      {/* ── TRUST BAR ── */}
      <div className="features-strip">
        <div className="features-inner">
          {features.map((f, i) => {
            const svgIcon = FEATURE_ICONS[f.icon]
            return (
              <div key={i} className={`feature-item scroll-reveal ${STAGGER[i] || ''}`}>
                <div className="feature-icon-wrap">
                  {svgIcon || (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  )}
                </div>
                <div>
                  <div className="feature-title">{lang === 'ar' ? f.titleAr : f.titleFr}</div>
                  <div className="feature-sub">{lang === 'ar' ? f.subAr : f.subFr}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── SCHOOL LEVELS ── */}
      <div className="levels-section">
        <div className="levels-inner">
          <div className="section-header scroll-reveal">
            <div className="section-tag">{T.levelsTag}</div>
            <h2 className="section-title">{T.levelsTitle}</h2>
            <p className="section-sub">{T.levelsSub}</p>
          </div>
          <div className="levels-grid">
            {LEVELS.map((lvl, i) => (
              <Link key={lvl.key} href={lvl.href} className={`level-card scroll-reveal reveal-scale ${STAGGER[i + 1]}`}>
                <div className="level-icon">{lvl.icon}</div>
                <div className="level-name">{lvl.name}</div>
                <div className="level-sub">{lvl.years} — {lvl.desc}</div>
                <div className="level-link">
                  {T.shopNow}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div className="section">
        <div className="section-header scroll-reveal">
          <div className="section-tag">{T.browse}</div>
          <h2 className="section-title">{T.ourCat}</h2>
          <p className="section-sub">{T.catSub}</p>
        </div>
        <div className="cats-grid">
          {categories.map((cat, idx) => {
            const count = products.filter(p => p.category === cat.name).length
            return (
              <Link key={cat.id} href={`/best-offers?cat=${encodeURIComponent(cat.name)}`} className={`cat-card scroll-reveal ${STAGGER[Math.min(idx, 6)]}`}>
                <div className="cat-card-bg">
                  {cat.image
                    ? <img src={cat.image} alt={cat.name} />
                    : <div className="cat-card-bg-fallback" />
                  }
                </div>
                <div className="cat-card-overlay" />
                <div className="cat-card-content">
                  <div className="cat-card-name">
                    <span className="cat-dot" />
                    {cat.name}
                  </div>
                  <div className="cat-card-footer">
                    <span className="cat-card-count">{count} {lang === 'fr' ? 'articles' : 'منتج'}</span>
                    <span className="cat-card-arrow">{lang === 'ar' ? '‹' : '›'}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      {featured.length > 0 && (
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="section-header scroll-reveal">
            <div className="section-tag">{T.trend}</div>
            <h2 className="section-title">{T.featBooks}</h2>
            <p className="section-sub">{T.featSub}</p>
          </div>
          <div className="products-grid scroll-reveal reveal-d1">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </div>
      )}

      {/* ── PROMO STRIP ── */}
      <div className="promo-strip">
        <div className="promo-strip-inner">
          <div className="scroll-reveal">
            <div className="promo-strip-label">{T.lto}</div>
            <h2>
              {T.freeShip} — <em>{T.freeShipEm}</em>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', marginTop: '0.5rem', fontFamily: 'var(--font-latin)' }}>
              {T.shipSub}
            </p>
          </div>

          <div className="promo-strip-stats">
            <div className="promo-stat scroll-reveal reveal-d1">
              <span className="promo-stat-num">1200+</span>
              <span className="promo-stat-label">{T.titles}</span>
            </div>
            <div className="promo-stat scroll-reveal reveal-d2">
              <span className="promo-stat-num">15K+</span>
              <span className="promo-stat-label">{T.clients}</span>
            </div>
            <div className="promo-stat scroll-reveal reveal-d3">
              <span className="promo-stat-num">30%</span>
              <span className="promo-stat-label">{T.savings}</span>
            </div>
          </div>

          <Link href="/best-offers" className="promo-strip-btn scroll-reveal reveal-d2">
            {T.seeAll}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* ── PROMO PRODUCTS ── */}
      {promos.length > 0 && (
        <div className="section">
          <div className="section-header scroll-reveal">
            <div className="section-tag">{T.promoTag}</div>
            <h2 className="section-title">{T.specialOff}</h2>
            <p className="section-sub">{T.promoSub}</p>
          </div>
          <div className="products-grid scroll-reveal reveal-d1">
            {promos.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }} className="scroll-reveal reveal-d2">
            <Link href="/best-offers" className="btn-primary">
              {T.seeAll} ›
            </Link>
          </div>
        </div>
      )}

      {/* ── ENGAGEMENTS ── */}
      <div className="engage-section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="engage-inner">
          <div className="section-header scroll-reveal">
            <div className="section-tag">{T.engageTag}</div>
            <h2 className="section-title">{T.engageTitle}</h2>
            <p className="section-sub">{T.engageSub}</p>
          </div>
          <div className="engage-grid">
            {ENGAGEMENTS.map((e, i) => (
              <div key={e.key} className={`engage-item scroll-reveal ${STAGGER[i + 1]}`}>
                <div className="engage-icon">{e.icon}</div>
                <div className="engage-title">{e.title}</div>
                <div className="engage-desc">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── NOTRE BOUTIQUE ── */}
      <div className="store-section">
        <div className="store-inner">
          <div className="store-header scroll-reveal">
            <div className="section-tag">{T.findUs}</div>
            <h2 className="section-title">{T.ourStore}</h2>
          </div>

          <div className="store-card">
            <div className="store-map scroll-reveal reveal-left">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207.26730226122532!2d-7.163565696074601!3d33.7793485957184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7a61535e16707%3A0x99a79e97743e3a!2sBouznika!5e0!3m2!1sen!2sma!4v1777733390873!5m2!1sen!2sma"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '320px', display: 'block' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation ProExcel"
              />
            </div>

            <div className="store-info scroll-reveal reveal-right reveal-d1">
              <div className="store-info-row">
                <div className="store-info-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div>
                  <div className="store-info-label">{T.address}</div>
                  <div className="store-info-value">{T.realAddr}</div>
                </div>
              </div>

              <div>
                <div className="store-info-row" style={{ marginBottom: '0.75rem' }}>
                  <div className="store-info-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div className="store-info-label" style={{ marginBottom: 0, lineHeight: '36px' }}>{T.hours}</div>
                </div>
                <div className="store-hours-list">
                  {[
                    [T.monFri, '08:30 – 19:00'],
                    [T.sat, '09:00 – 18:00'],
                    [T.sun, T.closed],
                    [T.holidays, T.closed],
                  ].map(([day, time]) => (
                    <div key={day} className="store-hours-row">
                      <span className="store-hours-day">{day}</span>
                      <span className={time === T.closed ? 'store-hours-closed' : 'store-hours-time'}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Bouznika+Maroc"
                target="_blank"
                rel="noopener noreferrer"
                className="store-maps-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                {T.openMap}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
