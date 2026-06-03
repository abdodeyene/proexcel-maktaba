'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LangContext'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, MessageSquare } from '@/components/LucideIcons'

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.79 1.53V6.74a4.85 4.85 0 0 1-1.02-.05z"/>
    </svg>
  )
}

export default function Footer() {
  const { lang } = useLang()
  const [logoSrc, setLogoSrc] = useState('')
  const [logoReady, setLogoReady] = useState(false)
  const [socials, setSocials] = useState({ fb: '', ig: '', tt: '', yt: '' })
  const [contact, setContact] = useState({
    phone: '',
    whatsapp: '',
    email: '',
    address: ''
  })

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      const src = d?.site_logo || '/logo.png'
      const img = new Image()
      img.onload = () => { setLogoSrc(src); setLogoReady(true) }
      img.onerror = () => { setLogoSrc(''); setLogoReady(false) }
      img.src = src
      setSocials({
        fb: d?.store_facebook || '',
        ig: d?.store_instagram || '',
        tt: d?.store_tiktok || d?.store_twitter || '',
        yt: d?.store_youtube || ''
      })
      setContact({
        phone: d?.store_phone || '+212 6 00 00 00 00',
        whatsapp: d?.store_whatsapp || d?.store_phone || '+212 6 00 00 00 00',
        email: d?.store_email || 'contact@proexcel.ma',
        address: d?.store_address || 'Casablanca, Maroc'
      })
    }).catch(() => {})
  }, [])

  const t = {
    fr: {
      desc: 'Votre librairie scolaire de confiance au Maroc. Des livres de qualité pour réussir votre année scolaire.',
      navTitle: 'Catalogue',
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
      rights: '© 2026 ProExcel. Tous droits réservés.',
      transfer: 'Virement',
      cash: 'À la livraison',
      supportTitle: 'Support & Contact',
      whatsappBtn: 'WhatsApp direct',
    },
    ar: {
      desc: 'مكتبتك المدرسية الموثوقة في المغرب. كتب عالية الجودة لنجاح عامك الدراسي.',
      navTitle: 'الكتالوج',
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
      rights: '© 2026 برو إكسيل. جميع الحقوق محفوظة.',
      transfer: 'تحويل بنكي',
      cash: 'الدفع عند الاستلام',
      supportTitle: 'الدعم والاتصال',
      whatsappBtn: 'واتساب مباشر',
    }
  }

  const T = t[lang as keyof typeof t] ?? t.fr
  const isAr = lang === 'ar'

  return (
    <footer className="proexcel-footer" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="footer-grid">

        {/* ── Brand column ── */}
        <div className="f-brand">
          {logoReady && logoSrc ? (
            <img
              src={logoSrc}
              alt="ProExcel Maktaba"
              className="f-logo-img"
              onError={() => setLogoReady(false)}
            />
          ) : (
            <div className="f-logo-fallback">
              ProExcel
            </div>
          )}
          <p className="f-desc">{T.desc}</p>

          {/* Social icons */}
          <div className="f-socials">
            {socials.fb && socials.fb !== '#' && (
              <a
                className="s-btn s-btn--fb"
                href={socials.fb} target="_blank"
                rel="noopener noreferrer" title="Facebook" aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            )}
            {socials.ig && socials.ig !== '#' && (
              <a
                className="s-btn s-btn--ig"
                href={socials.ig} target="_blank"
                rel="noopener noreferrer" title="Instagram" aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            )}
            {socials.tt && socials.tt !== '#' && (
              <a
                className="s-btn s-btn--tt"
                href={socials.tt} target="_blank"
                rel="noopener noreferrer" title="TikTok" aria-label="TikTok"
              >
                <TikTokIcon size={18} />
              </a>
            )}
            {socials.yt && socials.yt !== '#' && (
              <a
                className="s-btn s-btn--yt"
                href={socials.yt} target="_blank"
                rel="noopener noreferrer" title="YouTube" aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            )}
          </div>
        </div>

        {/* ── Navigation column ── */}
        <div className="f-col">
          <h4 className="f-col-title">{T.navTitle}</h4>
          <ul className="f-links">
            <li><Link href="/">{T.home}</Link></li>
            <li><Link href="/best-offers">{T.offers}</Link></li>
            <li><Link href="/niveaux/primaire">{lang === 'fr' ? 'Primaire' : 'الابتدائي'}</Link></li>
            <li><Link href="/niveaux/college">{lang === 'fr' ? 'Collège' : 'الإعدادي'}</Link></li>
            <li><Link href="/niveaux/lycee">{lang === 'fr' ? 'Lycée' : 'الثانوي'}</Link></li>
            <li><Link href="/about">{T.about}</Link></li>
            <li><Link href="/contact">{T.contact}</Link></li>
          </ul>
        </div>

        {/* ── Info/legal column ── */}
        <div className="f-col">
          <h4 className="f-col-title">{T.infoTitle}</h4>
          <ul className="f-links">
            <li><Link href="/terms#retour">{T.return}</Link></li>
            <li><Link href="/terms">{T.terms}</Link></li>
            <li><Link href="/terms#confidentialite">{T.privacy}</Link></li>
            <li><Link href="/terms#livraison">{T.shipping}</Link></li>
            <li><Link href="/terms#faq">{T.faq}</Link></li>
          </ul>
        </div>

        {/* ── Contact/Support column ── */}
        <div className="f-col f-col--contact">
          <h4 className="f-col-title">{T.supportTitle}</h4>
          <ul className="f-contact-info">
            {contact.phone && (
              <li>
                <Phone size={14} className="f-contact-icon" />
                <span>{contact.phone}</span>
              </li>
            )}
            {contact.whatsapp && (
              <li>
                <MessageSquare size={14} className="f-contact-icon" style={{ color: '#22c55e' }} />
                <a href={`https://wa.me/${contact.whatsapp.replace(/\+/g, '').replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover-underline">WhatsApp: {contact.whatsapp}</a>
              </li>
            )}
            {contact.email && (
              <li>
                <Mail size={14} className="f-contact-icon" />
                <a href={`mailto:${contact.email}`} className="hover-underline">{contact.email}</a>
              </li>
            )}
            {contact.address && (
              <li>
                <MapPin size={14} className="f-contact-icon" />
                <span>{contact.address}</span>
              </li>
            )}
          </ul>
          
          {/* Quick WhatsApp CTA */}
          {contact.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="f-whatsapp-btn"
            >
              <MessageSquare size={16} />
              <span>{T.whatsappBtn}</span>
            </a>
          )}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="f-bottom">
        <p className="f-copyright">{T.rights}</p>
        <div className="f-payments">
          <span className="pay-badge">CMI</span>
          <span className="pay-badge">{T.transfer}</span>
          <span className="pay-badge">{T.cash}</span>
        </div>
      </div>


      {/* ── Floating WhatsApp Widget ── */}
      <a
        href={`https://wa.me/${(contact.whatsapp || '+212 6 00 00 00 00').replace(/\+/g, '').replace(/\s+/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="proexcel-floating-whatsapp"
        aria-label="Discuter sur WhatsApp"
        title="Discuter sur WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.574 1.97 14.101.945 11.487.945 6.05 1.945 1.625 6.315 1.621 11.747c-.001 1.698.443 3.353 1.288 4.808L1.879 22.14l5.768-1.514zM17.844 14.7c-.3-.15-1.782-.88-2.062-.98-.28-.102-.484-.15-.688.15-.204.3-.79.98-.97 1.18-.18.2-.36.224-.66.074-2.73-1.36-4.47-2.86-5.8-5.15-.15-.259-.015-.4.12-.535.122-.122.28-.33.42-.495.14-.165.188-.28.28-.465.093-.185.047-.349-.023-.5-.07-.15-.688-1.66-.943-2.277-.25-.6-.5-.52-.688-.53-.18-.01-.387-.01-.594-.01-.206 0-.543.08-.827.39-.283.31-1.08.105-1.08 2.57 0 2.465 1.793 4.84 2.043 5.17.25.33 3.528 5.39 8.549 7.55 1.196.51 2.13.82 2.855 1.05 1.2.38 2.29.33 3.15.2 1 .15 1.78-.4 2.06-1.12.28-.72.28-1.34.2-1.47-.08-.13-.3-.21-.6-.36z" />
        </svg>
      </a>

      <style>{`
        .proexcel-floating-whatsapp {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          width: 60px;
          height: 60px;
          background-color: #25d366;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4), inset 0 1px 0 rgba(255,255,255,0.2);
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .proexcel-floating-whatsapp:hover {
          transform: translateY(-4px) scale(1.06);
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.6), inset 0 1px 0 rgba(255,255,255,0.3);
          background-color: #20ba5a;
        }

        @media (max-width: 768px) {
          .proexcel-floating-whatsapp {
            bottom: 80px;
            right: 16px;
            width: 50px;
            height: 50px;
          }
          .proexcel-floating-whatsapp svg {
            width: 24px;
            height: 24px;
          }
        }

        .proexcel-footer {
          background: linear-gradient(to top, #05070d 0%, #070B14 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.02), inset 0 30px 60px -30px rgba(56,189,248,0.05);
          padding: 4.5rem 2rem 2rem;
          color: #94a3b8;
          font-family: var(--font-latin);
          position: relative;
        }

        [dir="rtl"] .proexcel-footer {
          font-family: var(--font-arabic);
        }

        .footer-grid {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .f-brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.2rem;
        }

        [dir="rtl"] .f-brand {
          align-items: flex-start;
        }

        .f-logo-img {
          height: 38px;
          object-fit: contain;
          display: block;
          filter: brightness(0) invert(1);
          opacity: 0.95;
        }

        .f-logo-fallback {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .f-desc {
          font-size: 0.9rem;
          line-height: 1.65;
          color: #94a3b8;
          max-width: 320px;
        }

        .f-socials {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .s-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: all 0.25s ease;
          text-decoration: none;
        }

        .s-btn:hover {
          color: #fff;
          background: var(--primary, #e11d2e);
          border-color: var(--primary, #e11d2e);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(225, 29, 46, 0.35);
        }

        .f-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .f-col-title {
          font-family: var(--font-heading-latin);
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.02em;
        }

        [dir="rtl"] .f-col-title {
          font-family: var(--font-heading-arabic);
        }

        .f-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .f-links a {
          font-size: 0.9rem;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .f-links a:hover {
          color: #fff;
          transform: translateX(4px);
        }

        [dir="rtl"] .f-links a:hover {
          transform: translateX(-4px);
        }

        .f-contact-info {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .f-contact-info li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.9rem;
          color: #94a3b8;
          line-height: 1.4;
        }

        .f-contact-icon {
          color: var(--primary, #e11d2e);
          margin-top: 0.2rem;
          flex-shrink: 0;
        }

        .hover-underline:hover {
          text-decoration: underline;
          color: #fff;
        }

        .f-whatsapp-btn {
          margin-top: 0.75rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          color: #22c55e;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.65rem 1.2rem;
          border-radius: 30px;
          text-decoration: none;
          transition: all 0.25s ease;
          align-self: flex-start;
        }

        .f-whatsapp-btn:hover {
          background: #22c55e;
          color: #fff;
          border-color: #22c55e;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25);
        }

        .f-bottom {
          max-width: 1400px;
          margin: 0 auto;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
        }

        .f-copyright {
          font-size: 0.82rem;
          color: #64748b;
        }

        .f-payments {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .pay-badge {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 0.25rem 0.6rem;
          font-size: 0.72rem;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.05em;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 3rem;
          }
        }

        @media (max-width: 768px) {
          .proexcel-footer {
            padding: 3rem 1.25rem 1.5rem;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            margin-bottom: 3rem;
          }
          .f-brand {
            align-items: center;
            text-align: center;
          }
          .f-desc {
            max-width: 100%;
          }
          .f-socials {
            justify-content: center;
          }
          .f-col {
            align-items: center;
            text-align: center;
          }
          .f-whatsapp-btn {
            align-self: center;
          }
          .f-bottom {
            flex-direction: column;
            text-align: center;
            padding-top: 1.5rem;
          }
        }
      `}</style>
    </footer>
  )
}
