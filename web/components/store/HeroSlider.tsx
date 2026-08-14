'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LangContext'

// ─── Types ────────────────────────────────────────────────────────────────────

type Slide = {
  id: number
  tag: string
  tagAr: string
  title: string
  titleAr: string
  subtitle: string
  subtitleAr: string
  ctaText: string
  ctaTextAr: string
  ctaLink: string
  ctaText2: string
  ctaLink2: string
  imageUrl: string | null
  bgPosition: string
  textAlign: string
  overlayStrength: string
  titleColor: string
  subtitleColor: string
  tagColor: string
}

type ButtonStyle = {
  bgType: 'solid' | 'gradient'
  bgColor: string
  bgGradientStart: string
  bgGradientEnd: string
  bgGradientDirection: string
  textColor: string
  borderRadius: string
  paddingX: string
  paddingY: string
  fontSize: string
  fontWeight: string
  showArrowDot: boolean
  arrowDotColor: string
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const GRADIENTS = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #0d0d0d 0%, #1a0a00 50%, #2d0a00 100%)',
  'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #2a1a3a 100%)',
  'linear-gradient(135deg, #0a1628 0%, #1a2a3a 50%, #0d1f35 100%)',
]

const OVERLAYS: Record<string, string> = {
  light: 'linear-gradient(to bottom, rgba(0,0,0,.35) 0%, rgba(0,0,0,.25) 40%, rgba(0,0,0,.50) 100%)',
  medium: 'linear-gradient(to bottom, rgba(0,0,0,.55) 0%, rgba(0,0,0,.40) 40%, rgba(0,0,0,.70) 100%)',
  dark: 'linear-gradient(to bottom, rgba(0,0,0,.65) 0%, rgba(0,0,0,.50) 40%, rgba(0,0,0,.80) 100%)',
}

const DEFAULT_BTN: ButtonStyle = {
  bgType: 'solid',
  bgColor: '#ffffff',
  bgGradientStart: '#e11d2e',
  bgGradientEnd: '#000000',
  bgGradientDirection: '135deg',
  textColor: '#111827',
  borderRadius: '999px',
  paddingX: '28px',
  paddingY: '14px',
  fontSize: '0.9rem',
  fontWeight: '700',
  showArrowDot: true,
  arrowDotColor: '#e11d2e',
}

const SLIDE_DEFAULTS = {
  tagAr: '', titleAr: '', subtitleAr: '', ctaTextAr: '',
  ctaText2: '', ctaLink2: '/',
  textAlign: 'center', overlayStrength: 'medium',
  titleColor: '', subtitleColor: '', tagColor: '',
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 1, ...SLIDE_DEFAULTS,
    tag: 'Librairie scolaire de référence',
    title: 'Tous vos manuels\nscolaires,',
    subtitle: 'Des milliers de livres et fournitures scolaires livrés en 48h partout au Maroc.',
    ctaText: 'Explorer le catalogue',
    ctaLink: '/best-offers',
    imageUrl: null, bgPosition: 'center',
  },
  {
    id: 2, ...SLIDE_DEFAULTS,
    tag: 'Offres spéciales',
    title: 'Des économies sur\ntous vos livres.',
    subtitle: 'Packs et manuels scolaires à prix réduits pour tous les niveaux.',
    ctaText: 'Voir les promotions',
    ctaLink: '/best-offers',
    imageUrl: null, bgPosition: 'center',
  },
]

const DURATION = 5000

// ─── CTA Button ───────────────────────────────────────────────────────────────

function SliderCTAButton({
  text, href, buttonStyle, secondary = false,
}: {
  text: string; href: string; buttonStyle: ButtonStyle; secondary?: boolean
}) {
  if (!text) return null

  if (secondary) {
    return (
      <Link
        href={href || '/'}
        className="inline-flex items-center gap-2 border border-white/40 text-white/90 font-semibold transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5"
        style={{ borderRadius: buttonStyle.borderRadius, padding: `${buttonStyle.paddingY} ${buttonStyle.paddingX}`, fontSize: buttonStyle.fontSize }}
      >
        {text}
      </Link>
    )
  }

  const bg = buttonStyle.bgType === 'gradient'
    ? `linear-gradient(${buttonStyle.bgGradientDirection}, ${buttonStyle.bgGradientStart}, ${buttonStyle.bgGradientEnd})`
    : buttonStyle.bgColor

  return (
    <Link
      href={href || '/'}
      className="inline-flex items-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
      style={{
        background: bg, color: buttonStyle.textColor,
        borderRadius: buttonStyle.borderRadius,
        padding: `${buttonStyle.paddingY} ${buttonStyle.paddingX}`,
        fontSize: buttonStyle.fontSize, fontWeight: buttonStyle.fontWeight,
        boxShadow: '0 4px 20px rgba(0,0,0,.25)',
      }}
    >
      {buttonStyle.showArrowDot && (
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm group-hover:translate-x-0.5 transition-transform"
          style={{ background: buttonStyle.arrowDotColor, color: '#fff' }}
        >
          →
        </span>
      )}
      {text}
    </Link>
  )
}

// ─── HeroSlider ───────────────────────────────────────────────────────────────

export default function HeroSlider() {
  const { lang } = useLang()

  const [current, setCurrent] = useState(0)
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES)
  const [btnStyle, setBtnStyle] = useState<ButtonStyle>(DEFAULT_BTN)
  const [progress, setProgress] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStart = useRef(0)
  const slidesLen = useRef(DEFAULT_SLIDES.length)

  // ── Data loading ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/slides')
      .then(r => r.json())
      .then((data: Slide[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data)
          slidesLen.current = data.length
        }
      })
      .catch(() => { })

    fetch('/api/slider-button-style')
      .then(r => r.json())
      .then((data: Partial<ButtonStyle>) => {
        if (data?.bgType) setBtnStyle({ ...DEFAULT_BTN, ...data })
      })
      .catch(() => { })
  }, [])

  // ── LCP preload for first slide image ────────────────────────────────────────
  useEffect(() => {
    const first = slides[0]
    if (!first?.imageUrl) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = first.imageUrl
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [slides])

  // ── Signal hero type for CSS hooks ───────────────────────────────────────────
  useEffect(() => {
    const slide = slides[current]
    document.documentElement.dataset.hero = slide?.imageUrl ? 'photo' : 'gradient'
    return () => { delete document.documentElement.dataset.hero }
  }, [slides, current])

  // ── Slide navigation ─────────────────────────────────────────────────────────
  const goTo = useCallback((n: number) => {
    setCurrent((n + slidesLen.current) % slidesLen.current)
    setProgress(0)
  }, [])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    timerRef.current = setInterval(next, DURATION)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [next])

  // ── Progress bar ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (progRef.current) clearTimeout(progRef.current)
    setProgress(0)
    const start = Date.now()
    const tick = () => {
      const pct = Math.min(((Date.now() - start) / DURATION) * 100, 100)
      setProgress(pct)
      if (pct < 100) progRef.current = setTimeout(tick, 16)
    }
    progRef.current = setTimeout(tick, 50)
    return () => { if (progRef.current) clearTimeout(progRef.current) }
  }, [current])

  // ── Touch swipe ───────────────────────────────────────────────────────────────
  function onTouchStart(e: React.TouchEvent) { touchStart.current = e.touches[0].clientX }
  function onTouchEnd(e: React.TouchEvent) {
    const dx = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(dx) > 40) dx > 0 ? next() : prev()
  }

  // ── Text helper ───────────────────────────────────────────────────────────────
  const t = (fr: string, ar: string) => lang === 'ar' && ar ? ar : fr

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <section
      className="relative w-full overflow-hidden"
      suppressHydrationWarning
      style={{
        height: '100svh',
        minHeight: '560px',
        background: '#030712',
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Hero slider"
    >
      {/* ── SLIDES ───────────────────────────────────────────────────────────── */}
      {slides.map((slide, i) => {
        const isActive = i === current
        const overlay = OVERLAYS[slide.overlayStrength] ?? OVERLAYS.medium
        const align = slide.textAlign === 'left' ? 'left' : 'center'
        const flexAlign = align === 'left' ? 'items-start' : 'items-center'
        const tagColor = slide.tagColor || 'rgba(255,255,255,0.75)'
        const titleColor = slide.titleColor || '#ffffff'
        const subColor = slide.subtitleColor || 'rgba(255,255,255,0.75)'
        const cta1text = t(slide.ctaText, slide.ctaTextAr)

        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(.4,0,.2,1)]"
            style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none' }}
          >
            {/* Background — Ken Burns — z:0 */}
            <div
              className="absolute inset-[-5%] bg-cover bg-no-repeat transition-transform duration-[8000ms] ease-linear hero-slide-bg"
              style={{
                backgroundImage: slide.imageUrl ? `url(${slide.imageUrl})` : GRADIENTS[i % GRADIENTS.length],
                backgroundPosition: slide.bgPosition || 'center 30%',
                transform: isActive ? 'scale(1)' : 'scale(1.08)',
                zIndex: 0,
              }}
            />

            {/* Dark overlay — z:1 — must be between image and content */}
            <div className="absolute inset-0" style={{ background: overlay, zIndex: 1 }} />

            {/* Content — z:2 — above overlay */}
            <div
              className={`absolute inset-0 flex flex-col ${flexAlign} justify-center px-6 md:px-20 pt-16 md:pt-20 transition-all duration-[900ms] delay-300`}
              style={{
                textAlign: align,
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'none' : 'translateY(20px)',
                zIndex: 2,
              }}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
              {t(slide.tag, slide.tagAr) && (
                <span
                  className="inline-block text-[.7rem] font-bold tracking-[2px] uppercase bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full mb-4 md:mb-5 animate-fadeInUp"
                  style={{ color: tagColor }}
                >
                  {t(slide.tag, slide.tagAr)}
                </span>
              )}

              <h1
                className="text-[clamp(1.8rem,5vw,4.8rem)] font-extrabold leading-[1.2] md:leading-[1.1] tracking-[-0.03em] max-w-[820px] mb-4 md:mb-6 animate-fadeInUp [animation-delay:100ms]"
                style={{ color: titleColor, textShadow: '0 2px 24px rgba(0,0,0,.3)', whiteSpace: 'pre-line' }}
              >
                {t(slide.title, slide.titleAr)}
              </h1>

              {t(slide.subtitle, slide.subtitleAr) && (
                <p
                  className="text-[clamp(.82rem,1.8vw,1.05rem)] max-w-[320px] md:max-w-[560px] mb-6 md:mb-8 leading-[1.7] font-normal animate-fadeInUp [animation-delay:200ms]"
                  style={{ color: subColor }}
                >
                  {t(slide.subtitle, slide.subtitleAr)}
                </p>
              )}

              <div
                className="mt-4 md:mt-6 flex flex-wrap gap-4 animate-fadeInUp [animation-delay:300ms]"
                style={{ justifyContent: align === 'left' ? 'flex-start' : 'center' }}
              >
                <SliderCTAButton text={cta1text} href={slide.ctaLink} buttonStyle={btnStyle} />
                {slide.ctaText2 && (
                  <SliderCTAButton text={slide.ctaText2} href={slide.ctaLink2 || '/'} buttonStyle={btnStyle} secondary />
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* ── PERMANENT TOP GRADIENT — fully masks bright image behind transparent navbar ── */}
      <div
        className="absolute left-0 right-0 top-0 pointer-events-none"
        style={{
          height: '55%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 12%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.15) 65%, transparent 100%)',
          zIndex: 6,
        }}
        aria-hidden="true"
      />

      {/* ── PERMANENT BOTTOM GRADIENT — content legibility ────────────────────── */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{
          height: '45%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)',
          zIndex: 6,
        }}
        aria-hidden="true"
      />

      {/* ── DOTS ─────────────────────────────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Slides"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
            onClick={() => goTo(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === current ? '28px' : '8px',
              background: i === current ? '#fff' : 'rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>

      {/* ── PROGRESS BAR ─────────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 h-[3px] bg-red-600 z-20"
        style={{ width: `${progress}%`, transition: 'none' }}
        aria-hidden="true"
      />
    </section>
  )
}
