'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import HeroSlider from '@/components/store/HeroSlider'
import StatsBar from '@/components/store/StatsBar'
import InfoStrip from '@/components/store/InfoStrip'
import Testimonials from '@/components/Testimonials'
import Link from 'next/link'
import { useLang } from '@/components/LangContext'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { usePathname } from 'next/navigation'
import {
  MapPin, Clock, Navigation, CheckCircle2, Truck, ShieldCheck,
  Library, BookOpen, GraduationCap, Phone, MessageCircle
} from '@/components/LucideIcons'
import { motion } from 'framer-motion'

const cleanMapIframe = (rawHtml: string | null | undefined) => {
  if (!rawHtml) return ''
  const trimmed = rawHtml.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('//')) {
    return `<iframe src="${trimmed}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`
  }
  const match = rawHtml.match(/<iframe[\s\S]*?<\/iframe>/i)
  return match ? match[0] : rawHtml
}

function ScrollReveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  )
}

type Product = {
  id: number; title: string; titleAr?: string | null; author?: string | null
  price: number; compareAtPrice?: number | null; category?: string | null
  g1?: string | null; g2?: string | null; emoji?: string | null; stock: number
  rating?: number | null; reviewCount?: number | null; isPromo?: boolean | null
  isNew?: boolean | null; isBestOffer?: boolean | null; description?: string | null
  variants?: unknown | null; media?: unknown | null; reviews?: unknown | null
}

type Category = {
  id: number; name: string; emoji?: string | null
  color?: string | null; image?: string | null; count?: number
}

export default function HomePage() {
  const { lang } = useLang()
  const pathname = usePathname()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [settings, setSettings] = useState<Record<string, string | null> | undefined>(undefined)
  const [storeOpen, setStoreOpen] = useState<boolean | null>(null)

  useEffect(() => {
    if (settings) {
      try {
        const checkOpen = () => {
          const options = { timeZone: 'Africa/Casablanca', hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit' } as const
          const formatter = new Intl.DateTimeFormat('en-US', options)
          const parts = formatter.formatToParts(new Date())
          const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]))
          const day = partMap.weekday
          const hour = parseInt(partMap.hour || '0', 10)
          const minute = parseInt(partMap.minute || '0', 10)
          const timeMinutes = hour * 60 + minute
          let openStr = '08:30', closeStr = '19:00', isClosedDay = false
          if (day === 'Sun') {
            const sunHours = settings.hours_sun || 'Fermé'
            if (sunHours.toLowerCase().includes('fermé') || sunHours.includes('مغلق')) { isClosedDay = true }
            else {
              const match = sunHours.match(/(\d{2})[h:](\d{2})\s*[-–]\s*(\d{2})[h:](\d{2})/)
              if (match) { openStr = `${match[1]}:${match[2]}`; closeStr = `${match[3]}:${match[4]}` } else { isClosedDay = true }
            }
          } else if (day === 'Sat') {
            const satHours = settings.hours_sat || '09:00 – 18:00'
            if (satHours.toLowerCase().includes('fermé') || satHours.includes('مغلق')) { isClosedDay = true }
            else {
              const match = satHours.match(/(\d{2})[h:](\d{2})\s*[-–]\s*(\d{2})[h:](\d{2})/)
              if (match) { openStr = `${match[1]}:${match[2]}`; closeStr = `${match[3]}:${match[4]}` }
              else { openStr = '09:00'; closeStr = '18:00' }
            }
          } else {
            const monHours = settings.hours_mon || '08:30 – 19:00'
            if (monHours.toLowerCase().includes('fermé') || monHours.includes('مغلق')) { isClosedDay = true }
            else {
              const match = monHours.match(/(\d{2})[h:](\d{2})\s*[-–]\s*(\d{2})[h:](\d{2})/)
              if (match) { openStr = `${match[1]}:${match[2]}`; closeStr = `${match[3]}:${match[4]}` }
            }
          }
          if (isClosedDay) return false
          const [openH, openM] = openStr.split(':').map(Number)
          const [closeH, closeM] = closeStr.split(':').map(Number)
          return timeMinutes >= openH * 60 + openM && timeMinutes <= closeH * 60 + closeM
        }
        setStoreOpen(checkOpen())
      } catch { setStoreOpen(true) }
    }
  }, [settings])

  useScrollAnimation()

  useEffect(() => {
    let alive = true
    const loadData = () => {
      fetch('/api/products').then(r => r.json()).then(d => {
        const arr = Array.isArray(d) ? d : (d?.products ?? [])
        if (alive && arr.length >= 0) setProducts(arr)
      }).catch(() => {})
      fetch('/api/categories').then(r => r.json()).then(d => {
        if (alive && Array.isArray(d)) setCategories(d)
      }).catch(() => {})
      fetch('/api/settings').then(r => r.json()).then((d: Record<string, string | null>) => {
        if (!alive) return
        setSettings(d)
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
      browse: 'Catalogue', ourCat: 'Nos Catégories',
      catSub: 'Tous les niveaux et matières du programme national marocain',
      levelsTag: 'Niveaux Scolaires', levelsTitle: 'Trouvez vos livres par niveau',
      levelsSub: 'Sélectionnez votre niveau pour accéder directement aux manuels adaptés',
      primaire: 'Primaire', primaireYears: '1ère – 6ème Année',
      primaireDesc: 'Manuels officiels pour le cycle primaire, toutes matières.',
      college: 'Collège', collegeYears: '1ère – 3ème Année Collège',
      collegeDesc: 'Livres scolaires pour le cycle collégial, français et arabe.',
      lycee: 'Lycée', lyceeYears: 'Tronc Commun · 1ère · 2ème Bac',
      lyceeDesc: 'Manuels et parascolaires pour le baccalauréat.',
      shopNow: 'Découvrir', trend: 'Tendances',
      featBooks: 'Fournitures en Vedette', featSub: 'Les manuels les plus demandés cette saison scolaire',
      promoTag: 'Promotions', specialOff: 'Offres Spéciales',
      promoSub: 'Prix réduits sur une sélection de livres scolaires',
      seeAll: 'Voir toutes les offres',
      engageTag: 'Nos Engagements', engageTitle: 'Pourquoi choisir ProExcel ?',
      engageSub: 'La librairie scolaire de référence au Maroc depuis des années',
      e1Title: 'Programme Officiel Marocain',
      e1Desc: "Tous nos manuels sont conformes au programme du Ministère de l'Éducation Nationale.",
      e2Title: 'Livraison Rapide 48h', e2Desc: "Livraison Gratuite dès 499 DH d'achat.",
      e3Title: 'Paiement 100% Sécurisé',
      e3Desc: 'CMI, virement bancaire ou paiement à la livraison. Vos données sont protégées.',
      e4Title: 'Retours Faciles', e4Desc: 'Retours acceptés sous 14 jours. Service client disponible 6j/7.',
      findUs: 'Nous Trouver', ourStore: 'Notre Boutique', address: 'Adresse',
      hours: 'Horaires', openMap: 'Ouvrir dans Maps', monFri: 'Lun – Ven',
      sat: 'Samedi', sun: 'Dimanche', closed: 'Fermé', realAddr: 'Bouznika, Maroc',
      phoneLabel: 'Téléphone / WhatsApp', chatWhatsapp: 'Discuter sur WhatsApp',
    },
    ar: {
      browse: 'الفئات', ourCat: 'فئاتنا',
      catSub: 'جميع المستويات والمواد في البرنامج الوطني المغربي',
      levelsTag: 'المستويات الدراسية', levelsTitle: 'ابحث عن كتبك حسب المستوى',
      levelsSub: 'اختر مستواك للوصول مباشرة إلى الكتب المناسبة',
      primaire: 'الابتدائي', primaireYears: 'السنة الأولى – السادسة',
      primaireDesc: 'الكتب الرسمية للتعليم الابتدائي لجميع المواد.',
      college: 'الإعدادي', collegeYears: 'السنة الأولى – الثالثة إعدادي',
      collegeDesc: 'الكتب المدرسية للسلك الإعدادي بالفرنسية والعربية.',
      lycee: 'الثانوي', lyceeYears: 'الجذع المشترك · الأولى · الثانية باك',
      lyceeDesc: 'الكتب المدرسية والبرامج للبكالوريا.',
      shopNow: 'اكتشف', trend: 'رائج',
      featBooks: 'مستلزمات مميزة', featSub: 'الكتب الأكثر طلباً هذا الموسم الدراسي',
      promoTag: 'تخفيضات', specialOff: 'عروض خاصة',
      promoSub: 'أسعار مخفضة على مجموعة مختارة من الكتب',
      seeAll: 'عرض جميع العروض',
      engageTag: 'التزاماتنا', engageTitle: 'لماذا تختار برو إكسيل؟',
      engageSub: 'المكتبة المدرسية المرجعية في المغرب منذ سنوات',
      e1Title: 'البرنامج الوطني المغربي الرسمي',
      e1Desc: 'جميع كتبنا متوافقة مع برنامج وزارة التربية الوطنية.',
      e2Title: 'توصيل سريع خلال 48 ساعة', e2Desc: 'توصيل مجاني ابتداءً من 499 درهم.',
      e3Title: 'دفع آمن 100%',
      e3Desc: 'CMI أو تحويل بنكي أو الدفع عند الاستلام. بياناتك محمية.',
      e4Title: 'إرجاع سهل', e4Desc: 'الإرجاع مقبول خلال 14 يوماً. خدمة العملاء متاحة 6 أيام/7.',
      findUs: 'موقعنا', ourStore: 'متجرنا', address: 'العنوان',
      hours: 'ساعات العمل', openMap: 'فتح في الخرائط', monFri: 'الاثنين – الجمعة',
      sat: 'السبت', sun: 'الأحد', closed: 'مغلق', realAddr: 'بوزنيقة، المغرب',
      phoneLabel: 'الهاتف / واتساب', chatWhatsapp: 'تحدث عبر واتساب',
    }
  }

  const T = t[lang as keyof typeof t] ?? t.fr
  const isAr = lang === 'ar'

  const LEVELS = [
    { key: 'primaire', name: T.primaire, years: T.primaireYears, desc: T.primaireDesc, href: '/niveaux/primaire', icon: <Library size={24} /> },
    { key: 'college',  name: T.college,  years: T.collegeYears,  desc: T.collegeDesc,  href: '/niveaux/college',  icon: <BookOpen size={24} /> },
    { key: 'lycee',    name: T.lycee,    years: T.lyceeYears,    desc: T.lyceeDesc,    href: '/niveaux/lycee',    icon: <GraduationCap size={24} /> },
  ]

  const LEVEL_COLORS = {
    primaire: { accent: '#2563EB', bg: 'rgba(37,99,235,0.08)',  label: '#1D4ED8' },
    college:  { accent: '#7C3AED', bg: 'rgba(124,58,237,0.08)', label: '#5B21B6' },
    lycee:    { accent: '#E8352A', bg: 'rgba(232,53,42,0.08)',  label: '#B91C1C' },
  }

  const ENGAGEMENTS = [
    { key: 'prog',     title: T.e1Title, desc: T.e1Desc, icon: <CheckCircle2 size={22} /> },
    { key: 'delivery', title: T.e2Title, desc: T.e2Desc, icon: <Truck size={22} /> },
    { key: 'secure',   title: T.e3Title, desc: T.e3Desc, icon: <ShieldCheck size={22} /> },
    { key: 'returns',  title: T.e4Title, desc: T.e4Desc, icon: <CheckCircle2 size={22} /> },
  ]

  return (
    <>
      <HeroSlider />
      <InfoStrip lang={lang} />

      <style>{`
        .hp-section { width: 100%; padding: 4.5rem 0; }
        @media (min-width: 768px) { .hp-section { padding: 5.5rem 0; } }
        .hp-inner { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem; }
        @media (min-width: 640px) { .hp-inner { padding: 0 2rem; } }
        .hp-bg-a { background: #ffffff; }
        .hp-bg-b { background: #f8fafc; }
        .hp-header { text-align: center; margin-bottom: 2.75rem; }
        .hp-label {
          display: inline-block; font-size: 0.67rem; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #E8352A; margin-bottom: 0.65rem;
        }
        .hp-h2 {
          font-size: clamp(1.65rem, 3.5vw, 2.4rem); font-weight: 900;
          letter-spacing: -0.03em; line-height: 1.12; color: #111827;
        }
        .hp-divider {
          width: 38px; height: 3px; background: #E8352A;
          border-radius: 9999px; margin: 0.75rem auto 0;
        }
        .hp-sub {
          color: #6b7280; font-size: 0.92rem; line-height: 1.65;
          max-width: 460px; margin: 0.65rem auto 0;
        }
        .hp-card {
          background: #ffffff;
          border: 1.5px solid #e8ecf0;
          border-radius: 1rem;
          transition: box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .hp-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.09); }
        .hp-card-title { font-weight: 900; color: #111827; }
        .hp-card-desc  { color: #6b7280; font-size: 0.85rem; line-height: 1.65; }
        .hp-btn-red {
          display: inline-flex; align-items: center; gap: 0.55rem;
          padding: 0.75rem 1.75rem; border-radius: 9999px; background: #E8352A;
          color: #fff; font-weight: 700; font-size: 0.85rem;
          transition: background 0.2s, transform 0.18s;
          box-shadow: 0 5px 18px rgba(232,53,42,0.28);
        }
        .hp-btn-red:hover { background: #c9281f; transform: translateY(-1px); }
        .hp-btn-indigo {
          display: inline-flex; align-items: center; gap: 0.55rem;
          padding: 0.75rem 1.75rem; border-radius: 9999px; background: #4F46E5;
          color: #fff; font-weight: 700; font-size: 0.85rem;
          transition: background 0.2s, transform 0.18s;
          box-shadow: 0 5px 18px rgba(79,70,229,0.28);
        }
        .hp-btn-indigo:hover { background: #4338CA; transform: translateY(-1px); }
      `}</style>

      {/* ══ NIVEAUX ══ */}
      <section className="hp-section hp-bg-a" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="hp-inner">
          <ScrollReveal className="hp-header">
            <span className="hp-label">{T.levelsTag}</span>
            <h2 className="hp-h2">{T.levelsTitle}</h2>
            <div className="hp-divider" />
            <p className="hp-sub">{T.levelsSub}</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {LEVELS.map((lvl, i) => {
              const c = LEVEL_COLORS[lvl.key as keyof typeof LEVEL_COLORS]
              return (
                <ScrollReveal key={lvl.key} delay={i * 0.1}>
                  <Link
                    href={lvl.href}
                    className="hp-card group flex flex-col p-5 md:p-6 h-full"
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.accent }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '' }}
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: c.bg, color: c.accent }}
                    >
                      {lvl.icon}
                    </div>
                    <span className="text-[0.68rem] font-bold uppercase tracking-widest mb-1.5" style={{ color: c.label }}>{lvl.years}</span>
                    <h3 className="hp-card-title text-xl md:text-2xl mb-2">{lvl.name}</h3>
                    <p className="hp-card-desc flex-1">{lvl.desc}</p>
                    <div className="flex items-center gap-2 font-bold text-sm mt-6 transition-all duration-300 group-hover:gap-3" style={{ color: c.accent }}>
                      {T.shopNow}
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </div>
                  </Link>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ CATÉGORIES ══ */}
      <section className="hp-section hp-bg-b" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="hp-inner">
          <ScrollReveal className="hp-header">
            <span className="hp-label">{T.browse}</span>
            <h2 className="hp-h2">{T.ourCat}</h2>
            <div className="hp-divider" />
            <p className="hp-sub">{T.catSub}</p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.slice(0, 9).map((cat, idx) => (
              <ScrollReveal key={cat.id} delay={(idx % 3) * 0.07}>
                <Link
                  href={`/best-offers?cat=${encodeURIComponent(cat.name)}`}
                  className="group relative flex flex-col justify-end rounded-2xl overflow-hidden"
                  style={{ height: 'clamp(150px, 18vw, 220px)', background: 'var(--card)' }}
                >
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    {cat.image
                      ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' }} />
                    }
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                  <div className="relative p-4 flex items-end justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{cat.name}</h3>
                      {(cat.count ?? 0) > 0 && (
                        <p className="text-[0.68rem] text-white/60 mt-0.5">
                          {cat.count} {isAr ? 'منتج' : ((cat.count ?? 0) > 1 ? 'produits' : 'produit')}
                        </p>
                      )}
                    </div>
                    <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xs font-black flex-shrink-0 group-hover:bg-[#E8352A] transition-colors duration-300">
                      {isAr ? '‹' : '›'}
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ══ */}
      {featured.length > 0 && (
        <section className="hp-section hp-bg-a" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="hp-inner">
            <ScrollReveal className="hp-header">
              <span className="hp-label">{T.trend}</span>
              <h2 className="hp-h2">{T.featBooks}</h2>
              <div className="hp-divider" />
              <p className="hp-sub">{T.featSub}</p>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {featured.map(p => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>

            <ScrollReveal delay={0.1} className="text-center mt-12">
              <Link href="/best-offers" className="hp-btn-red">
                {isAr ? 'عرض كل الكتالوج' : 'Voir tout le catalogue'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── STATS ── */}
      <StatsBar settings={settings} lang={lang} />

      {/* ══ OFFRES SPÉCIALES ══ */}
      {promos.length > 0 && (
        <section className="hp-section hp-bg-b" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="hp-inner">
            <ScrollReveal className="hp-header">
              <span className="hp-label" style={{ color: '#4F46E5' }}>{T.promoTag}</span>
              <h2 className="hp-h2">{T.specialOff}</h2>
              <div className="hp-divider" style={{ background: '#4F46E5' }} />
              <p className="hp-sub">{T.promoSub}</p>
            </ScrollReveal>

            <div className={`grid grid-cols-2 ${promos.length <= 2 ? 'md:grid-cols-2 max-w-[640px] mx-auto' : 'md:grid-cols-3 lg:grid-cols-4'} gap-4 md:gap-5`}>
              {promos.map(p => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>

            <ScrollReveal delay={0.1} className="text-center mt-12">
              <Link href="/best-offers" className="hp-btn-indigo">
                {T.seeAll}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      <Testimonials />

      {/* ══ POURQUOI PROEXCEL ══ */}
      <section className="hp-section hp-bg-a" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="hp-inner">
          <ScrollReveal className="hp-header">
            <span className="hp-label">{T.engageTag}</span>
            <h2 className="hp-h2">{T.engageTitle}</h2>
            <div className="hp-divider" />
            <p className="hp-sub">{T.engageSub}</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ENGAGEMENTS.map((e, i) => (
              <ScrollReveal key={e.key} delay={i * 0.1}>
                <div className="hp-card flex flex-col items-center text-center p-7 gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(232,53,42,0.08)', color: '#E8352A' }}>
                    {e.icon}
                  </div>
                  <h3 className="hp-card-title text-base leading-snug">{e.title}</h3>
                  <p className="hp-card-desc">{e.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NOTRE BOUTIQUE ══ */}
      <section className="hp-section hp-bg-b">
        <div className="hp-inner">
          <div dir={isAr ? 'rtl' : 'ltr'}>
            <ScrollReveal className="hp-header">
              <span className="hp-label">{T.findUs}</span>
              <h2 className="hp-h2">{T.ourStore}</h2>
              <div className="hp-divider" />
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.1}>
            <div className="hp-card flex flex-col lg:flex-row overflow-hidden" style={{ minHeight: '420px' }}>
              {/* Map */}
              <div className="w-full lg:w-[55%] h-[260px] md:h-[300px] lg:h-auto relative" style={{ background: '#f1f5f9' }}>
                {settings?.store_map_iframe ? (
                  <div
                    className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
                    dangerouslySetInnerHTML={{ __html: cleanMapIframe(settings.store_map_iframe).replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') }}
                  />
                ) : (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207.26730226122532!2d-7.163565696074601!3d33.7793485957184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7a61535e16707%3A0x99a79e97743e3a!2sBouznika!5e0!3m2!1sen!2sma!4v1777733390873!5m2!1sen!2sma"
                    width="100%" height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation ProExcel"
                    className="w-full h-full"
                  />
                )}
              </div>

              {/* Info */}
              <div className="w-full lg:w-[45%] p-8 md:p-10 lg:p-12 flex flex-col justify-center gap-6" dir={isAr ? 'rtl' : 'ltr'}>
                <InfoRow icon={<MapPin size={18} />} color="red" title={T.address}>
                  <p className="hp-card-desc">{settings?.store_address || T.realAddr}</p>
                </InfoRow>

                {(settings?.store_phone || settings?.store_whatsapp) && (
                  <InfoRow icon={<Phone size={18} />} color="blue" title={T.phoneLabel}>
                    {settings?.store_phone && <p className="hp-card-desc">{settings.store_phone}</p>}
                    {settings?.store_whatsapp && <p className="hp-card-desc">{settings.store_whatsapp}</p>}
                  </InfoRow>
                )}

                <InfoRow
                  icon={<Clock size={18} />}
                  color="green"
                  title={T.hours}
                  extra={storeOpen !== null ? (
                    <span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold ${storeOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {storeOpen ? (isAr ? 'مفتوح' : 'Ouvert') : (isAr ? 'مغلق' : 'Fermé')}
                    </span>
                  ) : null}
                >
                  <div className="flex flex-col gap-1.5 text-sm" style={{ color: '#6b7280' }}>
                    {settings ? (
                      <>
                        <div className="flex justify-between gap-4"><span>{T.monFri}</span><span className="font-semibold" style={{ color: '#374151' }}>{settings.hours_mon}</span></div>
                        <div className="flex justify-between gap-4"><span>{T.sat}</span><span className="font-semibold" style={{ color: '#374151' }}>{settings.hours_sat}</span></div>
                        <div className="flex justify-between gap-4"><span>{T.sun}</span><span className="font-semibold text-red-500">{settings.hours_sun}</span></div>
                      </>
                    ) : (
                      [[T.monFri, '08:30 – 19:00'], [T.sat, '09:00 – 18:00'], [T.sun, T.closed]].map(([day, time]) => (
                        <div key={day} className="flex justify-between gap-4">
                          <span>{day}</span>
                          <span className={`font-semibold ${time === T.closed ? 'text-red-500' : ''}`} style={time !== T.closed ? { color: '#374151' } : undefined}>{time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </InfoRow>

                <div className="flex flex-wrap gap-2.5">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(settings?.store_address || T.realAddr)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex justify-center items-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-[0.8rem] transition-colors"
                    style={{ background: '#f1f5f9', color: '#374151', border: '1.5px solid #e2e8f0' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#e2e8f0'; el.style.borderColor = '#E8352A'; el.style.color = '#E8352A'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#f1f5f9'; el.style.borderColor = '#e2e8f0'; el.style.color = '#374151'; }}
                  >
                    <Navigation size={14} />
                    {T.openMap}
                  </a>
                  {settings?.store_whatsapp && (
                    <a
                      href={`https://wa.me/${settings.store_whatsapp.replace(/\+/g, '').replace(/\s+/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex justify-center items-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-[0.8rem] transition-all"
                      style={{ background: '#f0fdf4', color: '#15803d', border: '1.5px solid #bbf7d0' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#dcfce7'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f0fdf4'; }}
                    >
                      <MessageCircle size={14} />
                      {T.chatWhatsapp}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}

function InfoRow({ icon, color, title, children, extra }: {
  icon: React.ReactNode; color: 'red' | 'blue' | 'green'
  title: string; children: React.ReactNode; extra?: React.ReactNode
}) {
  const colorMap = {
    red:   { bg: 'rgba(232,53,42,0.08)',  text: '#E8352A' },
    blue:  { bg: 'rgba(37,99,235,0.08)',  text: '#2563EB' },
    green: { bg: 'rgba(34,197,94,0.08)',  text: '#16A34A' },
  }
  const c = colorMap[color]
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg, color: c.text }}>
        {icon}
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-bold text-sm" style={{ color: '#111827' }}>{title}</h4>
          {extra}
        </div>
        {children}
      </div>
    </div>
  )
}
