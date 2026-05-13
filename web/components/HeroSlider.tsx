'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

type Slide = {
  tag: string
  title: string
  span: string
  sub: string
  btn1: string
  btn1Link: string
  btn2: string
  btn2Link: string
  productImage?: string
  image?: string
  bgColor1?: string
  bgColor2?: string
  imageMobile?: string
  titleColor?: string
  spanColor?: string
  subColor?: string
  titleColorLight?: string
  spanColorLight?: string
  subColorLight?: string
}

const DEFAULT_SLIDES: Slide[] = [
  {
    tag: 'Rentrée Scolaire 2025-2026',
    title: 'Tous vos manuels\nscolaires,',
    span: 'en un seul endroit.',
    sub: 'Livres primaire, collège et lycée alignés avec le programme national marocain. Livraison 48h partout au Maroc.',
    btn1: 'Explorer le catalogue',
    btn1Link: '/best-offers',
    btn2: 'Voir les packs',
    btn2Link: '/best-offers?cat=Pack',
  },
  {
    tag: "Jusqu'à 30% de réduction",
    title: 'Des économies sur',
    span: 'tous vos livres scolaires.',
    sub: 'Profitez de nos offres spéciales sur une sélection de manuels et de packs scolaires complets pour chaque niveau.',
    btn1: 'Voir les promotions',
    btn1Link: '/best-offers',
    btn2: 'Voir les packs',
    btn2Link: '/best-offers?cat=Pack',
  },
]

const INTERVAL = 7000

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES)
  const [exiting, setExiting] = useState(false)
  const [isLight, setIsLight] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const slidesLenRef = useRef(2)

  useEffect(() => {
    const check = () => setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data?.hero_slides) {
          try {
            const parsed = JSON.parse(data.hero_slides)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSlides(parsed)
              slidesLenRef.current = parsed.length
            }
          } catch { /* keep defaults */ }
        }
      })
      .catch(() => {})
  }, [])

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setExiting(true)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slidesLenRef.current)
        setExiting(false)
      }, 500) // Match exit animation duration
    }, INTERVAL)
  }, [])

  useEffect(() => {
    slidesLenRef.current = slides.length
    startAutoplay()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [slides.length, startAutoplay])

  const goTo = (idx: number) => {
    if (idx === current || exiting) return
    setExiting(true)
    setTimeout(() => {
      setCurrent(idx)
      setExiting(false)
    }, 500)
    startAutoplay()
  }

  const slide = slides[current]
  const bgImg = slide.image || ''
  const productImg = slide.productImage || ''

  return (
    <section className={`hs-section ${exiting ? 'hs-exiting' : ''}`}>
      
      {/* Background — bgImg full-cover when available, else gradient */}
      <div className="hs-bg-layer">
        {bgImg ? (
          <>
            <img src={bgImg} alt="" className="hs-bg-fullimg" aria-hidden="true" />
            <div className="hs-bg-overlay" />
          </>
        ) : (
          <>
            <div className="hs-bg-grad" style={{ background: slide.bgColor1 ? `radial-gradient(circle at 70% 30%, ${slide.bgColor1} 0%, transparent 50%), linear-gradient(135deg, var(--bg2) 0%, var(--bg) 100%)` : '' }} />
            <div className="hs-bg-pattern" />
            <div className="hs-shape hs-shape-1" />
            <div className="hs-shape hs-shape-2" />
          </>
        )}
      </div>

      <div className={`hs-container${bgImg && !productImg ? ' hs-container--fullbg' : ''}`}>

        {/* Content Card — always on top */}
        <div className={`hs-content-card${bgImg ? ' hs-content-card--over' : ''}`}>
          {slide.tag && (
            <div className="hs-tag">
              <span className="hs-tag-dot" />
              {slide.tag}
            </div>
          )}

          <h1 className="hs-title" style={(isLight ? slide.titleColorLight : slide.titleColor) ? { color: isLight ? slide.titleColorLight : slide.titleColor } : undefined}>
            {slide.title.split('\n').map((line, i) => (
              <span key={i} className="hs-title-line">{line}</span>
            ))}
            <span className="hs-title-span" style={(isLight ? slide.spanColorLight : slide.spanColor) ? { color: isLight ? slide.spanColorLight : slide.spanColor } : undefined}>{slide.span}</span>
          </h1>

          <p className="hs-sub" style={(isLight ? slide.subColorLight : slide.subColor) ? { color: isLight ? slide.subColorLight : slide.subColor } : undefined}>
            {slide.sub}
          </p>

          <div className="hs-actions">
            <Link href={slide.btn1Link || '/best-offers'} className="hs-btn-primary">
              {slide.btn1}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
            {slide.btn2 && (
              <Link href={slide.btn2Link || '/best-offers'} className="hs-btn-secondary">
                {slide.btn2}
              </Link>
            )}
          </div>
        </div>

        {/* Visual col — shown when productImg exists OR no bgImg */}
        {(!bgImg || productImg) && <div className="hs-visual-col">
          <div className="hs-main-image-container">
            {productImg ? (
              <img src={productImg} alt={slide.title.replace('\n', ' ')} className="hs-main-image" />
            ) : (
              <div className="hs-placeholder-image hs-main-image">
                <BooksIllustration />
              </div>
            )}
          </div>
          
          {/* Decorative floating elements around the image */}
          <div className="hs-float-dec hs-dec-1" />
          <div className="hs-float-dec hs-dec-2" />
        </div>}

      </div>

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div className="hs-dots">
          {slides.map((_, i) => (
            <button 
              key={i} 
              aria-label={`Slide ${i + 1}`}
              className={`hs-dot ${i === current ? 'active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .hs-section {
          /* Navbar integration: negative top margin + equal padding to slide under header */
          margin-top: -68px;
          padding-top: 68px;
          min-height: 620px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--border);
        }

        .hs-bg-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .hs-bg-grad {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 70% 30%, rgba(232,53,42,0.08) 0%, transparent 60%),
                      linear-gradient(135deg, var(--bg2) 0%, var(--bg) 100%);
          transition: background 0.8s ease;
        }
        [data-theme="light"] .hs-bg-grad {
          background: radial-gradient(circle at 70% 30%, rgba(225,29,46,0.05) 0%, transparent 60%),
                      linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
        }

        .hs-bg-fullimg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .hs-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            rgba(0,0,0,0.72) 0%,
            rgba(0,0,0,0.5) 50%,
            rgba(0,0,0,0.25) 100%
          );
        }
        [data-theme="light"] .hs-bg-overlay {
          background: linear-gradient(
            105deg,
            rgba(0,0,0,0.58) 0%,
            rgba(0,0,0,0.35) 50%,
            rgba(0,0,0,0.10) 100%
          );
        }

        .hs-container--fullbg {
          grid-template-columns: 1fr;
          max-width: 860px;
          margin-left: 0;
          padding-left: 5rem;
        }

        .hs-content-card--over {
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 24px 64px rgba(0,0,0,0.5);
        }
        .hs-content-card--over .hs-title { color: #fff; }
        .hs-content-card--over .hs-sub { color: rgba(255,255,255,0.78); }

        @media (max-width: 1024px) {
          .hs-container--fullbg {
            padding-left: 2rem;
          }
        }
        @media (max-width: 640px) {
          .hs-container--fullbg {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
        }

        .hs-bg-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: radial-gradient(circle at 2px 2px, var(--text) 1px, transparent 0);
          background-size: 40px 40px;
        }

        .hs-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: hsOrbFloat 10s infinite alternate ease-in-out;
        }
        .hs-shape-1 {
          top: 10%; left: 15%;
          width: 350px; height: 350px;
          background: var(--primary);
        }
        .hs-shape-2 {
          bottom: -10%; right: 10%;
          width: 450px; height: 450px;
          background: #3b82f6;
          animation-delay: -5s;
          opacity: 0.08;
        }
        [data-theme="light"] .hs-shape {
          opacity: 0.08;
        }
        [data-theme="light"] .hs-shape-2 {
          opacity: 0.05;
        }

        .hs-container {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 4rem;
          width: 100%;
          display: grid;
          grid-template-columns: 1.1fr 1fr; /* Content left, Image right */
          gap: 5rem;
          align-items: center;
        }

        /* --- CONTENT SIDE --- */
        .hs-content-card {
          background: rgba(7, 11, 20, 0.6); /* Deep navy glass */
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          padding: 3.5rem;
          border-radius: 32px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          animation: textEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        [data-theme="light"] .hs-content-card {
          background: rgba(255, 255, 255, 0.97);
          border-color: rgba(0, 0, 0, 0.09);
          box-shadow: 0 20px 60px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.04);
        }
        [data-theme="light"] .hs-sub {
          color: #374151;
        }

        .hs-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(232,53,42,0.08);
          color: var(--primary);
          padding: 0.45rem 1.1rem;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(232,53,42,0.15);
        }
        .hs-tag-dot {
          width: 6px; height: 6px;
          background: var(--primary);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--primary);
        }

        .hs-title {
          font-size: 3.8rem;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
          color: var(--text);
        }
        .hs-title-line {
          display: block;
        }
        .hs-title-span {
          display: block;
          color: var(--primary);
          text-shadow: 0 0 40px rgba(232,53,42,0.2);
        }
        [data-theme="light"] .hs-title-span {
          text-shadow: none;
        }

        .hs-sub {
          font-size: 1.15rem;
          color: var(--text2);
          line-height: 1.6;
          margin-bottom: 2.5rem;
          font-weight: 500;
          max-width: 90%;
        }

        .hs-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .hs-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, var(--primary) 0%, #ff7a00 100%);
          color: #fff;
          padding: 0.9rem 1.8rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(232,53,42,0.3);
        }
        .hs-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(232,53,42,0.4);
        }
        [data-theme="light"] .hs-btn-primary {
          box-shadow: 0 8px 20px rgba(225,29,46,0.25);
        }
        [data-theme="light"] .hs-btn-primary:hover {
          box-shadow: 0 12px 28px rgba(225,29,46,0.35);
        }

        .hs-btn-secondary {
          display: inline-flex;
          align-items: center;
          background: rgba(255,255,255,0.05);
          color: var(--text);
          padding: 0.9rem 1.8rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          border: 1px solid var(--border);
          transition: all 0.3s ease;
        }
        [data-theme="light"] .hs-btn-secondary { background: rgba(0,0,0,0.03); }
        .hs-btn-secondary:hover {
          background: rgba(232,53,42,0.05);
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
        }

        /* --- VISUAL SIDE --- */
        .hs-visual-col {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: imageEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .hs-main-image-container {
          position: relative;
          z-index: 5;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .hs-main-image {
          max-width: 100%;
          height: auto;
          max-height: 520px;
          object-fit: contain; /* Prevents stretch/distortion */
          filter: drop-shadow(0 30px 60px rgba(0,0,0,0.4));
          border-radius: 16px;
          animation: hsImageFloat 6s ease-in-out infinite;
        }
        [data-theme="light"] .hs-main-image {
          filter: drop-shadow(0 30px 50px rgba(0,0,0,0.15));
        }

        .hs-placeholder-image {
          filter: drop-shadow(0 30px 60px rgba(0,0,0,0.3));
          max-width: 400px;
          width: 100%;
        }

        .hs-float-dec {
          position: absolute;
          backdrop-filter: blur(10px);
          border: 1px solid var(--border);
        }
        .hs-dec-1 {
          top: -5%; right: 5%;
          width: 80px; height: 80px;
          background: rgba(255,255,255,0.03);
          border-radius: 20px;
          animation: hsImageFloat 5s ease-in-out infinite reverse;
        }
        .hs-dec-2 {
          bottom: 5%; left: 0%;
          width: 60px; height: 60px;
          background: rgba(232,53,42,0.05);
          border-radius: 15px;
          animation: hsImageFloat 7s ease-in-out infinite;
        }
        [data-theme="light"] .hs-dec-1 { background: rgba(0,0,0,0.02); }
        [data-theme="light"] .hs-dec-2 { background: rgba(225,29,46,0.05); }


        /* --- DOTS NAVIGATION --- */
        .hs-dots {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.6rem;
          z-index: 20;
        }
        .hs-dot {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: var(--text2);
          opacity: 0.4;
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hs-dot.active {
          width: 32px;
          background: var(--primary);
          opacity: 1;
        }
        .hs-dot:hover:not(.active) {
          opacity: 0.8;
        }

        /* --- ANIMATIONS --- */
        @keyframes textEnter {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(12px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes textExit {
          0% { opacity: 1; transform: translateX(0); filter: blur(0); }
          100% { opacity: 0; transform: translateX(-60px); filter: blur(12px); }
        }
        @keyframes imageEnter {
          0% { opacity: 0; transform: translateX(80px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes imageExit {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-80px); }
        }

        @keyframes hsImageFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes hsOrbFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, -40px) scale(1.1); }
        }

        .hs-exiting .hs-content-card {
          animation: textExit 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hs-exiting .hs-visual-col {
          animation: imageExit 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 1024px) {
          .hs-container {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem;
            padding-top: 1rem;
            text-align: center;
          }
          .hs-visual-col {
            order: -1; /* Image on top */
          }
          .hs-main-image {
            max-height: 380px;
          }
          .hs-content-card {
            padding: 2.5rem 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hs-title {
            font-size: 2.8rem;
          }
          .hs-sub {
            max-width: 100%;
          }
          .hs-actions {
            justify-content: center;
          }
          .hs-section {
            min-height: auto;
            padding-bottom: 5rem;
          }
        }
        
        @media (max-width: 640px) {
          .hs-main-image {
            max-height: 280px;
          }
          .hs-content-card {
            padding: 2rem 1.25rem;
            border-radius: 28px;
          }
          .hs-title {
            font-size: 2.2rem;
          }
          .hs-actions {
            flex-direction: column;
            width: 100%;
          }
          .hs-btn-primary, .hs-btn-secondary {
            width: 100%;
            justify-content: center;
          }
          .hs-section {
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </section>
  )
}

function BooksIllustration() {
  return (
    <svg viewBox="0 0 460 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <rect x="100" y="50" width="200" height="280" rx="10" fill="#3A6BC4" transform="rotate(-10 100 50)" />
      <rect x="150" y="30" width="200" height="280" rx="10" fill="#D4813A" transform="rotate(5 150 30)" />
      <rect x="130" y="80" width="200" height="280" rx="10" fill="#3D8A60" transform="rotate(-2 130 80)" />
    </svg>
  )
}
