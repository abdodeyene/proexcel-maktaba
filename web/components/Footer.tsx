'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LangContext'

export default function Footer() {
  const { lang } = useLang()
  const [logoSrc, setLogoSrc] = useState('/logo.png')
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [socials, setSocials] = useState({ fb: '', ig: '', tw: '', yt: '' })

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
        tw: d?.store_twitter || '',
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

  const T = t[lang]

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

          {/* Social icons */}
          <div className="f-socials">
            {socials.fb && (
              <a className="s-btn" href={socials.fb} target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            )}
            {socials.ig && (
              <a className="s-btn" href={socials.ig} target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            )}
            {socials.tw && (
              <a className="s-btn" href={socials.tw} target="_blank" rel="noopener noreferrer" title="X / Twitter" aria-label="X / Twitter">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
            {socials.yt && (
              <a className="s-btn" href={socials.yt} target="_blank" rel="noopener noreferrer" title="YouTube" aria-label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}
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
