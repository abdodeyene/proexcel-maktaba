'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AboutPage() {
  const [aboutImgs, setAboutImgs] = useState({ about_img_1: '', about_img_2: '', about_img_3: '', about_img_4: '' })

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setAboutImgs({
            about_img_1: data.about_img_1 || '',
            about_img_2: data.about_img_2 || '',
            about_img_3: data.about_img_3 || '',
            about_img_4: data.about_img_4 || '',
          })
        }
      })
      .catch(() => {})
  }, [])

  const fallbackGradient = 'linear-gradient(135deg, #0e1e3a 0%, #070B14 100%)'

  return (
    <>
      {/* PAGE HERO */}
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #070B14 0%, #0e1e3a 50%, #070B14 100%)', minHeight: '340px', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/logo.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
        <div className="page-hero-inner" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
          <div className="breadcrumb-nav">
            <Link href="/">Accueil</Link>
            <span>›</span>
            <span>À Propos</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', marginBottom: '0.75rem' }}>
            À Propos de <span style={{ color: 'var(--primary)' }}>ProExcel</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', maxWidth: '560px' }}>
            Votre librairie scolaire de référence au Maroc depuis plus de 10 ans
          </p>
        </div>
      </div>

      {/* STORY SECTION */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div>
            <div className="section-tag" style={{ display: 'inline-block' }}>Notre Histoire</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
              Plus de <span className="text-gold">10 ans</span> au service<br />de l&apos;éducation marocaine
            </h2>
            <p style={{ color: 'var(--text2)', lineHeight: 1.9, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              Fondée en 2014, ProExcel Maktaba est née d&apos;une passion pour l&apos;éducation et d&apos;un constat simple : les familles marocaines avaient besoin d&apos;un accès facile et fiable aux livres scolaires de qualité.
            </p>
            <p style={{ color: 'var(--text2)', lineHeight: 1.9, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              Aujourd&apos;hui, nous proposons plus de 1 200 titres couvrant tous les niveaux du primaire au baccalauréat, en conformité avec les programmes officiels du Ministère de l&apos;Éducation Nationale marocain.
            </p>
            <p style={{ color: 'var(--text2)', lineHeight: 1.9, fontSize: '0.95rem' }}>
              Notre équipe de spécialistes sélectionne chaque ouvrage avec soin pour garantir qualité pédagogique, conformité aux référentiels officiels et accessibilité tarifaire pour toutes les familles.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Box 1 */}
            <div style={{ borderRadius: '14px', overflow: 'hidden', height: '220px', border: '1px solid var(--border)', flexShrink: 0, background: aboutImgs.about_img_1 ? undefined : fallbackGradient }}>
              {aboutImgs.about_img_1 ? (
                <img src={aboutImgs.about_img_1} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : null}
            </div>
            {/* Box 2 */}
            <div style={{ borderRadius: '14px', overflow: 'hidden', height: '220px', border: '1px solid var(--border)', marginTop: '1.5rem', flexShrink: 0, background: aboutImgs.about_img_2 ? undefined : fallbackGradient }}>
              {aboutImgs.about_img_2 ? (
                <img src={aboutImgs.about_img_2} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : null}
            </div>
            {/* Box 3 */}
            <div style={{ borderRadius: '14px', overflow: 'hidden', height: '160px', border: '1px solid var(--border)', marginTop: '-1rem', flexShrink: 0, background: aboutImgs.about_img_3 ? undefined : fallbackGradient }}>
              {aboutImgs.about_img_3 ? (
                <img src={aboutImgs.about_img_3} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : null}
            </div>
            {/* Box 4 */}
            <div style={{ borderRadius: '14px', overflow: 'hidden', height: '160px', border: '1px solid var(--border)', flexShrink: 0, background: aboutImgs.about_img_4 ? undefined : fallbackGradient }}>
              {aboutImgs.about_img_4 ? (
                <img src={aboutImgs.about_img_4} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* STATS BAND */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
          {[
            { num: '10+', label: 'Années d\'expérience' },
            { num: '1200+', label: 'Titres disponibles' },
            { num: '15K+', label: 'Clients fidèles' },
            { num: '48h', label: 'Délai de livraison' },
          ].map(s => (
            <div key={s.label} className="stat-item" style={{ background: 'var(--card)', padding: '2rem 1rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ fontFamily: '\'Playfair Display\', serif', fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>{s.num}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text2)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* VALUES */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div className="section-header">
          <div className="section-tag">Nos Valeurs</div>
          <h2 className="section-title">Ce qui nous différencie</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
          {[
            { icon: '✅', title: 'Qualité certifiée', desc: 'Tous nos livres sont conformes aux programmes officiels du Ministère de l\'Éducation Nationale.' },
            { icon: '💰', title: 'Prix justes', desc: 'Nous négocions directement avec les éditeurs pour vous offrir les meilleurs tarifs.' },
            { icon: '🚚', title: 'Livraison rapide', desc: 'Recevez vos commandes en 24 à 48 heures partout au Maroc.' },
            { icon: '🤝', title: 'Service client', desc: 'Notre équipe est disponible 6 jours sur 7 pour répondre à toutes vos questions.' },
            { icon: '🔄', title: 'Retours faciles', desc: 'Politique de retour simplifiée sous 14 jours sans conditions.' },
            { icon: '📦', title: 'Stock permanent', desc: 'Plus de 1 200 titres disponibles en permanence pour ne jamais rater la rentrée.' },
          ].map(v => (
            <div key={v.title} className="value-card" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem 1.5rem', transition: 'var(--t)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{v.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>{v.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* LOCATION */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-tag">Nous Trouver</div>
          <h2 className="section-title" style={{ marginBottom: '3rem' }}>Notre Boutique</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                Adresse
              </div>
              <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '0.9rem' }}>
                Avenue Mohammed V, Hay Riad<br />Rabat 10000, Maroc
              </p>
              <a href="https://maps.google.com/?q=Rabat+Hay+Riad+Maroc" target="_blank" rel="noreferrer" className="btn-map" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
                Ouvrir dans Maps
              </a>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary)' }}>🕐 Horaires</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                {[['Lun – Ven', '08:30 – 19:00'], ['Samedi', '09:00 – 18:00'], ['Dimanche', '10:00 – 14:00'], ['Jours fériés', 'Fermé']].map(([day, time]) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text2)' }}>{day}</span>
                    <span style={{ fontWeight: 600, color: time === 'Fermé' ? 'var(--red)' : 'var(--text)' }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '5rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--bg), var(--bg2))' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '1rem' }}>Prêt à explorer notre catalogue ?</h2>
        <p style={{ color: 'var(--text2)', marginBottom: '2rem', fontSize: '0.95rem' }}>Découvrez notre sélection de plus de 1 200 livres scolaires</p>
        <Link href="/best-offers" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem', display: 'inline-flex' }}>
          Explorer le catalogue ›
        </Link>
      </div>
    </>
  )
}
