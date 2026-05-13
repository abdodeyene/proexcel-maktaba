'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LangContext'
import { Facebook, Instagram, Youtube } from '@/components/LucideIcons'

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.79 1.53V6.74a4.85 4.85 0 0 1-1.02-.05z"/>
    </svg>
  )
}

export default function Footer() {
  const { lang } = useLang()
  const [logoSrc, setLogoSrc] = useState('/logo.png')
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [socials, setSocials] = useState({ fb: '', ig: '', tt: '', yt: '' })

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d?.site_logo) {
        const img = new Image()
        img.onload = () => { setLogoSrc(d.site_logo); setLogoLoaded(true) }
        img.onerror = () => setLogoLoaded(true)
        img.src = d.site_logo
      } else {
        setLogoLoaded(true)
      }
      setSocials({
        fb: d?.store_facebook || '',
        ig: d?.store_instagram || '',
        tt: d?.store_tiktok || d?.store_twitter || '',
        yt: d?.store_youtube || ''
      })
    }).catch(() => setLogoLoaded(true))
  }, [])

  const t = {
    fr: {
      desc: 'Votre librairie scolaire de confiance au Maroc. Des livres de qualité pour réussir votre année scolaire.',
      navTitle: 'Navigation',
      home: 'Accueil',
      offers: 'Meilleures Offres',
      about: 'À Propos',
      contact: 'Contact',
      infoTitle: 'Informations',
      return: 'Politique de retour',
      terms: "Conditions d'utilisation",
      privacy: 'Confidentialité',
      shipping: 'Livraison & Expédition',
      faq: 'FAQ',
      rights: '© 2026 ProExcel Maktaba. Tous droits réservés.',
      transfer: 'Virement',
      cash: 'Cash',
    },
    ar: {
      desc: 'مكتبتك المدرسية الموثوقة في المغرب. كتب عالية الجودة لنجاح عامك الدراسي.',
      navTitle: 'تصفح',
      home: 'الرئيسية',
      offers: 'أفضل العروض',
      about: 'من نحن',
      contact: 'اتصل بنا',
      infoTitle: 'معلومات',
      return: 'سياسة الإرجاع',
      terms: 'شروط الاستخدام',
      privacy: 'سياسة الخصوصية',
      shipping: 'الشحن والتوصيل',
      faq: 'الأسئلة الشائعة',
      rights: '© 2026 برو إكسيل مكتبة. جميع الحقوق محفوظة.',
      transfer: 'تحويل بنكي',
      cash: 'نقداً',
    }
  }

  const T = t[lang as keyof typeof t] ?? t.fr

  return (
    <footer>
      <div className="footer-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>

        {/* ── Brand column ── */}
        <div className="f-brand">
          {logoLoaded ? (
            <img
              src={logoSrc}
              alt="ProExcel Maktaba"
              style={{ height: '42px', objectFit: 'contain', marginBottom: '1rem', display: 'block', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <div style={{ height: '42px', marginBottom: '1rem', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
              ProExcel
            </div>
          )}
          <p className="f-desc">{T.desc}</p>


          {/* Social icons — always visible, glow on hover */}
          <div className="f-socials">
            <a
              className={`s-btn s-btn--fb${!socials.fb ? ' s-inactive' : ''}`}
              href={socials.fb || '#'} target={socials.fb ? '_blank' : undefined}
              rel="noopener noreferrer" title="Facebook" aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              className={`s-btn s-btn--ig${!socials.ig ? ' s-inactive' : ''}`}
              href={socials.ig || '#'} target={socials.ig ? '_blank' : undefined}
              rel="noopener noreferrer" title="Instagram" aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              className={`s-btn s-btn--tt${!socials.tt ? ' s-inactive' : ''}`}
              href={socials.tt || '#'} target={socials.tt ? '_blank' : undefined}
              rel="noopener noreferrer" title="TikTok" aria-label="TikTok"
            >
              <TikTokIcon size={18} />
            </a>
            <a
              className={`s-btn s-btn--yt${!socials.yt ? ' s-inactive' : ''}`}
              href={socials.yt || '#'} target={socials.yt ? '_blank' : undefined}
              rel="noopener noreferrer" title="YouTube" aria-label="YouTube"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* ── Navigation column ── */}
        <div className="f-col">
          <h4>{T.navTitle}</h4>
          <ul className="f-links">
            <li><Link href="/">{T.home}</Link></li>
            <li><Link href="/best-offers">{T.offers}</Link></li>
            <li><Link href="/about">{T.about}</Link></li>
            <li><Link href="/contact">{T.contact}</Link></li>
          </ul>
        </div>

        {/* ── Info/legal column ── */}
        <div className="f-col">
          <h4>{T.infoTitle}</h4>
          <ul className="f-links">
            <li><Link href="/terms#retour">{T.return}</Link></li>
            <li><Link href="/terms">{T.terms}</Link></li>
            <li><Link href="/terms#confidentialite">{T.privacy}</Link></li>
            <li><Link href="/terms#livraison">{T.shipping}</Link></li>
            <li><Link href="/terms#faq">{T.faq}</Link></li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="f-bottom">
        <p>{T.rights}</p>
        <div className="f-payments">
          <span className="pay-badge">CMI</span>
          <span className="pay-badge">{T.transfer}</span>
          <span className="pay-badge">{T.cash}</span>
        </div>
      </div>
    </footer>
  )
}
