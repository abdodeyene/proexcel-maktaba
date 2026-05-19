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

// Generic fallbacks — no year references, shown only when admin has no slides configured
const DEFAULT_SLIDES: Slide[] = [
  {
    tag: 'Librairie scolaire de référence',
    title: 'Tous vos manuels\nscolaires,',
    span: 'en un seul endroit.',
    sub: 'Livres primaire, collège et lycée. Livraison 48h partout au Maroc.',
    btn1: 'Explorer le catalogue',
    btn1Link: '/best-offers',
    btn2: 'Voir les packs',
    btn2Link: '/best-offers?cat=Pack',
  },
  {
    tag: 'Offres spéciales',
    title: 'Des économies sur',
    span: 'tous vos livres scolaires.',
    sub: 'Packs et manuels scolaires à prix réduits.',
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
  const slidesLenRef = useRef(DEFAULT_SLIDES.length)

  // Track theme for admin-set per-slide colours
  useEffect(() => {
    const check = () => setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  // Load admin-controlled slides from settings API
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
        setCurrent(p => (p + 1) % slidesLenRef.current)
        setExiting(false)
      }, 520)
    }, INTERVAL)
  }, [])

  useEffect(() => {
    slidesLenRef.current = slides.length
    startAutoplay()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [slides.length, startAutoplay])

  // Signal photo vs gradient mode to the navbar (Header reads data-hero)
  useEffect(() => {
    document.documentElement.dataset.hero = slides[current]?.image ? 'photo' : 'gradient'
  }, [current, slides])

  // Remove the signal when the slider unmounts (navigating away from home)
  useEffect(() => {
    return () => { delete document.documentElement.dataset.hero }
  }, [])

  const goTo = (i: number) => {
    if (i === current || exiting) return
    setExiting(true)
    setTimeout(() => { setCurrent(i); setExiting(false) }, 520)
    startAutoplay()
  }

  const s = slides[current]
  const bgImg   = s.image || ''
  const prodImg = s.productImage || ''
  const hasBg   = !!bgImg
  const hasProd = !!prodImg

  // Admin-set per-slide colour overrides
  const titleColor = (isLight ? s.titleColorLight : s.titleColor) || ''
  const spanColor  = (isLight ? s.spanColorLight  : s.spanColor)  || ''
  const subColor   = (isLight ? s.subColorLight   : s.subColor)   || ''

  return (
    <section className={`hs${hasBg ? ' hs--photo' : ''}${exiting ? ' hs--out' : ''}`}>

      {/* ── Background ─────────────────────────────────────── */}
      <div className="hs-bg" aria-hidden="true">

        {/* Gradient base — always rendered, also acts as fallback while image loads */}
        <div
          className="hs-bg-base"
          style={s.bgColor1
            ? { background: `radial-gradient(ellipse at 65% 35%, ${s.bgColor1} 0%, transparent 55%), linear-gradient(150deg, var(--bg2), var(--bg))` }
            : undefined}
        />

        {/* Hero background image — only for slides that have one.
            fetchPriority="high" on the first slide to boost LCP score.
            key forces a fresh element (and the bgIn animation) on slide change. */}
        {bgImg && (
          <img
            src={bgImg}
            key={`bg${current}`}
            alt=""
            className="hs-bg-img"
            /* fetchPriority is a valid React 18+ prop; TypeScript may need the cast */
            {...({ fetchPriority: current === 0 ? 'high' : 'auto' } as any)}
            decoding="async"
          />
        )}

        <div className="hs-vignette" />
      </div>

      {/* ── Slide content ──────────────────────────────────────
          key={current} forces a fresh mount so CSS enter-animations replay
          on every slide change. */}
      <div className="hs-stage" key={current}>

        {/* Text block — centred when bg image and no product column */}
        <div className={`hs-copy${hasBg && !hasProd ? ' hs-copy--centered' : ''}`}>

          {s.tag && (
            <div className="hs-tag">
              <span className="hs-pip" />
              {s.tag}
            </div>
          )}

          <h1 className="hs-headline" style={titleColor ? { color: titleColor } : undefined}>
            {s.title.split('\n').map((line, i) => (
              <span key={i} className="hs-hrow">{line} </span>
            ))}
            {s.span && (
              <span className="hs-span" style={spanColor ? { color: spanColor } : undefined}>
                {s.span}
              </span>
            )}
          </h1>

          {s.sub && (
            <p className="hs-lead" style={subColor ? { color: subColor } : undefined}>
              {s.sub}
            </p>
          )}

          <div className="hs-ctas">
            {s.btn1 && (
              <Link href={s.btn1Link || '/best-offers'} className="hs-cta-a">
                {s.btn1}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            )}
            {s.btn2 && (
              <Link href={s.btn2Link || '/best-offers'} className="hs-cta-b">
                {s.btn2}
              </Link>
            )}
          </div>
        </div>

        {/* Visual column — shown when there is a product image OR when there is no bg image */}
        {(!hasBg || hasProd) && (
          <div className="hs-visual">
            {hasProd
              ? <img src={prodImg} alt="" className="hs-img" decoding="async" />
              : <div className="hs-illus"><BooksIllustration /></div>
            }
          </div>
        )}

      </div>

      {/* ── Dot navigation ─────────────────────────────────── */}
      {slides.length > 1 && (
        <div className="hs-dots" role="tablist" aria-label="Slides">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              className={`hs-dot${i === current ? ' on' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}

      {/* ── Progress strip ─────────────────────────────────── */}
      {slides.length > 1 && (
        <div className="hs-bar" key={`bar${current}`} aria-hidden="true" />
      )}

      <style jsx>{`
        /* ─── SECTION ───────────────────────────────── */
        .hs {
          position: relative;
          overflow: hidden;
          /* clamp: min 520px, prefer 78dvh, max 820px — avoids overflowing tall monitors */
          min-height: clamp(520px, 78dvh, 820px);
          display: flex;
          align-items: center;
          /* Pull up behind the fixed navbar (68px) without content offset */
          margin-top: -68px;
          padding-top: 68px;
          border-bottom: 1px solid var(--border);
        }

        /* ─── BACKGROUND ────────────────────────────── */
        .hs-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hs-bg-base {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 65% 35%, rgba(232,53,42,0.07) 0%, transparent 55%),
            linear-gradient(150deg, var(--bg2) 0%, var(--bg) 100%);
          transition: background 0.8s ease;
        }
        [data-theme="light"] .hs-bg-base {
          background:
            radial-gradient(ellipse at 65% 35%, rgba(225,29,46,0.04) 0%, transparent 55%),
            linear-gradient(150deg, #f3f5fb 0%, #ffffff 100%);
        }

        /* Background image: fade + slight scale on each new slide */
        .hs-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          z-index: 1;
          animation: bgIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Overlay — transparent normally, dark gradient in photo mode */
        .hs-vignette {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }
        .hs--photo .hs-vignette {
          background:
            /* Left → right: strong on left for text readability */
            linear-gradient(105deg,
              rgba(0,0,0,0.68) 0%,
              rgba(0,0,0,0.40) 45%,
              rgba(0,0,0,0.10) 100%),
            /* Bottom vignette */
            linear-gradient(to top, rgba(0,0,0,0.48) 0%, transparent 55%),
            /* Top vignette for navbar area */
            linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 28%);
        }

        /* ─── STAGE (content wrapper) ────────────────── */
        .hs-stage {
          position: relative;
          z-index: 10;
          max-width: 1380px;
          margin: 0 auto;
          padding: 2rem 4rem 5.5rem;
          width: 100%;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 5rem;
          align-items: center;
          animation: stageIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        /* Photo mode with no product: single centred column */
        .hs--photo .hs-stage {
          grid-template-columns: 1fr;
          max-width: 740px;
          padding-left: 2rem;
          padding-right: 2rem;
        }
        .hs--out .hs-stage {
          animation: stageOut 0.45s ease forwards;
        }

        /* ─── COPY ───────────────────────────────────── */
        .hs-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .hs-copy--centered {
          align-items: center;
          text-align: center;
        }

        /* ─── BADGE ──────────────────────────────────── */
        .hs-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(232,53,42,0.09);
          color: var(--primary);
          border: 1px solid rgba(232,53,42,0.18);
          padding: 0.38rem 0.95rem;
          border-radius: 100px;
          font-size: 0.73rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 1.4rem;
          animation: tagIn 0.5s 0.08s cubic-bezier(0.34, 1.4, 0.64, 1) both;
        }
        .hs--photo .hs-tag {
          background: rgba(255,255,255,0.10);
          border-color: rgba(255,255,255,0.22);
          color: rgba(255,255,255,0.9);
        }
        .hs-pip {
          width: 5px; height: 5px;
          background: currentColor;
          border-radius: 50%;
          display: block;
          opacity: 0.7;
          flex-shrink: 0;
        }

        /* ─── HEADLINE ───────────────────────────────── */
        .hs-headline {
          font-size: clamp(2.2rem, 3.8vw, 3.7rem);
          font-weight: 900;
          line-height: 1.07;
          letter-spacing: -0.03em;
          margin-bottom: 1.1rem;
          color: var(--text);
        }
        .hs--photo .hs-headline { color: #fff; }

        .hs-hrow {
          display: block;
          animation: rowIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hs-hrow:nth-child(2) { animation-delay: 0.06s; }

        .hs-span {
          display: block;
          color: var(--primary);
          animation: rowIn 0.55s 0.12s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hs--photo .hs-span { color: #ffaa90; }

        /* ─── SUBTITLE ───────────────────────────────── */
        .hs-lead {
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--text2);
          margin-bottom: 2.2rem;
          max-width: 440px;
          animation: rowIn 0.55s 0.18s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        [data-theme="light"] .hs-lead { color: #4b5563; }
        .hs--photo .hs-lead {
          color: rgba(255,255,255,0.76);
          max-width: 560px;
        }
        .hs-copy--centered .hs-lead {
          margin-left: auto;
          margin-right: auto;
        }

        /* ─── BUTTONS ────────────────────────────────── */
        .hs-ctas {
          display: flex;
          gap: 0.85rem;
          align-items: center;
          flex-wrap: wrap;
          animation: rowIn 0.55s 0.24s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .hs-cta-a {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, var(--primary) 0%, #e8531a 100%);
          color: #fff;
          padding: 0.88rem 1.85rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.92rem;
          letter-spacing: 0.01em;
          box-shadow: 0 6px 20px rgba(232,53,42,0.30);
          transition: transform 0.25s cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 0.25s ease;
        }
        .hs-cta-a:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(232,53,42,0.42);
        }
        .hs-cta-a svg {
          transition: transform 0.25s cubic-bezier(0.34, 1.4, 0.64, 1);
          flex-shrink: 0;
        }
        .hs-cta-a:hover svg { transform: translateX(3px); }

        .hs-cta-b {
          display: inline-flex;
          align-items: center;
          padding: 0.88rem 1.65rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.92rem;
          color: var(--text);
          border: 1.5px solid var(--border);
          background: rgba(255,255,255,0.03);
          transition: all 0.25s ease;
        }
        [data-theme="light"] .hs-cta-b { background: rgba(0,0,0,0.02); }
        .hs--photo .hs-cta-b {
          color: rgba(255,255,255,0.85);
          border-color: rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.06);
        }
        .hs-cta-b:hover {
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
        }
        .hs--photo .hs-cta-b:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.55);
          color: #fff;
        }

        /* ─── VISUAL COLUMN ──────────────────────────── */
        .hs-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          animation: visualIn 0.7s 0.08s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .hs-img {
          max-width: 100%;
          height: auto;
          max-height: 500px;
          object-fit: contain;
          filter: drop-shadow(0 28px 56px rgba(0,0,0,0.30));
          border-radius: 14px;
          animation: imgDrift 7s ease-in-out infinite;
        }
        [data-theme="light"] .hs-img {
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.14));
        }

        .hs-illus {
          max-width: 360px;
          width: 100%;
          opacity: 0.88;
          animation: imgDrift 8s ease-in-out infinite;
        }

        /* ─── DOTS NAVIGATION ────────────────────────── */
        .hs-dots {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.45rem;
          z-index: 20;
        }
        .hs-dot {
          width: 7px; height: 7px;
          border-radius: 4px;
          background: var(--text2);
          opacity: 0.3;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hs--photo .hs-dot { background: rgba(255,255,255,0.55); opacity: 0.45; }
        .hs-dot.on {
          width: 24px;
          background: var(--primary);
          opacity: 1;
        }
        .hs-dot:hover:not(.on) { opacity: 0.65; }

        /* ─── PROGRESS STRIP ─────────────────────────── */
        .hs-bar {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          background: linear-gradient(to right, var(--primary), #f97316);
          z-index: 20;
          animation: barGrow 7s linear forwards;
        }
        .hs--out .hs-bar { opacity: 0; }

        /* ─── KEYFRAMES ──────────────────────────────── */
        @keyframes bgIn {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes stageIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes stageOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes rowIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tagIn {
          from { opacity: 0; transform: scale(0.88) translateY(-6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes visualIn {
          from { opacity: 0; transform: translateX(28px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes imgDrift {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes barGrow {
          from { width: 0; }
          to   { width: 100%; }
        }

        /* ─── REDUCED MOTION ─────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .hs-bg-img,
          .hs-stage,
          .hs-hrow,
          .hs-span,
          .hs-tag,
          .hs-lead,
          .hs-ctas,
          .hs-visual,
          .hs-img,
          .hs-illus,
          .hs-bar {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            transition: opacity 0.15s ease !important;
          }
        }

        /* ─── RESPONSIVE ─────────────────────────────── */
        @media (max-width: 1024px) {
          .hs { min-height: clamp(460px, 70dvh, 660px); }
          .hs-stage {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem 2rem 5.5rem;
            text-align: center;
          }
          .hs--photo .hs-stage { max-width: 100%; }
          .hs-copy { align-items: center; }
          .hs-lead { max-width: 100%; margin-left: auto; margin-right: auto; }
          .hs-ctas { justify-content: center; }
          .hs-visual { order: -1; }
          .hs-img { max-height: 280px; }
          .hs-illus { max-width: 240px; }
          /* Simpler overlay on tablet (centred text, no left-bias needed) */
          .hs--photo .hs-vignette {
            background:
              linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%),
              linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, transparent 30%),
              linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35));
          }
        }

        @media (max-width: 640px) {
          .hs { min-height: clamp(420px, 65dvh, 580px); }
          .hs-stage { padding: 1.5rem 1.25rem 5.5rem; gap: 1.25rem; }
          .hs-headline { font-size: clamp(1.85rem, 6vw, 2.2rem); }
          .hs-img { max-height: 200px; }
          .hs-ctas { flex-direction: column; width: 100%; }
          .hs-cta-a, .hs-cta-b { width: 100%; justify-content: center; }
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
