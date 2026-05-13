'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LangContext'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Truck, 
  Send,
  MessageCircle,
  CheckCircle
} from '@/components/LucideIcons'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const { lang, t, isRTL } = useLang()
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const T = {
    breadHome: t('Accueil', 'الرئيسية'),
    breadContact: t('Contact', 'اتصل بنا'),
    heroTitle: t('تواصل معنا', 'تواصل معنا'), // Force Arabic for the title if desired, but let's keep it consistent
    heroTitleTrans: t('Contactez-nous', 'تواصل معنا'),
    heroSub: t('Notre équipe est disponible pour répondre à toutes vos questions', 'فريقنا متاح للإجابة على جميع استفساراتك'),
    formTitle: t('Envoyez-nous', 'أرسل لنا'), 
    formTitle2: t('un message', 'رسالة'),
    formSub: t('Nous répondrons dans les 24 heures ouvrables', 'سنرد خلال 24 ساعة عمل'),
    first: t('Prénom', 'الاسم الأول'), 
    last: t('Nom', 'اسم العائلة'),
    emailLabel: t('Email', 'البريد الإلكتروني'), 
    phoneLabel: t('Téléphone', 'الهاتف'),
    subject: t('الموضوع', 'الموضوع'), 
    messageLabel: t('Message', 'الرسالة'),
    opts: lang === 'ar'
      ? ['الطلب والتوصيل', 'توفر كتاب', 'الإرجاع والاسترداد', 'سؤال عام', 'شراكة']
      : ['Commande & Livraison', "Disponibilité d'un livre", 'Retour & Remboursement', 'Question générale', 'Partenariat'],
    msgPlaceholder: t('Décrivez votre demande en détail…', 'صف طلبك بالتفصيل…'),
    send: t('Envoyer le message ›', 'إرسال الرسالة ›'),
    sentMsg: t('Message envoyé avec succès ! Nous vous répondrons sous 24 heures.', 'تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة.'),
    addrTitle: t('Notre Adresse', 'عنواننا'), 
    addrVal: settings?.store_address || t('Bouznika, Maroc', 'بوزنيقة، المغرب'), 
    mapLink: t('Voir sur la carte', 'عرض على الخريطة'),
    phoneTitle: t('Téléphone & WhatsApp', 'الهاتف وواتساب'), 
    phoneVal: settings?.store_phone || '+212 6 12 34 56 78', 
    phoneHours: t('Lun–Sam: 08:30–19:00', 'الاثنين–السبت: 08:30–19:00'),
    emailTitle: t('Email', 'البريد الإلكتروني'), 
    emailVal: settings?.store_email || 'contact@proexcel.ma', 
    emailNote: t('Réponse sous 24h ouvrables', 'رد خلال 24 ساعة عمل'),
    hoursTitle: t('Horaires d\'Ouverture', 'ساعات العمل'),
    deliveryTitle: t('Livraison', 'التوصيل'),
    deliveryInfo: t('Partout au Maroc en 24-48h', 'في جميع أنحاء المغرب خلال 24-48 ساعة'), 
    deliveryFree: t('Gratuite ≥ 499 DH', 'مجاني عند الطلب ≥ 499 درهم'), 
    deliveryFees: t('Frais: 25 DH sinon', 'رسوم: 25 درهم خلاف ذلك'),
  }

  const days = [
    { key: 'hours_mon', fr: 'Lundi', ar: 'الاثنين' },
    { key: 'hours_tue', fr: 'Mardi', ar: 'الثلاثاء' },
    { key: 'hours_wed', fr: 'Mercredi', ar: 'الأربعاء' },
    { key: 'hours_thu', fr: 'Jeudi', ar: 'الخميس' },
    { key: 'hours_fri', fr: 'Vendredi', ar: 'الجمعة' },
    { key: 'hours_sat', fr: 'Samedi', ar: 'السبت' },
    { key: 'hours_sun', fr: 'Dimanche', ar: 'الأحد' },
  ]

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="breadcrumb-nav">
            <Link href="/">{T.breadHome}</Link>
            <span>›</span>
            <span>{T.breadContact}</span>
          </div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <span style={{ color: 'var(--primary)', display: 'flex' }}><MessageCircle size={42} /></span>
            {T.heroTitleTrans}
          </h1>
          <p>{T.heroSub}</p>
        </div>
      </div>

      <div className="contact-layout" dir={isRTL ? 'rtl' : 'ltr'}>
        
        {/* Form */}
        <div className="contact-form-card">
          {sent ? (
            <div style={{
              textAlign: 'center', padding: '4rem 2rem',
              background: 'rgba(34,197,94,0.06)', borderRadius: '24px',
              border: '1px solid rgba(34,197,94,0.25)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem'
            }}>
              <div style={{ color: 'var(--green)', transform: 'scale(1.2)' }}><CheckCircle size={48} /></div>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--green)', fontWeight: 800 }}>{lang === 'fr' ? 'Message envoyé !' : 'تم الإرسال!'}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.95rem' }}>{T.sentMsg}</p>
              </div>
            </div>
          ) : (
            <>
              <h2>{T.formTitle}<br /><span className="text-gold">{T.formTitle2}</span></h2>
              <p className="subtitle">{T.formSub}</p>

              <form onSubmit={handleSubmit}>
                <div className="form-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                    <label className="form-label">{T.first}</label>
                    <input className="form-input" type="text" placeholder="Mohammed" required />
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                    <label className="form-label">{T.last}</label>
                    <input className="form-input" type="text" placeholder="Alami" required />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">{T.emailLabel}</label>
                  <input className="form-input" type="email" placeholder="mohammed@example.com" required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">{T.phoneLabel}</label>
                  <input className="form-input" type="tel" placeholder="+212 6 XX XX XX XX" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">{T.subject}</label>
                  <select className="form-input" style={{ width: '100%' }}>
                    {T.opts.map((o: string) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">{T.messageLabel}</label>
                  <textarea className="form-input" placeholder={T.msgPlaceholder} required style={{ minHeight: '120px' }}></textarea>
                </div>
                
                <button type="submit" className="btn-primary proexcel-btn-contact-send" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}>
                  {T.send}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Info Cards */}
        <div>
          <div className="info-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div className="info-card">
              <div className="info-icon"><MapPin size={24} /></div>
              <div>
                <h4>{T.addrTitle}</h4>
                <p>
                  {T.addrVal}<br />
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(T.addrVal)}`} target="_blank" rel="noreferrer" className="proexcel-btn-contact-map" style={{ color: 'var(--primary)', fontSize: '.8rem', textDecoration: 'none' }}>
                    <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                    {T.mapLink}
                  </a>
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"><Phone size={24} /></div>
              <div>
                <h4>{T.phoneTitle}</h4>
                <p>
                  {T.phoneVal}<br />
                  <span style={{ color: 'var(--text2)', fontSize: '.78rem' }}>{T.phoneHours}</span>
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"><Mail size={24} /></div>
              <div>
                <h4>{T.emailTitle}</h4>
                <p>
                  {T.emailVal}<br />
                  <span style={{ color: 'var(--text2)', fontSize: '.78rem' }}>{T.emailNote}</span>
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"><Clock size={24} /></div>
              <div>
                <h4>{T.hoursTitle}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text2)', marginTop: '0.5rem' }}>
                  {days.map(day => {
                    const time = settings?.[day.key] || (lang === 'ar' ? 'مغلق' : 'Fermé')
                    return (
                      <div key={day.key} style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                        <span>{lang === 'ar' ? day.ar : day.fr}</span>
                        <span style={{ fontWeight: 600, color: (time === 'Fermé' || time === 'مغلق') ? 'var(--red)' : 'var(--text)' }}>{time}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"><Truck size={24} /></div>
              <div>
                <h4>{T.deliveryTitle}</h4>
                <p>
                  {T.deliveryInfo}<br />
                  <strong>{T.deliveryFree}</strong><br />
                  {T.deliveryFees}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Map Embed */}
      {settings?.store_map_iframe && (
        <div className="contact-map-wrap" style={{ marginTop: '3rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div 
            style={{ width: '100%', height: '450px' }} 
            dangerouslySetInnerHTML={{ __html: settings.store_map_iframe.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') }} 
          />
        </div>
      )}
    </>
  )
}

