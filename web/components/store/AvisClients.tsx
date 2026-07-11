'use client'

import React from 'react'
import { useLang } from '@/components/LangContext'

export default function AvisClients() {
  const { lang } = useLang()
  const isAr = lang === 'ar'

  const t = {
    fr: {
      tag: "Avis Clients",
      title: "Ce que nos clients disent",
      testimonials1: [
        { id: 1, name: "Fatima Z.", city: "Casablanca", text: "Livraison rapide et produits de qualité. Je commande toujours pour mes enfants ici.", rating: 5 },
        { id: 2, name: "Youssef M.", city: "Rabat", text: "Catalogue très riche, programme officiel bien respecté. Service client au top!", rating: 5 },
        { id: 3, name: "Amina S.", city: "Marrakech", text: "Plateforme très pratique pour commander toutes les fournitures scolaires.", rating: 4 },
        { id: 4, name: "Jean P.", city: "Fès", text: "Les livres sont arrivés parfaits et à temps. Emballage soigné. Je recommande.", rating: 5 },
        { id: 5, name: "Laila K.", city: "Tanger", text: "Meilleur site pour les affaires scolaires de mes enfants. Tout est là.", rating: 5 },
      ],
      testimonials2: [
        { id: 6, name: "Omar D.", city: "Oujda", text: "Très satisfait de ma première commande. Les prix sont imbattables.", rating: 4 },
        { id: 7, name: "Chaimaa L.", city: "Agadir", text: "Expérience client excellente. Je reviendrai certainement pour la rentrée.", rating: 5 },
        { id: 8, name: "Karim B.", city: "Tanger", text: "Large choix de produits, prix compétitifs. Livraison en 24h comme promis.", rating: 4 },
        { id: 9, name: "Sara H.", city: "Meknès", text: "Service après-vente très réactif. Ils ont réglé mon problème en quelques minutes.", rating: 5 },
        { id: 10, name: "Mehdi T.", city: "Kénitra", text: "J'ai trouvé tous les manuels scolaires en un seul endroit. Un grand gain de temps.", rating: 5 },
      ]
    },
    ar: {
      tag: "آراء العملاء",
      title: "ما يقوله عملاؤنا",
      testimonials1: [
        { id: 1, name: "فاطمة ز.", city: "الدار البيضاء", text: "توصيل سريع ومنتجات ذات جودة عالية. أطلب دائما لأطفالي من هنا.", rating: 5 },
        { id: 2, name: "يوسف م.", city: "الرباط", text: "كتالوج غني جدا، البرنامج الرسمي محترم بدقة. خدمة عملاء ممتازة!", rating: 5 },
        { id: 3, name: "أمينة س.", city: "مراكش", text: "منصة عملية جدا لطلب جميع اللوازم المدرسية.", rating: 4 },
        { id: 4, name: "جان ب.", city: "فاس", text: "الكتب وصلت بحالة ممتازة وفي الوقت المحدد. تغليف أنيق. أوصي به.", rating: 5 },
        { id: 5, name: "ليلى ك.", city: "طنجة", text: "أفضل موقع للأدوات المدرسية لأطفالي. كل شيء متوفر هنا.", rating: 5 },
      ],
      testimonials2: [
        { id: 6, name: "عمر د.", city: "وجدة", text: "راض جدا عن طلبي الأول. الأسعار لا تقبل المنافسة.", rating: 4 },
        { id: 7, name: "شيماء ل.", city: "أكادير", text: "تجربة عملاء ممتازة. سأعود بالتأكيد في الدخول المدرسي القادم.", rating: 5 },
        { id: 8, name: "كريم ب.", city: "طنجة", text: "خيار واسع من المنتجات، أسعار تنافسية. توصيل في 24 ساعة كما وعدتم.", rating: 4 },
        { id: 9, name: "سارة هـ.", city: "مكناس", text: "خدمة ما بعد البيع سريعة التجاوب. قاموا بحل مشكلتي في بضع دقائق.", rating: 5 },
        { id: 10, name: "مهدي ط.", city: "القنيطرة", text: "وجدت جميع الكتب المدرسية في مكان واحد. توفير كبير للوقت.", rating: 5 },
      ]
    }
  }

  const content = isAr ? t.ar : t.fr

  const getGradient = (id: number) => {
    const gradients = [
      "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)",
      "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
      "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
      "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
      "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    ]
    return gradients[id % gradients.length]
  }

  const TestimonialCard = ({ item }: { item: any }) => (
    <div className="avis-card" dir={isAr ? "rtl" : "ltr"}>
      <div className="stars">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</div>
      <p className="quote">"{item.text}"</p>
      <div className="user-info">
        <div className="avatar" style={{ background: getGradient(item.id) }}>
          {item.name.charAt(0)}
        </div>
        <div className="user-text">
          <div className="name">{item.name}</div>
          <div className="city">{item.city}</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="avis-section-wrapper" style={{ background: 'var(--bg)', width: '100%', borderTop: '1px solid var(--border)' }}>
      <section className="avis-section">
        <style>{`
          .avis-section {
            padding: 60px 0;
            overflow: hidden;
            width: 100%;
            font-family: 'Sora', sans-serif;
            background: transparent;
          }
          .marquee-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
            width: 100%;
          }
          .marquee-row {
            display: flex;
            width: 100%;
          }
          .marquee-content {
            display: flex;
            width: max-content;
          }
          .marquee-content.scroll-left {
            animation: scroll-left 40s linear infinite;
          }
          .marquee-content.scroll-right {
            animation: scroll-right 40s linear infinite;
          }
          .marquee-group {
            display: flex;
            gap: 16px;
            padding-right: 16px;
            flex-shrink: 0;
          }
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-25%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(-25%); }
            100% { transform: translateX(0); }
          }
          
          .avis-card {
            width: 280px;
            background: rgba(150, 150, 150, 0.05);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(150, 150, 150, 0.15);
            border-radius: 20px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            color: var(--text);
          }
          .stars {
            color: #fbbf24;
            font-size: 1.1rem;
            letter-spacing: 2px;
          }
          .quote {
            font-style: italic;
            font-size: 0.95rem;
            line-height: 1.5;
            flex-grow: 1;
            margin: 0;
            opacity: 0.9;
          }
          .user-info {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.2rem;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
          }
          .user-text {
            display: flex;
            flex-direction: column;
          }
          .name {
            font-weight: 700;
            font-size: 0.95rem;
          }
          .city {
            font-size: 0.8rem;
            opacity: 0.6;
          }
        `}</style>

        <div className="section-header scroll-reveal" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="section-tag">{content.tag}</div>
          <h2 className="section-title">{content.title}</h2>
        </div>

        {/* ALWAYS use LTR for the marquee container so that the translation math is 100% reliable, regardless of site language */}
        <div className="marquee-container" dir="ltr">
          <div className="marquee-row">
            <div className="marquee-content scroll-left">
              <div className="marquee-group">
                {content.testimonials1.map((item) => <TestimonialCard key={item.id} item={item} />)}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {content.testimonials1.map((item) => <TestimonialCard key={'dup1-' + item.id} item={item} />)}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {content.testimonials1.map((item) => <TestimonialCard key={'dup2-' + item.id} item={item} />)}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {content.testimonials1.map((item) => <TestimonialCard key={'dup3-' + item.id} item={item} />)}
              </div>
            </div>
          </div>

          <div className="marquee-row">
            <div className="marquee-content scroll-right">
              <div className="marquee-group">
                {content.testimonials2.map((item) => <TestimonialCard key={item.id} item={item} />)}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {content.testimonials2.map((item) => <TestimonialCard key={'dup1-' + item.id} item={item} />)}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {content.testimonials2.map((item) => <TestimonialCard key={'dup2-' + item.id} item={item} />)}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {content.testimonials2.map((item) => <TestimonialCard key={'dup3-' + item.id} item={item} />)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
