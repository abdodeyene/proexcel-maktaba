'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LangContext'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

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
  light:  'linear-gradient(to bottom, rgba(0,0,0,.35) 0%, rgba(0,0,0,.25) 40%, rgba(0,0,0,.50) 100%)',
  medium: 'linear-gradient(to bottom, rgba(0,0,0,.55) 0%, rgba(0,0,0,.40) 40%, rgba(0,0,0,.70) 100%)',
  dark:   'linear-gradient(to bottom, rgba(0,0,0,.65) 0%, rgba(0,0,0,.50) 40%, rgba(0,0,0,.80) 100%)',
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
    title: 'Tous vos manuels et fournitures\nen un seul endroit',
    subtitle: 'Préparez votre rentrée avec ProExcel. Des milliers de livres livrés en 24/48h partout au Maroc.',
    ctaText: 'Découvrir le catalogue',
    ctaLink: '/best-offers',
    ctaText2: 'Voir les offres',
    ctaLink2: '/best-offers',
    imageUrl: null, bgPosition: 'center',
  },
  {
    id: 2, ...SLIDE_DEFAULTS,
    tag: 'Offres spéciales',
    title: 'Des économies sur\ntous vos livres',
    subtitle: 'Packs et manuels scolaires à prix réduits pour tous les niveaux.',
    ctaText: 'Voir les promotions',
    ctaLink: '/best-offers',
    imageUrl: null, bgPosition: 'center',
  },
]

const DURATION = 5000

function MagneticButton({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { damping: 15, stiffness: 150, mass: 0.1 })
  const springY = useSpring(y, { damping: 15, stiffness: 150, mass: 0.1 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    x.set((clientX - centerX) * 0.35)
    y.set((clientY - centerY) * 0.35)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  )
}

function SliderCTAButton({
  text, href, buttonStyle, secondary = false,
}: {
  text: string; href: string; buttonStyle: ButtonStyle; secondary?: boolean
}) {
  if (!text) return null

  const btnContent = secondary ? (
    <Link
      href={href || '/'}
      className="inline-flex items-center gap-2 font-semibold transition-all duration-300 hover:scale-105 shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] group"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        borderRadius: buttonStyle.borderRadius,
        padding: `${buttonStyle.paddingY} ${buttonStyle.paddingX}`,
        fontSize: buttonStyle.fontSize,
        border: '1px solid rgba(255,255,255,0.15)'
      }}
    >
      {text}
    </Link>
  ) : (
    <Link
      href={href || '/'}
      className="inline-flex items-center gap-2.5 transition-all duration-300 hover:scale-105 group"
      style={{
        background: buttonStyle.bgType === 'gradient'
          ? `linear-gradient(${buttonStyle.bgGradientDirection}, ${buttonStyle.bgGradientStart}, ${buttonStyle.bgGradientEnd})`
          : buttonStyle.bgColor,
        color: buttonStyle.textColor,
        borderRadius: buttonStyle.borderRadius,
        padding: `${buttonStyle.paddingY} ${buttonStyle.paddingX}`,
        fontSize: buttonStyle.fontSize, fontWeight: buttonStyle.fontWeight,
        boxShadow: '0 4px 20px rgba(225, 29, 46, 0.4)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 30px rgba(225, 29, 46, 0.6)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(225, 29, 46, 0.4)'; }}
    >
      {buttonStyle.showArrowDot && (
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
          style={{ background: buttonStyle.arrowDotColor, color: '#fff' }}
        >
          →
        </span>
      )}
      {text}
    </Link>
  )

  return <MagneticButton>{btnContent}</MagneticButton>
}

// ─── HeroSlider ───────────────────────────────────────────────────────────────

export default function HeroSlider() {
  const { lang } = useLang()

  const [current, setCurrent] = useState(0)
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES)
  const [btnStyle, setBtnStyle] = useState<ButtonStyle>(DEFAULT_BTN)
  const [progress, setProgress] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStart = useRef(0)
  const slidesLen  = useRef(DEFAULT_SLIDES.length)

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
      .catch(() => {})

    fetch('/api/slider-button-style')
      .then(r => r.json())
      .then((data: Partial<ButtonStyle>) => {
        if (data?.bgType) setBtnStyle({ ...DEFAULT_BTN, ...data })
      })
      .catch(() => {})
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
        const isActive   = i === current
        const overlay    = OVERLAYS[slide.overlayStrength] ?? OVERLAYS.medium
        const tagColor   = slide.tagColor      || 'rgba(255,255,255,0.75)'
        const titleColor = slide.titleColor    || '#ffffff'
        const subColor   = slide.subtitleColor || 'rgba(255,255,255,0.75)'
        const cta1text   = t(slide.ctaText, slide.ctaTextAr)

        const containerVariants = {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.15
            }
          }
        }

        const itemVariants = {
          hidden: { opacity: 0, y: 25, scale: 0.97 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: 'spring' as const,
              stiffness: 110,
              damping: 18
            }
          }
        }

        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(.4,0,.2,1)]"
            style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none' }}
          >
            {/* Background — Ken Burns — z:0 */}
            <div
              className={`absolute inset-[-5%] bg-cover bg-no-repeat transition-transform duration-[12000ms] ease-linear hero-slide-bg ${isActive ? 'ken-burns' : ''}`}
              style={{
                backgroundImage: slide.imageUrl ? `url(${slide.imageUrl})` : GRADIENTS[i % GRADIENTS.length],
                backgroundPosition: slide.bgPosition || 'center 30%',
                zIndex: 0,
              }}
            />

            {/* Dark overlay — z:1 — must be between image and content */}
            <div className="absolute inset-0 hero-overlay" style={{ background: overlay, zIndex: 1 }} />

            {/* Content — z:2 — above overlay */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isActive ? "visible" : "hidden"}
              className="absolute inset-0 z-[2] flex flex-col items-center justify-center text-center px-6 md:px-12 pt-16 md:pt-24"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
              {t(slide.tag, slide.tagAr) && (
                <motion.span
                  variants={itemVariants}
                  className="inline-block text-[0.68rem] md:text-[0.75rem] font-bold tracking-[3px] uppercase bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full mb-5 md:mb-7 shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                  style={{ color: tagColor }}
                >
                  {t(slide.tag, slide.tagAr)}
                </motion.span>
              )}

              <motion.h1
                variants={itemVariants}
                className="text-[clamp(2.2rem,6vw,5.5rem)] font-norsal text-white leading-[1.05] tracking-[-0.04em] max-w-[360px] md:max-w-[860px] mb-4 md:mb-6 text-glow"
                style={{
                  color: titleColor,
                  whiteSpace: 'pre-line'
                }}
              >
                {t(slide.title, slide.titleAr)}
              </motion.h1>

              {t(slide.subtitle, slide.subtitleAr) && (
                <motion.p
                  variants={itemVariants}
                  className="text-[clamp(0.9rem,2.2vw,1.2rem)] text-white/80 max-w-[300px] md:max-w-[580px] leading-relaxed mb-8 md:mb-10 font-medium"
                  style={{
                    color: subColor,
                    textShadow: '0 2px 10px rgba(0,0,0,0.4)'
                  }}
                >
                  {t(slide.subtitle, slide.subtitleAr)}
                </motion.p>
              )}

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4 md:gap-5 items-center"
                style={{ justifyContent: 'center' }}
              >
                <SliderCTAButton text={cta1text} href={slide.ctaLink} buttonStyle={btnStyle} />
                {slide.ctaText2 && (
                  <SliderCTAButton text={slide.ctaText2} href={slide.ctaLink2 || '/'} buttonStyle={btnStyle} secondary />
                )}
              </motion.div>
            </motion.div>
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
