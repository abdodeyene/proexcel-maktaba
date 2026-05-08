'use client'

import { useState, useEffect } from 'react'
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
    tag: 'Jusqu\'à 30% de réduction',
    title: 'Des économies sur',
    span: 'tous vos livres scolaires.',
    sub: 'Profitez de nos offres spéciales sur une sélection de manuels et de packs scolaires complets pour chaque niveau.',
    btn1: 'Voir les promotions',
    btn1Link: '/best-offers',
    btn2: 'Voir les packs',
    btn2Link: '/best-offers?cat=Pack',
  },
]

function BooksIllustration() {
  return (
    <svg
      viewBox="0 0 460 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="books-svg"
      aria-hidden="true"
    >
      {/* Warm glow */}
      <ellipse cx="230" cy="195" rx="190" ry="145" fill="rgba(200,117,51,0.07)" />

      {/* Shelf line */}
      <rect x="18" y="308" width="424" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
      <rect x="28" y="313" width="404" height="3" rx="1.5" fill="rgba(255,255,255,0.04)" />

      {/* ── Standing books (left side) ── */}

      {/* Book 1 – Bright slate blue */}
      <rect x="20" y="145" width="40" height="163" rx="5" fill="#3A6BC4" />
      <rect x="20" y="145" width="10" height="163" rx="5 0 0 5" fill="rgba(0,0,0,0.22)" />
      <rect x="35" y="165" width="16" height="2" rx="1" fill="rgba(255,255,255,0.18)" />
      <rect x="35" y="170" width="12" height="2" rx="1" fill="rgba(255,255,255,0.12)" />

      {/* Book 2 – Amber terracotta */}
      <rect x="66" y="158" width="36" height="150" rx="5" fill="#D4813A" />
      <rect x="66" y="158" width="9" height="150" rx="5 0 0 5" fill="rgba(0,0,0,0.2)" />
      <rect x="80" y="178" width="14" height="2" rx="1" fill="rgba(255,255,255,0.22)" />
      <rect x="80" y="183" width="10" height="2" rx="1" fill="rgba(255,255,255,0.14)" />

      {/* Book 3 – Teal green */}
      <rect x="108" y="150" width="38" height="158" rx="5" fill="#3D8A60" />
      <rect x="108" y="150" width="9" height="158" rx="5 0 0 5" fill="rgba(0,0,0,0.2)" />

      {/* ── Open Book (center, main focus) ── */}

      {/* Left page */}
      <path
        d="M155 160 L155 298 Q155 304 161 304 L228 292 L228 156 Q228 152 222 152 L161 152 Q155 152 155 158 Z"
        fill="#FAFAF6"
        stroke="rgba(27,49,87,0.06)"
        strokeWidth="0.5"
      />
      {/* Right page */}
      <path
        d="M305 160 L305 298 Q305 304 299 304 L232 292 L232 156 Q232 152 238 152 L299 152 Q305 152 305 158 Z"
        fill="#F4EEE3"
        stroke="rgba(27,49,87,0.06)"
        strokeWidth="0.5"
      />
      {/* Spine shadow */}
      <rect x="225" y="151" width="10" height="154" fill="rgba(27,49,87,0.07)" />

      {/* Page lines left */}
      <line x1="172" y1="192" x2="216" y2="192" stroke="#D8CDBA" strokeWidth="1.3" />
      <line x1="172" y1="204" x2="216" y2="204" stroke="#D8CDBA" strokeWidth="1.3" />
      <line x1="172" y1="216" x2="210" y2="216" stroke="#D8CDBA" strokeWidth="1.3" />
      <line x1="172" y1="228" x2="216" y2="228" stroke="#D8CDBA" strokeWidth="1.3" />
      <line x1="172" y1="240" x2="208" y2="240" stroke="#D8CDBA" strokeWidth="1.3" />
      <line x1="172" y1="252" x2="216" y2="252" stroke="#D8CDBA" strokeWidth="1.3" />
      <line x1="172" y1="264" x2="212" y2="264" stroke="#D8CDBA" strokeWidth="1.3" />

      {/* Page lines right */}
      <line x1="243" y1="192" x2="288" y2="192" stroke="#C8BAA0" strokeWidth="1.3" />
      <line x1="243" y1="204" x2="288" y2="204" stroke="#C8BAA0" strokeWidth="1.3" />
      <line x1="243" y1="216" x2="283" y2="216" stroke="#C8BAA0" strokeWidth="1.3" />
      <line x1="243" y1="228" x2="288" y2="228" stroke="#C8BAA0" strokeWidth="1.3" />
      <line x1="243" y1="240" x2="281" y2="240" stroke="#C8BAA0" strokeWidth="1.3" />
      <line x1="243" y1="252" x2="288" y2="252" stroke="#C8BAA0" strokeWidth="1.3" />
      <line x1="243" y1="264" x2="285" y2="264" stroke="#C8BAA0" strokeWidth="1.3" />

      {/* Amber bookmark */}
      <path d="M282 152 L288 152 L288 186 L285 182 L282 186 Z" fill="#C87533" opacity="0.65" />

      {/* ── Standing books (right side) ── */}

      {/* Book 4 – Cornflower blue */}
      <rect x="311" y="154" width="38" height="154" rx="5" fill="#5B8DD9" />
      <rect x="311" y="154" width="9" height="154" rx="5 0 0 5" fill="rgba(0,0,0,0.2)" />
      <rect x="325" y="174" width="16" height="2" rx="1" fill="rgba(255,255,255,0.18)" />
      <rect x="325" y="179" width="12" height="2" rx="1" fill="rgba(255,255,255,0.12)" />

      {/* Book 5 – Warm orange */}
      <rect x="355" y="166" width="34" height="142" rx="5" fill="#C87533" />
      <rect x="355" y="166" width="8" height="142" rx="5 0 0 5" fill="rgba(0,0,0,0.2)" />

      {/* Book 6 – Indigo, far right, tallest */}
      <rect x="395" y="140" width="45" height="168" rx="5" fill="#4A6FA5" />
      <rect x="395" y="140" width="11" height="168" rx="5 0 0 5" fill="rgba(0,0,0,0.22)" />
      <rect x="412" y="160" width="18" height="2" rx="1" fill="rgba(255,255,255,0.18)" />
      <rect x="412" y="165" width="14" height="2" rx="1" fill="rgba(255,255,255,0.12)" />

      {/* ── Decorative elements ── */}

      {/* Pencil – upper right, angled */}
      <g transform="translate(386, 54) rotate(28)">
        <rect x="0" y="8" width="12" height="54" rx="1.5" fill="#F59E0B" />
        <polygon points="0,62 12,62 6,72" fill="#D97706" />
        <ellipse cx="6" cy="5.5" rx="6" ry="5.5" fill="#DC2626" />
        <rect x="0" y="8" width="12" height="7" fill="#D1D5DB" />
        <line x1="6" y1="8" x2="6" y2="62" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      </g>

      {/* Small decorative dots — upper left area */}
      <circle cx="136" cy="120" r="4.5" fill="#C87533" opacity="0.35" />
      <circle cx="150" cy="107" r="2.8" fill="#C87533" opacity="0.2" />
      <circle cx="122" cy="110" r="3" fill="#5B8DD9" opacity="0.3" />

      {/* Sparkle cross – left */}
      <line x1="60" y1="108" x2="60" y2="122" stroke="#C87533" strokeWidth="2.2" strokeLinecap="round" opacity="0.4" />
      <line x1="53" y1="115" x2="67" y2="115" stroke="#C87533" strokeWidth="2.2" strokeLinecap="round" opacity="0.4" />

      {/* Dots – upper right */}
      <circle cx="345" cy="100" r="4" fill="#C87533" opacity="0.28" />
      <circle cx="360" cy="88" r="2.4" fill="#C87533" opacity="0.18" />
      <circle cx="332" cy="90" r="3" fill="#5B8DD9" opacity="0.3" />

      {/* Small star – top center */}
      <g transform="translate(228, 92)">
        <polygon
          points="0,-7 1.6,-2.4 6.6,-2.4 2.7,0.9 4.1,5.7 0,2.8 -4.1,5.7 -2.7,0.9 -6.6,-2.4 -1.6,-2.4"
          fill="#C87533"
          opacity="0.5"
        />
      </g>
    </svg>
  )
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data?.hero_slides) {
          try {
            const parsed = JSON.parse(data.hero_slides)
            if (Array.isArray(parsed) && parsed.length > 0) setSlides(parsed)
          } catch { /* keep defaults */ }
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="hero-section" aria-label="Présentation">
      <div className="hero-container">

        {/* ── Text content ── */}
        <div className="hero-content">
          {slides.map((slide, i) => (
            <div key={i} className={`hero-slide${i === current ? ' active' : ''}`}>
              {slide.tag && (
                <div className="hero-tag">
                  <span className="hero-tag-dot" />
                  {slide.tag}
                </div>
              )}

              <h1 className="hero-heading">
                {slide.title.split('\n').map((line, j) => (
                  <span key={j}>{line}<br /></span>
                ))}
                {slide.span && (
                  <em className="hero-heading-em">{slide.span}</em>
                )}
              </h1>

              {slide.sub && <p className="hero-sub">{slide.sub}</p>}

              <div className="hero-btns">
                {slide.btn1 && (
                  <Link href={slide.btn1Link || '/best-offers'} className="hero-btn-primary">
                    {slide.btn1}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                )}
                {slide.btn2 && (
                  <Link href={slide.btn2Link || '/best-offers'} className="hero-btn-outline">
                    {slide.btn2}
                  </Link>
                )}
              </div>

              <div className="hero-trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Jusqu&apos;à <strong>30%</strong> d&apos;économies sur les packs scolaires
              </div>
            </div>
          ))}

          {slides.length > 1 && (
            <div className="hero-dots" role="tablist" aria-label="Slides">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`hero-dot${i === current ? ' active' : ''}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Slide ${i + 1}`}
                  role="tab"
                  aria-selected={i === current}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Visual illustration ── */}
        <div className="hero-visual" aria-hidden="true">
          <BooksIllustration />
        </div>
      </div>
    </section>
  )
}
