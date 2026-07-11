'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LangContext'
import { Facebook, Instagram, Phone, Mail, MapPin } from '@/components/LucideIcons'

function WhatsAppIcon({ size = 18, className = "" }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  )
}

function PELogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8">
        <div className="absolute top-0 left-0 w-6 h-6 border-2 border-white rounded-sm"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-sm flex items-center justify-center">
          <span className="text-[#0d1117] text-xs font-black tracking-tighter">PE</span>
        </div>
      </div>
      <div className="font-sans text-xl font-bold text-white tracking-wide">ProExcel</div>
    </div>
  )
}

export default function Footer() {
  const { lang } = useLang()
  const [logoSrc, setLogoSrc] = useState('')
  const [logoReady, setLogoReady] = useState(false)
  const [socials, setSocials] = useState({ fb: '', ig: '', phone: '', email: '', whatsapp: '', address: '' })

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      const src = d?.site_logo || '/logo.png'
      const img = new Image()
      img.onload = () => { setLogoSrc(src); setLogoReady(true) }
      img.onerror = () => { setLogoSrc(''); setLogoReady(false) }
      img.src = src
      setSocials({
        fb: d?.store_facebook || 'https://facebook.com',
        ig: d?.store_instagram || 'https://instagram.com',
        phone: d?.store_phone || '+212 6 00 00 00 00',
        whatsapp: d?.store_phone || d?.store_whatsapp || '+212 6 00 00 00 00',
        email: d?.store_email || 'contact@proexcel.ma',
        address: d?.store_address || 'Casablanca, Maroc'
      })
    }).catch(() => {})
  }, [])

  const t = {
    fr: {
      desc: 'Votre librairie scolaire de confiance au Maroc. Des livres de qualité pour réussir votre année scolaire.',
      catalogTitle: 'CATALOGUE',
      home: 'Accueil',
      offers: 'Meilleures Offres',
      primaire: 'Primaire',
      college: 'Collège',
      lycee: 'Lycée',
      about: 'À Propos',
      contact: 'Contact',
      infoTitle: 'INFORMATIONS',
      return: 'Politique de retour',
      terms: "Conditions d'utilisation",
      privacy: 'Confidentialité',
      shipping: 'Livraison & Expédition',
      faq: 'FAQ',
      supportTitle: 'SUPPORT & CONTACT',
      whatsappDirect: 'WhatsApp direct',
      rights: '© 2026 ProExcel. Tous droits réservés.',
      transfer: 'Virement',
      cash: 'À la livraison',
    },
    ar: {
      desc: 'مكتبتك المدرسية الموثوقة في المغرب. كتب عالية الجودة لنجاح عامك الدراسي.',
      catalogTitle: 'الكتالوج',
      home: 'الرئيسية',
      offers: 'أفضل العروض',
      primaire: 'الابتدائي',
      college: 'الإعدادي',
      lycee: 'الثانوي',
      about: 'من نحن',
      contact: 'اتصل بنا',
      infoTitle: 'معلومات',
      return: 'سياسة الإرجاع',
      terms: 'شروط الاستخدام',
      privacy: 'سياسة الخصوصية',
      shipping: 'الشحن والتوصيل',
      faq: 'الأسئلة الشائعة',
      supportTitle: 'الدعم والاتصال',
      whatsappDirect: 'واتساب مباشر',
      rights: '© 2026 برو إكسيل. جميع الحقوق محفوظة.',
      transfer: 'تحويل بنكي',
      cash: 'الدفع عند الاستلام',
    }
  }

  const T = t[lang as keyof typeof t] ?? t.fr
  const isAr = lang === 'ar'

  return (
    <>
      <footer className="w-full bg-[#0d1117] text-white pt-20 pb-8 mt-16 font-sans flex flex-col items-center" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="w-full max-w-[1240px] px-6 md:px-8">
          
          {/* Main 4-Column Layout */}
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 pb-16 w-full">
            
            {/* Column 1: Brand & Socials */}
            <div className="flex flex-col items-start gap-6 w-full lg:w-[30%]">
              {logoReady && logoSrc ? (
                <img
                  src={logoSrc}
                  alt="ProExcel"
                  className="h-[48px] object-contain filter brightness-0 invert opacity-95 transition-opacity hover:opacity-100"
                  onError={() => setLogoReady(false)}
                />
              ) : (
                <PELogo />
              )}
              <p className="text-[0.9rem] text-gray-400 leading-relaxed pr-4 font-medium">
                {T.desc}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <a href={socials.fb} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1877F2] to-[#0a56bd] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(24,119,242,0.4)]">
                  <Facebook size={20} fill="currentColor" strokeWidth={0} />
                </a>
                <a href={socials.ig} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(214,36,159,0.4)]">
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Column 2: Catalogue */}
            <div className="flex flex-col gap-6 w-full lg:w-[20%] lg:pl-6">
              <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase">{T.catalogTitle}</h4>
              <ul className="flex flex-col gap-4 text-[0.95rem] font-medium text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors duration-200">{T.home}</Link></li>
                <li><Link href="/best-offers" className="hover:text-white transition-colors duration-200">{T.offers}</Link></li>
                <li><Link href="/niveaux/primaire" className="hover:text-white transition-colors duration-200">{T.primaire}</Link></li>
                <li><Link href="/niveaux/college" className="hover:text-white transition-colors duration-200">{T.college}</Link></li>
                <li><Link href="/niveaux/lycee" className="hover:text-white transition-colors duration-200">{T.lycee}</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors duration-200">{T.about}</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors duration-200">{T.contact}</Link></li>
              </ul>
            </div>

            {/* Column 3: Informations */}
            <div className="flex flex-col gap-6 w-full lg:w-[20%]">
              <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase">{T.infoTitle}</h4>
              <ul className="flex flex-col gap-4 text-[0.95rem] font-medium text-gray-400">
                <li><Link href="/terms#retour" className="hover:text-white transition-colors duration-200">{T.return}</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors duration-200">{T.terms}</Link></li>
                <li><Link href="/terms#confidentialite" className="hover:text-white transition-colors duration-200">{T.privacy}</Link></li>
                <li><Link href="/terms#livraison" className="hover:text-white transition-colors duration-200">{T.shipping}</Link></li>
                <li><Link href="/terms#faq" className="hover:text-white transition-colors duration-200">{T.faq}</Link></li>
              </ul>
            </div>

            {/* Column 4: Support & Contact */}
            <div className="flex flex-col gap-6 w-full lg:w-[25%]">
              <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase">{T.supportTitle}</h4>
              <ul className="flex flex-col gap-4 text-[0.9rem] font-medium text-gray-400">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Phone size={14} className="text-gray-300" />
                  </div>
                  <span dir="ltr">{socials.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00d084]/10 flex items-center justify-center flex-shrink-0">
                    <WhatsAppIcon size={14} className="text-[#00d084]" />
                  </div>
                  <span dir="ltr">WhatsApp: {socials.whatsapp}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Mail size={14} className="text-gray-300" />
                  </div>
                  <span className="hover:text-white transition-colors duration-200 cursor-pointer">{socials.email}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={14} className="text-gray-300" />
                  </div>
                  <span className="leading-relaxed">{socials.address}</span>
                </li>
              </ul>
              <div className="mt-6">
                <a 
                  href={`https://wa.me/${socials.whatsapp.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_12px_rgba(37,211,102,0.25)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] font-bold tracking-wide"
                  style={{ 
                    color: '#ffffff', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '8px', 
                    padding: '10px 24px',
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                  }}
                >
                  <WhatsAppIcon size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span style={{ position: 'relative', zIndex: 10 }}>{T.whatsappDirect}</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-6 text-[0.85rem] text-gray-500 font-medium w-full">
            <p>{T.rights}</p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="text-gray-400 text-[0.75rem] font-bold tracking-widest uppercase cursor-default">CMI</span>
              <span className="text-gray-500/40 text-[0.6rem]">•</span>
              <span className="text-gray-400 text-[0.75rem] font-bold tracking-widest uppercase cursor-default">{T.transfer}</span>
              <span className="text-gray-500/40 text-[0.6rem]">•</span>
              <span className="text-gray-400 text-[0.75rem] font-bold tracking-widest uppercase cursor-default">{T.cash}</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${socials.whatsapp.replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(37,211,102,0.5)]"
        aria-label="Contact us on WhatsApp"
      >
        <WhatsAppIcon size={28} className="group-hover:scale-110 transition-transform duration-300" />
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75"></span>
      </a>
    </>
  )
}
