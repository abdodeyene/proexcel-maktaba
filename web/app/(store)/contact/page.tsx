'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    alert('Message envoyé avec succès! Nous vous répondrons sous 24 heures.')
  }

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="breadcrumb-nav">
            <Link href="/">Accueil</Link>
            <span>›</span>
            <span>Contact</span>
          </div>
          <h1>📬 Contactez-nous</h1>
          <p>Notre équipe est disponible pour répondre à toutes vos questions</p>
        </div>
      </div>

      <div className="contact-layout">
        
        {/* Form */}
        <div className="contact-form-card">
          <h2>Envoyez-nous<br /><span className="text-gold">un message</span></h2>
          <p className="subtitle">Nous répondrons dans les 24 heures ouvrables</p>

          <form onSubmit={handleSubmit}>
            <div className="form-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                <label className="form-label">Prénom</label>
                <input className="form-input" type="text" placeholder="Mohammed" required />
              </div>
              <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                <label className="form-label">Nom</label>
                <input className="form-input" type="text" placeholder="Alami" required />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="mohammed@example.com" required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input className="form-input" type="tel" placeholder="+212 6 XX XX XX XX" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Sujet</label>
              <select className="form-input" style={{ width: '100%' }}>
                <option>Commande & Livraison</option>
                <option>Disponibilité d&apos;un livre</option>
                <option>Retour & Remboursement</option>
                <option>Question générale</option>
                <option>Partenariat</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-input" placeholder="Décrivez votre demande en détail…" required style={{ minHeight: '120px' }}></textarea>
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}>
              Envoyer le message ›
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div>
          <div className="info-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div className="info-card" style={{ display: 'flex', gap: '1rem', background: 'var(--card)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--r)' }}>
              <div className="info-icon" style={{ fontSize: '1.5rem' }}>📍</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text)' }}>Notre Adresse</h4>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.5 }}>
                  Avenue Mohammed V, Hay Riad<br />Rabat 10000, Maroc<br />
                  <a 
                    href="https://maps.google.com/?q=Rabat+Hay+Riad+Maroc" 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ color: 'var(--gold)', fontSize: '.8rem', textDecoration: 'none' }}
                  >
                    📍 Voir sur la carte
                  </a>
                </p>
              </div>
            </div>

            <div className="info-card" style={{ display: 'flex', gap: '1rem', background: 'var(--card)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--r)' }}>
              <div className="info-icon" style={{ fontSize: '1.5rem' }}>📞</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text)' }}>Téléphone & WhatsApp</h4>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.5 }}>
                  +212 6 12 34 56 78<br />+212 5 37 XX XX XX<br />
                  <span style={{ color: 'var(--text2)', fontSize: '.78rem' }}>Lun–Sam: 08:30–19:00</span>
                </p>
              </div>
            </div>

            <div className="info-card" style={{ display: 'flex', gap: '1rem', background: 'var(--card)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--r)' }}>
              <div className="info-icon" style={{ fontSize: '1.5rem' }}>📧</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text)' }}>Email</h4>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.5 }}>
                  contact@proexcel.ma<br />commandes@proexcel.ma<br />
                  <span style={{ color: 'var(--text2)', fontSize: '.78rem' }}>Réponse sous 24h ouvrables</span>
                </p>
              </div>
            </div>

            <div className="info-card" style={{ display: 'flex', gap: '1rem', background: 'var(--card)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--r)' }}>
              <div className="info-icon" style={{ fontSize: '1.5rem' }}>🕐</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text)' }}>Horaires d&apos;Ouverture</h4>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.5 }}>
                  Lundi – Vendredi: <strong>08:30 – 19:00</strong><br />
                  Samedi: <strong>09:00 – 18:00</strong><br />
                  Dimanche: <strong>10:00 – 14:00</strong>
                </p>
              </div>
            </div>

            <div className="info-card" style={{ display: 'flex', gap: '1rem', background: 'var(--card)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--r)' }}>
              <div className="info-icon" style={{ fontSize: '1.5rem' }}>🚚</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text)' }}>Livraison</h4>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.5 }}>
                  Livraison partout au Maroc en <strong>24-48h</strong><br />
                  Gratuite pour toute commande ≥ <strong>499 DH</strong><br />
                  Frais de port: <strong>25 DH</strong> sinon
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}
