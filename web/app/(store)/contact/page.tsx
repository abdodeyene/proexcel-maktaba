'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LangContext'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const { lang } = useLang()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const t = {
    fr: {
      breadHome: 'Accueil', breadContact: 'Contact',
      heroTitle: '📬 Contactez-nous',
      heroSub: 'Notre équipe est disponible pour répondre à toutes vos questions',
      formTitle: 'Envoyez-nous', formTitle2: 'un message',
      formSub: 'Nous répondrons dans les 24 heures ouvrables',
      first: 'Prénom', last: 'Nom',
      email: 'Email', phone: 'Téléphone',
      subject: 'Sujet', message: 'Message',
      opts: ['Commande & Livraison', 'Disponibilité d\'un livre', 'Retour & Remboursement', 'Question générale', 'Partenariat'],
      msgPlaceholder: 'Décrivez votre demande en détail…',
      send: 'Envoyer le message ›',
      sentMsg: 'Message envoyé avec succès ! Nous vous répondrons sous 24 heures.',
      addrTitle: 'Notre Adresse', addrVal: 'Bouznika, Maroc', mapLink: 'Voir sur la carte',
      phoneTitle: 'Téléphone & WhatsApp', phoneVal: '+212 6 12 34 56 78', phoneHours: 'Lun–Sam: 08:30–19:00',
      emailTitle: 'Email', emailVal: 'contact@proexcel.ma', emailNote: 'Réponse sous 24h ouvrables',
      hoursTitle: 'Horaires d\'Ouverture',
      hours: [['Lundi – Vendredi', '08:30 – 19:00'], ['Samedi', '09:00 – 18:00'], ['Dimanche', '10:00 – 14:00']],
      deliveryTitle: 'Livraison',
      deliveryInfo: 'Partout au Maroc en 24-48h', deliveryFree: 'Gratuite ≥ 499 DH', deliveryFees: 'Frais: 25 DH sinon',
    },
    ar: {
      breadHome: 'الرئيسية', breadContact: 'اتصل بنا',
      heroTitle: '📬 تواصل معنا',
      heroSub: 'فريقنا متاح للإجابة على جميع استفساراتك',
      formTitle: 'أرسل لنا', formTitle2: 'رسالة',
      formSub: 'سنرد خلال 24 ساعة عمل',
      first: 'الاسم الأول', last: 'اسم العائلة',
      email: 'البريد الإلكتروني', phone: 'الهاتف',
      subject: 'الموضوع', message: 'الرسالة',
      opts: ['الطلب والتوصيل', 'توفر كتاب', 'الإرجاع والاسترداد', 'سؤال عام', 'شراكة'],
      msgPlaceholder: 'صف طلبك بالتفصيل…',
      send: 'إرسال الرسالة ›',
      sentMsg: 'تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة.',
      addrTitle: 'عنواننا', addrVal: 'بوزنيقة، المغرب', mapLink: 'عرض على الخريطة',
      phoneTitle: 'الهاتف وواتساب', phoneVal: '+212 6 12 34 56 78', phoneHours: 'الاثنين–السبت: 08:30–19:00',
      emailTitle: 'البريد الإلكتروني', emailVal: 'contact@proexcel.ma', emailNote: 'رد خلال 24 ساعة عمل',
      hoursTitle: 'ساعات العمل',
      hours: [['الاثنين – الجمعة', '08:30 – 19:00'], ['السبت', '09:00 – 18:00'], ['الأحد', '10:00 – 14:00']],
      deliveryTitle: 'التوصيل',
      deliveryInfo: 'في جميع أنحاء المغرب خلال 24-48 ساعة', deliveryFree: 'مجاني عند الطلب ≥ 499 درهم', deliveryFees: 'رسوم: 25 درهم خلاف ذلك',
    }
  }
  const c = t[lang]

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="breadcrumb-nav">
            <Link href="/">{c.breadHome}</Link>
            <span>›</span>
            <span>{c.breadContact}</span>
          </div>
          <h1>{c.heroTitle}</h1>
          <p>{c.heroSub}</p>
        </div>
      </div>

      <div className="contact-layout">
        
        {/* Form */}
        <div className="contact-form-card">
          {sent ? (
            <div style={{
              textAlign: 'center', padding: '3rem 1rem',
              background: 'rgba(34,197,94,0.06)', borderRadius: '12px',
              border: '1px solid rgba(34,197,94,0.3)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: 'var(--green)' }}>{lang === 'fr' ? 'Message envoyé !' : 'تم الإرسال!'}</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{c.sentMsg}</p>
            </div>
          ) : (
            <>
              <h2>{c.formTitle}<br /><span className="text-gold">{c.formTitle2}</span></h2>
              <p className="subtitle">{c.formSub}</p>

              <form onSubmit={handleSubmit}>
                <div className="form-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                    <label className="form-label">{c.first}</label>
                    <input className="form-input" type="text" placeholder="Mohammed" required />
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                    <label className="form-label">{c.last}</label>
                    <input className="form-input" type="text" placeholder="Alami" required />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">{c.email}</label>
                  <input className="form-input" type="email" placeholder="mohammed@example.com" required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">{c.phone}</label>
                  <input className="form-input" type="tel" placeholder="+212 6 XX XX XX XX" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">{c.subject}</label>
                  <select className="form-input" style={{ width: '100%' }}>
                    {c.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">{c.message}</label>
                  <textarea className="form-input" placeholder={c.msgPlaceholder} required style={{ minHeight: '120px' }}></textarea>
                </div>
                
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}>
                  {c.send}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Info Cards */}
        <div>
          <div className="info-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div className="info-card">
              <div className="info-icon">📍</div>
              <div>
                <h4>{c.addrTitle}</h4>
                <p>
                  {c.addrVal}<br />
                  <a href="https://maps.google.com/?q=Bouznika+Maroc" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: '.8rem', textDecoration: 'none' }}>
                    📍 {c.mapLink}
                  </a>
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <div>
                <h4>{c.phoneTitle}</h4>
                <p>
                  {c.phoneVal}<br />
                  <span style={{ color: 'var(--text2)', fontSize: '.78rem' }}>{c.phoneHours}</span>
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">📧</div>
              <div>
                <h4>{c.emailTitle}</h4>
                <p>
                  {c.emailVal}<br />
                  <span style={{ color: 'var(--text2)', fontSize: '.78rem' }}>{c.emailNote}</span>
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🕐</div>
              <div>
                <h4>{c.hoursTitle}</h4>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.5 }}>
                  {c.hours.map(([day, time]) => (
                    <span key={day} style={{ display: 'block' }}>
                      {day}: <strong style={{ color: 'var(--text)' }}>{time}</strong>
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🚚</div>
              <div>
                <h4>{c.deliveryTitle}</h4>
                <p>
                  {c.deliveryInfo}<br />
                  <strong>{c.deliveryFree}</strong><br />
                  {c.deliveryFees}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}
