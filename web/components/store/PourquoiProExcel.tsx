'use client'

import React, { useState, useEffect } from 'react'
import { useLang } from '@/components/LangContext'

export default function PourquoiProExcel() {
  const { lang } = useLang()
  const [ecoCount, setEcoCount] = useState(0)
  const [promoCount, setPromoCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = React.useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const stepTime = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      setEcoCount(Math.min(15, Math.floor((15 * currentStep) / steps)))
      setPromoCount(Math.min(30, Math.floor((30 * currentStep) / steps)))

      if (currentStep >= steps) clearInterval(timer)
    }, stepTime)

    return () => clearInterval(timer)
  }, [isVisible])

  return (
    <div style={{ background: 'var(--bg2)', width: '100%', borderTop: '1px solid var(--border)' }}>
      <section className="pourquoi-section" ref={sectionRef}>
        <style>{`
          .pourquoi-section {
            padding: 60px 20px;
            max-width: 1200px;
            margin: 0 auto;
            font-family: 'Sora', sans-serif;
            width: 100%;
          }
          .bento-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            width: 100%;
          }
          .bento-card {
            position: relative;
            background: rgba(150, 150, 150, 0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(150, 150, 150, 0.15);
            border-radius: 24px;
            padding: 32px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
            color: var(--text);
            z-index: 1;
          }
          .bento-card:hover {
            transform: scale(1.03);
            z-index: 2;
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
            border-color: rgba(150, 150, 150, 0.3);
          }
          
          .bento-large {
            grid-column: span 2;
            grid-row: span 2;
            align-items: center;
            justify-content: center;
            text-align: center;
            min-height: 400px;
          }
          .bento-medium-1 { grid-column: span 2; grid-row: span 1; justify-content: flex-end; }
          .bento-medium-2 { grid-column: span 1; grid-row: span 1; justify-content: flex-end; }
          .bento-small { grid-column: span 1; grid-row: span 1; justify-content: flex-end; }

          .bento-card h3 {
            font-size: 1.4rem;
            font-weight: 700;
            margin: 0 0 12px 0;
            position: relative;
            z-index: 2;
          }
          .bento-card p {
            font-size: 0.95rem;
            opacity: 0.7;
            line-height: 1.6;
            margin: 0;
            position: relative;
            z-index: 2;
          }

          .bento-glow {
            position: absolute;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            filter: blur(60px);
            opacity: 0.5;
            z-index: -1;
            transition: opacity 0.4s ease, transform 0.4s ease;
          }
          .bento-card:hover .bento-glow {
            opacity: 0.8;
            transform: scale(1.2);
          }
          .glow-red { background: var(--accent, #e63946); top: -30px; left: -30px; width: 200px; height: 200px; }
          .glow-green { background: #2a9d8f; bottom: -30px; right: -30px; width: 200px; height: 200px; }
          .glow-blue { background: radial-gradient(circle, var(--accentBlue, #4361ee) 0%, #7209b7 100%); top: -20px; right: -20px; width: 180px; height: 180px; }
          .glow-orange { background: radial-gradient(circle, #f4a261 0%, #e76f51 100%); bottom: -20px; left: -20px; }
          .glow-wa { background: #25D366; top: 50%; left: 50%; transform: translate(-50%, -50%); filter: blur(70px); }

          .card-officiel-bg {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(230,57,70,0.1), rgba(42,157,143,0.1), rgba(230,57,70,0.1));
            background-size: 200% 200%;
            animation: gradientBG 8s ease infinite;
            z-index: -2;
          }
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .shimmer {
            position: absolute;
            top: 0; left: -100%;
            width: 50%; height: 100%;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent);
            transform: skewX(-20deg);
            animation: shimmer 4s infinite;
            pointer-events: none;
            z-index: 0;
          }
          @keyframes shimmer {
            0% { left: -100%; }
            20% { left: 200%; }
            100% { left: 200%; }
          }
          .badge-officiel {
            position: absolute;
            top: 24px; right: 24px;
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255,255,255,0.3);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            backdrop-filter: blur(10px);
            animation: float 3s ease-in-out infinite;
            z-index: 2;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          .flag-icon {
            font-size: 5rem;
            margin-bottom: 16px;
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.15));
            z-index: 2;
          }

          .truck-container {
            font-size: 3.5rem;
            margin-bottom: auto;
            overflow: hidden;
            position: relative;
            width: 100%;
            height: 80px;
            z-index: 2;
          }
          .truck-icon {
            position: absolute;
            left: -60px;
            top: 10px;
            animation: drive 5s ease-in-out infinite;
          }
          @keyframes drive {
            0% { left: -60px; opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { left: calc(100% + 20px); opacity: 0; }
          }

          .counters-wrapper {
            display: flex;
            gap: 20px;
            margin-bottom: auto;
            z-index: 2;
          }
          .counter-box {
            display: flex;
            flex-direction: column;
          }
          .counter-num {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--accent, #e63946);
            line-height: 1;
          }
          .counter-num.promo { color: #f4a261; }
          .counter-label {
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.8;
            margin-top: 4px;
          }

          .wa-container {
            position: relative;
            width: 64px;
            height: 64px;
            background: rgba(37, 211, 102, 0.15);
            border: 1px solid rgba(37, 211, 102, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: auto;
            font-size: 2rem;
            z-index: 2;
          }
          .wa-pulse {
            position: absolute;
            top: 0; right: 0;
            width: 14px; height: 14px;
            background: #25D366;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
          }

          @media (max-width: 1024px) {
            .bento-grid { grid-template-columns: repeat(2, 1fr); }
            .bento-large { grid-column: span 2; grid-row: span 1; min-height: 320px; }
            .bento-medium-1 { grid-column: span 2; }
            .bento-medium-2 { grid-column: span 1; }
            .bento-small { grid-column: span 1; }
          }
          @media (max-width: 640px) {
            .bento-grid { grid-template-columns: 1fr; }
            .bento-large, .bento-medium-1, .bento-medium-2, .bento-small {
              grid-column: span 1;
              grid-row: auto;
              min-height: 240px;
            }
          }
        `}</style>

        <div className="section-header scroll-reveal" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="section-tag">{lang === 'ar' ? 'التزاماتنا' : 'Nos Engagements'}</div>
          <h2 className="section-title">{lang === 'ar' ? 'لماذا تختار برو إكسيل؟' : 'Pourquoi choisir ProExcel ?'}</h2>
          <p className="section-sub">{lang === 'ar' ? 'المكتبة المدرسية المرجعية في المغرب منذ سنوات' : 'La librairie scolaire de référence au Maroc depuis des années'}</p>
        </div>

        <div className="bento-grid">
          <div className="bento-card bento-large">
            <div className="card-officiel-bg"></div>
            <div className="bento-glow glow-red"></div>
            <div className="bento-glow glow-green"></div>
            <div className="shimmer"></div>

            <div className="badge-officiel">✓ {lang === 'ar' ? 'رسمي' : 'Officiel'}</div>
            <div className="flag-icon" style={{ display: 'flex', justifyContent: 'center' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }}>
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </div>
            <h3>{lang === 'ar' ? 'البرنامج الوطني المغربي' : 'Programme Officiel Marocain'}</h3>
            <p>{lang === 'ar' ? 'جميع كتبنا متوافقة مع برنامج وزارة التربية الوطنية.' : 'Tous nos livres suivent le programme officiel du Ministère de l\'Éducation.'}</p>
          </div>

          <div className="bento-card bento-medium-1">
            <div className="bento-glow glow-blue"></div>
            <div className="truck-container">
              <div className="truck-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
            </div>
            <h3>{lang === 'ar' ? 'توصيل سريع خلال 48 ساعة' : 'Livraison 24/48h'}</h3>
            <p>{lang === 'ar' ? 'توصيل سريع في جميع أنحاء المغرب في وقت قياسي.' : 'Livraison rapide partout au Maroc en un temps record pour vos fournitures.'}</p>
          </div>

          <div className="bento-card bento-medium-2">
            <div className="bento-glow glow-orange"></div>
            <div className="counters-wrapper">
              <div className="counter-box">
                <span className="counter-num">-{ecoCount}%</span>
                <span className="counter-label">{lang === 'ar' ? 'توفير' : 'Économie'}</span>
              </div>
              <div className="counter-box">
                <span className="counter-num promo">-{promoCount}%</span>
                <span className="counter-label">{lang === 'ar' ? 'تخفيض' : 'Promo'}</span>
              </div>
            </div>
            <h3>{lang === 'ar' ? 'أسعار تنافسية' : 'Prix Compétitifs'}</h3>
            <p>{lang === 'ar' ? 'أفضل الأسعار في السوق مع عروض منتظمة.' : 'Les meilleurs prix du marché avec des offres régulières.'}</p>
          </div>

          <div className="bento-card bento-small">
            <div className="bento-glow glow-wa"></div>
            <div className="wa-container">
              <span className="wa-pulse"></span>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <h3>{lang === 'ar' ? 'دعم عبر واتساب' : 'Support WhatsApp'}</h3>
            <p>{lang === 'ar' ? 'فريقنا يجيبك بسرعة 7 أيام/7.' : 'Notre équipe vous répond rapidement 7j/7.'}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
