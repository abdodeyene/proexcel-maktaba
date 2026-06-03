'use client'

import React from 'react'
import { useLang } from '@/components/LangContext'

interface TestimonialItem {
  name: string
  roleFr: string
  roleAr: string
  textFr: string
  textAr: string
  rating: number
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    name: 'Fatima Z.',
    roleFr: 'Maman de 2 enfants',
    roleAr: 'أم لطفلين',
    textFr: 'Service rapide, produits bien emballés et support WhatsApp très réactif.',
    textAr: 'خدمة سريعة، منتجات مغلفة جيدًا ودعم واتساب سريع الاستجابة.',
    rating: 5
  },
  {
    name: 'Youssef M.',
    roleFr: "Parent d'élève",
    roleAr: 'ولي أمر طالب',
    textFr: "J'ai trouvé tous les manuels pour mes enfants. Livraison rapide.",
    textAr: 'وجدت جميع الكتب المدرسية لأطفالي. توصيل سريع.',
    rating: 5
  },
  {
    name: 'Amina E.',
    roleFr: 'Cliente fidèle',
    roleAr: 'عميلة وفية',
    textFr: 'Prix raisonnables et commande reçue sans problème.',
    textAr: 'أسعار معقولة وطلب تم استلامه بدون أي مشاكل.',
    rating: 5
  },
  {
    name: 'Jean P.',
    roleFr: 'Enseignant',
    roleAr: 'معلم',
    textFr: 'Plateforme très pratique pour commander toutes les fournitures scolaires.',
    textAr: 'منصة عملية للغاية لطلب جميع المستلزمات المدرسية.',
    rating: 5
  },
  {
    name: 'Chaimaa L.',
    roleFr: 'Étudiante',
    roleAr: 'طالبة',
    textFr: 'Les livres sont arrivés en parfait état et très rapidement. Service client impeccable.',
    textAr: 'وصلت الكتب في حالة ممتازة وبسرعة كبيرة. خدمة عملاء ممتازة.',
    rating: 5
  },
  {
    name: 'Karim B.',
    roleFr: "Parent d'élève",
    roleAr: 'ولي أمر',
    textFr: 'Très satisfait de la qualité des cahiers et stylos. Commande livrée sous 48h.',
    textAr: 'راضي تمامًا عن جودة الدفاتر والأقلام. تم توصيل الطلب في غضون 48 ساعة.',
    rating: 5
  },
  {
    name: 'Sofia T.',
    roleFr: "Maman d'élève",
    roleAr: 'أم لطالب',
    textFr: 'Excellent rapport qualité-prix. Support client efficace par WhatsApp.',
    textAr: 'علاقة ممتازة بين الجودة والسعر. دعم عملاء فعال عبر واتساب.',
    rating: 5
  }
]

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400 flex-shrink-0">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export default function Testimonials() {
  const { lang } = useLang()
  const isAr = lang === 'ar'

  const titleFr = 'Ils nous font confiance'
  const titleAr = 'يثقون بنا'

  // Duplicate array for seamless infinite loop
  const allItems = [...DEFAULT_TESTIMONIALS, ...DEFAULT_TESTIMONIALS]

  return (
    <section
      className="relative w-full py-20 md:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #070B14 0%, #05070D 100%)' }}
    >
      {/* Background glow orbs */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/4 w-[500px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(232,53,42,0.12) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)' }}
      />

      {/* Header */}
      <div className="text-center mb-14 md:mb-18 flex flex-col items-center gap-4 relative z-10 px-4">
        <span className="text-[0.72rem] font-bold tracking-[3px] uppercase text-[#e8352a] bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full">
          {isAr ? 'آراء العملاء' : 'Avis Clients'}
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
          {isAr ? titleAr : titleFr}
        </h2>
        <p className="text-base text-gray-400 max-w-[500px]">
          {isAr ? 'ثقة آلاف العائلات المغربية في خدماتنا' : 'La confiance de milliers de familles marocaines'}
        </p>
      </div>

      {/* Marquee container — strictly overflow-hidden with fade masks */}
      <div
        className="relative w-full overflow-hidden z-10"
        dir="ltr"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        {/* Track — uses CSS animation, pauses on hover */}
        <div
          className="flex gap-5 w-max"
          style={{
            animation: 'marqueeScroll 40s linear infinite',
            willChange: 'transform',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'paused'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'running'; }}
        >
          {allItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[300px] sm:w-[360px] bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-4"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
            >
              {/* Rating stars */}
              <div className="flex gap-1" dir="ltr">
                {[...Array(item.rating)].map((_, i) => <StarIcon key={i} />)}
              </div>

              {/* Review Text */}
              <p className="text-sm sm:text-base leading-relaxed text-gray-200 italic flex-1" dir={isAr ? 'rtl' : 'ltr'}>
                &ldquo;{isAr ? item.textAr : item.textFr}&rdquo;
              </p>

              {/* User Row */}
              <div className="flex items-center gap-3 border-t border-white/10 pt-4" dir={isAr ? 'rtl' : 'ltr'}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e8352a] to-[#a81c13] text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-lg">
                  {item.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <h4 className="text-sm font-bold text-white leading-tight">{item.name}</h4>
                  <span className="text-xs text-gray-400 mt-0.5">{isAr ? item.roleAr : item.roleFr}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="marqueeScroll"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}
