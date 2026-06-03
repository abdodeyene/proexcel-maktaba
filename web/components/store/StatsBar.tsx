'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type StatItem = { num: number; suffix: string; label: string }

type StatsBarProps = {
  settings?: Record<string, string | null>
  lang?: string
}

function parseStatNum(raw: string): { num: number; suffix: string } {
  const s = raw.trim()
  const numMatch = s.match(/^([0-9.,]+)/)
  const numStr = numMatch ? numMatch[1].replace(',', '') : '0'
  const num = parseFloat(numStr)
  const suffix = s.slice(numStr.length)
  return { num, suffix }
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) {
      setValue(0)
      return
    }

    const start = performance.now()
    const easeOutQuad = (t: number) => t * (2 - t)
    let frameId: number

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setValue(Math.round(easeOutQuad(progress) * target))
      
      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      } else {
        setValue(target)
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [target, duration, active])

  return value
}

function StatCol({ stat, active, delay }: { stat: StatItem; active: boolean; delay: number }) {
  const counted = useCountUp(stat.num, 1500, active)
  // Safe fallback: if observer hasn't activated yet, render the final target to avoid 0 values
  const val = active ? counted : stat.num
  const display = val >= 1000 ? val.toLocaleString('fr-FR') : String(val)

  return (
    <div
      className="flex flex-col items-center justify-center flex-1 transition-all duration-1000 ease-out relative"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'none' : 'translateY(20px) scale(0.95)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="text-[1.6rem] xs:text-[2rem] sm:text-[3rem] md:text-[4rem] font-black leading-none tracking-tight whitespace-nowrap flex items-baseline justify-center text-white drop-shadow-lg">
        {display}
        <span className="stats-gradient-text text-[1rem] sm:text-[1.5rem] md:text-[2rem] font-extrabold ml-1">
          {stat.suffix}
        </span>
      </div>
      <div className="text-[0.6rem] sm:text-[0.75rem] font-bold tracking-[2px] sm:tracking-[4px] uppercase mt-3 sm:mt-4 text-center text-gray-400 min-h-[2.5em] flex items-center justify-center leading-relaxed">
        {stat.label}
      </div>
    </div>
  )
}

export default function StatsBar({ settings, lang = 'fr' }: StatsBarProps) {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    obs.observe(element)

    // Fallback: activate animation if observer doesn't fire in 1s
    const fallback = setTimeout(() => {
      setActive(true)
    }, 1000)

    return () => {
      obs.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  const raw1 = settings?.promo_stat1_num || '1200+'
  const raw2 = settings?.promo_stat2_num || '15K+'
  const raw3 = settings?.promo_stat3_num || '30%'

  const label1 = lang === 'ar' ? (settings?.promo_stat1_ar || 'عناوين متوفرة') : (settings?.promo_stat1_fr || 'Titres Disponibles')
  const label2 = lang === 'ar' ? (settings?.promo_stat2_ar || 'عملاء راضون')  : (settings?.promo_stat2_fr || 'Clients Satisfaits')
  const label3 = lang === 'ar' ? (settings?.promo_stat3_ar || 'أقصى توفير')   : (settings?.promo_stat3_fr || 'Économies Max')

  const promoTag   = lang === 'ar' ? (settings?.promo_tag_ar   || 'عرض خاص')            : (settings?.promo_tag_fr   || 'Offre Spéciale')
  const promoTitle = lang === 'ar' ? (settings?.promo_title_ar || 'توصيل مجاني')         : (settings?.promo_title_fr || 'Livraison Gratuite')
  const promoEm    = lang === 'ar' ? (settings?.promo_em_ar    || 'ابتداءً من 499 درهم') : (settings?.promo_em_fr    || 'dès 499 DH')
  const promoSub   = lang === 'ar'
    ? (settings?.promo_sub_ar || 'اطلب المزيد من الكتب واستفد من التوصيل المجاني في جميع أنحاء المغرب.')
    : (settings?.promo_sub_fr || 'Commandez plus de livres et profitez de la livraison offerte partout au Maroc.')
  const btnText = lang === 'ar' ? (settings?.promo_btn_ar || 'عرض جميع العروض') : (settings?.promo_btn_fr || 'Voir toutes les offres')
  const btnLink = settings?.promo_btn_link || '/best-offers'

  const STATS: StatItem[] = [
    { ...parseStatNum(raw1), label: label1 },
    { ...parseStatNum(raw2), label: label2 },
    { ...parseStatNum(raw3), label: label3 },
  ]

  const isAr = lang === 'ar'

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-14 pb-16 px-6 md:pt-24 md:pb-28 lg:pt-28 lg:pb-32 max-w-[1340px] mx-auto my-10 md:my-16 rounded-[2.5rem] text-white shadow-[0_30px_70px_rgba(8,112,184,0.15)] border border-white/[0.07] group"
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        background: 'linear-gradient(145deg, #0f172a 0%, #020617 100%)',
      }}
    >
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          50% { transform: translateY(-15px) translateX(15px) scale(1.02); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .stats-gradient-text {
          background: linear-gradient(135deg, #ff4b2b, #ff416c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stats-glass-panel {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.01);
        }
        .stats-premium-btn {
          background: linear-gradient(135deg, #E8352A, #BE2317);
          box-shadow: 0 10px 25px -5px rgba(232, 53, 42, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2);
        }
        .stats-premium-btn:hover {
          box-shadow: 0 15px 35px -5px rgba(232, 53, 42, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.2);
          transform: translateY(-2px) scale(1.02);
        }
      `}</style>

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full bg-[#E8352A]/15 blur-[120px] animate-[float-slow_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[80%] rounded-full bg-[#3b82f6]/10 blur-[140px] animate-[float-medium_10s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[40%] rounded-full bg-[#8b5cf6]/15 blur-[100px] animate-[pulse-glow_6s_ease-in-out_infinite]" />
        
        {/* Subtle Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.1]" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-[1100px] mx-auto text-center px-4">
        {/* Texts */}
        <div className="flex flex-col items-center gap-5 mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full stats-glass-panel border border-white/10 mb-2 transform transition duration-500 hover:scale-105 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8352A] animate-pulse shadow-[0_0_8px_#E8352A]" />
            <p className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-white/90">
              {promoTag}
            </p>
          </div>
          
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black leading-tight tracking-tight text-white px-2 max-w-[800px]">
            {promoTitle}{' '}
            <span className="relative inline-block whitespace-nowrap stats-gradient-text drop-shadow-[0_0_15px_rgba(232,53,42,0.4)] pb-1">
              {promoEm}
            </span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-[650px] leading-relaxed mt-2 px-4 font-medium">
            {promoSub}
          </p>
        </div>

        {/* Glassmorphic Stats Container */}
        <div className="w-full stats-glass-panel rounded-[2.5rem] px-6 py-10 sm:px-14 sm:py-14 grid grid-cols-3 gap-6 sm:gap-10 md:gap-20 max-w-[1000px] mx-auto relative overflow-hidden group/stats">
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover/stats:animate-[shimmer_2s_infinite] transition-all" />
          
          {STATS.map((stat, i) => (
            <StatCol key={`${stat.label}-${i}`} stat={stat} active={active} delay={i * 150} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-14 md:mt-20 relative group/btn">
          {/* Glow behind button */}
          <div className="absolute -inset-2 bg-gradient-to-r from-[#E8352A] to-[#ff416c] rounded-full blur-xl opacity-30 group-hover/btn:opacity-60 transition duration-500 group-hover/btn:duration-200"></div>
          <Link
            href={btnLink}
            className="relative stats-premium-btn inline-flex items-center justify-center gap-3 text-white font-extrabold text-sm sm:text-lg px-10 py-4 sm:px-12 sm:py-5 rounded-full transition-all duration-300 z-10"
          >
            <span>{btnText}</span>
            <span className="text-xl leading-none group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
