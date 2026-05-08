'use client'

import { useState, useEffect, type JSX } from 'react'
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
  image: string
  imageMobile?: string
  bgColor1: string
  bgColor2: string
  productImage?: string
}

const DEFAULT_SLIDES: Slide[] = [
  {
    tag: 'Rentrée Scolaire 2026',
    title: 'Tous vos manuels',
    span: 'en un seul endroit',
    sub: 'Découvrez notre sélection complète de livres scolaires pour le primaire, collège et lycée au Maroc.',
    btn1: 'Explorer le catalogue ›',
    btn1Link: '/best-offers',
    btn2: 'En savoir plus',
    btn2Link: '/about',
    image: '',
    bgColor1: '#0a1628',
    bgColor2: '#030812',
  },
  {
    tag: 'Imprimantes & Fournitures',
    title: 'Équipez votre',
    span: 'espace de travail',
    sub: 'Imprimantes, cartouches, papier et tout le matériel pour votre bureau ou salle de classe.',
    btn1: 'Voir les imprimantes ›',
    btn1Link: '/best-offers?cat=Imprimantes',
    btn2: 'Fournitures bureau',
    btn2Link: '/best-offers?cat=Fournitures',
    image: '',
    bgColor1: '#050d1a',
    bgColor2: '#020810',
  },
  {
    tag: 'Offres Limitées',
    title: "Jusqu'à",
    span: '30% de réduction',
    sub: 'Profitez de nos offres spéciales sur une sélection de manuels et fournitures scolaires.',
    btn1: 'Voir les promotions ›',
    btn1Link: '/best-offers',
    btn2: 'Voir les packs',
    btn2Link: '/best-offers?cat=Pack',
    image: '',
    bgColor1: '#1a0508',
    bgColor2: '#070B14',
  },
]

// ─── Slide 1: Backpack + School Supplies ───
function BackpackScene() {
  return (
    <div className="slide-visual-scene">
      <div className="slide-vis-glow" />

      {/* Book floating top-left */}
      <div className="vis-orbit vis-orbit-tl">
        <svg width="52" height="65" viewBox="0 0 52 65" fill="none">
          <rect width="52" height="65" rx="5" fill="#1D4ED8"/>
          <rect x="0" y="0" width="8" height="65" rx="5 0 0 5" fill="#1E3A8A"/>
          <text x="26" y="36" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="9" fontFamily="sans-serif" fontWeight="700">MATH</text>
          <text x="26" y="50" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="sans-serif">6ème</text>
        </svg>
      </div>

      {/* Pencil floating top-right */}
      <div className="vis-orbit vis-orbit-tr">
        <svg width="14" height="72" viewBox="0 0 14 72" fill="none">
          <rect x="1" y="9" width="12" height="52" fill="#FBBF24"/>
          <polygon points="1,61 13,61 7,72" fill="#EA580C"/>
          <ellipse cx="7" cy="5" r="6" fill="#DC2626"/>
          <rect x="1" y="9" width="12" height="6" fill="#D1D5DB"/>
          <line x1="7" y1="9" x2="7" y2="61" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
        </svg>
      </div>

      {/* Main Backpack */}
      <div className="vis-main">
        <svg width="200" height="230" viewBox="0 0 200 230" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="224" rx="67" ry="7" fill="rgba(0,0,0,0.35)"/>
          <rect x="36" y="78" width="17" height="108" rx="8" fill="#8B0000" opacity="0.85"/>
          <rect x="147" y="78" width="17" height="108" rx="8" fill="#8B0000" opacity="0.85"/>
          <rect x="28" y="56" width="144" height="158" rx="28" fill="#C8102E"/>
          <rect x="48" y="36" width="104" height="28" rx="13" fill="#A50E27"/>
          <path d="M76 36 C76 10 124 10 124 36" stroke="#8B0000" strokeWidth="11" fill="none" strokeLinecap="round"/>
          <path d="M44 76 Q80 62 118 74" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <rect x="50" y="118" width="100" height="80" rx="14" fill="#A50E27"/>
          <line x1="50" y1="148" x2="150" y2="148" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeDasharray="5 4"/>
          <rect x="95" y="143" width="10" height="10" rx="2" fill="rgba(255,255,255,0.65)"/>
          <text x="100" y="182" textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="20" fontFamily="sans-serif" fontWeight="900">PE</text>
          <rect x="28" y="200" width="144" height="14" rx="0 0 28 28" fill="rgba(0,0,0,0.2)"/>
        </svg>
      </div>

      {/* Notebook floating bottom-left */}
      <div className="vis-orbit vis-orbit-bl">
        <svg width="55" height="68" viewBox="0 0 55 68" fill="none">
          <rect width="55" height="68" rx="5" fill="#16A34A"/>
          <rect x="0" y="0" width="8" height="68" rx="5 0 0 5" fill="#166534"/>
          <line x1="14" y1="20" x2="46" y2="20" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
          <line x1="14" y1="28" x2="46" y2="28" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
          <line x1="14" y1="36" x2="46" y2="36" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
          <line x1="14" y1="44" x2="36" y2="44" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Ruler floating bottom-right */}
      <div className="vis-orbit vis-orbit-br">
        <svg width="76" height="22" viewBox="0 0 76 22" fill="none">
          <rect width="76" height="22" rx="4" fill="#F1F5F9"/>
          <rect width="76" height="4" rx="2 2 0 0" fill="#E2E8F0"/>
          <line x1="10" y1="4" x2="10" y2="14" stroke="#94A3B8" strokeWidth="1"/>
          <line x1="20" y1="4" x2="20" y2="10" stroke="#94A3B8" strokeWidth="1"/>
          <line x1="30" y1="4" x2="30" y2="14" stroke="#94A3B8" strokeWidth="1"/>
          <line x1="40" y1="4" x2="40" y2="10" stroke="#94A3B8" strokeWidth="1"/>
          <line x1="50" y1="4" x2="50" y2="14" stroke="#94A3B8" strokeWidth="1"/>
          <line x1="60" y1="4" x2="60" y2="10" stroke="#94A3B8" strokeWidth="1"/>
          <line x1="70" y1="4" x2="70" y2="14" stroke="#94A3B8" strokeWidth="1"/>
          <text x="38" y="20" textAnchor="middle" fill="#94A3B8" fontSize="5.5" fontFamily="sans-serif">30 cm</text>
        </svg>
      </div>
    </div>
  )
}

// ─── Slide 2: Printer + Office Supplies ───
function PrinterScene() {
  return (
    <div className="slide-visual-scene">
      <div className="slide-vis-glow" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)' }} />

      {/* Red ink cartridge top-left */}
      <div className="vis-orbit vis-orbit-tl">
        <svg width="32" height="68" viewBox="0 0 32 68" fill="none">
          <rect x="4" y="4" width="24" height="60" rx="7" fill="#C8102E"/>
          <rect x="4" y="4" width="24" height="22" rx="7 7 0 0" fill="#9A0C24"/>
          <text x="16" y="21" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="7" fontFamily="sans-serif" fontWeight="700">INK</text>
          <rect x="8" y="38" width="7" height="4" rx="1" fill="rgba(255,255,255,0.4)"/>
          <rect x="17" y="38" width="7" height="4" rx="1" fill="rgba(255,255,255,0.4)"/>
        </svg>
      </div>

      {/* Black ink cartridge top-right */}
      <div className="vis-orbit vis-orbit-tr">
        <svg width="32" height="68" viewBox="0 0 32 68" fill="none">
          <rect x="4" y="4" width="24" height="60" rx="7" fill="#1E293B"/>
          <rect x="4" y="4" width="24" height="22" rx="7 7 0 0" fill="#0F172A"/>
          <text x="16" y="21" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="7" fontFamily="sans-serif" fontWeight="700">INK</text>
          <rect x="8" y="38" width="7" height="4" rx="1" fill="rgba(255,255,255,0.3)"/>
          <rect x="17" y="38" width="7" height="4" rx="1" fill="rgba(255,255,255,0.3)"/>
        </svg>
      </div>

      {/* Main Printer */}
      <div className="vis-main">
        <svg width="220" height="170" viewBox="0 0 220 170" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="110" cy="166" rx="82" ry="6" fill="rgba(0,0,0,0.3)"/>
          <rect x="15" y="52" width="190" height="108" rx="14" fill="#1E293B"/>
          <rect x="15" y="52" width="190" height="35" rx="14 14 0 0" fill="#243550"/>
          <rect x="52" y="24" width="116" height="32" rx="7" fill="#1E293B"/>
          <rect x="64" y="12" width="92" height="18" rx="4" fill="white" opacity="0.88"/>
          <line x1="72" y1="17" x2="148" y2="17" stroke="#E2E8F0" strokeWidth="1.2"/>
          <line x1="72" y1="22" x2="130" y2="22" stroke="#E2E8F0" strokeWidth="1.2"/>
          <rect x="48" y="153" width="124" height="12" rx="4" fill="white" opacity="0.85"/>
          <rect x="28" y="62" width="95" height="44" rx="6" fill="#0D1B2A"/>
          <rect x="33" y="67" width="85" height="34" rx="4" fill="#0A2540"/>
          <line x1="38" y1="77" x2="113" y2="77" stroke="rgba(56,189,248,0.7)" strokeWidth="1.5"/>
          <line x1="38" y1="85" x2="95" y2="85" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5"/>
          <rect x="38" y="91" width="50" height="4" rx="2" fill="rgba(56,189,248,0.25)"/>
          <rect x="38" y="91" width="28" height="4" rx="2" fill="rgba(56,189,248,0.6)"/>
          <circle cx="172" cy="104" r="13" fill="#C8102E"/>
          <circle cx="172" cy="104" r="8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
          <circle cx="148" cy="104" r="7" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          <circle cx="128" cy="104" r="7" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          <line x1="175" y1="148" x2="195" y2="148" stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>
          <line x1="175" y1="154" x2="195" y2="154" stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>
          <line x1="175" y1="160" x2="195" y2="160" stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>
        </svg>
      </div>

      {/* Paper stack bottom-left */}
      <div className="vis-orbit vis-orbit-bl">
        <svg width="62" height="78" viewBox="0 0 62 78" fill="none">
          <rect x="4" y="5" width="58" height="72" rx="3" fill="#E2E8F0"/>
          <rect x="0" y="0" width="58" height="72" rx="3" fill="#F8FAFC"/>
          <line x1="10" y1="16" x2="48" y2="16" stroke="#CBD5E1" strokeWidth="1.5"/>
          <line x1="10" y1="24" x2="48" y2="24" stroke="#CBD5E1" strokeWidth="1.5"/>
          <line x1="10" y1="32" x2="48" y2="32" stroke="#CBD5E1" strokeWidth="1.5"/>
          <line x1="10" y1="40" x2="48" y2="40" stroke="#CBD5E1" strokeWidth="1.5"/>
          <line x1="10" y1="50" x2="35" y2="50" stroke="#CBD5E1" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Stapler bottom-right */}
      <div className="vis-orbit vis-orbit-br">
        <svg width="72" height="38" viewBox="0 0 72 38" fill="none">
          <rect x="4" y="16" width="64" height="20" rx="7" fill="#334155"/>
          <rect x="4" y="16" width="64" height="10" rx="7 7 0 0" fill="#475569"/>
          <rect x="9" y="23" width="20" height="10" rx="3" fill="#1E293B"/>
          <rect x="11" y="25" width="16" height="5" rx="2" fill="#C8102E"/>
          <rect x="40" y="18" width="22" height="6" rx="3" fill="#64748B"/>
          <circle cx="56" cy="28" r="4" fill="#94A3B8"/>
        </svg>
      </div>
    </div>
  )
}

// ─── Slide 3: Promotions + Discount Circle ───
function PromoScene() {
  return (
    <div className="slide-visual-scene">
      <div className="slide-vis-glow" style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.28) 0%, transparent 70%)' }} />

      {/* Book top-left */}
      <div className="vis-orbit vis-orbit-tl">
        <svg width="52" height="65" viewBox="0 0 52 65" fill="none">
          <rect width="52" height="65" rx="5" fill="#7C3AED"/>
          <rect x="0" y="0" width="8" height="65" rx="5 0 0 5" fill="#5B21B6"/>
          <text x="26" y="36" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="9" fontFamily="sans-serif" fontWeight="700">SVT</text>
          <text x="26" y="50" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="sans-serif">-30%</text>
        </svg>
      </div>

      {/* Star badge top-right */}
      <div className="vis-orbit vis-orbit-tr">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <polygon points="26,2 31,18 49,18 35,29 40,46 26,36 12,46 17,29 3,18 21,18" fill="#F59E0B"/>
          <text x="26" y="30" textAnchor="middle" fill="white" fontSize="9" fontFamily="sans-serif" fontWeight="900">TOP</text>
        </svg>
      </div>

      {/* Main discount circle */}
      <div className="vis-main">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="92" fill="#C8102E"/>
          <circle cx="100" cy="100" r="84" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="8 6"/>
          <circle cx="100" cy="100" r="70" fill="rgba(0,0,0,0.15)"/>
          <text x="100" y="70" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="13" fontFamily="sans-serif" fontWeight="600">JUSQU&apos;À</text>
          <text x="100" y="122" textAnchor="middle" fill="white" fontSize="58" fontFamily="sans-serif" fontWeight="900">30%</text>
          <text x="100" y="148" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="12" fontFamily="sans-serif" fontWeight="700">ÉCONOMIES</text>
          <circle cx="28" cy="38" r="6" fill="rgba(255,255,255,0.2)"/>
          <circle cx="172" cy="48" r="4" fill="rgba(255,255,255,0.2)"/>
          <circle cx="30" cy="162" r="5" fill="rgba(255,255,255,0.15)"/>
          <circle cx="170" cy="155" r="7" fill="rgba(255,255,255,0.15)"/>
        </svg>
      </div>

      {/* Price tag bottom-left */}
      <div className="vis-orbit vis-orbit-bl">
        <svg width="82" height="52" viewBox="0 0 82 52" fill="none">
          <path d="M4 10 C4 5 8 1 13 1 L70 1 L80 26 L70 51 L13 51 C8 51 4 47 4 42 Z" fill="white" opacity="0.95"/>
          <circle cx="13" cy="26" r="4" fill="none" stroke="#CBD5E1" strokeWidth="2"/>
          <text x="48" y="23" textAnchor="middle" fill="#C8102E" fontSize="15" fontFamily="sans-serif" fontWeight="900">59 DH</text>
          <text x="48" y="39" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="sans-serif">au lieu de 85 DH</text>
        </svg>
      </div>

      {/* Book bottom-right */}
      <div className="vis-orbit vis-orbit-br">
        <svg width="50" height="62" viewBox="0 0 50 62" fill="none">
          <rect width="50" height="62" rx="5" fill="#0369A1"/>
          <rect x="0" y="0" width="8" height="62" rx="5 0 0 5" fill="#075985"/>
          <text x="25" y="33" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="7" fontFamily="sans-serif" fontWeight="700">PHYSIQUE</text>
          <text x="25" y="46" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="sans-serif">-20%</text>
        </svg>
      </div>
    </div>
  )
}

const SCENES: Array<(() => JSX.Element) | null> = [BackpackScene, PrinterScene, PromoScene]

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
      .catch(() => { /* keep defaults */ })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goTo = (index: number) => setCurrent(index)
  const next = () => setCurrent((prev) => (prev + 1) % slides.length)
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className="hero">
      <div className="slider">
        {slides.map((slide, index) => {
          const SceneComponent = SCENES[index] ?? null
          return (
            <div className={`slide ${index === current ? 'active' : ''}`} key={index}>
              <div
                className="slide-bg slide-bg-desktop"
                style={
                  slide.image
                    ? { backgroundImage: `url(${slide.image})` }
                    : { background: `radial-gradient(ellipse at 68% 50%, ${slide.bgColor1 || '#0c1e3a'} 0%, ${slide.bgColor2 || '#060c1a'} 65%)` }
                }
              />
              <div
                className="slide-bg slide-bg-mobile"
                style={
                  (slide.imageMobile || slide.image)
                    ? { backgroundImage: `url(${slide.imageMobile || slide.image})` }
                    : { background: `radial-gradient(ellipse at 68% 50%, ${slide.bgColor1 || '#0c1e3a'} 0%, ${slide.bgColor2 || '#060c1a'} 65%)` }
                }
              />
              <div className="slide-overlay" />
              <div className="slide-content">
                <div className="slide-inner">
                  <div className="slide-text">
                    {slide.tag && <div className="slide-tag">{slide.tag}</div>}
                    <h1 className="slide-title">
                      <span>{slide.title}</span>
                      {slide.span && <><br /><span className="text-gold">{slide.span}</span></>}
                    </h1>
                    {slide.sub && <p className="slide-sub">{slide.sub}</p>}
                    <div className="slide-btns">
                      {slide.btn1 && (
                        <Link href={slide.btn1Link || '/'} className="btn-primary">
                          {slide.btn1}
                        </Link>
                      )}
                      {slide.btn2 && (
                        <Link href={slide.btn2Link || '/'} className="btn-outline">
                          {slide.btn2}
                        </Link>
                      )}
                    </div>
                  </div>

                  {(slide.productImage || (!slide.image && SceneComponent)) && (
                    <div className="slide-visual">
                      {slide.productImage
                        ? <img src={slide.productImage} alt="" className="slide-product-img" />
                        : SceneComponent ? <SceneComponent /> : null
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === current ? 'active' : ''}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>

      <div className="slider-arrows">
        <div className="arrow arrow-prev" onClick={prev}>‹</div>
        <div className="arrow arrow-next" onClick={next}>›</div>
      </div>
    </section>
  )
}
