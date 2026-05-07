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
  image: string
  imageMobile?: string
  bgColor1: string
  bgColor2: string
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
    btn2Link: '/#about',
    image: '',
    bgColor1: '#0e1e3a',
    bgColor2: '#070B14',
  },
  {
    tag: 'Offres Spéciales',
    title: 'Économisez jusqu\'à',
    span: '30% sur les packs',
    sub: 'Achetez vos livres en pack et économisez. Livraison gratuite pour les commandes supérieures à 499 DH.',
    btn1: 'Voir les offres ›',
    btn1Link: '/best-offers',
    btn2: 'Voir les packs',
    btn2Link: '/best-offers?cat=Pack',
    image: '',
    bgColor1: '#1a0a10',
    bgColor2: '#070B14',
  },
  {
    tag: 'Nouveautés 2026',
    title: 'Les nouveaux',
    span: 'livres sont arrivés',
    sub: 'Informatique, Technologie, Langues… Découvrez les dernières parutions pour préparer votre baccalauréat.',
    btn1: 'Voir les nouveautés ›',
    btn1Link: '/best-offers?sort=new',
    btn2: '',
    btn2Link: '',
    image: '',
    bgColor1: '#0a1820',
    bgColor2: '#070B14',
  },
]

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
      <div className="slider" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide, index) => (
          <div className={`slide ${index === current ? 'active' : ''}`} key={index}>
            <>
              <div
                className="slide-bg slide-bg-desktop"
                style={
                  slide.image
                    ? { backgroundImage: `url(${slide.image})` }
                    : { background: `radial-gradient(ellipse at 70% 50%, ${slide.bgColor1 || '#0c1e3a'} 0%, ${slide.bgColor2 || '#060c1a'} 65%)` }
                }
              />
              <div
                className="slide-bg slide-bg-mobile"
                style={
                  (slide.imageMobile || slide.image)
                    ? { backgroundImage: `url(${slide.imageMobile || slide.image})` }
                    : { background: `radial-gradient(ellipse at 70% 50%, ${slide.bgColor1 || '#0c1e3a'} 0%, ${slide.bgColor2 || '#060c1a'} 65%)` }
                }
              />
            </>
            <div className="slide-overlay" />
            <div className="slide-content">
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
          </div>
        ))}
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
