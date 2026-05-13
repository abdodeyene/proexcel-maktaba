'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LangContext'
import {
  CheckCircle,
  Tag,
  Truck,
  Users,
  RefreshCcw,
  Package,
  MapPin,
  Clock
} from '@/components/LucideIcons'

const VAL_ICONS = [
  <CheckCircle size={22} />,
  <Tag size={22} />,
  <Truck size={22} />,
  <Users size={22} />,
  <RefreshCcw size={22} />,
  <Package size={22} />,
]

const DEFAULT_STATS = [
  { num: '10+',   labelFr: "Années d'expérience", labelAr: 'سنوات خبرة' },
  { num: '1200+', labelFr: 'Titres disponibles',  labelAr: 'عنوان متوفر' },
  { num: '15K+',  labelFr: 'Clients fidèles',     labelAr: 'عميل وفي' },
  { num: '48h',   labelFr: 'Délai de livraison',  labelAr: 'وقت التوصيل' },
]

const DEFAULT_VALUES = [
  { titleFr: 'Qualité certifiée', titleAr: 'جودة معتمدة', descFr: "Tous nos livres sont conformes aux programmes officiels du Ministère de l'Éducation Nationale.", descAr: 'جميع كتبنا متوافقة مع المناهج الرسمية لوزارة التعليم الوطني.' },
  { titleFr: 'Prix justes',       titleAr: 'أسعار عادلة', descFr: 'Nous négocions directement avec les éditeurs pour vous offrir les meilleurs tarifs.',         descAr: 'نتفاوض مباشرة مع الناشرين لنقدم لك أفضل الأسعار.' },
  { titleFr: 'Livraison rapide',  titleAr: 'توصيل سريع',  descFr: 'Recevez vos commandes en 24 à 48 heures partout au Maroc.',                                    descAr: 'استلم طلباتك خلال 24 إلى 48 ساعة في جميع أنحاء المغرب.' },
  { titleFr: 'Service client',    titleAr: 'خدمة العملاء', descFr: 'Notre équipe est disponible 6 jours sur 7 pour répondre à toutes vos questions.',              descAr: 'فريقنا متاح 6 أيام في الأسبوع للرد على جميع استفساراتك.' },
  { titleFr: 'Retours faciles',   titleAr: 'إرجاع سهل',   descFr: 'Politique de retour simplifiée sous 14 jours sans conditions.',                                 descAr: 'سياسة إرجاع مبسطة خلال 14 يوماً دون شروط.' },
  { titleFr: 'Stock permanent',   titleAr: 'مخزون دائم',  descFr: "Plus de 1 200 titres disponibles en permanence pour ne jamais rater la rentrée.",               descAr: 'أكثر من 1200 عنوان متوفر باستمرار لضمان عدم فوات الموسم الدراسي.' },
]

export default function AboutPage() {
  const { lang, t } = useLang()
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => { if (data && typeof data === 'object') setSettings(data) })
      .catch(() => {})
  }, [])

  const isAr = lang === 'ar'
  const sf = (frKey: string, arKey: string, fbFr: string, fbAr: string) =>
    isAr ? (settings?.[arKey] || fbAr) : (settings?.[frKey] || fbFr)

  const statsData: typeof DEFAULT_STATS = (() => {
    try { if (settings?.about_stats) { const p = JSON.parse(settings.about_stats); if (Array.isArray(p)) return p } } catch {}
    return DEFAULT_STATS
  })()

  const valuesData: typeof DEFAULT_VALUES = (() => {
    try { if (settings?.about_values) { const p = JSON.parse(settings.about_values); if (Array.isArray(p)) return p } } catch {}
    return DEFAULT_VALUES
  })()

  const T = {
    breadHome:  t('Accueil', 'الرئيسية'),
    breadAbout: t('À Propos', 'من نحن'),
    heroTitle1: t('À Propos de', 'من نحن —'),
    heroTitle2: t('ProExcel', 'برو إكسيل'),
    heroSub:    sf('about_hero_sub_fr', 'about_hero_sub_ar',
                   'Votre librairie scolaire de référence au Maroc depuis plus de 10 ans',
                   'مكتبتك المدرسية الموثوقة في المغرب منذ أكثر من 10 سنوات'),
    storyTag:   sf('about_story_tag_fr', 'about_story_tag_ar', 'Notre Histoire', 'قصتنا'),
    storyTitle: sf('about_story_title_fr', 'about_story_title_ar', '', ''),
    storyH2a:   t('Plus de', 'أكثر من'),
    storyH2b:   t('10 ans', '10 سنوات'),
    storyH2c:   t("au service de l'éducation marocaine", 'في خدمة التعليم المغربي'),
    story1:     sf('about_story1_fr', 'about_story1_ar',
                   "Fondée en 2014, ProExcel Maktaba est née d'une passion pour l'éducation et d'un constat simple : les familles marocaines avaient besoin d'un accès facile et fiable aux livres scolaires de qualité.",
                   'تأسست برو إكسيل مكتبة عام 2014 من شغف بالتعليم وإدراك بسيط: احتياج الأسر المغربية إلى وصول سهل وموثوق للكتب المدرسية عالية الجودة.'),
    story2:     sf('about_story2_fr', 'about_story2_ar',
                   "Aujourd'hui, nous proposons plus de 1 200 titres couvrant tous les niveaux du primaire au baccalauréat, en conformité avec les programmes officiels du Ministère de l'Éducation Nationale marocain.",
                   'اليوم، نقدم أكثر من 1200 عنوان يغطي جميع المستويات من الابتدائي حتى الثانوية، وفق المناهج الرسمية لوزارة التعليم الوطني المغربية.'),
    story3:     sf('about_story3_fr', 'about_story3_ar',
                   "Notre équipe de spécialistes sélectionne chaque ouvrage avec soin pour garantir qualité pédagogique, conformité aux référentiels officiels et accessibilité tarifaire pour toutes les familles.",
                   'يختار فريق متخصصينا كل كتاب بعناية لضمان الجودة التربوية، والامتثال للمناهج الرسمية، وإمكانية الوصول بأسعار مناسبة لجميع الأسر.'),
    valTag:     sf('about_val_tag_fr', 'about_val_tag_ar', 'Nos Valeurs', 'قيمنا'),
    valH2:      sf('about_val_h2_fr',  'about_val_h2_ar',  'Ce qui nous différencie', 'ما يميزنا'),
    findTag:    t('Nous Trouver', 'موقعنا'),
    findH2:     t('Notre Boutique', 'متجرنا'),
    addressLabel: t('Adresse', 'العنوان'),
    addressVal:   settings?.store_address || t('Bouznika, Maroc', 'بوزنيقة، المغرب'),
    hoursLabel:   t('Horaires', 'ساعات العمل'),
    openMap:      t('Ouvrir dans Maps', 'فتح في الخرائط'),
    ctaH2:  sf('about_cta_title_fr', 'about_cta_title_ar', 'Prêt à explorer notre catalogue ?', 'هل أنت مستعد لاستكشاف كتالوجنا؟'),
    ctaSub: sf('about_cta_sub_fr',   'about_cta_sub_ar',   'Découvrez notre sélection de plus de 1 200 livres scolaires', 'اكتشف مجموعتنا من أكثر من 1200 كتاب مدرسي'),
    ctaBtn: sf('about_cta_btn_fr',   'about_cta_btn_ar',   'Explorer le catalogue ›', 'تصفح الكتالوج ›'),
  }

  const days = [
    { key: 'hours_mon', fr: 'Lundi',    ar: 'الاثنين' },
    { key: 'hours_tue', fr: 'Mardi',    ar: 'الثلاثاء' },
    { key: 'hours_wed', fr: 'Mercredi', ar: 'الأربعاء' },
    { key: 'hours_thu', fr: 'Jeudi',    ar: 'الخميس' },
    { key: 'hours_fri', fr: 'Vendredi', ar: 'الجمعة' },
    { key: 'hours_sat', fr: 'Samedi',   ar: 'السبت' },
    { key: 'hours_sun', fr: 'Dimanche', ar: 'الأحد' },
  ]

  const heroImg = settings?.about_img_1 || ''

  return (
    <>
      <style>{`
        /* ── HERO ── */
        .ab-hero {
          position: relative;
          min-height: 420px;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: linear-gradient(135deg, #070B14 0%, #0e1e3a 60%, #070B14 100%);
        }
        .ab-hero-bg {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.04) 1px, transparent 0);
          background-size: 36px 36px;
        }
        .ab-hero-glow {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,53,42,0.12) 0%, transparent 70%);
          top: -200px; right: -100px;
          pointer-events: none;
        }
        .ab-hero-inner {
          position: relative; z-index: 1;
          max-width: 1400px; margin: 0 auto;
          padding: 6rem 2rem 4rem;
        }
        .ab-hero h1 { font-size: clamp(2.2rem, 5vw, 3.8rem); color: #fff; line-height: 1.1; margin-bottom: 1rem; }
        .ab-hero p  { color: rgba(255,255,255,0.65); font-size: 1.05rem; max-width: 540px; line-height: 1.7; }

        /* ── STORY ── */
        .ab-story {
          max-width: 1400px; margin: 0 auto;
          padding: 6rem 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .ab-story-text .section-tag { display: inline-block; margin-bottom: 1.25rem; }
        .ab-story-text h2 {
          font-size: clamp(1.9rem, 3vw, 2.8rem);
          line-height: 1.15;
          margin-bottom: 2rem;
        }
        .ab-story-text p {
          color: var(--text2); line-height: 1.9;
          font-size: 0.95rem; margin-bottom: 1.2rem;
        }
        .ab-story-text p:last-child { margin-bottom: 0; }

        /* Single image with premium frame */
        .ab-img-wrap {
          position: relative;
        }
        .ab-img-frame {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          aspect-ratio: 4/5;
          box-shadow: 0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06);
        }
        .ab-img-frame img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .ab-img-frame:hover img { transform: scale(1.03); }
        .ab-img-fallback {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #0e1e3a 0%, #1a0a10 50%, #070B14 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 5rem;
        }
        /* Decorative accent corner */
        .ab-img-accent {
          position: absolute;
          bottom: -20px; left: -20px;
          width: 120px; height: 120px;
          border-radius: 22px;
          background: linear-gradient(135deg, var(--primary), #ff7a00);
          opacity: 0.18;
          z-index: -1;
          filter: blur(2px);
        }
        .ab-img-accent2 {
          position: absolute;
          top: -16px; right: -16px;
          width: 80px; height: 80px;
          border-radius: 16px;
          border: 2px solid rgba(232,53,42,0.25);
          z-index: -1;
        }
        /* Floating badge on image */
        .ab-img-badge {
          position: absolute;
          bottom: 24px; right: -16px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1rem 1.25rem;
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
          display: flex; align-items: center; gap: 0.75rem;
          backdrop-filter: blur(12px);
          z-index: 5;
        }
        .ab-img-badge-num {
          font-size: 1.5rem; font-weight: 900;
          color: var(--primary); line-height: 1;
        }
        .ab-img-badge-label {
          font-size: 0.72rem; font-weight: 700;
          color: var(--text2); text-transform: uppercase;
          letter-spacing: 0.5px; line-height: 1.3;
        }

        /* ── STATS ── */
        .ab-stats {
          background: var(--bg2);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 5rem 2rem;
        }
        .ab-stats-grid {
          max-width: 1100px; margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .ab-stat {
          text-align: center;
          padding: 2.5rem 1rem;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .ab-stat:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.2);
        }
        .ab-stat::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), #ff7a00);
          border-radius: 0 0 2px 2px;
        }
        .ab-stat-num {
          font-size: 2.8rem; font-weight: 900;
          color: var(--primary); line-height: 1;
          margin-bottom: 0.6rem;
          font-family: 'Outfit', sans-serif;
        }
        .ab-stat-label {
          font-size: 0.82rem; color: var(--text2);
          font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ── VALUES ── */
        .ab-values { max-width: 1400px; margin: 0 auto; padding: 6rem 2rem; }
        .ab-values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }
        .ab-val-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 2.25rem 2rem;
          transition: all 0.28s ease;
          position: relative;
          overflow: hidden;
        }
        .ab-val-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          border: 1px solid transparent;
          background: linear-gradient(135deg, rgba(232,53,42,0.12), transparent) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.28s;
        }
        .ab-val-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.18); }
        .ab-val-card:hover::after { opacity: 1; }
        .ab-val-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: rgba(232,53,42,0.09);
          color: var(--primary);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.25rem;
        }
        .ab-val-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 0.6rem; }
        .ab-val-desc  { color: var(--text2); font-size: 0.88rem; line-height: 1.65; }

        /* ── LOCATION ── */
        .ab-loc { background: var(--bg2); border-top: 1px solid var(--border); padding: 6rem 2rem; }
        .ab-loc-inner { max-width: 960px; margin: 0 auto; }
        .ab-loc-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 2rem; margin-top: 3rem;
        }
        .ab-loc-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 20px; padding: 2rem; overflow: hidden;
        }
        .ab-loc-card-title {
          display: flex; align-items: center; gap: 0.5rem;
          font-weight: 700; color: var(--primary);
          margin-bottom: 1.25rem; font-size: 0.95rem;
        }
        .ab-hours-row {
          display: flex; justify-content: space-between;
          padding: 0.45rem 0;
          border-bottom: 1px solid var(--border);
          font-size: 0.86rem;
        }
        .ab-hours-row:last-child { border-bottom: none; }

        /* ── CTA ── */
        .ab-cta {
          padding: 7rem 2rem;
          text-align: center;
          background: linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%);
          position: relative; overflow: hidden;
        }
        .ab-cta::before {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,53,42,0.07) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .ab-cta h2   { font-size: clamp(1.8rem, 3vw, 2.6rem); margin-bottom: 1rem; position: relative; }
        .ab-cta p    { color: var(--text2); font-size: 0.95rem; margin-bottom: 2.5rem; position: relative; }
        .ab-cta a    { position: relative; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .ab-story { grid-template-columns: 1fr; gap: 3rem; padding: 4rem 2rem; }
          .ab-img-badge { right: 16px; }
          .ab-values-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .ab-story { padding: 3rem 1.25rem; }
          .ab-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .ab-values-grid { grid-template-columns: 1fr; }
          .ab-loc-grid { grid-template-columns: 1fr; }
          .ab-img-badge { display: none; }
          .ab-hero-inner { padding: 5rem 1.25rem 3rem; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="ab-hero">
        <div className="ab-hero-bg" />
        <div className="ab-hero-glow" />
        <div className="ab-hero-inner">
          <div className="breadcrumb-nav" style={{ marginBottom: '1.5rem' }}>
            <Link href="/">{T.breadHome}</Link>
            <span>›</span>
            <span>{T.breadAbout}</span>
          </div>
          <h1>
            {T.heroTitle1} <span style={{ color: 'var(--primary)' }}>{T.heroTitle2}</span>
          </h1>
          <p>{T.heroSub}</p>
        </div>
      </div>

      {/* ── STORY ── */}
      <div className="ab-story">
        <div className="ab-story-text">
          <div className="section-tag">{T.storyTag}</div>
          <h2>
            {T.storyTitle
              ? T.storyTitle
              : <>{T.storyH2a} <span style={{ color: 'var(--primary)' }}>{T.storyH2b}</span><br />{T.storyH2c}</>
            }
          </h2>
          <p>{T.story1}</p>
          <p>{T.story2}</p>
          <p>{T.story3}</p>
        </div>

        <div className="ab-img-wrap">
          <div className="ab-img-frame">
            {heroImg
              ? <img src={heroImg} alt="ProExcel Maktaba" />
              : <div className="ab-img-fallback">📚</div>
            }
          </div>
          <div className="ab-img-accent" />
          <div className="ab-img-accent2" />
          <div className="ab-img-badge">
            <div>
              <div className="ab-img-badge-num">10+</div>
              <div className="ab-img-badge-label">{isAr ? 'سنوات\nخبرة' : 'Années\nd\'exp.'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="ab-stats">
        <div className="ab-stats-grid">
          {statsData.map((s, i) => (
            <div key={i} className="ab-stat">
              <div className="ab-stat-num">{s.num}</div>
              <div className="ab-stat-label">{isAr ? s.labelAr : s.labelFr}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── VALUES ── */}
      <div className="ab-values">
        <div className="section-header">
          <div className="section-tag">{T.valTag}</div>
          <h2 className="section-title">{T.valH2}</h2>
        </div>
        <div className="ab-values-grid">
          {valuesData.map((v, i) => (
            <div key={i} className="ab-val-card">
              <div className="ab-val-icon">{VAL_ICONS[i] || <CheckCircle size={22} />}</div>
              <div className="ab-val-title">{isAr ? v.titleAr : v.titleFr}</div>
              <div className="ab-val-desc">{isAr ? v.descAr : v.descFr}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LOCATION ── */}
      <div className="ab-loc">
        <div className="ab-loc-inner">
          <div className="section-header">
            <div className="section-tag">{T.findTag}</div>
            <h2 className="section-title">{T.findH2}</h2>
          </div>
          <div className="ab-loc-grid">
            <div className="ab-loc-card">
              <div className="ab-loc-card-title"><MapPin size={18} />{T.addressLabel}</div>
              <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '0.9rem', marginBottom: '1rem' }}>{T.addressVal}</p>
              <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
                {settings?.store_map_iframe
                  ? <div dangerouslySetInnerHTML={{ __html: settings.store_map_iframe.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="180"') }} />
                  : <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207.26730226122532!2d-7.163565696074601!3d33.7793485957184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7a61535e16707%3A0x99a79e97743e3a!2sBouznika!5e0!3m2!1sen!2sma!4v1777733390873!5m2!1sen!2sma" width="100%" height="180" style={{ border: 0, display: 'block' }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                }
              </div>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(T.addressVal)}`} target="_blank" rel="noreferrer" className="btn-map proexcel-btn-about-map" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
                {T.openMap}
              </a>
            </div>

            <div className="ab-loc-card">
              <div className="ab-loc-card-title"><Clock size={18} />{T.hoursLabel}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {days.map(day => {
                  const time = settings?.[day.key] || (isAr ? 'مغلق' : 'Fermé')
                  const closed = time === 'Fermé' || time === 'مغلق'
                  return (
                    <div key={day.key} className="ab-hours-row">
                      <span style={{ color: 'var(--text2)' }}>{isAr ? day.ar : day.fr}</span>
                      <span style={{ fontWeight: 600, color: closed ? 'var(--red)' : 'var(--text)' }}>{time}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="ab-cta">
        <h2>{T.ctaH2}</h2>
        <p>{T.ctaSub}</p>
        <Link href="/best-offers" className="btn-primary proexcel-btn-about-catalog" style={{ fontSize: '1rem', padding: '1rem 2.5rem', display: 'inline-flex' }}>
          {T.ctaBtn}
        </Link>
      </div>
    </>
  )
}
