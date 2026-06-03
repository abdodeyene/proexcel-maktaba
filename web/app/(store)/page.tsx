'use client'
// Recompile trigger

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
  MapPin,
  Clock,
  Navigation,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Library,
  BookOpen,
  GraduationCap,
  Phone,
  MessageCircle
} from '@/components/LucideIcons'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const STAGGER = ['', 'reveal-d1', 'reveal-d2', 'reveal-d3', 'reveal-d4', 'reveal-d5', 'reveal-d6']

const cleanMapIframe = (rawHtml: string | null | undefined) => {
  if (!rawHtml) return ''
  const trimmed = rawHtml.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('//')) {
    return `<iframe src="${trimmed}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`
  }
  const match = rawHtml.match(/<iframe[\s\S]*?<\/iframe>/i)
  return match ? match[0] : rawHtml
}

const MotionLink = motion(Link)

function FramerTiltCard({ children, className, style, href, ...props }: any) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20, mass: 0.2 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20, mass: 0.2 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-6, 6])

  const handleMouseMove = (e: React.MouseEvent<any>) => {
    if (window.innerWidth <= 768) return
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2
    x.set(mouseX / width)
    y.set(mouseY / height)
  }

  const handleMouseLeave = (e: React.MouseEvent<any>) => {
    x.set(0)
    y.set(0)
    if (props.onMouseLeave) props.onMouseLeave(e)
  }

  if (href) {
    return (
      <MotionLink
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={props.onMouseEnter}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          perspective: 1000,
          ...style
        }}
        className={className}
      >
        {children}
      </MotionLink>
    )
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={props.onMouseEnter}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        ...style
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function ScrollReveal({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        type: 'spring',
        stiffness: 80,
        damping: 15,
        delay: delay
      }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  )
}

function MagneticButton({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { damping: 15, stiffness: 150, mass: 0.1 })
  const springY = useSpring(y, { damping: 15, stiffness: 150, mass: 0.1 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth <= 768) return
    const { clientX, clientY, currentTarget } = e
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    x.set((clientX - centerX) * 0.3)
    y.set((clientY - centerY) * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  )
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
  count?: number
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

          let openStr = '08:30'
          let closeStr = '19:00'
          let isClosedDay = false

          if (day === 'Sun') {
            const sunHours = settings.hours_sun || 'Fermé'
            if (sunHours.toLowerCase().includes('fermé') || sunHours.includes('مغلق')) {
              isClosedDay = true
            } else {
              const match = sunHours.match(/(\d{2})[h:](\d{2})\s*[-–]\s*(\d{2})[h:](\d{2})/)
              if (match) {
                openStr = `${match[1]}:${match[2]}`
                closeStr = `${match[3]}:${match[4]}`
              } else {
                isClosedDay = true
              }
            }
          } else if (day === 'Sat') {
            const satHours = settings.hours_sat || '09:00 – 18:00'
            if (satHours.toLowerCase().includes('fermé') || satHours.includes('مغلق')) {
              isClosedDay = true
            } else {
              const match = satHours.match(/(\d{2})[h:](\d{2})\s*[-–]\s*(\d{2})[h:](\d{2})/)
              if (match) {
                openStr = `${match[1]}:${match[2]}`
                closeStr = `${match[3]}:${match[4]}`
              } else {
                openStr = '09:00'
                closeStr = '18:00'
              }
            }
          } else {
            const monHours = settings.hours_mon || '08:30 – 19:00'
            if (monHours.toLowerCase().includes('fermé') || monHours.includes('مغلق')) {
              isClosedDay = true
            } else {
              const match = monHours.match(/(\d{2})[h:](\d{2})\s*[-–]\s*(\d{2})[h:](\d{2})/)
              if (match) {
                openStr = `${match[1]}:${match[2]}`
                closeStr = `${match[3]}:${match[4]}`
              }
            }
          }

          if (isClosedDay) return false

          const [openH, openM] = openStr.split(':').map(Number)
          const [closeH, closeM] = closeStr.split(':').map(Number)
          const openMinutes = openH * 60 + openM
          const closeMinutes = closeH * 60 + closeM

          return timeMinutes >= openMinutes && timeMinutes <= closeMinutes
        }
        setStoreOpen(checkOpen())
      } catch (e) {
        setStoreOpen(true)
      }
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
      browse: 'Catalogue',
      ourCat: 'Nos Catégories',
      catSub: 'Tous les niveaux et matières du programme national marocain',
      levelsTag: 'Niveaux Scolaires',
      levelsTitle: 'Trouvez vos livres par niveau',
      levelsSub: 'Sélectionnez votre niveau pour accéder directement aux manuels adaptés',
      primaire: 'Primaire', primaireYears: '1ère – 6ème Année', primaireDesc: 'Manuels officiels pour le cycle primaire, toutes matières.',
      college: 'Collège', collegeYears: '1ère – 3ème Année Collège', collegeDesc: 'Livres scolaires pour le cycle collégial, français et arabe.',
      lycee: 'Lycée', lyceeYears: 'Tronc Commun · 1ère · 2ème Bac', lyceeDesc: 'Manuels et parascolaires pour le baccalauréat.',
      shopNow: 'Commander maintenant',
      lto: 'Offre Spéciale',
      freeShip: 'Livraison Gratuite',
      freeShipEm: 'dès 499 DH',
      shipSub: 'Commandez plus de livres et profitez de la livraison offerte partout au Maroc.',
      titles: 'Titres disponibles',
      clients: 'Clients satisfaits',
      savings: 'Économies max',
      seeAll: 'Voir toutes les offres',
      trend: 'Tendances',
      featBooks: 'Fournitures en Vedette',
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
      e2Desc: 'Livraison Gratuite dès 499 DH d\'achat.',
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
      phoneLabel: 'Téléphone / WhatsApp',
      whatsappLabel: 'WhatsApp',
      chatWhatsapp: 'Discuter sur WhatsApp',
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
      shopNow: 'اطلب الآن',
      lto: 'عرض خاص',
      freeShip: 'توصيل مجاني',
      freeShipEm: 'ابتداءً من 499 درهم',
      shipSub: 'اطلب المزيد من الكتب واستفد من التوصيل المجاني في جميع أنحاء المغرب.',
      titles: 'عناوين متوفرة',
      clients: 'عملاء راضون',
      savings: 'أقصى توفير',
      seeAll: 'عرض جميع العروض',
      trend: 'رائج',
      featBooks: 'مستلزمات مميزة',
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
      e2Desc: 'توصيل مجاني ابتداءً من 499 درهم.',
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
      phoneLabel: 'الهاتف / واتساب',
      whatsappLabel: 'واتساب',
      chatWhatsapp: 'تحدث عبر واتساب',
    }
  }

  const T = t[lang as keyof typeof t] ?? t.fr

  const LEVELS = [
    {
      key: 'primaire',
      name: T.primaire,
      years: T.primaireYears,
      desc: T.primaireDesc,
      href: '/niveaux/primaire',
      icon: <Library size={24} />,
    },
    {
      key: 'college',
      name: T.college,
      years: T.collegeYears,
      desc: T.collegeDesc,
      href: '/niveaux/college',
      icon: <BookOpen size={24} />,
    },
    {
      key: 'lycee',
      name: T.lycee,
      years: T.lyceeYears,
      desc: T.lyceeDesc,
      href: '/niveaux/lycee',
      icon: <GraduationCap size={24} />,
    },
  ]

  const ENGAGEMENTS = [
    {
      key: 'prog',
      title: T.e1Title,
      desc: T.e1Desc,
      icon: <CheckCircle2 size={20} />,
    },
    {
      key: 'delivery',
      title: T.e2Title,
      desc: T.e2Desc,
      icon: <Truck size={20} />,
    },
    {
      key: 'secure',
      title: T.e3Title,
      desc: T.e3Desc,
      icon: <ShieldCheck size={20} />,
    },
    {
      key: 'returns',
      title: T.e4Title,
      desc: T.e4Desc,
      icon: <CheckCircle2 size={20} />,
    },
  ]

  // ─── 3D TILT HANDLER ────────────────────────────────────────────
  const handleTilt = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rx = ((y - cy) / cy) * -6
    const ry = ((x - cx) / cx) * 6
    el.style.setProperty('--rx', `${rx}deg`)
    el.style.setProperty('--ry', `${ry}deg`)
    el.classList.add('tilt-active')
  }
  const resetTilt = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.classList.remove('tilt-active')
  }

  return (
    <>
      {/* ── HERO ── */}
      <HeroSlider />

      {/* ── INFO STRIP — trust bar under hero ── */}
      <InfoStrip lang={lang} />

      {/* ══════════════════════════════════════════════
          NIVEAUX — 3D Spatial Glass Plates
          ══════════════════════════════════════════════ */}
      <section className="w-full relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #070B12 0%, #0A0F1A 100%)' }}>
        {/* Ambient orbs */}
        <div className="spatial-orb w-[600px] h-[600px] top-[-150px] left-[-100px] opacity-30" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)' }} />
        <div className="spatial-orb w-[500px] h-[500px] bottom-[-100px] right-[-80px] opacity-25" style={{ background: 'radial-gradient(circle, rgba(232,53,42,0.15) 0%, transparent 70%)', animationDelay: '4s' }} />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <ScrollReveal className="flex flex-col items-center text-center mb-16 md:mb-20">
            <span className="label-chip mb-5">{T.levelsTag}</span>
            <div className="section-glow-line" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-[-0.04em] leading-[1.04] mb-5 font-norsal text-glow">
              {T.levelsTitle}
            </h2>
            <p className="text-base md:text-lg text-white/50 max-w-[580px] leading-relaxed">{T.levelsSub}</p>
          </ScrollReveal>

          {/* 3D Glass Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">
            {LEVELS.map((lvl, i) => {
              const configs = {
                primaire: {
                  glow: 'rgba(56,189,248,0.28)',
                  glowShadow: '0 30px 70px rgba(56,189,248,0.22)',
                  iconBg: 'rgba(56,189,248,0.12)',
                  iconColor: '#38BDF8',
                  border: 'rgba(56,189,248,0.2)',
                  bgGrad: 'linear-gradient(145deg, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0.02) 60%, transparent 100%)',
                },
                college: {
                  glow: 'rgba(139,92,246,0.28)',
                  glowShadow: '0 30px 70px rgba(139,92,246,0.22)',
                  iconBg: 'rgba(139,92,246,0.12)',
                  iconColor: '#A78BFA',
                  border: 'rgba(139,92,246,0.2)',
                  bgGrad: 'linear-gradient(145deg, rgba(139,92,246,0.08) 0%, rgba(139,92,246,0.02) 60%, transparent 100%)',
                },
                lycee: {
                  glow: 'rgba(232,53,42,0.28)',
                  glowShadow: '0 30px 70px rgba(232,53,42,0.22)',
                  iconBg: 'rgba(232,53,42,0.12)',
                  iconColor: '#F87171',
                  border: 'rgba(232,53,42,0.2)',
                  bgGrad: 'linear-gradient(145deg, rgba(232,53,42,0.08) 0%, rgba(232,53,42,0.02) 60%, transparent 100%)',
                },
              }
              const cfg = configs[lvl.key as keyof typeof configs]

              return (
                <ScrollReveal key={lvl.key} delay={i * 0.1}>
                  <FramerTiltCard
                    href={lvl.href}
                    className="group relative flex flex-col justify-between p-8 md:p-10 rounded-[2rem] overflow-hidden shine-sweep"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: `1px solid rgba(255,255,255,0.07)`,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                      minHeight: '300px',
                    }}
                    onMouseEnter={(e: any) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = cfg.border
                      el.style.boxShadow = cfg.glowShadow
                    }}
                    onMouseLeave={(e: any) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'rgba(255,255,255,0.07)'
                      el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
                    }}
                  >
                    {/* Color gradient overlay on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: cfg.bgGrad }}
                    />

                    {/* Dot grid pattern */}
                    <div
                      className="absolute inset-0 opacity-[0.03] pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col gap-5">
                      {/* Icon */}
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0"
                        style={{ background: cfg.iconBg, color: cfg.iconColor, boxShadow: `0 0 0 1px ${cfg.border}` }}
                      >
                        {lvl.icon}
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: cfg.iconColor }}>{lvl.years}</p>
                        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">{lvl.name}</h3>
                        <p className="text-sm md:text-base text-white/55 leading-relaxed">{lvl.desc}</p>
                      </div>
                    </div>

                    {/* CTA Arrow */}
                    <div className="relative z-10 mt-8 flex items-center gap-2 font-bold text-sm transition-all duration-300 group-hover:gap-3" style={{ color: cfg.iconColor }}>
                      {T.shopNow}
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </div>
                  </FramerTiltCard>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CATÉGORIES — Cinematic Grid
          ══════════════════════════════════════════════ */}
      <section className="w-full relative py-24 md:py-32 overflow-hidden" style={{ background: '#0B0F19' }}>
        {/* Top fade from previous section */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0A0F1A] to-transparent pointer-events-none z-0" />
        {/* Ambient */}
        <div className="spatial-orb w-[800px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ background: 'radial-gradient(ellipse, rgba(232,53,42,0.1) 0%, transparent 70%)' }} />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="flex flex-col items-center text-center mb-16">
            <span className="label-chip mb-5">{T.browse}</span>
            <div className="section-glow-line" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-[-0.04em] leading-tight mb-5 font-norsal text-glow">{T.ourCat}</h2>
            <p className="text-base md:text-lg text-white/50 max-w-[580px]">{T.catSub}</p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {categories.map((cat, idx) => {
              const count = cat.count ?? 0
              return (
                <ScrollReveal key={cat.id} delay={(idx % 4) * 0.08}>
                  <FramerTiltCard
                    href={`/best-offers?cat=${encodeURIComponent(cat.name)}`}
                    className="group relative flex flex-col justify-end rounded-3xl overflow-hidden"
                    style={{
                      height: 'clamp(180px, 22vw, 280px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                    }}
                    onMouseEnter={(e: any) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.boxShadow = '0 24px 60px rgba(232,53,42,0.2), 0 8px 30px rgba(0,0,0,0.5)'
                    }}
                    onMouseLeave={(e: any) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)'
                    }}
                  >
                    {/* Image */}
                    <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-[1.07]">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
                      )}
                    </div>

                    {/* Deep gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10 z-[1] transition-opacity duration-300 group-hover:opacity-90" />

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 z-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(232,53,42,0.12) 0%, transparent 60%)' }} />

                    {/* Content */}
                    <div className="relative z-[3] p-4 sm:p-5 flex flex-col gap-1.5" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8352A] flex-shrink-0 group-hover:shadow-[0_0_10px_#E8352A] transition-shadow duration-300" />
                        <h3 className="text-sm sm:text-base md:text-[1.05rem] font-bold text-white leading-tight overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-red-300 transition-colors duration-300">
                          {cat.name}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/10 pt-2">
                        <span className="text-[0.72rem] text-white/55 font-semibold tracking-wider">
                          {count} {lang === 'fr' ? (count > 1 ? 'produits' : 'produit') : 'منتج'}
                        </span>
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white bg-white/10 group-hover:bg-[#E8352A] group-hover:shadow-[0_0_12px_rgba(232,53,42,0.6)] transition-all duration-300 translate-x-0 group-hover:translate-x-0.5">
                          {lang === 'ar' ? '‹' : '›'}
                        </span>
                      </div>
                    </div>
                  </FramerTiltCard>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURED PRODUCTS — Cinematic Section
          ══════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="w-full relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0B0F19 0%, #070B12 100%)' }}>
          <div className="product-ambient-glow" />
          <div className="spatial-orb w-[700px] h-[500px] top-[-100px] right-[-100px] opacity-20" style={{ background: 'radial-gradient(circle, rgba(232,53,42,0.12) 0%, transparent 70%)' }} />

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollReveal className="flex flex-col items-center text-center mb-16">
              <span className="label-chip mb-5">{T.trend}</span>
              <div className="section-glow-line" />
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-[-0.04em] leading-tight mb-5 font-norsal text-glow">{T.featBooks}</h2>
              <p className="text-base md:text-lg text-white/50 max-w-[580px]">{T.featSub}</p>
            </ScrollReveal>

            <ScrollReveal delay={0.12} className="relative w-full">
              <div 
                className="relative p-6 md:p-10 rounded-[2.5rem] overflow-hidden" 
                style={{ 
                  background: 'rgba(255,255,255,0.015)', 
                  backdropFilter: 'blur(24px)', 
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(232,53,42,0.15)',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              >
                {/* Inner glowing core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(232,53,42,0.15) 0%, transparent 60%)' }} />
                
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
                  {featured.map((p) => (
                    <FramerTiltCard key={p.id} className="group relative h-full rounded-2xl">
                      {/* Neon glow behind card on hover */}
                      <div className="absolute -inset-1 rounded-[1.75rem] blur-xl opacity-0 group-hover:opacity-70 transition duration-500 pointer-events-none" style={{ background: 'linear-gradient(135deg, #E8352A, #F59E0B)' }} />
                      <div className="relative h-full z-10 transition-transform duration-500 group-hover:-translate-y-2">
                        <ProductCard {...p} />
                      </div>
                    </FramerTiltCard>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="text-center mt-14">
              <MagneticButton>
                <Link
                  href="/best-offers"
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-sm md:text-base uppercase tracking-wider text-white transition-all duration-300 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #e11d2e 0%, #c20f1e 100%)', boxShadow: '0 8px 30px rgba(232,53,42,0.3)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 50px rgba(232,53,42,0.55)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(232,53,42,0.3)'; }}
                >
                  {lang === 'fr' ? 'Voir tout le catalogue' : 'عرض كل الكتالوج'}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </MagneticButton>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── STATS BAR — dark promo cinematic banner ── */}
      <StatsBar settings={settings} lang={lang} />

      {/* ══════════════════════════════════════════════
          OFFRES SPÉCIALES — Promo Products
          ══════════════════════════════════════════════ */}
      {promos.length > 0 && (
        <section className="w-full relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #07090F 0%, #0A0F1A 100%)' }}>
          <div className="spatial-orb w-[600px] h-[600px] bottom-[-100px] right-[-50px] opacity-25" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)' }} />
          <div className="spatial-orb w-[500px] h-[500px] top-[-80px] left-[-80px] opacity-20" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', animationDelay: '5s' }} />

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollReveal className="flex flex-col items-center text-center mb-16">
              <span className="label-chip mb-5" style={{ color: '#818CF8', background: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.22)' }}>{T.promoTag}</span>
              <div className="section-glow-line" style={{ background: 'linear-gradient(90deg, transparent, #818CF8, transparent)' }} />
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-[-0.04em] leading-tight mb-5 font-norsal text-glow-indigo">{T.specialOff}</h2>
              <p className="text-base md:text-lg text-white/50 max-w-[580px]">{T.promoSub}</p>
            </ScrollReveal>

            <ScrollReveal delay={0.12} className="relative w-full">
              <div 
                className="relative p-6 md:p-10 rounded-[2.5rem] overflow-hidden" 
                style={{ 
                  background: 'rgba(255,255,255,0.015)', 
                  backdropFilter: 'blur(24px)', 
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              >
                {/* Inner glowing core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(79,70,229,0.15) 0%, transparent 60%)' }} />
                
                <div className={`relative z-10 grid grid-cols-2 ${promos.length <= 2 ? 'md:grid-cols-2 max-w-[760px] mx-auto' : 'md:grid-cols-3 lg:grid-cols-4'} gap-5 md:gap-7`}>
                  {promos.map((p) => (
                    <FramerTiltCard key={p.id} className="group relative h-full rounded-2xl">
                      {/* Neon glow behind card on hover */}
                      <div className="absolute -inset-1 rounded-[1.75rem] blur-xl opacity-0 group-hover:opacity-70 transition duration-500 pointer-events-none" style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }} />
                      <div className="relative h-full z-10 transition-transform duration-500 group-hover:-translate-y-2">
                        <ProductCard {...p} />
                      </div>
                    </FramerTiltCard>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="text-center mt-14">
              <MagneticButton>
                <Link
                  href="/best-offers"
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-sm md:text-base uppercase tracking-wider text-white transition-all duration-300 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #1D4ED8 100%)', boxShadow: '0 8px 30px rgba(79,70,229,0.3)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 50px rgba(79,70,229,0.55)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(79,70,229,0.3)'; }}
                >
                  {T.seeAll}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </MagneticButton>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      <Testimonials />

      {/* ══════════════════════════════════════════════
          ENGAGEMENTS — Glass Commitment Cards
          ══════════════════════════════════════════════ */}
      <section className="w-full relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #05070D 0%, #070B14 100%)' }}>
        <div className="spatial-orb w-[800px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" style={{ background: 'radial-gradient(ellipse, rgba(232,53,42,0.1) 0%, transparent 70%)' }} />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="flex flex-col items-center text-center mb-16 md:mb-20">
            <span className="label-chip mb-5">{T.engageTag}</span>
            <div className="section-glow-line" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-[-0.04em] leading-tight mb-5 font-norsal text-glow">{T.engageTitle}</h2>
            <p className="text-base md:text-lg text-white/50 max-w-[580px]">{T.engageSub}</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {ENGAGEMENTS.map((e, i) => (
              <ScrollReveal key={e.key} delay={i * 0.08}>
                <FramerTiltCard
                  className="group relative p-8 lg:p-9 rounded-[1.75rem] flex flex-col items-center text-center gap-5 shine-sweep"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 16px 50px rgba(0,0,0,0.35)',
                  }}
                  onMouseEnter={(ev: any) => {
                    const el = ev.currentTarget as HTMLElement
                    el.style.borderColor = 'rgba(232,53,42,0.3)'
                    el.style.boxShadow = '0 24px 60px rgba(232,53,42,0.15), 0 8px 30px rgba(0,0,0,0.4)'
                  }}
                  onMouseLeave={(ev: any) => {
                    const el = ev.currentTarget as HTMLElement
                    el.style.borderColor = 'rgba(255,255,255,0.07)'
                    el.style.boxShadow = '0 16px 50px rgba(0,0,0,0.35)'
                  }}
                >
                  {/* Dot grid subtle */}
                  <div className="absolute inset-0 opacity-[0.025] pointer-events-none rounded-[1.75rem]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                  {/* Icon */}
                  <div
                    className="relative z-10 w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110"
                    style={{ background: 'rgba(232,53,42,0.1)', color: '#F87171', boxShadow: '0 0 0 1px rgba(232,53,42,0.2)' }}
                  >
                    {e.icon}
                  </div>

                  <div className="relative z-10 flex flex-col gap-3">
                    <h3 className="text-lg md:text-xl font-black text-white leading-snug">{e.title}</h3>
                    <p className="text-sm md:text-base text-white/50 leading-relaxed">{e.desc}</p>
                  </div>
                </FramerTiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          NOTRE BOUTIQUE — Unified Spatial Card
          ══════════════════════════════════════════════ */}
      <section className="w-full relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #070B14 0%, #050810 100%)' }}>
        <div className="spatial-orb w-[500px] h-[400px] top-0 right-0 opacity-20" style={{ background: 'radial-gradient(circle, rgba(29,78,137,0.2) 0%, transparent 70%)' }} />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <ScrollReveal className="flex flex-col items-center text-center mb-12 md:mb-16">
            <span className="label-chip mb-5">{T.findUs}</span>
            <div className="section-glow-line" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-[-0.04em] leading-tight font-norsal text-glow">{T.ourStore}</h2>
          </ScrollReveal>

          {/* Unified Card */}
          <ScrollReveal delay={0.12}>
            <div
              className="flex flex-col lg:flex-row rounded-[2.5rem] overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.025)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                minHeight: '520px',
              }}
            >
            {/* Map Left */}
            <div className="w-full lg:w-[55%] h-[280px] md:h-[360px] lg:h-auto relative overflow-hidden rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-l-[2.5rem]">
              {settings?.store_map_iframe ? (
                <div
                  className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:object-cover"
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
                  className="w-full h-full object-cover opacity-80"
                />
              )}
              {/* Right edge fade */}
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[rgba(10,12,22,0.8)] to-transparent pointer-events-none hidden lg:block" />
            </div>

            {/* Info Right */}
            <div className="w-full lg:w-[45%] p-8 md:p-12 lg:p-14 flex flex-col justify-center gap-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(232,53,42,0.12)', color: '#F87171', boxShadow: '0 0 0 1px rgba(232,53,42,0.2)' }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="text-base font-black text-white mb-1">{T.address}</h4>
                  <p className="text-sm text-white/55 leading-relaxed">{settings?.store_address || T.realAddr}</p>
                </div>
              </div>

              {/* Phone */}
              {(settings?.store_phone || settings?.store_whatsapp) && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.12)', color: '#60A5FA', boxShadow: '0 0 0 1px rgba(59,130,246,0.2)' }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white mb-1">{T.phoneLabel}</h4>
                    <div className="flex flex-col gap-0.5 text-sm text-white/55">
                      {settings?.store_phone && <span>{settings.store_phone}</span>}
                      {settings?.store_whatsapp && <span>{settings.store_whatsapp}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ADE80', boxShadow: '0 0 0 1px rgba(34,197,94,0.2)' }}>
                  <Clock size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-base font-black text-white">{T.hours}</h4>
                    {storeOpen !== null && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold ${storeOpen ? 'bg-green-500/15 text-green-400 border border-green-500/25' : 'bg-red-500/15 text-red-400 border border-red-500/25'}`}>
                        {storeOpen ? (lang === 'fr' ? 'Ouvert' : 'مفتوح') : (lang === 'fr' ? 'Fermé' : 'مغلق')}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-white/50">
                    {settings ? (
                      <>
                        <div className="flex justify-between border-b border-white/[0.07] pb-2"><span>{T.monFri}</span><span className="font-semibold text-white/75">{settings.hours_mon}</span></div>
                        <div className="flex justify-between border-b border-white/[0.07] pb-2"><span>{T.sat}</span><span className="font-semibold text-white/75">{settings.hours_sat}</span></div>
                        <div className="flex justify-between"><span>{T.sun}</span><span className="font-semibold text-red-400">{settings.hours_sun}</span></div>
                      </>
                    ) : (
                      [[T.monFri, '08:30 – 19:00'], [T.sat, '09:00 – 18:00'], [T.sun, T.closed]].map(([day, time], idx) => (
                        <div key={day} className={`flex justify-between ${idx !== 2 ? 'border-b border-white/[0.07] pb-2' : ''}`}>
                          <span>{day}</span>
                          <span className={`font-semibold ${time === T.closed ? 'text-red-400' : 'text-white/75'}`}>{time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings?.store_address || T.realAddr)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex justify-center items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-1"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                >
                  <Navigation size={18} />
                  {T.openMap}
                </a>
                {settings?.store_whatsapp && (
                  <a
                    href={`https://wa.me/${settings.store_whatsapp.replace(/\+/g, '').replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex justify-center items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-1"
                    style={{ background: 'rgba(37,211,102,0.1)', color: '#25D366', border: '1px solid rgba(37,211,102,0.25)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.22)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,211,102,0.45)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,211,102,0.25)'; }}
                  >
                    <MessageCircle size={18} />
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
