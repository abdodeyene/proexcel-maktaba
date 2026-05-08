'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LangContext'

export default function AboutPage() {
  const { lang } = useLang()
  const [aboutImgs, setAboutImgs] = useState({ about_img_1: '', about_img_2: '', about_img_3: '', about_img_4: '' })

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setAboutImgs({
            about_img_1: data.about_img_1 || '',
            about_img_2: data.about_img_2 || '',
            about_img_3: data.about_img_3 || '',
            about_img_4: data.about_img_4 || '',
          })
        }
      })
      .catch(() => {})
  }, [])

  const fallbackGradient = 'linear-gradient(135deg, #0e1e3a 0%, #070B14 100%)'

  const t = {
    fr: {
      breadHome: 'Accueil',
      breadAbout: 'À Propos',
      heroTitle1: 'À Propos de',
      heroTitle2: 'ProExcel',
      heroSub: 'Votre librairie scolaire de référence au Maroc depuis plus de 10 ans',
      storyTag: 'Notre Histoire',
      storyH2a: 'Plus de',
      storyH2b: '10 ans',
      storyH2c: 'au service de l\'éducation marocaine',
      story1: 'Fondée en 2014, ProExcel Maktaba est née d\'une passion pour l\'éducation et d\'un constat simple : les familles marocaines avaient besoin d\'un accès facile et fiable aux livres scolaires de qualité.',
      story2: 'Aujourd\'hui, nous proposons plus de 1 200 titres couvrant tous les niveaux du primaire au baccalauréat, en conformité avec les programmes officiels du Ministère de l\'Éducation Nationale marocain.',
      story3: 'Notre équipe de spécialistes sélectionne chaque ouvrage avec soin pour garantir qualité pédagogique, conformité aux référentiels officiels et accessibilité tarifaire pour toutes les familles.',
      stat1: 'Années d\'expérience', stat2: 'Titres disponibles', stat3: 'Clients fidèles', stat4: 'Délai de livraison',
      valTag: 'Nos Valeurs', valH2: 'Ce qui nous différencie',
      vals: [
        { icon: '✅', t: 'Qualité certifiée', d: 'Tous nos livres sont conformes aux programmes officiels du Ministère de l\'Éducation Nationale.' },
        { icon: '💰', t: 'Prix justes', d: 'Nous négocions directement avec les éditeurs pour vous offrir les meilleurs tarifs.' },
        { icon: '🚚', t: 'Livraison rapide', d: 'Recevez vos commandes en 24 à 48 heures partout au Maroc.' },
        { icon: '🤝', t: 'Service client', d: 'Notre équipe est disponible 6 jours sur 7 pour répondre à toutes vos questions.' },
        { icon: '🔄', t: 'Retours faciles', d: 'Politique de retour simplifiée sous 14 jours sans conditions.' },
        { icon: '📦', t: 'Stock permanent', d: 'Plus de 1 200 titres disponibles en permanence pour ne jamais rater la rentrée.' },
      ],
      findTag: 'Nous Trouver', findH2: 'Notre Boutique',
      addressLabel: 'Adresse', addressVal: 'Bouznika, Maroc',
      hoursLabel: 'Horaires',
      schedule: [['Lun – Ven', '08:30 – 19:00'], ['Samedi', '09:00 – 18:00'], ['Dimanche', '10:00 – 14:00'], ['Jours fériés', 'Fermé']],
      openMap: 'Ouvrir dans Maps',
      ctaH2: 'Prêt à explorer notre catalogue ?',
      ctaSub: 'Découvrez notre sélection de plus de 1 200 livres scolaires',
      ctaBtn: 'Explorer le catalogue ›',
    },
    ar: {
      breadHome: 'الرئيسية',
      breadAbout: 'من نحن',
      heroTitle1: 'من نحن -',
      heroTitle2: 'برو إكسيل',
      heroSub: 'مكتبتك المدرسية الموثوقة في المغرب منذ أكثر من 10 سنوات',
      storyTag: 'قصتنا',
      storyH2a: 'أكثر من',
      storyH2b: '10 سنوات',
      storyH2c: 'في خدمة التعليم المغربي',
      story1: 'تأسست برو إكسيل مكتبة عام 2014 من شغف بالتعليم وإدراك بسيط: احتياج الأسر المغربية إلى وصول سهل وموثوق للكتب المدرسية عالية الجودة.',
      story2: 'اليوم، نقدم أكثر من 1200 عنوان يغطي جميع المستويات من الابتدائي حتى الثانوية، وفق المناهج الرسمية لوزارة التعليم الوطني المغربية.',
      story3: 'يختار فريق متخصصينا كل كتاب بعناية لضمان الجودة التربوية، والامتثال للمناهج الرسمية، وإمكانية الوصول بأسعار مناسبة لجميع الأسر.',
      stat1: 'سنوات خبرة', stat2: 'عنوان متوفر', stat3: 'عميل وفي', stat4: 'وقت التوصيل',
      valTag: 'قيمنا', valH2: 'ما يميزنا',
      vals: [
        { icon: '✅', t: 'جودة معتمدة', d: 'جميع كتبنا متوافقة مع المناهج الرسمية لوزارة التعليم الوطني.' },
        { icon: '💰', t: 'أسعار عادلة', d: 'نتفاوض مباشرة مع الناشرين لنقدم لك أفضل الأسعار.' },
        { icon: '🚚', t: 'توصيل سريع', d: 'استلم طلباتك خلال 24 إلى 48 ساعة في جميع أنحاء المغرب.' },
        { icon: '🤝', t: 'خدمة العملاء', d: 'فريقنا متاح 6 أيام في الأسبوع للرد على جميع استفساراتك.' },
        { icon: '🔄', t: 'إرجاع سهل', d: 'سياسة إرجاع مبسطة خلال 14 يوماً دون شروط.' },
        { icon: '📦', t: 'مخزون دائم', d: 'أكثر من 1200 عنوان متوفر باستمرار لضمان عدم فوات الموسم الدراسي.' },
      ],
      findTag: 'موقعنا', findH2: 'متجرنا',
      addressLabel: 'العنوان', addressVal: 'بوزنيقة، المغرب',
      hoursLabel: 'ساعات العمل',
      schedule: [['الاثنين – الجمعة', '08:30 – 19:00'], ['السبت', '09:00 – 18:00'], ['الأحد', '10:00 – 14:00'], ['أيام العطل', 'مغلق']],
      openMap: 'فتح في الخرائط',
      ctaH2: 'هل أنت مستعد لاستكشاف كتالوجنا؟',
      ctaSub: 'اكتشف مجموعتنا من أكثر من 1200 كتاب مدرسي',
      ctaBtn: 'تصفح الكتالوج ›',
    }
  }

  const c = t[lang]

  return (
    <>
      {/* PAGE HERO */}
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #070B14 0%, #0e1e3a 50%, #070B14 100%)', minHeight: '340px', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/logo.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
        <div className="page-hero-inner" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb-nav">
            <Link href="/">{c.breadHome}</Link>
            <span>›</span>
            <span>{c.breadAbout}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', marginBottom: '0.75rem' }}>
            {c.heroTitle1} <span style={{ color: 'var(--primary)' }}>{c.heroTitle2}</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', maxWidth: '560px' }}>
            {c.heroSub}
          </p>
        </div>
      </div>

      {/* STORY SECTION */}
      <style>{`
        .about-story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-areas: "text1 imgtop" "text2 imgbottom";
          gap: 3rem 5rem;
          align-items: start;
        }
        .about-story-text1 { grid-area: text1; }
        .about-story-text2 { grid-area: text2; }
        .about-story-imgtop { grid-area: imgtop; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .about-story-imgbottom { grid-area: imgbottom; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-self: start; }
        @media (max-width: 768px) {
          .about-story-grid {
            grid-template-columns: 1fr;
            grid-template-areas: "text1" "imgtop" "text2" "imgbottom";
            gap: 1.75rem;
          }
          .about-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-location-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div className="about-story-grid">
          <div className="about-story-text1">
            <div className="section-tag" style={{ display: 'inline-block' }}>{c.storyTag}</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
              {c.storyH2a} <span className="text-gold">{c.storyH2b}</span><br />{c.storyH2c}
            </h2>
            <p style={{ color: 'var(--text2)', lineHeight: 1.9, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              {c.story1}
            </p>
          </div>
          <div className="about-story-imgtop">
            <div style={{ borderRadius: '14px', overflow: 'hidden', height: '220px', border: '1px solid var(--border)', background: aboutImgs.about_img_1 ? undefined : fallbackGradient }}>
              {aboutImgs.about_img_1 ? <img src={aboutImgs.about_img_1} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : null}
            </div>
            <div style={{ borderRadius: '14px', overflow: 'hidden', height: '220px', border: '1px solid var(--border)', marginTop: '1.5rem', background: aboutImgs.about_img_2 ? undefined : fallbackGradient }}>
              {aboutImgs.about_img_2 ? <img src={aboutImgs.about_img_2} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : null}
            </div>
          </div>
          <div className="about-story-text2">
            <p style={{ color: 'var(--text2)', lineHeight: 1.9, marginBottom: '1.25rem', fontSize: '0.95rem' }}>{c.story2}</p>
            <p style={{ color: 'var(--text2)', lineHeight: 1.9, fontSize: '0.95rem' }}>{c.story3}</p>
          </div>
          <div className="about-story-imgbottom">
            <div style={{ borderRadius: '14px', overflow: 'hidden', height: '160px', border: '1px solid var(--border)', background: aboutImgs.about_img_3 ? undefined : fallbackGradient }}>
              {aboutImgs.about_img_3 ? <img src={aboutImgs.about_img_3} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : null}
            </div>
            <div style={{ borderRadius: '14px', overflow: 'hidden', height: '160px', border: '1px solid var(--border)', background: aboutImgs.about_img_4 ? undefined : fallbackGradient }}>
              {aboutImgs.about_img_4 ? <img src={aboutImgs.about_img_4} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : null}
            </div>
          </div>
        </div>
      </div>

      {/* STATS BAND */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '4rem 2rem' }}>
        <div className="about-stats-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
          {[
            { num: '10+', label: c.stat1 },
            { num: '1200+', label: c.stat2 },
            { num: '15K+', label: c.stat3 },
            { num: '48h', label: c.stat4 },
          ].map(s => (
            <div key={s.label} className="stat-item" style={{ background: 'var(--card)', padding: '2rem 1rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ fontFamily: "'Poppins', 'Inter', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>{s.num}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text2)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* VALUES */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div className="section-header">
          <div className="section-tag">{c.valTag}</div>
          <h2 className="section-title">{c.valH2}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
          {c.vals.map(v => (
            <div key={v.t} className="value-card" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem 1.5rem', transition: 'var(--t)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{v.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>{v.t}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.7 }}>{v.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* LOCATION */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-tag">{c.findTag}</div>
          <h2 className="section-title" style={{ marginBottom: '3rem' }}>{c.findH2}</h2>
          <div className="about-location-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                {c.addressLabel}
              </div>
              <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '0.9rem' }}>{c.addressVal}</p>
              <div style={{ borderRadius: '8px', overflow: 'hidden', marginTop: '1rem' }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207.26730226122532!2d-7.163565696074601!3d33.7793485957184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7a61535e16707%3A0x99a79e97743e3a!2sBouznika!5e0!3m2!1sen!2sma!4v1777733390873!5m2!1sen!2sma" width="100%" height="180" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
              <a href="https://maps.google.com/?q=Bouznika+Maroc" target="_blank" rel="noreferrer" className="btn-map" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
                {c.openMap}
              </a>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary)' }}>🕐 {c.hoursLabel}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                {c.schedule.map(([day, time]) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text2)' }}>{day}</span>
                    <span style={{ fontWeight: 600, color: (time === 'Fermé' || time === 'مغلق') ? 'var(--red)' : 'var(--text)' }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '5rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--bg), var(--bg2))' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '1rem' }}>{c.ctaH2}</h2>
        <p style={{ color: 'var(--text2)', marginBottom: '2rem', fontSize: '0.95rem' }}>{c.ctaSub}</p>
        <Link href="/best-offers" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem', display: 'inline-flex' }}>
          {c.ctaBtn}
        </Link>
      </div>
    </>
  )
}
