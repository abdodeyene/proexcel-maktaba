'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [lang, setLang] = useState<'fr' | 'ar'>('fr')
  const [logoSrc, setLogoSrc] = useState('/logo.png')

  const [socials, setSocials] = useState({ fb: '', ig: '', tw: '', yt: '' })

  useEffect(() => {
    const savedLang = localStorage.getItem('proexcel_lang') as 'fr' | 'ar' | null
    if (savedLang) setLang(savedLang)
    fetch('/api/settings').then(r => r.json()).then(d => { 
      if(d?.site_logo) setLogoSrc(d.site_logo)
      setSocials({
        fb: d?.store_facebook || '',
        ig: d?.store_instagram || '',
        tw: d?.store_twitter || '',
        yt: d?.store_youtube || ''
      })
    }).catch(()=>{})
  }, [])

  const locale = lang

  const t = {
    fr: {
      desc: 'Votre librairie scolaire de confiance au Maroc. Des livres de qualité pour réussir votre année scolaire.',
      nav: 'Navigation',
      home: 'Accueil',
      offers: 'Meilleures Offres',
      about: 'À Propos',
      contact: 'Contact',
      cat: 'Catégories',
      math: 'Mathématiques',
      sci: 'Sciences',
      lang: 'Langues',
      info: 'Informatique',
      pack: 'Packs',
      infoTitle: 'Infos',
      return: 'Politique de retour',
      terms: "Conditions d'utilisation",
      privacy: 'Confidentialité',
      shipping: 'Livraison & Expédition',
      faq: 'FAQ',
      rights: '© 2026 ProExcel Maktaba. Tous droits réservés.',
      transfer: 'Virement',
      cash: 'Cash'
    },
    ar: {
      desc: 'مكتبتك المدرسية الموثوقة في المغرب. كتب عالية الجودة لنجاح عامك الدراسي.',
      nav: 'تصفح',
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
      cash: 'نقداً'
    }
  }

  const currentT = t[locale as 'fr' | 'ar']
  return (
    <footer>
      <div className="footer-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
        <div className="f-brand">
          <img src={logoSrc} alt="ProExcel" style={{ height: '45px', objectFit: 'contain', marginBottom: '1rem', display: 'block' }} />
          <p className="f-desc">{currentT.desc}</p>
          <div className="f-socials">
            {socials.fb && (
              <a className="s-btn" href={socials.fb} target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            )}
            {socials.ig && (
              <a className="s-btn" href={socials.ig} target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            )}
            {socials.tw && (
              <a className="s-btn" href={socials.tw} target="_blank" rel="noopener noreferrer" title="Twitter" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            )}
            {socials.yt && (
              <a className="s-btn" href={socials.yt} target="_blank" rel="noopener noreferrer" title="YouTube" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        <div className="f-col">
          <h4>{currentT.nav}</h4>
          <ul className="f-links">
            <li><Link href="/">{currentT.home}</Link></li>
            <li><Link href="/best-offers">{currentT.offers}</Link></li>
            <li><Link href="/about">{currentT.about}</Link></li>
            <li><Link href="/contact">{currentT.contact}</Link></li>
          </ul>
        </div>

        <div className="f-col">
          <h4>{currentT.infoTitle}</h4>
          <ul className="f-links">
            <li><a href="#">{currentT.return}</a></li>
            <li><a href="#">{currentT.terms}</a></li>
            <li><a href="#">{currentT.privacy}</a></li>
            <li><a href="#">{currentT.shipping}</a></li>
            <li><a href="#">{currentT.faq}</a></li>
          </ul>
        </div>
      </div>

      <div className="f-bottom">
        <p>{currentT.rights}</p>
        <div className="f-payments">
          <span className="pay-badge">💳 CMI</span>
          <span className="pay-badge">🏦 {currentT.transfer}</span>
          <span className="pay-badge">💵 {currentT.cash}</span>
        </div>
      </div>
    </footer>
  )
}
