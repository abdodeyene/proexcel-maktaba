'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LangContext'

const sections = {
  fr: [
    {
      id: 'utilisation',
      icon: '📋',
      title: "Conditions d'utilisation",
      content: `En accédant au site ProExcel Maktaba, vous acceptez pleinement et sans réserve les présentes conditions d'utilisation. Ces conditions régissent votre accès et votre utilisation de notre site web, de nos services et de nos produits.

ProExcel Maktaba se réserve le droit de modifier ces conditions à tout moment. Les modifications entreront en vigueur dès leur publication sur le site. Il vous appartient de consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.

L'utilisation continue du site après publication des modifications vaut acceptation des nouvelles conditions.`
    },
    {
      id: 'commandes',
      icon: '🛒',
      title: 'Commandes & Paiements',
      content: `Toute commande passée sur ProExcel Maktaba constitue un contrat de vente entre vous et notre boutique. Nous acceptons les modes de paiement suivants :

• **CMI / Carte bancaire** – Paiement sécurisé en ligne
• **Virement bancaire** – Virement à nos coordonnées bancaires
• **Paiement à la livraison** – Cash uniquement

Les prix affichés sont en Dirhams Marocains (DH) et incluent la TVA applicable. Nous nous réservons le droit de modifier les prix à tout moment, mais les commandes déjà confirmées ne seront pas affectées.

La disponibilité des produits est indiquée sur chaque fiche produit. En cas d'indisponibilité après confirmation de votre commande, nous vous contacterons dans les meilleurs délais.`
    },
    {
      id: 'livraison',
      icon: '🚚',
      title: 'Livraison & Expédition',
      content: `**Délais de livraison :** 24 à 48 heures ouvrables après confirmation de paiement, partout au Maroc.

**Frais de livraison :**
• Livraison gratuite pour toute commande ≥ 499 DH
• 25 DH pour les commandes inférieures à 499 DH

**Zones de livraison :** Nous livrons dans toutes les villes du Maroc via nos partenaires de transport (Amana, Chronopost, CTM...).

**Suivi de commande :** Un numéro de suivi vous sera communiqué par SMS ou email dès l'expédition de votre colis.

En cas de retard ou de problème de livraison, contactez notre service client dans les 72 heures suivant la date de livraison prévue.`
    },
    {
      id: 'retour',
      icon: '🔄',
      title: 'Politique de retour',
      content: `**Délai de retour :** 7 jours à compter de la réception du colis.

**Conditions de retour :**
• Le produit doit être dans son état d'origine, non utilisé et non endommagé
• Le produit doit être accompagné de son emballage original et de la facture d'achat
• Les livres numériques et les téléchargements ne sont pas éligibles au retour

**Procédure de retour :**
1. Contactez notre service client par email ou téléphone
2. Obtenez votre numéro de retour autorisé (RMA)
3. Renvoyez le produit à notre adresse avec le numéro RMA visible
4. Le remboursement sera effectué sous 5 à 10 jours ouvrables

**Remboursement :** Effectué par le même moyen de paiement utilisé lors de la commande. Les frais de retour sont à la charge du client sauf en cas d'erreur de notre part.`
    },
    {
      id: 'confidentialite',
      icon: '🔒',
      title: 'Confidentialité & Données personnelles',
      content: `Conformément à la loi 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel au Maroc, ProExcel Maktaba s'engage à protéger vos données personnelles.

**Données collectées :** Nom, prénom, adresse email, numéro de téléphone, adresse de livraison et historique de commandes.

**Utilisation des données :**
• Traitement et suivi de vos commandes
• Communication concernant votre compte
• Envoi de newsletters (avec votre consentement)
• Amélioration de nos services

**Vos droits :** Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de vos données. Pour exercer ces droits, contactez-nous à : privacy@proexcel.ma

**Cookies :** Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.`
    },
    {
      id: 'faq',
      icon: '❓',
      title: 'FAQ – Questions fréquentes',
      content: `**Comment passer une commande ?**
Parcourez notre catalogue, ajoutez les articles souhaités au panier, puis procédez au paiement en renseignant vos informations de livraison.

**Puis-je modifier ou annuler ma commande ?**
Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa confirmation. Après ce délai, la commande est en cours de traitement.

**Les livres sont-ils conformes aux programmes officiels ?**
Oui, tous nos livres sont conformes aux programmes du Ministère de l'Éducation Nationale marocain pour l'année scolaire en cours.

**Comment suivre ma commande ?**
Après expédition, vous recevrez un SMS avec votre numéro de suivi. Vous pouvez également contacter notre service client.

**Que faire si je reçois un article endommagé ?**
Contactez-nous immédiatement avec des photos du dommage. Nous vous enverrons un remplacement sous 48 heures.`
    }
  ],
  ar: [
    {
      id: 'utilisation',
      icon: '📋',
      title: 'شروط الاستخدام',
      content: `بالوصول إلى موقع برو إكسيل مكتبة، فإنك توافق بشكل كامل وغير مشروط على شروط الاستخدام هذه. تحكم هذه الشروط وصولك واستخدامك لموقعنا الإلكتروني وخدماتنا ومنتجاتنا.

تحتفظ برو إكسيل مكتبة بحق تعديل هذه الشروط في أي وقت. تدخل التعديلات حيز التنفيذ فور نشرها على الموقع. يتعين عليك مراجعة هذه الصفحة بانتظام للاطلاع على أي تعديلات.

يُعدّ الاستمرار في استخدام الموقع بعد نشر التعديلات قبولاً للشروط الجديدة.`
    },
    {
      id: 'commandes',
      icon: '🛒',
      title: 'الطلبات والمدفوعات',
      content: `كل طلب يُقدَّم على موقع برو إكسيل مكتبة يُشكّل عقد بيع بينك وبين متجرنا. نقبل طرق الدفع التالية:

• **بطاقة مصرفية (CMI)** – دفع آمن عبر الإنترنت
• **تحويل بنكي** – تحويل إلى بياناتنا البنكية
• **الدفع عند التسليم** – نقداً فقط

الأسعار المعروضة بالدرهم المغربي (DH) وتشمل الضريبة على القيمة المضافة. نحتفظ بحق تعديل الأسعار في أي وقت، لكن الطلبات المؤكدة بالفعل لن تتأثر.

يُبيَّن توفر المنتجات في كل صفحة منتج. في حالة عدم التوفر بعد تأكيد طلبك، سنتواصل معك في أقرب وقت ممكن.`
    },
    {
      id: 'livraison',
      icon: '🚚',
      title: 'التوصيل والشحن',
      content: `**مواعيد التوصيل:** من 24 إلى 48 ساعة عمل بعد تأكيد الدفع، في جميع أنحاء المغرب.

**تكاليف التوصيل:**
• توصيل مجاني لكل طلب يساوي أو يتجاوز 499 درهم
• 25 درهم للطلبات التي تقل عن 499 درهم

**مناطق التوصيل:** نوصّل إلى جميع مدن المغرب عبر شركاء النقل لدينا (أمانة، كرونوبوست، CTM...).

**تتبع الطلب:** سيتم إرسال رقم التتبع عبر الرسائل القصيرة أو البريد الإلكتروني فور شحن طلبك.

في حالة التأخر أو مشاكل التوصيل، اتصل بخدمة العملاء خلال 72 ساعة من تاريخ التسليم المتوقع.`
    },
    {
      id: 'retour',
      icon: '🔄',
      title: 'سياسة الإرجاع',
      content: `**مدة الإرجاع:** 7 أيام من تاريخ استلام الطلب.

**شروط الإرجاع:**
• يجب أن يكون المنتج في حالته الأصلية، غير مستخدم وغير تالف
• يجب إرفاق المنتج بعبوته الأصلية وفاتورة الشراء
• الكتب الرقمية والتنزيلات غير مؤهلة للإرجاع

**إجراء الإرجاع:**
1. تواصل مع خدمة العملاء عبر البريد الإلكتروني أو الهاتف
2. احصل على رقم الإرجاع المصرح به (RMA)
3. أعد إرسال المنتج إلى عنواننا مع ظهور رقم RMA
4. سيتم الاسترداد خلال 5 إلى 10 أيام عمل

**الاسترداد:** يتم بنفس طريقة الدفع المستخدمة عند الطلب. تكاليف الإرجاع على عاتق العميل إلا في حالة حدوث خطأ من جهتنا.`
    },
    {
      id: 'confidentialite',
      icon: '🔒',
      title: 'الخصوصية وحماية البيانات الشخصية',
      content: `وفقاً للقانون 09-08 المتعلق بحماية الأشخاص الطبيعيين فيما يخص معالجة البيانات ذات الطابع الشخصي بالمغرب، تلتزم برو إكسيل مكتبة بحماية بياناتك الشخصية.

**البيانات المجمعة:** الاسم، الاسم الشخصي، البريد الإلكتروني، رقم الهاتف، عنوان التوصيل وسجل الطلبات.

**استخدام البيانات:**
• معالجة ومتابعة طلباتك
• التواصل بشأن حسابك
• إرسال النشرات الإخبارية (بموافقتك)
• تحسين خدماتنا

**حقوقك:** لديك حق الوصول إلى بياناتك وتصحيحها وحذفها والاعتراض على معالجتها. لممارسة هذه الحقوق، تواصل معنا على: privacy@proexcel.ma

**ملفات تعريف الارتباط (الكوكيز):** يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربتك. يمكنك تعطيلها في إعدادات متصفحك.`
    },
    {
      id: 'faq',
      icon: '❓',
      title: 'الأسئلة الشائعة',
      content: `**كيف أقوم بتقديم طلب؟**
تصفح كتالوجنا، أضف العناصر المطلوبة إلى السلة، ثم انتقل إلى الدفع مع إدخال معلومات التوصيل.

**هل يمكنني تعديل أو إلغاء طلبي؟**
يمكنك تعديل أو إلغاء طلبك خلال ساعتين من تأكيده. بعد هذه المدة، يكون الطلب قيد المعالجة.

**هل الكتب متوافقة مع المناهج الرسمية؟**
نعم، جميع كتبنا متوافقة مع مناهج وزارة التعليم الوطني المغربية للسنة الدراسية الحالية.

**كيف أتابع طلبي؟**
بعد الشحن، ستتلقى رسالة قصيرة برقم التتبع. يمكنك أيضاً التواصل مع خدمة العملاء.

**ماذا أفعل إذا استلمت منتجاً تالفاً؟**
تواصل معنا فوراً مع صور الضرر. سنرسل لك استبدالاً خلال 48 ساعة.`
    }
  ]
}

export default function TermsPage() {
  const { lang } = useLang()
  const [activeSection, setActiveSection] = useState('utilisation')

  const currentSections = sections[lang as keyof typeof sections] ?? sections.fr
  const activeData = currentSections.find(s => s.id === activeSection)

  const labels = {
    fr: {
      breadHome: 'Accueil', breadTerms: 'Conditions',
      heroTitle: 'Conditions & Politiques',
      heroSub: 'Tout ce que vous devez savoir sur l\'utilisation de ProExcel Maktaba',
      lastUpdate: 'Dernière mise à jour',
      contact: 'Des questions ? Contactez-nous',
      contactBtn: 'Nous contacter'
    },
    ar: {
      breadHome: 'الرئيسية', breadTerms: 'الشروط',
      heroTitle: 'الشروط والسياسات',
      heroSub: 'كل ما تحتاج معرفته حول استخدام برو إكسيل مكتبة',
      lastUpdate: 'آخر تحديث',
      contact: 'لديك أسئلة؟ تواصل معنا',
      contactBtn: 'اتصل بنا'
    }
  }
  const L = labels[lang as keyof typeof labels] ?? labels.fr

  const formatContent = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, i) => {
      if (!line.trim()) return <br key={i} />
      // Bold text **...**
      const parts = line.split(/\*\*(.*?)\*\*/)
      return (
        <p key={i} style={{ marginBottom: '0.6rem', lineHeight: 1.8 }}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <strong key={j} style={{ color: 'var(--text)', fontWeight: 700 }}>{part}</strong>
              : part
          )}
        </p>
      )
    })
  }

  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #070B14 0%, #0e1e3a 60%, #070B14 100%)',
        minHeight: '260px', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(232,53,42,0.08) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem', position: 'relative', zIndex: 1, width: '100%' }}>
          <div className="breadcrumb-nav" style={{ marginBottom: '1.25rem' }}>
            <Link href="/" style={{ color: 'var(--text2)' }}>{L.breadHome}</Link>
            <span style={{ color: 'var(--text2)' }}>›</span>
            <span style={{ color: 'var(--primary)' }}>{L.breadTerms}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#fff', marginBottom: '0.75rem', fontWeight: 800 }}>
            {L.heroTitle}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', maxWidth: '560px' }}>
            {L.heroSub}
          </p>
          <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📅</span>
            {L.lastUpdate}: {lang === 'fr' ? '08 mai 2026' : '08 مايو 2026'}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="terms-layout">

        {/* Sidebar Nav */}
        <div className="terms-sidebar">
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            {currentSections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  width: '100%', textAlign: lang === 'ar' ? 'right' : 'left',
                  padding: '0.9rem 1.25rem', background: activeSection === s.id ? 'rgba(232,53,42,0.08)' : 'transparent',
                  border: 'none', borderLeft: lang === 'fr' ? (activeSection === s.id ? '3px solid var(--primary)' : '3px solid transparent') : 'none',
                  borderRight: lang === 'ar' ? (activeSection === s.id ? '3px solid var(--primary)' : '3px solid transparent') : 'none',
                  color: activeSection === s.id ? 'var(--primary)' : 'var(--text2)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  fontFamily: lang === 'ar' ? 'var(--font-arabic)' : 'var(--font-latin)',
                  fontWeight: activeSection === s.id ? 700 : 500,
                  fontSize: '0.88rem',
                  flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
                }}
              >
                <span>{s.icon}</span>
                <span>{s.title}</span>
              </button>
            ))}
          </div>

          {/* Contact CTA */}
          <div style={{
            marginTop: '1.5rem', background: 'linear-gradient(135deg, rgba(232,53,42,0.08), rgba(232,53,42,0.04))',
            border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem', textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>💬</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>{L.contact}</p>
            <Link href="/contact" className="btn-primary" style={{ display: 'inline-block', fontSize: '0.82rem', padding: '0.55rem 1.25rem' }}>
              {L.contactBtn}
            </Link>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeData && (
            <div
              key={activeData.id}
              className="terms-content-card"
              style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: '20px', padding: '2.5rem',
                animation: 'fadeInUp 0.3s ease'
              }}
            >
              {/* Section Header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                marginBottom: '2rem', paddingBottom: '1.5rem',
                borderBottom: '1px solid var(--border)',
                flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: 'rgba(232,53,42,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0
                }}>
                  {activeData.icon}
                </div>
                <h2 style={{
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)', fontWeight: 800,
                  fontFamily: lang === 'ar' ? 'var(--font-heading-arabic)' : 'var(--font-heading-latin)'
                }}>
                  {activeData.title}
                </h2>
              </div>

              {/* Content */}
              <div style={{
                color: 'var(--text2)', lineHeight: 1.85,
                fontFamily: lang === 'ar' ? 'var(--font-arabic)' : 'var(--font-latin)',
                direction: lang === 'ar' ? 'rtl' : 'ltr',
                textAlign: lang === 'ar' ? 'right' : 'left'
              }}>
                {formatContent(activeData.content)}
              </div>
            </div>
          )}

          {/* All Sections Mini (below active) */}
          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {currentSections.filter(s => s.id !== activeSection).map(s => (
              <button
                key={s.id}
                onClick={() => { setActiveSection(s.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '1rem', cursor: 'pointer',
                  transition: 'all 0.2s', textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)'
                  ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
                  ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                <span style={{
                  fontSize: '0.78rem', color: 'var(--text2)', fontWeight: 500,
                  fontFamily: lang === 'ar' ? 'var(--font-arabic)' : 'var(--font-latin)'
                }}>{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

    </>
  )
}
