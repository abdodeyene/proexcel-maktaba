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
  let num = parseFloat(numStr)
  const rest = s.slice(numStr.length)
  let suffix = rest
  if (/^[kK]/i.test(rest)) { num *= 1000; suffix = rest.slice(1) }
  return { num, suffix }
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setValue(Math.round(easeOut(p) * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, active])
  return value
}

function StatCol({ stat, active, delay }: { stat: StatItem; active: boolean; delay: number }) {
  const val = useCountUp(stat.num, 1800, active)
  const isK = stat.suffix.toLowerCase().startsWith('k')
  const display = isK
    ? String(Math.round(val / 1000))
    : val >= 1000 ? val.toLocaleString('fr-FR') : String(val)
  const suffix = isK ? `K${stat.suffix.slice(1)}` : stat.suffix

  return (
    <div
      className="flex flex-col items-center justify-center transition-all duration-700"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'none' : 'translateY(12px)',
        transitionDelay: active ? `${delay}ms` : '0ms',
      }}
    >
      <div className="text-[2.6rem] md:text-[3.2rem] font-black text-white leading-none tracking-tight">
        {display}
        <span className="text-red-500 text-[1.5rem] md:text-[1.8rem] font-black align-top mt-1.5 inline-block ml-0.5">
          {suffix}
        </span>
      </div>
      <div className="text-[.56rem] font-bold tracking-[2.5px] uppercase mt-2.5 whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {stat.label}
      </div>
    </div>
  )
}

export default function StatsBar({ settings, lang = 'fr' }: StatsBarProps) {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const raw1 = settings?.promo_stat1_num || '1200+'
  const raw2 = settings?.promo_stat2_num || '15K+'
  const raw3 = settings?.promo_stat3_num || '30%'

  const label1 = lang === 'ar' ? (settings?.promo_stat1_ar || 'عناوين متوفرة') : (settings?.promo_stat1_fr || 'Titres Disponibles')
  const label2 = lang === 'ar' ? (settings?.promo_stat2_ar || 'عملاء راضون') : (settings?.promo_stat2_fr || 'Clients Satisfaits')
  const label3 = lang === 'ar' ? (settings?.promo_stat3_ar || 'أقصى توفير') : (settings?.promo_stat3_fr || 'Économies Max')

  const promoTag = lang === 'ar' ? (settings?.promo_tag_ar || 'عرض خاص') : (settings?.promo_tag_fr || 'Offre Spéciale')
  const promoTitle = lang === 'ar' ? (settings?.promo_title_ar || 'توصيل مجاني') : (settings?.promo_title_fr || 'Livraison Gratuite')
  const promoEm = lang === 'ar' ? (settings?.promo_em_ar || 'ابتداءً من 499 درهم') : (settings?.promo_em_fr || 'dès 499 DH')
  const promoSub = lang === 'ar'
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
      suppressHydrationWarning
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(105deg, #0c0703 0%, #170f06 40%, #130a04 70%, #0c0703 100%)' }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Warm glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 180% at 50% 50%, rgba(190,30,20,0.12) 0%, transparent 65%)' }}
      />

      <div
        className="relative"
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '3.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.2rem',
          textAlign: 'center',
        }}
      >
        {/* Offer text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(210,60,50,0.85)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '16px', height: '1px', background: 'rgba(210,60,50,0.6)' }} />
            {promoTag}
            <span style={{ display: 'inline-block', width: '16px', height: '1px', background: 'rgba(210,60,50,0.6)' }} />
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
            {promoTitle}{' '}<em style={{ fontStyle: 'normal', color: '#e8b84b' }}>{promoEm}</em>
          </h2>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.38)', maxWidth: '480px' }}>
            {promoSub}
          </p>
        </div>

        {/* Stats */}
        {/* Stats */}
        <div className="stats-grid">
          {STATS.map((stat, i) => (
            <div key={`${stat.label}-${i}`} className={i === 2 ? "stat-col-last" : ""}>
              <StatCol stat={stat} active={active} delay={i * 140} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link href={btnLink} className="stats-btn-3d">
          <span className="stats-btn-text">{btnText}</span>
          <span className="stats-btn-icon">→</span>
        </Link>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.04)' }} />

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2.5rem 1rem;
          width: 100%;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
        }
        .stat-col-last {
          grid-column: span 2;
        }
        @media (min-width: 768px) {
          .stat-col-last {
            grid-column: span 1;
          }
        }

        .stats-btn-3d {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          background: linear-gradient(135deg, #e8352a 0%, #c21e13 100%);
          color: #ffffff !important;
          font-weight: 800;
          font-size: 1.05rem;
          padding: 1rem 3.5rem;
          border-radius: 16px;
          text-decoration: none !important;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: translateY(0);
          margin-top: 1.5rem;
          
          /* 3D Box Shadow */
          box-shadow: 
            0 6px 0 #91120a, 
            0 12px 24px rgba(220,40,40,0.4), 
            inset 0 1px 0 rgba(255,255,255,0.2);
        }

        .stats-btn-3d:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 10px 0 #91120a, 
            0 16px 32px rgba(220,40,40,0.5), 
            inset 0 1px 0 rgba(255,255,255,0.3);
        }

        .stats-btn-3d:active {
          transform: translateY(4px);
          box-shadow: 
            0 2px 0 #91120a, 
            0 4px 12px rgba(220,40,40,0.38), 
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .stats-btn-text {
          position: relative;
          z-index: 2;
          letter-spacing: 0.5px;
        }

        .stats-btn-icon {
          font-size: 1.2rem;
          line-height: 1;
          opacity: 0.9;
          transition: transform 0.3s ease;
          position: relative;
          z-index: 2;
        }

        .stats-btn-3d:hover .stats-btn-icon {
          transform: translateX(6px);
        }
      `}</style>
    </section>
  )
}
