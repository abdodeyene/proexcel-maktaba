'use client'
import { useEffect, useState } from 'react'
import {
  BUTTON_STYLE_PAGES,
  ButtonStyle,
  buildButtonStyleSheet,
  sanitizeButtonStyles,
} from '@/lib/buttonStyles'
import { 
  Palette, 
  Store, 
  Layout, 
  Sparkles, 
  Home, 
  FileText, 
  MapPin, 
  TrendingUp, 
  Wrench, 
  MousePointer2, 
  Save, 
  Upload, 
  Trash2, 
  Plus, 
  Settings2,
  Clock,
  Phone,
  MessageCircle,
  Mail,
  Globe,
  ShoppingCart,
  User,
  Send,
  ShieldCheck,
  Bell
} from '@/components/LucideIcons'

const TABS = [
  { id: 'tab-btn-design', icon: <MousePointer2 size={18} />, title: 'Design Boutons', sub: 'Style & Animations Premium' },
  { id: 'tab-colors', icon: <Palette size={18} />, title: 'Palette Couleurs', sub: 'Identité visuelle globale' },
  { id: 'tab-store', icon: <Store size={18} />, title: 'Infos Boutique', sub: 'Contact, Logo & Coordonnées' },
  { id: 'tab-slider', icon: <Layout size={18} />, title: 'Hero Slider', sub: 'Diapositives interactives' },
  { id: 'tab-features', icon: <Sparkles size={18} />, title: 'Bandelette', sub: 'Arguments de vente' },
  { id: 'tab-home', icon: <Home size={18} />, title: 'Page d\'accueil', sub: 'Titres & Sections' },
  { id: 'tab-about', icon: <FileText size={18} />, title: 'À Propos', sub: 'Histoire & Galerie photo' },
  { id: 'tab-contact', icon: <Mail size={18} />, title: 'Contact', sub: 'Messages & Map' },
  { id: 'tab-marketing', icon: <Sparkles size={18} />, title: 'Marketing & Pixels', sub: 'Facebook, TikTok & Promos' },
  { id: 'tab-analytics', icon: <TrendingUp size={18} />, title: 'Rentabilité', sub: 'Calcul des bénéfices & Coûts' },
  { id: 'tab-advanced', icon: <Wrench size={18} />, title: 'Avancé', sub: 'SEO & Configuration technique' },
]

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
  titleColor?: string
  spanColor?: string
  subColor?: string
  titleColorLight?: string
  spanColorLight?: string
  subColorLight?: string
}

type Feature = {
  icon: string
  titleFr: string
  titleAr: string
  subFr: string
  subAr: string
  iconColor?: string
  titleColor?: string
}

const BUTTON_PAGES = BUTTON_STYLE_PAGES

const DEFAULT_FEATURES: Feature[] = [
  { icon: '🚚', titleFr: 'Livraison 48h', titleAr: 'توصيل خلال 48 ساعة', subFr: 'Partout au Maroc', subAr: 'في جميع أنحاء المغرب' },
  { icon: '🔒', titleFr: 'Paiement Sécurisé', titleAr: 'دفع آمن', subFr: 'Transactions protégées', subAr: 'معاملات محمية' },
  { icon: '📚', titleFr: '1200+ Titres', titleAr: '+1200 عنوان', subFr: 'Catalogue complet', subAr: 'كتالوج شامل' },
  { icon: '⭐', titleFr: '15K+ Clients', titleAr: '+15000 عميل', subFr: 'Clients satisfaits', subAr: 'عملاء راضون' },
]

import { MOROCCAN_CITIES } from '@/lib/constants'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('tab-btn-design')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [buttonStyles, setButtonStyles] = useState<Record<string, ButtonStyle>>({})
  const [draftButtonStyles, setDraftButtonStyles] = useState<Record<string, ButtonStyle>>({})
  const [editingBtn, setEditingBtn] = useState<string | null>(null)
  const [previewState, setPreviewState] = useState<'normal' | 'hover' | 'active'>('normal')
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('dark')
  const [activeBtnPage, setActiveBtnPage] = useState('home')
  const [slides, setSlides] = useState<Slide[]>([
    { tag: 'Rentrée Scolaire 2026', title: 'Tous vos manuels', span: 'en un seul endroit', sub: 'Découvrez notre sélection complète de livres scolaires.', btn1: 'Explorer le catalogue ›', btn1Link: '/best-offers', btn2: 'En savoir plus', btn2Link: '/#about', image: '', bgColor1: '#0e1e3a', bgColor2: '#070B14' },
    { tag: 'Offres Spéciales', title: 'Économisez jusqu\'à', span: '30% sur les packs', sub: 'Livraison gratuite pour les commandes supérieures à 499 DH.', btn1: 'Voir les offres ›', btn1Link: '/best-offers', btn2: '', btn2Link: '', image: '', bgColor1: '#1a0a10', bgColor2: '#070B14' },
  ])
  const [slideUploading, setSlideUploading] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState('')
  const [features, setFeatures] = useState<Feature[]>(DEFAULT_FEATURES)

  type AboutStat = { num: string; labelFr: string; labelAr: string }
  type AboutValue = { titleFr: string; titleAr: string; descFr: string; descAr: string }

  const [aboutStats, setAboutStats] = useState<AboutStat[]>([
    { num: '10+', labelFr: "Années d'expérience", labelAr: 'سنوات خبرة' },
    { num: '1200+', labelFr: 'Titres disponibles', labelAr: 'عنوان متوفر' },
    { num: '15K+', labelFr: 'Clients fidèles', labelAr: 'عميل وفي' },
    { num: '48h', labelFr: 'Délai de livraison', labelAr: 'وقت التوصيل' },
  ])
  const [aboutValues, setAboutValues] = useState<AboutValue[]>([
    { titleFr: 'Qualité certifiée', titleAr: 'جودة معتمدة', descFr: "Tous nos livres sont conformes aux programmes officiels du Ministère de l'Éducation Nationale.", descAr: 'جميع كتبنا متوافقة مع المناهج الرسمية لوزارة التعليم الوطني.' },
    { titleFr: 'Prix justes', titleAr: 'أسعار عادلة', descFr: 'Nous négocions directement avec les éditeurs pour vous offrir les meilleurs tarifs.', descAr: 'نتفاوض مباشرة مع الناشرين لنقدم لك أفضل الأسعار.' },
    { titleFr: 'Livraison rapide', titleAr: 'توصيل سريع', descFr: 'Recevez vos commandes en 24 à 48 heures partout au Maroc.', descAr: 'استلم طلباتك خلال 24 إلى 48 ساعة في جميع أنحاء المغرب.' },
    { titleFr: 'Service client', titleAr: 'خدمة العملاء', descFr: 'Notre équipe est disponible 6 jours sur 7 pour répondre à toutes vos questions.', descAr: 'فريقنا متاح 6 أيام في الأسبوع للرد على جميع استفساراتك.' },
    { titleFr: 'Retours faciles', titleAr: 'إرجاع سهل', descFr: 'Politique de retour simplifiée sous 14 jours sans conditions.', descAr: 'سياسة إرجاع مبسطة خلال 14 يوماً دون شروط.' },
    { titleFr: 'Stock permanent', titleAr: 'مخزون دائم', descFr: "Plus de 1 200 titres disponibles en permanence pour ne jamais rater la rentrée.", descAr: 'أكثر من 1200 عنوان متوفر باستمرار لضمان عدم فوات الموسم الدراسي.' },
  ])

  // Combined settings state
  const [settings, setSettings] = useState({
    col_primary: '#3b82f6',
    col_secondary: '#8b5cf6',
    col_promo: '#ef4444',
    col_success: '#22c55e',
    home_bg1: '#0a0f1e',
    home_bg2: '#0d1b3e',

    store_name: 'ProExcel Maktaba',
    store_slogan: 'La bibliothèque scolaire de référence au Maroc',
    store_emoji: '📚',
    store_email: 'contact@proexcel.ma',
    store_phone: '+212 6 00 00 00 00',
    store_whatsapp: '+212600000000',
    store_address: 'Casablanca, Maroc',
    store_city: 'Casablanca',
    store_map_iframe: '',
    store_hours: '',
    store_facebook: '',
    store_instagram: '',
    store_tiktok: '',
    store_youtube: '',
    site_logo: '',
    site_favicon: '',
    login_bg_image: '',
    delivery_fee: '25',
    free_delivery_min: '499',
    delivery_delay: '48h – 72h',

    home_feat_tag: 'Tendances',
    home_feat_title: 'Livres en Vedette',
    home_feat_sub: 'Les manuels les plus demandés cette saison',
    home_cat_tag: 'Catégories',
    home_cat_title: 'Parcourez nos rayons',
    home_cat_sub: 'Trouvez rapidement l\'ouvrage nécessaire',

    promo_tag_fr: 'Offre Spéciale',
    promo_tag_ar: 'عرض خاص',
    promo_title_fr: 'Livraison Gratuite',
    promo_title_ar: 'توصيل مجاني',
    promo_em_fr: 'dès 499 DH',
    promo_em_ar: 'ابتداءً من 499 درهم',
    promo_sub_fr: 'Commandez plus de livres et profitez de la livraison offerte partout au Maroc.',
    promo_sub_ar: 'اطلب المزيد من الكتب واستفد من التوصيل المجاني في جميع أنحاء المغرب.',
    promo_stat1_num: '1200+',
    promo_stat1_fr: 'Titres disponibles',
    promo_stat1_ar: 'عناوين متوفرة',
    promo_stat2_num: '15K+',
    promo_stat2_fr: 'Clients satisfaits',
    promo_stat2_ar: 'عملاء راضون',
    promo_stat3_num: '30%',
    promo_stat3_fr: 'Économies max',
    promo_stat3_ar: 'أقصى توفير',
    promo_btn_fr: 'Voir toutes les offres',
    promo_btn_ar: 'عرض جميع العروض',
    promo_btn_link: '/best-offers',

    hours_mon: '08:30 – 18:30',
    hours_tue: '08:30 – 18:30',
    hours_wed: '08:30 – 18:30',
    hours_thu: '08:30 – 18:30',
    hours_fri: '08:30 – 18:30',
    hours_sat: '09:00 – 13:00',
    hours_sun: 'Fermé',

    seo_title: 'ProExcel Maktaba | Librairie Scolaire',
    seo_desc: 'Vente en ligne de livres scolaires au Maroc.',
    seo_keywords: 'livres, maroc, école, éducation',

    pixel_fb: '',
    pixel_tiktok: '',
    pixel_google: '',
    promo_codes: '[]',

    about_img_1: '',
    about_img_2: '',
    about_img_3: '',
    about_img_4: '',

    map_iframe: '',

    pp_layout: 'side-by-side',
    pp_gallery: 'carousel',
    pp_zoom: 'true',
    pp_price_size: '1.75rem',
    pp_price_color: '#3b82f6',
    pp_tabs_style: 'underline',
    pp_badge_style: 'pill',
    pp_badge_pos: 'top-right',

    pp_btn_radius: '16px',
    pp_btn_shadow: '0 10px 25px rgba(232, 53, 42, 0.2)',
    pp_btn_hover_col: '#c0392b',
    pp_cta_bg: '#e8352a',
    pp_cta_text: '#ffffff',
    pp_outline_col: '#e8352a',

    analytics_target_margin: '30',

    about_hero_sub_fr: 'Votre librairie scolaire de référence au Maroc depuis plus de 10 ans',
    about_hero_sub_ar: 'مكتبتك المدرسية الموثوقة في المغرب منذ أكثر من 10 سنوات',
    about_story_tag_fr: 'Notre Histoire',
    about_story_tag_ar: 'قصتنا',
    about_story_title_fr: "Plus de 10 ans au service de l'éducation marocaine",
    about_story_title_ar: 'أكثر من 10 سنوات في خدمة التعليم المغربي',
    about_story1_fr: "Fondée en 2014, ProExcel Maktaba est née d'une passion pour l'éducation et d'un constat simple : les familles marocaines avaient besoin d'un accès facile et fiable aux livres scolaires de qualité.",
    about_story1_ar: 'تأسست برو إكسيل مكتبة عام 2014 من شغف بالتعليم وإدراك بسيط: احتياج الأسر المغربية إلى وصول سهل وموثوق للكتب المدرسية عالية الجودة.',
    about_story2_fr: "Aujourd'hui, nous proposons plus de 1 200 titres couvrant tous les niveaux du primaire au baccalauréat, en conformité avec les programmes officiels du Ministère de l'Éducation Nationale marocain.",
    about_story2_ar: 'اليوم، نقدم أكثر من 1200 عنوان يغطي جميع المستويات من الابتدائي حتى الثانوية، وفق المناهج الرسمية لوزارة التعليم الوطني المغربية.',
    about_story3_fr: "Notre équipe de spécialistes sélectionne chaque ouvrage avec soin pour garantir qualité pédagogique, conformité aux référentiels officiels et accessibilité tarifaire pour toutes les familles.",
    about_story3_ar: 'يختار فريق متخصصينا كل كتاب بعناية لضمان الجودة التربوية، والامتثال للمناهج الرسمية، وإمكانية الوصول بأسعار مناسبة لجميع الأسر.',
    about_val_tag_fr: 'Nos Valeurs',
    about_val_tag_ar: 'قيمنا',
    about_val_h2_fr: 'Ce qui nous différencie',
    about_val_h2_ar: 'ما يميزنا',
    about_cta_title_fr: 'Prêt à explorer notre catalogue ?',
    about_cta_title_ar: 'هل أنت مستعد لاستكشاف كتالوجنا؟',
    about_cta_sub_fr: 'Découvrez notre sélection de plus de 1 200 livres scolaires',
    about_cta_sub_ar: 'اكتشف مجموعتنا من أكثر من 1200 كتاب مدرسي',
    about_cta_btn_fr: 'Explorer le catalogue ›',
    about_cta_btn_ar: 'تصفح الكتالوج ›',

    sticky_buy_label: 'Commander maintenant',

    trust_livraison_label: 'Livraison',
    trust_livraison_val: '24–48h au Maroc',
    trust_format_label: 'Format',
    trust_format_val: 'Standard / Express',
    trust_retours_label: 'Retours',
    trust_retours_val: '7 jours satisfait',
    trust_paiement_label: 'Paiement',
    trust_paiement_val: 'CMI / Virement / Cash',
  })

  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])

  type PushStatus = 'idle' | 'loading' | 'success' | 'denied' | 'unsupported' | 'error'
  const [pushStatus,   setPushStatus]   = useState<PushStatus>('idle')
  const [pushError,    setPushError]    = useState<string>('')
  type TestStatus = 'idle' | 'loading' | 'success' | 'error'
  const [testStatus,   setTestStatus]   = useState<TestStatus>('idle')
  const [testMessage,  setTestMessage]  = useState<string>('')

  function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const trimmed = base64String.trim()
    const padding = '='.repeat((4 - (trimmed.length % 4)) % 4)
    const base64  = (trimmed + padding).replace(/-/g, '+').replace(/_/g, '/')
    const raw     = window.atob(base64)
    const buffer  = new ArrayBuffer(raw.length)
    const bytes   = new Uint8Array(buffer)
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)
    return bytes as unknown as Uint8Array<ArrayBuffer>
  }

  async function enablePushNotifications() {
    setPushError('')

    // Step 1 — browser support
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.error('[push] ServiceWorker or PushManager not supported in this browser')
      setPushStatus('unsupported')
      return
    }
    setPushStatus('loading')

    try {
      // Step 2 — notification permission
      const permission = await Notification.requestPermission()
      console.log('[push] Permission:', permission)
      if (permission !== 'granted') {
        setPushStatus('denied')
        return
      }

      // Step 3 — register service worker
      let reg: ServiceWorkerRegistration
      try {
        reg = await navigator.serviceWorker.register('/sw.js')
        await navigator.serviceWorker.ready
        console.log('[push] SW registered, scope:', reg.scope)
      } catch (swErr) {
        console.error('[push] SW registration failed:', swErr)
        setPushError('Service worker registration failed: ' + (swErr instanceof Error ? swErr.message : String(swErr)))
        setPushStatus('error')
        return
      }

      // Step 4 — VAPID public key
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      const trimmedKey = vapidKey ? vapidKey.trim() : ''
      console.log('[push] VAPID key present:', !!trimmedKey, trimmedKey ? `(${trimmedKey.length} chars)` : '(MISSING)')
      if (!trimmedKey) {
        console.error('[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set in environment')
        setPushError('VAPID public key manquante — ajoutez NEXT_PUBLIC_VAPID_PUBLIC_KEY dans les variables Vercel')
        setPushStatus('error')
        return
      }

      // Step 5 — convert key and subscribe
      let sub: PushSubscription
      try {
        const appServerKey = urlBase64ToUint8Array(trimmedKey)
        console.log('[push] VAPID key converted, Uint8Array length:', appServerKey.length)
        if (appServerKey.length !== 65) {
          throw new Error(`Invalid VAPID key: expected 65 bytes, got ${appServerKey.length}`)
        }
        sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: appServerKey })
        console.log('[push] Subscribed, endpoint:', sub.endpoint)
      } catch (subErr) {
        console.error('[push] pushManager.subscribe failed:', subErr)
        setPushError('Subscribe failed: ' + (subErr instanceof Error ? subErr.message : String(subErr)))
        setPushStatus('error')
        return
      }

      // Step 6 — save subscription to server
      const res = await fetch('/api/admin/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(sub),
      })
      console.log('[push] API response status:', res.status)
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        console.error('[push] API error:', res.status, body)
        setPushError(`Erreur serveur ${res.status}${body ? ': ' + body : ''}`)
        setPushStatus('error')
        return
      }

      const data = await res.json().catch(() => ({}))
      if (data.saved) {
        setPushStatus('success')
      } else {
        setPushError('La souscription n\'a pas pu être enregistrée.')
        setPushStatus('error')
      }
    } catch (e) {
      console.error('[push] Unexpected error:', e)
      setPushError(e instanceof Error ? e.message : String(e))
      setPushStatus('error')
    }
  }

  async function sendTestNotification() {
    setTestStatus('loading')
    setTestMessage('')
    try {
      const res = await fetch('/api/admin/push/test', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}` },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setTestMessage(data.message || `Erreur ${res.status}`)
        setTestStatus('error')
        return
      }
      setTestMessage(`Appareils enregistrés: ${data.subscriptionsCount ?? 0}, envoyées: ${data.sent ?? 0}`)
      setTestStatus('success')
    } catch (e) {
      setTestMessage(e instanceof Error ? e.message : 'Erreur réseau')
      setTestStatus('error')
    }
  }

  function token() { return localStorage.getItem('proexcel_admin_token') || '' }

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setSettings(prev => ({ ...prev, ...data }))
          if (data.hero_slides) {
            try {
              const parsed = JSON.parse(data.hero_slides)
              if (Array.isArray(parsed)) setSlides(parsed)
            } catch { /* keep defaults */ }
          }
          if (data.features_strip) {
            try {
              const parsed = JSON.parse(data.features_strip)
              if (Array.isArray(parsed)) setFeatures(parsed)
            } catch { /* keep defaults */ }
          }
          if (data.about_stats) {
            try {
              const parsed = JSON.parse(data.about_stats)
              if (Array.isArray(parsed)) setAboutStats(parsed)
            } catch { /* keep defaults */ }
          }
          if (data.about_values) {
            try {
              const parsed = JSON.parse(data.about_values)
              if (Array.isArray(parsed)) setAboutValues(parsed)
            } catch { /* keep defaults */ }
          }
          if (data.button_styles) {
            try {
              const parsed = sanitizeButtonStyles(JSON.parse(data.button_styles))
              setButtonStyles(parsed)
              setDraftButtonStyles(parsed)
              publishButtonStyles(parsed)
            } catch { /* keep defaults */ }
          }
        }
      })
      .catch(console.error)

    fetch('/api/products', { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then(setProducts)
      .catch(console.error)

    fetch('/api/orders', { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then(setOrders)
      .catch(console.error)
  }, [])

  // On mount: detect if this device is already subscribed and restore push status
  useEffect(() => {
    async function checkPushSubscription() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
      if (Notification.permission !== 'granted') return
      try {
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.getSubscription()
        if (!sub) return

        // Ask the server whether this endpoint is in the DB
        const res = await fetch('/api/admin/push/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token()}`,
          },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        if (!res.ok) return
        const data = await res.json().catch(() => ({}))

        if (data.subscribed) {
          setPushStatus('success')
        } else {
          // Browser has subscription but DB lost it — re-save silently
          const saveRes = await fetch('/api/admin/push/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token()}`,
            },
            body: JSON.stringify(sub),
          })
          if (saveRes.ok) {
            const saveData = await saveRes.json().catch(() => ({}))
            if (saveData.saved) setPushStatus('success')
          }
        }
      } catch {
        // silently ignore — do not change push status on startup errors
      }
    }
    checkPushSubscription()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Instant Favicon Preview in Browser Tab
  useEffect(() => {
    if (settings.site_favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = settings.site_favicon
    }
  }, [settings.site_favicon])

  async function saveSettings() {
    setLoading(true)
    try {
      const mergedBtnStyles = sanitizeButtonStyles({ ...buttonStyles, ...draftButtonStyles })
      let payload: any = {}
      if (activeTab === 'tab-btn-design') {
        payload = { button_styles: JSON.stringify(mergedBtnStyles) }
      } else {
        payload = { ...settings, hero_slides: JSON.stringify(slides), features_strip: JSON.stringify(features), about_stats: JSON.stringify(aboutStats), about_values: JSON.stringify(aboutValues), button_styles: JSON.stringify(mergedBtnStyles) }
      }

      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`
        },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        if (activeTab === 'tab-btn-design') {
          setButtonStyles(mergedBtnStyles)
          setDraftButtonStyles({})
          publishButtonStyles(mergedBtnStyles)
        }
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function uploadSlideImage(idx: number, file: File, field: 'image' | 'imageMobile' | 'productImage' = 'image') {
    setSlideUploading(idx)
    setUploadError('')
    try {
      const formData = new FormData()
      formData.append('files', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}` },
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || `HTTP ${res.status}`)
      }
      const { urls } = await res.json()
      if (urls[0]) {
        const updated = slides.map((s, i) => i === idx ? { ...s, [field]: urls[0] } : s)
        setSlides(updated)
      }
    } catch (e) { setUploadError(e instanceof Error ? e.message : 'Erreur upload') }
    finally { setSlideUploading(null) }
  }

  function updateSlide(idx: number, field: keyof Slide, val: string) {
    setSlides(slides.map((s, i) => i === idx ? { ...s, [field]: val } : s))
  }

  function addSlide() {
    setSlides([...slides, { tag: '', title: 'Nouveau titre', span: '', sub: '', btn1: 'Voir plus', btn1Link: '/best-offers', btn2: '', btn2Link: '', image: '', bgColor1: '#0e1e3a', bgColor2: '#070B14' }])
  }

  function removeSlide(idx: number) {
    if (slides.length <= 1) return
    setSlides(slides.filter((_, i) => i !== idx))
  }

  function moveSlide(idx: number, dir: -1 | 1) {
    const next = [...slides]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
      ;[next[idx], next[target]] = [next[target], next[idx]]
    setSlides(next)
  }

  function updateKey(key: string, val: string) {
    setSettings(prev => ({ ...prev, [key]: val }))
  }

  function getBtnStyle(id: string, def: ButtonStyle, isDraft = true): ButtonStyle {
    const base = isDraft ? draftButtonStyles : buttonStyles
    return { ...def, ...(base[id] || {}) }
  }

  function publishButtonStyles(next: Record<string, ButtonStyle>) {
    const cleaned = sanitizeButtonStyles(next)
    let el = document.getElementById('proexcel-btn-custom') as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = 'proexcel-btn-custom'
      document.head.appendChild(el)
    }
    el.textContent = buildButtonStyleSheet(cleaned)
    try {
      localStorage.setItem('proexcel_button_styles', JSON.stringify(cleaned))
      window.dispatchEvent(new CustomEvent('proexcel-button-styles:update', { detail: cleaned }))
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('proexcel-button-styles')
        channel.postMessage(cleaned)
        channel.close()
      }
    } catch { /* ignore cross-tab sync failures */ }
  }

  function updateBtnDraft(id: string, def: ButtonStyle, field: keyof ButtonStyle, val: string) {
    const current = getBtnStyle(id, def, true)
    const updated = { ...current, [field]: val } as ButtonStyle
    const nextDrafts = { ...draftButtonStyles, [id]: updated }
    setDraftButtonStyles(nextDrafts)
    
    // Publish combined styles (persistent + current draft) for real-time site-wide preview
    publishButtonStyles({ ...buttonStyles, ...nextDrafts })
  }

  function commitBtnStyle(id: string) {
    const draft = draftButtonStyles[id]
    if (!draft) return
    const next = sanitizeButtonStyles({ ...buttonStyles, [id]: draft })
    setButtonStyles(next)
    publishButtonStyles(next)
    setEditingBtn(null)
  }

  function resetBtnDraft(id: string) {
    const next = { ...draftButtonStyles }
    delete next[id]
    setDraftButtonStyles(next)
  }

  function resetBtnStyle(id: string) {
    const next = { ...buttonStyles }
    delete next[id]
    const cleaned = sanitizeButtonStyles(next)
    setButtonStyles(cleaned)
    publishButtonStyles(cleaned)
  }

  function previewBg(style: ButtonStyle) {
    return style.bgType === 'gradient'
      ? `linear-gradient(${style.gradDir}, ${style.gradColor1} 0%, ${style.gradColor2} 100%)`
      : style.bgColor
  }

  function colorInputValue(value: string, fallback = '#e8352a') {
    return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback
  }

  return (
    <div>
      {/* TOPBAR */}
      <div className="admin-topbar">
        <div className="topbar-title">Paramètres <span>Configuration globale</span></div>
        <div className="topbar-actions">
          {uploadError && <span style={{ color: '#ef4444', fontSize: '0.8rem', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>⚠ {uploadError}</span>}
          <button className="btn-new proexcel-btn-admin-save-action" onClick={saveSettings} disabled={loading}>
            {loading ? 'Enregistrement…' : saved ? '💾 Enregistré !' : '💾 Sauvegarder tout'}
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="settings-layout">
          {/* LEFT NAV */}
          <nav className="settings-nav">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span style={{ fontSize: '1.1rem' }}>{tab.icon}</span>
                <div>
                  <div className="sni-title">{tab.title}</div>
                  <div className="sni-sub">{tab.sub}</div>
                </div>
              </button>
            ))}
          </nav>

          {/* PANELS */}
          <div className="settings-panels fade-up">

            {/* TAB: COLORS */}
            {activeTab === 'tab-colors' && (
              <div className="settings-panel active">
                <div className="sp-section-title">Identité Visuelle Globale</div>
                <div className="settings-card" style={{ background: 'linear-gradient(135deg, var(--a-card) 0%, rgba(192,57,43,0.02) 100%)' }}>
                  <div className="sp-grid-2">
                    {[
                      { key: 'col_primary', label: 'Couleur Principale', desc: 'Boutons primaires, liens actifs, accents de navigation' },
                      { key: 'col_secondary', label: 'Couleur Secondaire', desc: 'Badges, icônes d\'accentuation et éléments secondaires' },
                      { key: 'col_promo', label: 'Alertes & Promos', desc: 'Prix barrés, badges de réduction et urgence' },
                      { key: 'col_success', label: 'Validation & Succès', desc: 'Messages de réussite et statuts positifs' },
                    ].map(c => (
                      <div key={c.key} className="cp-section" style={{ background: 'var(--a-bg)', border: '1px solid var(--a-border)', borderRadius: '14px', padding: '1.25rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--a-text)' }}>{c.label}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--a-text2)', marginTop: '0.2rem' }}>{c.desc}</div>
                        </div>
                        <div className="color-field">
                          <div className="color-swatch-wrap" style={{ width: '46px', height: '46px' }}>
                            <input
                              type="color"
                              value={settings[c.key as keyof typeof settings]}
                              onChange={e => updateKey(c.key, e.target.value)}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <input
                              className="s-input"
                              style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                              value={settings[c.key as keyof typeof settings]}
                              onChange={e => updateKey(c.key, e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sp-section-title" style={{ marginTop: '1.5rem' }}>Arrière-plans Immersion</div>
                <div className="settings-card">
                  <div className="sp-grid-2">
                    {[
                      { key: 'home_bg1', label: 'Fond Hero (Début)', desc: 'Couleur supérieure du dégradé Hero' },
                      { key: 'home_bg2', label: 'Fond Hero (Fin)', desc: 'Couleur inférieure du dégradé Hero' },
                    ].map(c => (
                      <div key={c.key} className="cp-section" style={{ background: 'var(--a-bg)', border: '1px solid var(--a-border)', borderRadius: '14px', padding: '1.25rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--a-text)' }}>{c.label}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--a-text2)', marginTop: '0.2rem' }}>{c.desc}</div>
                        </div>
                        <div className="color-field">
                          <div className="color-swatch-wrap">
                            <input
                              type="color"
                              value={settings[c.key as keyof typeof settings]}
                              onChange={e => updateKey(c.key, e.target.value)}
                            />
                          </div>
                          <input
                            className="s-input"
                            style={{ fontFamily: 'monospace', flex: 1 }}
                            value={settings[c.key as keyof typeof settings]}
                            onChange={e => updateKey(c.key, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: STORE INFO */}
            {activeTab === 'tab-store' && (
              <div className="settings-panel active">

                {/* LOGO + FAVICON + LOGIN BG */}
                <div className="sp-section-title">Images & Médias</div>
                <div className="settings-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {[
                      { settingKey: 'site_logo', label: 'Logo du site', hint: 'Affiché dans le header (PNG recommandé)', size: '38px', circle: false },
                      { settingKey: 'site_favicon', label: 'Favicon', hint: 'Icône de l\'onglet (PNG 32×32 recommandé)', size: '32px', circle: false },
                      { settingKey: 'login_bg_image', label: 'Fond page connexion', hint: 'Image de fond de la page login', size: '60px', circle: false },
                    ].map(item => {
                      const currentVal = (settings as Record<string, string>)[item.settingKey] || ''
                      return (
                        <div key={item.settingKey}>
                          <div className="s-label">{item.label}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            {currentVal ? (
                              <div style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--a-border)', flexShrink: 0, background: 'var(--a-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={currentVal} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              </div>
                            ) : (
                              <div style={{ width: '56px', height: '56px', borderRadius: '8px', border: '2px dashed var(--a-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--a-text2)', fontSize: '1.5rem' }}>
                                🖼️
                              </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
                              <label style={{ cursor: 'pointer' }}>
                                <input
                                  type="file"
                                  accept="image/*"
                                  hidden
                                  onChange={async e => {
                                    const file = e.target.files?.[0]
                                    if (!file) return
                                    setUploadError('')
                                    const fd = new FormData()
                                    fd.append('files', file)
                                    try {
                                      const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd })
                                      if (!res.ok) {
                                        const data = await res.json().catch(() => ({}))
                                        throw new Error(data.message || `HTTP ${res.status}`)
                                      }
                                      const { urls } = await res.json()
                                      if (urls[0]) updateKey(item.settingKey, urls[0])
                                    } catch (err) { setUploadError(err instanceof Error ? err.message : 'Erreur upload') }
                                    e.target.value = ''
                                  }}
                                />
                                <span className="btn-action proexcel-btn-admin-upload-action" style={{ display: 'inline-block', cursor: 'pointer', fontSize: '0.78rem' }}>📷 Upload</span>
                              </label>
                              {currentVal && (
                                <button className="btn-action btn-action-red proexcel-btn-admin-danger-action" style={{ fontSize: '0.72rem' }} onClick={() => updateKey(item.settingKey, '')}>Supprimer</button>
                              )}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--a-text2)' }}>{item.hint}</div>
                          {currentVal && (
                            <input className="s-input" style={{ marginTop: '0.5rem', fontSize: '0.78rem', fontFamily: 'monospace' }} value={currentVal} onChange={e => updateKey(item.settingKey, e.target.value)} placeholder="URL de l'image" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="sp-section-title">Identité de la boutique</div>
                <div className="settings-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <div className="s-label">Nom de la boutique</div>
                      <input className="s-input" value={settings.store_name} onChange={e => updateKey('store_name', e.target.value)} />
                    </div>
                    <div>
                      <div className="s-label">Slogan</div>
                      <input className="s-input" value={settings.store_slogan} onChange={e => updateKey('store_slogan', e.target.value)} />
                    </div>
                    <div>
                      <div className="s-label">Emoji du logo</div>
                      <input className="s-input" style={{ width: '80px', fontSize: '1.25rem' }} value={settings.store_emoji} onChange={e => updateKey('store_emoji', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="sp-section-title">Contact & Coordonnées</div>
                <div className="settings-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    {[
                      { key: 'store_email', label: 'Email', type: 'email' },
                      { key: 'store_phone', label: 'Téléphone', type: 'text' },
                      { key: 'store_whatsapp', label: 'WhatsApp', type: 'text' },
                      { key: 'store_address', label: 'Adresse', type: 'text' },
                    ].map(f => (
                      <div key={f.key}>
                        <div className="s-label">{f.label}</div>
                        <input className="s-input" type={f.type} value={settings[f.key as keyof typeof settings]} onChange={e => updateKey(f.key, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sp-section-title">Réseaux Sociaux</div>
                <div className="settings-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    {[
                      { key: 'store_facebook', label: 'Facebook URL' },
                      { key: 'store_instagram', label: 'Instagram URL' },
                      { key: 'store_tiktok', label: 'TikTok URL' },
                      { key: 'store_youtube', label: 'YouTube URL' },
                    ].map(f => (
                      <div key={f.key}>
                        <div className="s-label">{f.label}</div>
                        <input className="s-input" type="url" value={settings[f.key as keyof typeof settings]} onChange={e => updateKey(f.key, e.target.value)} placeholder="https://..." />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: HERO SLIDER */}
            {activeTab === 'tab-slider' && (
              <div className="settings-panel active">
                <div className="sp-section-title">Diapositives du Hero Slider</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--a-text2)', marginBottom: '1.5rem' }}>
                  La 1ère diapositive = principale. Cliquez ▲▼ pour réordonner. Sauvegardez après modifications.
                </div>

                {slides.map((slide, idx) => (
                  <div key={idx} className="settings-card" style={{ marginBottom: '1.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--a-primary)', fontSize: '0.95rem' }}>
                        {idx === 0 ? '⭐ ' : ''}Diapositive {idx + 1}
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn-action proexcel-btn-admin-secondary-action" onClick={() => moveSlide(idx, -1)} disabled={idx === 0} title="Monter">▲</button>
                        <button className="btn-action proexcel-btn-admin-secondary-action" onClick={() => moveSlide(idx, 1)} disabled={idx === slides.length - 1} title="Descendre">▼</button>
                        <button className="btn-action btn-action-red proexcel-btn-admin-danger-action" onClick={() => removeSlide(idx)} disabled={slides.length <= 1} title="Supprimer">✕</button>
                      </div>
                    </div>

                    {/* 2 images: background + product side */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

                      {/* Image 1: Background */}
                      <div style={{ background: 'var(--a-bg)', border: '1px solid var(--a-border)', borderRadius: '10px', padding: '1rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--a-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.6rem' }}>🌄 Image de fond (full cover)</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--a-text2)', marginBottom: '0.75rem', lineHeight: 1.4 }}>Couvre tout le slider en arrière-plan.</div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          {slide.image ? (
                            <div style={{ width: '110px', height: '65px', borderRadius: '7px', overflow: 'hidden', border: '1px solid var(--a-border)', flexShrink: 0 }}>
                              <img src={slide.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ) : (
                            <div style={{ width: '110px', height: '65px', borderRadius: '7px', background: `radial-gradient(ellipse at 60% 50%, ${slide.bgColor1 || '#0e1e3a'} 0%, ${slide.bgColor2 || '#070B14'} 100%)`, flexShrink: 0, border: '2px dashed var(--a-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--a-text2)', fontSize: '0.65rem' }}>Aucune</div>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ cursor: 'pointer' }}>
                              <input type="file" accept="image/*" hidden onChange={e => { if (e.target.files?.[0]) uploadSlideImage(idx, e.target.files[0], 'image'); e.target.value = '' }} />
                              <span className="btn-action proexcel-btn-admin-upload-action" style={{ display: 'inline-block', cursor: 'pointer' }}>
                                {slideUploading === idx ? '⏳…' : '📷 Choisir'}
                              </span>
                            </label>
                            {slide.image && (
                              <button className="btn-action btn-action-red proexcel-btn-admin-danger-action" onClick={() => updateSlide(idx, 'image', '')}>✕ Suppr.</button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Image 2: Product side */}
                      <div style={{ background: 'var(--a-bg)', border: '1px solid var(--a-border)', borderRadius: '10px', padding: '1rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--a-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.6rem' }}>📦 Image produit (côté texte)</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--a-text2)', marginBottom: '0.75rem', lineHeight: 1.4 }}>S'affiche à côté du texte. PNG transparent recommandé.</div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          {slide.productImage ? (
                            <div style={{ width: '110px', height: '65px', borderRadius: '7px', overflow: 'hidden', border: '1px solid var(--a-border)', flexShrink: 0, background: 'repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 0 0 / 10px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img src={slide.productImage} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                          ) : (
                            <div style={{ width: '110px', height: '65px', borderRadius: '7px', border: '2px dashed var(--a-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--a-text2)', fontSize: '0.65rem' }}>Aucune</div>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ cursor: 'pointer' }}>
                              <input type="file" accept="image/*" hidden onChange={e => { if (e.target.files?.[0]) uploadSlideImage(idx, e.target.files[0], 'productImage'); e.target.value = '' }} />
                              <span className="btn-action proexcel-btn-admin-upload-action" style={{ display: 'inline-block', cursor: 'pointer' }}>
                                {slideUploading === idx ? '⏳…' : '🏷️ Choisir'}
                              </span>
                            </label>
                            {slide.productImage && (
                              <button className="btn-action btn-action-red proexcel-btn-admin-danger-action" onClick={() => updateSlide(idx, 'productImage', '')}>✕ Suppr.</button>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Gradient colors (shown when no image) */}
                    {!slide.image && (
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <div className="s-label">Couleur dégradé 1</div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input type="color" value={slide.bgColor1} onChange={e => updateSlide(idx, 'bgColor1', e.target.value)} style={{ width: '40px', height: '32px', borderRadius: '4px', border: 'none', cursor: 'pointer' }} />
                            <input className="s-input" style={{ fontFamily: 'monospace', flex: 1 }} value={slide.bgColor1} onChange={e => updateSlide(idx, 'bgColor1', e.target.value)} />
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="s-label">Couleur dégradé 2</div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input type="color" value={slide.bgColor2} onChange={e => updateSlide(idx, 'bgColor2', e.target.value)} style={{ width: '40px', height: '32px', borderRadius: '4px', border: 'none', cursor: 'pointer' }} />
                            <input className="s-input" style={{ fontFamily: 'monospace', flex: 1 }} value={slide.bgColor2} onChange={e => updateSlide(idx, 'bgColor2', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <div className="s-label">Tag (petit texte)</div>
                        <input className="s-input" value={slide.tag} onChange={e => updateSlide(idx, 'tag', e.target.value)} placeholder="Ex: Rentrée 2026" />
                      </div>
                      <div>
                        <div className="s-label">Titre principal</div>
                        <input className="s-input" value={slide.title} onChange={e => updateSlide(idx, 'title', e.target.value)} placeholder="Ex: Tous vos manuels" />
                      </div>
                      <div>
                        <div className="s-label">Titre coloré (suite)</div>
                        <input className="s-input" value={slide.span} onChange={e => updateSlide(idx, 'span', e.target.value)} placeholder="Ex: en un seul endroit" />
                      </div>
                      <div>
                        <div className="s-label">Sous-titre</div>
                        <input className="s-input" value={slide.sub} onChange={e => updateSlide(idx, 'sub', e.target.value)} />
                      </div>
                      <div>
                        <div className="s-label">Bouton 1 texte</div>
                        <input className="s-input" value={slide.btn1} onChange={e => updateSlide(idx, 'btn1', e.target.value)} />
                      </div>
                      <div>
                        <div className="s-label">Bouton 1 lien</div>
                        <input className="s-input" value={slide.btn1Link} onChange={e => updateSlide(idx, 'btn1Link', e.target.value)} />
                      </div>
                      <div>
                        <div className="s-label">Bouton 2 texte (optionnel)</div>
                        <input className="s-input" value={slide.btn2} onChange={e => updateSlide(idx, 'btn2', e.target.value)} />
                      </div>
                      <div>
                        <div className="s-label">Bouton 2 lien</div>
                        <input className="s-input" value={slide.btn2Link} onChange={e => updateSlide(idx, 'btn2Link', e.target.value)} />
                      </div>
                    </div>

                    {/* Text Colors */}
                    <div style={{ marginTop: '1rem', borderRadius: '8px', border: '1px solid var(--a-border)', overflow: 'hidden' }}>
                      {/* Dark Mode Colors */}
                      <div style={{ padding: '0.75rem 0.85rem', background: '#0d1220' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8896A9', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.65rem' }}>🌙 Dark Mode — couleurs</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.65rem' }}>
                          {[
                            { label: 'Titre', key: 'titleColor', def: '#F1EDE4' },
                            { label: 'Titre coloré', key: 'spanColor', def: '#E8352A' },
                            { label: 'Sous-titre', key: 'subColor', def: '#8896A9' },
                          ].map(({ label, key, def }) => (
                            <div key={key}>
                              <div style={{ fontSize: '0.68rem', color: '#8896A9', fontWeight: 600, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                <input type="color" value={(slide as any)[key] || def} onChange={e => updateSlide(idx, key as keyof Slide, e.target.value)} style={{ width: '32px', height: '28px', borderRadius: '4px', border: '1px solid #2a3245', cursor: 'pointer', padding: '2px', background: 'transparent' }} />
                                <input style={{ flex: 1, padding: '0.35rem 0.5rem', background: '#111827', border: '1px solid #2a3245', borderRadius: '5px', color: '#F1EDE4', fontSize: '0.72rem', outline: 'none', fontFamily: 'monospace' }} value={(slide as any)[key] || ''} onChange={e => updateSlide(idx, key as keyof Slide, e.target.value)} placeholder={def} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Light Mode Colors */}
                      <div style={{ padding: '0.75rem 0.85rem', background: '#f3f4f6', borderTop: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.65rem' }}>☀️ Light Mode — couleurs</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.65rem' }}>
                          {[
                            { label: 'Titre', key: 'titleColorLight', def: '#111827' },
                            { label: 'Titre coloré', key: 'spanColorLight', def: '#e11d2e' },
                            { label: 'Sous-titre', key: 'subColorLight', def: '#374151' },
                          ].map(({ label, key, def }) => (
                            <div key={key}>
                              <div style={{ fontSize: '0.68rem', color: '#6b7280', fontWeight: 600, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                <input type="color" value={(slide as any)[key] || def} onChange={e => updateSlide(idx, key as keyof Slide, e.target.value)} style={{ width: '32px', height: '28px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer', padding: '2px' }} />
                                <input style={{ flex: 1, padding: '0.35rem 0.5rem', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '5px', color: '#111827', fontSize: '0.72rem', outline: 'none', fontFamily: 'monospace' }} value={(slide as any)[key] || ''} onChange={e => updateSlide(idx, key as keyof Slide, e.target.value)} placeholder={def} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  className="btn-new proexcel-btn-admin-primary-action"
                  onClick={addSlide}
                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem', borderRadius: '10px', textAlign: 'center' }}
                >
                  + Ajouter une diapositive
                </button>
              </div>
            )}

            {/* TAB: FEATURES STRIP */}
            {activeTab === 'tab-features' && (
              <div className="settings-panel active">
                <div className="sp-section-title">Bandelette sous le slider</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--a-text2)', marginBottom: '1.5rem' }}>
                  Configurez les 4 éléments affichés dans la bandelette sous le slider (icône, titre FR/AR, sous-titre FR/AR).
                </p>
                {features.map((f, idx) => (
                  <div key={idx} style={{ background: 'var(--a-bg)', border: '1px solid var(--a-border)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--a-text)' }}>
                      Élément {idx + 1}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--a-text2)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Icône</label>
                        <select
                          value={f.icon}
                          onChange={e => setFeatures(features.map((x, i) => i === idx ? { ...x, icon: e.target.value } : x))}
                          style={{ width: '100%', padding: '0.5rem', background: 'var(--a-card)', border: '1px solid var(--a-border)', borderRadius: '6px', color: 'var(--a-text)', fontSize: '0.85rem', outline: 'none' }}
                        >
                          <option value="delivery">🚚 Livraison</option>
                          <option value="security">🔒 Sécurité</option>
                          <option value="catalog">📚 Catalogue</option>
                          <option value="clients">👥 Clients</option>
                          <option value="star">⭐ Étoile</option>
                          <option value="check">✅ Validé</option>
                          <option value="gift">🎁 Cadeau</option>
                          <option value="phone">📞 Téléphone</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--a-text2)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Couleur icône</label>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <input type="color" value={f.iconColor || '#E8352A'} onChange={e => setFeatures(features.map((x, i) => i === idx ? { ...x, iconColor: e.target.value } : x))} style={{ width: '36px', height: '30px', borderRadius: '4px', border: '1px solid var(--a-border)', cursor: 'pointer', padding: '2px' }} />
                          <input style={{ flex: 1, padding: '0.4rem', background: 'var(--a-card)', border: '1px solid var(--a-border)', borderRadius: '6px', color: 'var(--a-text)', fontSize: '0.75rem', outline: 'none', fontFamily: 'monospace' }} value={f.iconColor || ''} onChange={e => setFeatures(features.map((x, i) => i === idx ? { ...x, iconColor: e.target.value } : x))} placeholder="#E8352A" />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--a-text2)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Couleur titre</label>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <input type="color" value={f.titleColor || '#F1EDE4'} onChange={e => setFeatures(features.map((x, i) => i === idx ? { ...x, titleColor: e.target.value } : x))} style={{ width: '36px', height: '30px', borderRadius: '4px', border: '1px solid var(--a-border)', cursor: 'pointer', padding: '2px' }} />
                          <input style={{ flex: 1, padding: '0.4rem', background: 'var(--a-card)', border: '1px solid var(--a-border)', borderRadius: '6px', color: 'var(--a-text)', fontSize: '0.75rem', outline: 'none', fontFamily: 'monospace' }} value={f.titleColor || ''} onChange={e => setFeatures(features.map((x, i) => i === idx ? { ...x, titleColor: e.target.value } : x))} placeholder="#F1EDE4" />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--a-text2)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Titre (FR)</label>
                        <input
                          type="text"
                          value={f.titleFr}
                          onChange={e => setFeatures(features.map((x, i) => i === idx ? { ...x, titleFr: e.target.value } : x))}
                          placeholder="Livraison 48h"
                          style={{ width: '100%', padding: '0.5rem', background: 'var(--a-card)', border: '1px solid var(--a-border)', borderRadius: '6px', color: 'var(--a-text)', fontSize: '0.85rem', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--a-text2)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Titre (AR)</label>
                        <input
                          type="text"
                          value={f.titleAr}
                          onChange={e => setFeatures(features.map((x, i) => i === idx ? { ...x, titleAr: e.target.value } : x))}
                          placeholder="توصيل خلال 48 ساعة"
                          dir="rtl"
                          style={{ width: '100%', padding: '0.5rem', background: 'var(--a-card)', border: '1px solid var(--a-border)', borderRadius: '6px', color: 'var(--a-text)', fontSize: '0.85rem', outline: 'none', direction: 'rtl' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--a-text2)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sous-titre (FR)</label>
                        <input
                          type="text"
                          value={f.subFr}
                          onChange={e => setFeatures(features.map((x, i) => i === idx ? { ...x, subFr: e.target.value } : x))}
                          placeholder="Partout au Maroc"
                          style={{ width: '100%', padding: '0.5rem', background: 'var(--a-card)', border: '1px solid var(--a-border)', borderRadius: '6px', color: 'var(--a-text)', fontSize: '0.85rem', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--a-text2)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sous-titre (AR)</label>
                        <input
                          type="text"
                          value={f.subAr}
                          onChange={e => setFeatures(features.map((x, i) => i === idx ? { ...x, subAr: e.target.value } : x))}
                          placeholder="في جميع أنحاء المغرب"
                          dir="rtl"
                          style={{ width: '100%', padding: '0.5rem', background: 'var(--a-card)', border: '1px solid var(--a-border)', borderRadius: '6px', color: 'var(--a-text)', fontSize: '0.85rem', outline: 'none', direction: 'rtl' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ fontSize: '0.78rem', color: 'var(--a-text2)', marginTop: '0.5rem' }}>
                  💡 Utilisez des emojis comme icônes (ex: 🚚, 🔒, 📚, ⭐). Cliquez sur "Enregistrer" pour appliquer.
                </div>
              </div>
            )}

            {/* TAB: HOME SECTIONS */}
            {activeTab === 'tab-home' && (
              <div className="settings-panel active">
                <div className="sp-section-title">Sections de la page d'accueil</div>
                {[
                  { id: 'feat', label: 'Section Tendances / Livres en Vedette', prefix: 'home_feat' },
                  { id: 'cat', label: 'Section Rayons / Catégories', prefix: 'home_cat' }
                ].map(sec => (
                  <div key={sec.id} className="settings-card" style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--a-primary)' }}>{sec.label}</div>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      <div>
                        <div className="s-label">Tag / Petit titre</div>
                        <input className="s-input" value={settings[`${sec.prefix}_tag` as keyof typeof settings]} onChange={e => updateKey(`${sec.prefix}_tag`, e.target.value)} />
                      </div>
                      <div>
                        <div className="s-label">Titre principal</div>
                        <input className="s-input" value={settings[`${sec.prefix}_title` as keyof typeof settings]} onChange={e => updateKey(`${sec.prefix}_title`, e.target.value)} />
                      </div>
                      <div>
                        <div className="s-label">Sous-titre</div>
                        <input className="s-input" value={settings[`${sec.prefix}_sub` as keyof typeof settings]} onChange={e => updateKey(`${sec.prefix}_sub`, e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}

                {/* PROMO STRIP */}
                <div className="sp-section-title" style={{ marginTop: '1.5rem' }}>Bandeau Promo (section rouge)</div>
                <div className="settings-card" style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div><div className="s-label">Tag (FR)</div><input className="s-input" value={settings.promo_tag_fr} onChange={e => updateKey('promo_tag_fr', e.target.value)} placeholder="Offre Spéciale" /></div>
                    <div><div className="s-label">Tag (AR)</div><input className="s-input" dir="rtl" value={settings.promo_tag_ar} onChange={e => updateKey('promo_tag_ar', e.target.value)} placeholder="عرض خاص" /></div>
                    <div><div className="s-label">Titre (FR)</div><input className="s-input" value={settings.promo_title_fr} onChange={e => updateKey('promo_title_fr', e.target.value)} placeholder="Livraison Gratuite" /></div>
                    <div><div className="s-label">Titre (AR)</div><input className="s-input" dir="rtl" value={settings.promo_title_ar} onChange={e => updateKey('promo_title_ar', e.target.value)} placeholder="توصيل مجاني" /></div>
                    <div><div className="s-label">Texte coloré italic (FR)</div><input className="s-input" value={settings.promo_em_fr} onChange={e => updateKey('promo_em_fr', e.target.value)} placeholder="dès 499 DH" /></div>
                    <div><div className="s-label">Texte coloré italic (AR)</div><input className="s-input" dir="rtl" value={settings.promo_em_ar} onChange={e => updateKey('promo_em_ar', e.target.value)} placeholder="ابتداءً من 499 درهم" /></div>
                    <div><div className="s-label">Sous-titre (FR)</div><input className="s-input" value={settings.promo_sub_fr} onChange={e => updateKey('promo_sub_fr', e.target.value)} /></div>
                    <div><div className="s-label">Sous-titre (AR)</div><input className="s-input" dir="rtl" value={settings.promo_sub_ar} onChange={e => updateKey('promo_sub_ar', e.target.value)} /></div>
                  </div>

                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--a-text2)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0.75rem 0 0.5rem' }}>📊 Statistiques</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    {[
                      { numKey: 'promo_stat1_num', frKey: 'promo_stat1_fr', arKey: 'promo_stat1_ar', defNum: '1200+', defFr: 'Titres disponibles', defAr: 'عناوين متوفرة' },
                      { numKey: 'promo_stat2_num', frKey: 'promo_stat2_fr', arKey: 'promo_stat2_ar', defNum: '15K+', defFr: 'Clients satisfaits', defAr: 'عملاء راضون' },
                      { numKey: 'promo_stat3_num', frKey: 'promo_stat3_fr', arKey: 'promo_stat3_ar', defNum: '30%', defFr: 'Économies max', defAr: 'أقصى توفير' },
                    ].map((s, i) => (
                      <div key={i} style={{ background: 'var(--a-bg)', border: '1px solid var(--a-border)', borderRadius: '8px', padding: '0.75rem' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--a-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Stat {i + 1}</div>
                        <div className="s-label">Chiffre</div>
                        <input className="s-input" style={{ marginBottom: '0.4rem', fontWeight: 800 }} value={settings[s.numKey as keyof typeof settings]} onChange={e => updateKey(s.numKey, e.target.value)} placeholder={s.defNum} />
                        <div className="s-label">Label (FR)</div>
                        <input className="s-input" style={{ marginBottom: '0.4rem' }} value={settings[s.frKey as keyof typeof settings]} onChange={e => updateKey(s.frKey, e.target.value)} placeholder={s.defFr} />
                        <div className="s-label">Label (AR)</div>
                        <input className="s-input" dir="rtl" value={settings[s.arKey as keyof typeof settings]} onChange={e => updateKey(s.arKey, e.target.value)} placeholder={s.defAr} />
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--a-text2)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0.5rem 0' }}>🔘 Bouton</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div><div className="s-label">Texte bouton (FR)</div><input className="s-input" value={settings.promo_btn_fr} onChange={e => updateKey('promo_btn_fr', e.target.value)} placeholder="Voir toutes les offres" /></div>
                    <div><div className="s-label">Texte bouton (AR)</div><input className="s-input" dir="rtl" value={settings.promo_btn_ar} onChange={e => updateKey('promo_btn_ar', e.target.value)} placeholder="عرض جميع العروض" /></div>
                    <div><div className="s-label">Lien bouton</div><input className="s-input" value={settings.promo_btn_link} onChange={e => updateKey('promo_btn_link', e.target.value)} placeholder="/best-offers" /></div>
                  </div>
                </div>

                <div className="sp-section-title" style={{ marginTop: '1.5rem' }}>Cartes de confiance — Page Produit</div>
                <div className="settings-card">
                  <div style={{ fontSize: '0.8rem', color: 'var(--a-text2)', marginBottom: '1.25rem' }}>
                    Ces 4 cartes apparaissent sous les boutons "Ajouter au panier" et "Acheter maintenant" sur chaque page produit.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    {[
                      { lKey: 'trust_livraison_label', vKey: 'trust_livraison_val', icon: '🚚', defaultLabel: 'Livraison' },
                      { lKey: 'trust_format_label',    vKey: 'trust_format_val',    icon: '📦', defaultLabel: 'Format' },
                      { lKey: 'trust_retours_label',   vKey: 'trust_retours_val',   icon: '↩️', defaultLabel: 'Retours' },
                      { lKey: 'trust_paiement_label',  vKey: 'trust_paiement_val',  icon: '🔒', defaultLabel: 'Paiement' },
                    ].map(card => (
                      <div key={card.lKey} style={{ background: 'var(--a-bg)', border: '1px solid var(--a-border)', borderRadius: '12px', padding: '1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--a-text)' }}>{card.icon} {card.defaultLabel}</div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <div className="s-label">Titre</div>
                          <input className="s-input" value={settings[card.lKey as keyof typeof settings]} onChange={e => updateKey(card.lKey, e.target.value)} placeholder={card.defaultLabel} />
                        </div>
                        <div>
                          <div className="s-label">Valeur</div>
                          <input className="s-input" value={settings[card.vKey as keyof typeof settings]} onChange={e => updateKey(card.vKey, e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sp-section-title" style={{ marginTop: '1.5rem' }}>Bouton Sticky — Mobile</div>
                <div className="settings-card">
                  <div style={{ fontSize: '0.8rem', color: 'var(--a-text2)', marginBottom: '1rem' }}>
                    Texte du bouton fixe en bas de la page produit sur mobile.
                  </div>
                  <div>
                    <div className="s-label">Texte du bouton</div>
                    <input
                      className="s-input"
                      value={settings.sticky_buy_label}
                      onChange={e => updateKey('sticky_buy_label', e.target.value)}
                      placeholder="Commander maintenant"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ABOUT */}
            {activeTab === 'tab-about' && (
              <div className="settings-panel active">

                {/* ── HERO ── */}
                <div className="sp-section-title">Section Hero (En-tête)</div>
                <div className="settings-card" style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div><div className="s-label">Sous-titre 🇫🇷</div><input className="s-input" value={settings.about_hero_sub_fr} onChange={e => updateKey('about_hero_sub_fr', e.target.value)} /></div>
                    <div><div className="s-label">الوصف 🇲🇦</div><input className="s-input" dir="rtl" value={settings.about_hero_sub_ar} onChange={e => updateKey('about_hero_sub_ar', e.target.value)} /></div>
                  </div>
                </div>

                {/* ── STORY ── */}
                <div className="sp-section-title">Section Histoire</div>
                <div className="settings-card" style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div><div className="s-label">Tag 🇫🇷</div><input className="s-input" value={settings.about_story_tag_fr} onChange={e => updateKey('about_story_tag_fr', e.target.value)} /></div>
                    <div><div className="s-label">الوسم 🇲🇦</div><input className="s-input" dir="rtl" value={settings.about_story_tag_ar} onChange={e => updateKey('about_story_tag_ar', e.target.value)} /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div><div className="s-label">Titre principal 🇫🇷</div><input className="s-input" value={settings.about_story_title_fr} onChange={e => updateKey('about_story_title_fr', e.target.value)} /></div>
                    <div><div className="s-label">العنوان الرئيسي 🇲🇦</div><input className="s-input" dir="rtl" value={settings.about_story_title_ar} onChange={e => updateKey('about_story_title_ar', e.target.value)} /></div>
                  </div>
                  {([
                    { fr: 'about_story1_fr', ar: 'about_story1_ar', label: 'Paragraphe 1' },
                    { fr: 'about_story2_fr', ar: 'about_story2_ar', label: 'Paragraphe 2' },
                    { fr: 'about_story3_fr', ar: 'about_story3_ar', label: 'Paragraphe 3' },
                  ] as const).map(p => (
                    <div key={p.fr} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div className="s-label">{p.label} 🇫🇷</div>
                        <textarea className="s-input" style={{ minHeight: '80px', resize: 'vertical' }} value={settings[p.fr as keyof typeof settings]} onChange={e => updateKey(p.fr, e.target.value)} />
                      </div>
                      <div>
                        <div className="s-label">{p.label} 🇲🇦</div>
                        <textarea className="s-input" dir="rtl" style={{ minHeight: '80px', resize: 'vertical' }} value={settings[p.ar as keyof typeof settings]} onChange={e => updateKey(p.ar, e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── PHOTOS ── */}
                <div className="sp-section-title">Photos (grille 2×2)</div>
                <div className="settings-card" style={{ marginBottom: '1.25rem', padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--a-text2)', marginBottom: '1.25rem' }}>Apparaissent à côté du texte de présentation. Dégradé sombre si vide.</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
                    {(['about_img_1','about_img_2','about_img_3','about_img_4'] as const).map((key, idx) => {
                      const val = (settings as Record<string, string>)[key] || ''
                      return (
                        <div key={key}>
                          <div className="s-label">Photo {idx + 1}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                            {val ? (
                              <img src={val} alt="" style={{ width: '72px', height: '54px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--a-border)', flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: '72px', height: '54px', borderRadius: '8px', border: '2px dashed var(--a-border)', background: 'linear-gradient(135deg,#0e1e3a,#070B14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--a-text2)', flexShrink: 0 }}>vide</div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                              <label style={{ cursor: 'pointer' }}>
                                <input type="file" accept="image/*" hidden onChange={async e => {
                                  const file = e.target.files?.[0]; if (!file) return
                                  const fd = new FormData(); fd.append('files', file)
                                  try {
                                    const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd })
                                    if (!res.ok) throw new Error(`HTTP ${res.status}`)
                                    const { urls } = await res.json()
                                    if (urls[0]) updateKey(key, urls[0])
                                  } catch (err) { setUploadError(err instanceof Error ? err.message : 'Erreur') }
                                  e.target.value = ''
                                }} />
                                <span className="btn-action proexcel-btn-admin-upload-action" style={{ display: 'inline-block', cursor: 'pointer', fontSize: '0.75rem' }}>📷 Upload</span>
                              </label>
                              {val && <button className="btn-action btn-action-red proexcel-btn-admin-danger-action" style={{ fontSize: '0.72rem' }} onClick={() => updateKey(key, '')}>Supprimer</button>}
                            </div>
                          </div>
                          {val && <input className="s-input" style={{ fontSize: '0.72rem', fontFamily: 'monospace' }} value={val} onChange={e => updateKey(key, e.target.value)} />}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* ── STATS ── */}
                <div className="sp-section-title">Statistiques (chiffres clés)</div>
                <div className="settings-card" style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    {aboutStats.map((stat, i) => (
                      <div key={i} style={{ background: 'var(--a-bg)', border: '1px solid var(--a-border)', borderRadius: '12px', padding: '1rem' }}>
                        <div className="s-label">Chiffre {i + 1}</div>
                        <input className="s-input" style={{ marginBottom: '0.5rem', fontWeight: 700 }} placeholder="Ex: 10+" value={stat.num} onChange={e => setAboutStats(prev => prev.map((s, j) => j === i ? { ...s, num: e.target.value } : s))} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <div>
                            <div className="s-label">Label 🇫🇷</div>
                            <input className="s-input" value={stat.labelFr} onChange={e => setAboutStats(prev => prev.map((s, j) => j === i ? { ...s, labelFr: e.target.value } : s))} />
                          </div>
                          <div>
                            <div className="s-label">Label 🇲🇦</div>
                            <input className="s-input" dir="rtl" value={stat.labelAr} onChange={e => setAboutStats(prev => prev.map((s, j) => j === i ? { ...s, labelAr: e.target.value } : s))} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── VALUES ── */}
                <div className="sp-section-title">Section Valeurs "Ce qui nous différencie"</div>
                <div className="settings-card" style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div><div className="s-label">Tag 🇫🇷</div><input className="s-input" value={settings.about_val_tag_fr} onChange={e => updateKey('about_val_tag_fr', e.target.value)} /></div>
                    <div><div className="s-label">الوسم 🇲🇦</div><input className="s-input" dir="rtl" value={settings.about_val_tag_ar} onChange={e => updateKey('about_val_tag_ar', e.target.value)} /></div>
                    <div><div className="s-label">Titre 🇫🇷</div><input className="s-input" value={settings.about_val_h2_fr} onChange={e => updateKey('about_val_h2_fr', e.target.value)} /></div>
                    <div><div className="s-label">العنوان 🇲🇦</div><input className="s-input" dir="rtl" value={settings.about_val_h2_ar} onChange={e => updateKey('about_val_h2_ar', e.target.value)} /></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {aboutValues.map((val, i) => (
                      <div key={i} style={{ background: 'var(--a-bg)', border: '1px solid var(--a-border)', borderRadius: '12px', padding: '1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--a-primary)', marginBottom: '0.75rem' }}>Carte {i + 1}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                          <div><div className="s-label">Titre 🇫🇷</div><input className="s-input" value={val.titleFr} onChange={e => setAboutValues(prev => prev.map((v, j) => j === i ? { ...v, titleFr: e.target.value } : v))} /></div>
                          <div><div className="s-label">العنوان 🇲🇦</div><input className="s-input" dir="rtl" value={val.titleAr} onChange={e => setAboutValues(prev => prev.map((v, j) => j === i ? { ...v, titleAr: e.target.value } : v))} /></div>
                          <div><div className="s-label">Description 🇫🇷</div><textarea className="s-input" style={{ minHeight: '60px', resize: 'vertical' }} value={val.descFr} onChange={e => setAboutValues(prev => prev.map((v, j) => j === i ? { ...v, descFr: e.target.value } : v))} /></div>
                          <div><div className="s-label">الوصف 🇲🇦</div><textarea className="s-input" dir="rtl" style={{ minHeight: '60px', resize: 'vertical' }} value={val.descAr} onChange={e => setAboutValues(prev => prev.map((v, j) => j === i ? { ...v, descAr: e.target.value } : v))} /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── CTA ── */}
                <div className="sp-section-title">Bouton d&apos;appel à l&apos;action (bas de page)</div>
                <div className="settings-card">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div><div className="s-label">Titre 🇫🇷</div><input className="s-input" value={settings.about_cta_title_fr} onChange={e => updateKey('about_cta_title_fr', e.target.value)} /></div>
                    <div><div className="s-label">العنوان 🇲🇦</div><input className="s-input" dir="rtl" value={settings.about_cta_title_ar} onChange={e => updateKey('about_cta_title_ar', e.target.value)} /></div>
                    <div><div className="s-label">Sous-titre 🇫🇷</div><input className="s-input" value={settings.about_cta_sub_fr} onChange={e => updateKey('about_cta_sub_fr', e.target.value)} /></div>
                    <div><div className="s-label">الوصف 🇲🇦</div><input className="s-input" dir="rtl" value={settings.about_cta_sub_ar} onChange={e => updateKey('about_cta_sub_ar', e.target.value)} /></div>
                    <div><div className="s-label">Texte bouton 🇫🇷</div><input className="s-input" value={settings.about_cta_btn_fr} onChange={e => updateKey('about_cta_btn_fr', e.target.value)} /></div>
                    <div><div className="s-label">نص الزر 🇲🇦</div><input className="s-input" dir="rtl" value={settings.about_cta_btn_ar} onChange={e => updateKey('about_cta_btn_ar', e.target.value)} /></div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: CONTACT & LOCALISATION */}
            {activeTab === 'tab-contact' && (
              <div className="settings-panel active">
                <div className="sp-section-title">Localisation & Map</div>
                <div className="settings-card" style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'grid', gap: '1.25rem' }}>
                    <div>
                      <div className="s-label">Iframe Google Maps (Code d'intégration)</div>
                      <textarea 
                        className="s-input" 
                        style={{ minHeight: '100px', fontFamily: 'monospace', fontSize: '0.8rem' }}
                        placeholder='<iframe src="..." ...></iframe>'
                        value={settings.store_map_iframe} 
                        onChange={e => updateKey('store_map_iframe', e.target.value)} 
                      />
                      <p style={{ fontSize: '0.72rem', color: 'var(--a-text2)', marginTop: '0.4rem' }}>
                        Allez sur Google Maps › Partager › Intégrer une carte › Copier le contenu HTML
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <div className="s-label">Ville</div>
                        <select className="s-input" value={settings.store_city} onChange={e => updateKey('store_city', e.target.value)}>
                          {MOROCCAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                      </div>
                      <div>
                        <div className="s-label">Adresse physique</div>
                        <input className="s-input" value={settings.store_address} onChange={e => updateKey('store_address', e.target.value)} placeholder="Ex: 123 Rue de la Liberté, Casablanca" />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <div className="s-label">Téléphone</div>
                        <div style={{ position: 'relative' }}>
                          <Phone size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--a-text2)' }} />
                          <input className="s-input" style={{ paddingLeft: '36px' }} value={settings.store_phone} onChange={e => updateKey('store_phone', e.target.value)} placeholder="+212 6..." />
                        </div>
                      </div>
                      <div>
                        <div className="s-label">WhatsApp</div>
                        <div style={{ position: 'relative' }}>
                          <MessageCircle size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--a-text2)' }} />
                          <input className="s-input" style={{ paddingLeft: '36px' }} value={settings.store_whatsapp} onChange={e => updateKey('store_whatsapp', e.target.value)} placeholder="2126..." />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="s-label">Email de contact</div>
                      <div style={{ position: 'relative' }}>
                        <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--a-text2)' }} />
                        <input className="s-input" style={{ paddingLeft: '36px' }} value={settings.store_email} onChange={e => updateKey('store_email', e.target.value)} placeholder="contact@..." />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sp-section-title">Horaires d'ouverture</div>
                <div className="settings-card">
                  <div className="hours-edit">
                    {[
                      { key: 'hours_mon', label: 'Lundi' },
                      { key: 'hours_tue', label: 'Mardi' },
                      { key: 'hours_wed', label: 'Mercredi' },
                      { key: 'hours_thu', label: 'Jeudi' },
                      { key: 'hours_fri', label: 'Vendredi' },
                      { key: 'hours_sat', label: 'Samedi' },
                      { key: 'hours_sun', label: 'Dimanche' },
                    ].map(day => (
                      <div key={day.key} className="hours-row">
                        <div className="hours-day">
                          <Clock size={14} style={{ marginRight: '8px', opacity: 0.5 }} />
                          {day.label}
                        </div>
                        <div className="hours-time">
                          <input
                            className="s-input"
                            style={{ flex: 1 }}
                            value={settings[day.key as keyof typeof settings]}
                            onChange={e => updateKey(day.key, e.target.value)}
                            placeholder="Ex: 09:00 - 18:00"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MARKETING & PIXELS */}
            {activeTab === 'tab-marketing' && (
              <div className="settings-panel active">
                <div className="sp-section-title">Livraison</div>
                <div className="settings-card" style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <div className="s-label">Tarif de livraison (DH)</div>
                      <input className="s-input" type="number" value={settings.delivery_fee} onChange={e => updateKey('delivery_fee', e.target.value)} />
                    </div>
                    <div>
                      <div className="s-label">Livraison gratuite à partir de (DH)</div>
                      <input className="s-input" type="number" value={settings.free_delivery_min} onChange={e => updateKey('free_delivery_min', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="sp-section-title">Codes Promo</div>
                <div className="settings-card" style={{ marginBottom: '2rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '1rem' }}>Saisissez vos codes promo au format JSON. Exemple: <code>[{"{"}"code":"PROMO10","discount":10,"type":"amount"{"}"}]</code></p>
                  <textarea
                    className="s-input"
                    style={{ minHeight: '120px', fontFamily: 'monospace', fontSize: '0.85rem' }}
                    value={settings.promo_codes}
                    onChange={e => updateKey('promo_codes', e.target.value)}
                  />
                </div>

                <div className="sp-section-title">Pixels de Suivi (Tracking)</div>
                <div className="settings-card">
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <div className="s-label">Facebook Pixel ID</div>
                      <input className="s-input" value={settings.pixel_fb} onChange={e => updateKey('pixel_fb', e.target.value)} placeholder="Ex: 123456789012345" />
                    </div>
                    <div>
                      <div className="s-label">TikTok Pixel ID</div>
                      <input className="s-input" value={settings.pixel_tiktok} onChange={e => updateKey('pixel_tiktok', e.target.value)} placeholder="Ex: CA123456789" />
                    </div>
                    <div>
                      <div className="s-label">Google Analytics / Ads (G-XXXXX)</div>
                      <input className="s-input" value={settings.pixel_google} onChange={e => updateKey('pixel_google', e.target.value)} placeholder="Ex: G-ABCDEFGH12" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BUTTON DESIGN MANAGER */}
            {activeTab === 'tab-btn-design' && (
              <div className="settings-panel active">
                <div className="bd-hero" style={{ 
                  background: 'linear-gradient(145deg, #0f172a 0%, #161c2d 100%)', 
                  color: '#fff', 
                  borderRadius: '32px', 
                  padding: '4.5rem 3.5rem', 
                  marginBottom: '3rem', 
                  boxShadow: '0 30px 70px rgba(0,0,0,0.25)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  position: 'relative', 
                  overflow: 'hidden', 
                  border: '1px solid rgba(255,255,255,0.06)' 
                }}>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="bd-eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '5px', fontSize: '0.65rem', fontWeight: 900, marginBottom: '1.25rem', color: '#6366f1' }}>Design Engine v2.0</div>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: 950, marginBottom: '1.5rem', letterSpacing: '-0.04em', lineHeight: 0.95 }}>Boutons <br/><span style={{ color: 'var(--a-primary)' }}>Interactifs</span></h2>
                    <p style={{ fontSize: '1.1rem', opacity: 0.65, maxWidth: '560px', lineHeight: 1.8, fontWeight: 500 }}>Personnalisez l&apos;expérience tactile de votre boutique. Ajustez les formes, les couleurs et les animations pour créer une interface qui respire le luxe.</p>
                  </div>
                  <div className="bd-hero-stat" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(30px)', borderRadius: '28px', padding: '2.5rem 3.5rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 2, boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                      <strong style={{ fontSize: '4.5rem', fontWeight: 950, display: 'block', color: '#fff', lineHeight: 1 }}>{BUTTON_PAGES.reduce((sum, page) => sum + page.buttons.length, 0)}</strong>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.5, letterSpacing: '3px', marginTop: '4px', display: 'block' }}>Composants Gérés</span>
                  </div>
                  <div style={{ position: 'absolute', right: '-5%', top: '-20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                  <div style={{ position: 'absolute', left: '20%', bottom: '-15%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(232,53,42,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                </div>

                <div className="bd-tabs" style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  marginBottom: '2.5rem', 
                  background: 'rgba(0,0,0,0.02)', 
                  padding: '0.6rem', 
                  borderRadius: '24px', 
                  border: '1px solid var(--a-border)', 
                  overflowX: 'auto', 
                  whiteSpace: 'nowrap',
                  scrollbarWidth: 'none'
                }}>
                  {BUTTON_PAGES.map(page => (
                    <button
                      key={page.id}
                      type="button"
                      className={`bd-tab ${activeBtnPage === page.id ? 'active' : ''}`}
                      onClick={() => { setActiveBtnPage(page.id); setEditingBtn(null) }}
                      style={{
                        padding: '0.85rem 1.75rem',
                        borderRadius: '18px',
                        border: 'none',
                        background: activeBtnPage === page.id ? 'var(--a-primary)' : 'transparent',
                        color: activeBtnPage === page.id ? '#fff' : 'var(--a-text2)',
                        fontWeight: activeBtnPage === page.id ? 800 : 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: activeBtnPage === page.id ? '0 10px 25px -5px rgba(232, 53, 42, 0.4)' : 'none'
                      }}
                    >
                      {page.label}
                      <small style={{ 
                        background: activeBtnPage === page.id ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)', 
                        color: activeBtnPage === page.id ? '#fff' : 'var(--a-text2)', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '8px', 
                        fontSize: '0.7rem',
                        fontWeight: 900
                      }}>{page.buttons.length}</small>
                    </button>
                  ))}
                </div>

                {BUTTON_PAGES.filter(p => p.id === activeBtnPage).map(page => (
                  <div key={page.id} className="bd-list" style={{ display: 'grid', gap: '1rem' }}>
                    {page.buttons.map(btn => {
                      const style = getBtnStyle(btn.id, btn.default)
                      const bg = previewBg(style)
                      const isEditing = editingBtn === btn.id
                      const update = (field: keyof ButtonStyle, val: string) => updateBtnDraft(btn.id, btn.default, field, val)

                      return (
                        <div key={btn.id} className="bd-row-wrap" style={{ borderRadius: '24px', overflow: 'hidden', border: isEditing ? '2.5px solid var(--a-primary)' : '1px solid var(--a-border)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', background: 'var(--a-card)', boxShadow: isEditing ? '0 30px 60px rgba(0,0,0,0.12)' : 'var(--a-shadow)' }}>
                          <div className={`bd-button-row`} style={{ padding: '1.5rem 2.5rem', display: 'flex', alignItems: 'center', gap: '3rem' }}>
                            <div style={{ minWidth: '180px', display: 'flex', justifyContent: 'center', perspective: '800px' }}>
                              <button className={`proexcel-btn-${btn.id}`} style={{ 
                                pointerEvents: 'none',
                                transform: 'rotateY(-10deg) rotateX(5deg)'
                              }}>
                                {btn.label}
                              </button>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--a-text)', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>{btn.label}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--a-text2)', fontWeight: 600, opacity: 0.7 }}>Emplacement : {btn.location}</div>
                            </div>
                            <div className="desk-only" style={{ background: 'rgba(232,53,42,0.05)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--a-primary)', border: '1px solid rgba(232,53,42,0.1)' }}>
                              .proexcel-btn-{btn.id}
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                              <button 
                                className={`btn-action ${isEditing ? 'proexcel-btn-admin-primary-action' : 'proexcel-btn-admin-secondary-action'}`} 
                                onClick={() => setEditingBtn(isEditing ? null : btn.id)}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, minWidth: '140px' }}
                              >
                                {isEditing ? 'Fermer' : 'Personnaliser'}
                              </button>
                            </div>
                          </div>

                          {isEditing && (
                            <div className="bd-editor-panel" style={{ background: 'var(--a-bg)', borderTop: '1px solid var(--a-border)', display: 'grid', gridTemplateColumns: '380px 1fr' }}>
                              
                              {/* STICKY LIVE PREVIEW SIDEBAR */}
                              <div style={{ padding: '2.5rem', borderRight: '1px solid var(--a-border)', position: 'sticky', top: 0, alignSelf: 'start', height: 'fit-content' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--a-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                  Live Preview System
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => setPreviewTheme('light')} style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#fff', border: '1px solid #ddd', cursor: 'pointer', outline: previewTheme === 'light' ? '2px solid var(--a-primary)' : 'none' }} />
                                    <button onClick={() => setPreviewTheme('dark')} style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#0f172a', border: '1px solid #334155', cursor: 'pointer', outline: previewTheme === 'dark' ? '2px solid var(--a-primary)' : 'none' }} />
                                  </div>
                                </div>

                                <div style={{ 
                                  background: previewTheme === 'dark' ? '#0f172a' : '#f8fafc',
                                  backgroundImage: previewTheme === 'dark' ? 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)' : 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.02) 1px, transparent 0)',
                                  backgroundSize: '20px 20px',
                                  borderRadius: '24px', 
                                  padding: '4rem 2rem', 
                                  display: 'flex', 
                                  flexDirection: 'column',
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  minHeight: '260px',
                                  border: '1px solid var(--a-border)',
                                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)',
                                  position: 'relative',
                                  overflow: 'hidden'
                                }}>
                                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.65rem', fontWeight: 800, color: previewTheme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', textTransform: 'uppercase' }}>
                                    Mode {previewTheme}
                                  </div>
                                  
                                  {/* THE REAL BUTTON PREVIEW */}
                                   {/* THE REAL BUTTON PREVIEW */}
                                   <ButtonDraftPreview 
                                     btnId={btn.id} 
                                     label={btn.label} 
                                     style={style} 
                                     state={previewState} 
                                   />

                                 </div>

                                 <div style={{ display: 'flex', background: 'var(--a-card)', padding: '0.4rem', borderRadius: '12px', marginTop: '1.5rem', border: '1px solid var(--a-border)' }}>
                                   {(['normal', 'hover', 'active'] as const).map(s => (
                                     <button
                                       key={s}
                                       onClick={() => setPreviewState(s)}
                                       style={{
                                         flex: 1,
                                         padding: '0.5rem',
                                         borderRadius: '8px',
                                         border: 'none',
                                         background: previewState === s ? 'var(--a-primary)' : 'transparent',
                                         color: previewState === s ? '#fff' : 'var(--a-text2)',
                                         fontSize: '0.75rem',
                                         fontWeight: 700,
                                         cursor: 'pointer',
                                         textTransform: 'capitalize'
                                       }}
                                     >
                                       {s}
                                     </button>
                                   ))}
                                 </div>

                                 <div style={{ marginTop: '2.5rem', display: 'grid', gap: '1rem' }}>
                                   <button 
                                     className="proexcel-btn-admin-primary-action" 
                                     onClick={() => commitBtnStyle(btn.id)}
                                     style={{ width: '100%', padding: '1rem', borderRadius: '16px', fontWeight: 900, fontSize: '0.95rem', boxShadow: '0 10px 30px rgba(232, 53, 42, 0.3)' }}
                                   >
                                     Enregistrer les modifications
                                   </button>
                                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                     <button 
                                       className="proexcel-btn-admin-secondary-action" 
                                       onClick={() => resetBtnDraft(btn.id)}
                                       style={{ padding: '0.85rem', borderRadius: '14px', fontSize: '0.8rem', fontWeight: 800, border: '1.5px solid var(--a-border)' }}
                                     >
                                       Réinitialiser le draft
                                     </button>
                                     <button 
                                       className="proexcel-btn-admin-danger-action" 
                                       onClick={() => { resetBtnStyle(btn.id); setEditingBtn(null); }}
                                       style={{ padding: '0.85rem', borderRadius: '14px', fontSize: '0.8rem', fontWeight: 800, background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: '1.5px solid rgba(239, 68, 68, 0.2)' }}
                                     >
                                       Style original
                                     </button>
                                   </div>
                                 </div>
                              </div>

                              {/* EDITOR CONTROLS */}
                              <div className="bd-editor-panel" style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
                                  
                                  {/* SECTION: FOND & TEXTE */}
                                  <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--a-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>Couleurs & Fond</div>
                                    <div className="s-field" style={{ marginBottom: '1.25rem' }}>
                                      <div className="s-label">Type d'arrière-plan</div>
                                      <select className="s-input" value={style.bgType} onChange={e => update('bgType', e.target.value as any)}>
                                        <option value="solid">Couleur unie</option>
                                        <option value="gradient">Dégradé premium</option>
                                      </select>
                                    </div>

                                    {style.bgType === 'solid' ? (
                                      <div className="s-field" style={{ marginBottom: '1.25rem' }}>
                                        <div className="s-label">Couleur de fond</div>
                                        <div className="color-field">
                                          <div className="color-swatch-wrap"><input type="color" value={colorInputValue(style.bgColor)} onChange={e => update('bgColor', e.target.value)} /></div>
                                          <input className="s-input" style={{ fontFamily: 'monospace' }} value={style.bgColor} onChange={e => update('bgColor', e.target.value)} />
                                        </div>
                                      </div>
                                    ) : (
                                      <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                          <div>
                                            <div className="s-label">Début</div>
                                            <div className="color-field">
                                              <div className="color-swatch-wrap"><input type="color" value={style.gradColor1} onChange={e => update('gradColor1', e.target.value)} /></div>
                                              <input className="s-input" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }} value={style.gradColor1} onChange={e => update('gradColor1', e.target.value)} />
                                            </div>
                                          </div>
                                          <div>
                                            <div className="s-label">Fin</div>
                                            <div className="color-field">
                                              <div className="color-swatch-wrap"><input type="color" value={style.gradColor2} onChange={e => update('gradColor2', e.target.value)} /></div>
                                              <input className="s-input" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }} value={style.gradColor2} onChange={e => update('gradColor2', e.target.value)} />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="s-field">
                                          <div className="s-label">Direction</div>
                                          <select className="s-input" value={style.gradDir} onChange={e => update('gradDir', e.target.value)}>
                                            <option value="135deg">Diagonale (135°)</option>
                                            <option value="90deg">Vertical (90°)</option>
                                            <option value="180deg">Inversé (180°)</option>
                                            <option value="0deg">Horizontal (0°)</option>
                                          </select>
                                        </div>
                                      </div>
                                    )}

                                    <div className="s-field">
                                      <div className="s-label">Couleur du texte</div>
                                      <div className="color-field">
                                        <div className="color-swatch-wrap"><input type="color" value={colorInputValue(style.textColor)} onChange={e => update('textColor', e.target.value)} /></div>
                                        <input className="s-input" style={{ fontFamily: 'monospace' }} value={style.textColor} onChange={e => update('textColor', e.target.value)} />
                                      </div>
                                    </div>

                                    <div className="s-field" style={{ marginTop: '1.25rem' }}>
                                      <div className="s-label">Type Fond au survol</div>
                                      <select className="s-input" value={style.hoverBgType ?? style.bgType} onChange={e => update('hoverBgType', e.target.value as 'solid' | 'gradient')}>
                                        <option value="solid">Couleur unie</option>
                                        <option value="gradient">Dégradé</option>
                                      </select>
                                    </div>

                                    {(style.hoverBgType ?? style.bgType) === 'solid' ? (
                                      <div className="s-field" style={{ marginTop: '1rem' }}>
                                        <div className="s-label">Hover BG</div>
                                        <div className="color-field">
                                          <div className="color-swatch-wrap"><input type="color" value={colorInputValue(style.hoverBgColor)} onChange={e => update('hoverBgColor', e.target.value)} /></div>
                                          <input className="s-input" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }} value={style.hoverBgColor} onChange={e => update('hoverBgColor', e.target.value)} />
                                        </div>
                                      </div>
                                    ) : (
                                      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                          <div>
                                            <div className="s-label">Hover Début</div>
                                            <div className="color-field">
                                              <div className="color-swatch-wrap"><input type="color" value={colorInputValue(style.hoverGradColor1)} onChange={e => update('hoverGradColor1', e.target.value)} /></div>
                                              <input className="s-input" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }} value={style.hoverGradColor1} onChange={e => update('hoverGradColor1', e.target.value)} />
                                            </div>
                                          </div>
                                          <div>
                                            <div className="s-label">Hover Fin</div>
                                            <div className="color-field">
                                              <div className="color-swatch-wrap"><input type="color" value={colorInputValue(style.hoverGradColor2)} onChange={e => update('hoverGradColor2', e.target.value)} /></div>
                                              <input className="s-input" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }} value={style.hoverGradColor2} onChange={e => update('hoverGradColor2', e.target.value)} />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    <div className="s-field" style={{ marginTop: '1rem' }}>
                                      <div className="s-label">Hover Text</div>
                                      <div className="color-field">
                                        <div className="color-swatch-wrap"><input type="color" value={colorInputValue(style.hoverTextColor)} onChange={e => update('hoverTextColor', e.target.value)} /></div>
                                        <input className="s-input" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }} value={style.hoverTextColor} onChange={e => update('hoverTextColor', e.target.value)} />
                                      </div>
                                    </div>

                                    <div className="s-field" style={{ marginTop: '1.25rem' }}>
                                      <div className="s-label">Bordure (Couleur, Épaisseur, Style)</div>
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                                        <div className="color-field">
                                          <div className="color-swatch-wrap"><input type="color" value={colorInputValue(style.borderColor)} onChange={e => update('borderColor', e.target.value)} /></div>
                                          <input className="s-input" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }} value={style.borderColor} onChange={e => update('borderColor', e.target.value)} />
                                        </div>
                                        <input className="s-input" value={style.borderWidth} onChange={e => update('borderWidth', e.target.value)} placeholder="1.5px" />
                                        <select className="s-input" value={style.borderStyle} onChange={e => update('borderStyle', e.target.value)}>
                                          <option value="solid">Solid</option>
                                          <option value="dashed">Dashed</option>
                                          <option value="dotted">Dotted</option>
                                          <option value="double">Double</option>
                                          <option value="none">None</option>
                                        </select>
                                      </div>
                                    </div>

                                    <div className="s-field" style={{ marginTop: '1.25rem' }}>
                                      <div className="s-label">Bordure au survol (Hover)</div>
                                      <div className="color-field">
                                        <div className="color-swatch-wrap"><input type="color" value={colorInputValue(style.hoverBorderColor || style.borderColor)} onChange={e => update('hoverBorderColor', e.target.value)} /></div>
                                        <input className="s-input" style={{ fontFamily: 'monospace' }} value={style.hoverBorderColor || ''} onChange={e => update('hoverBorderColor', e.target.value)} placeholder="Hérité..." />
                                      </div>
                                    </div>
                                  </div>

                                  {/* SECTION: TYPOGRAPHIE & TAILLE */}
                                  <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--a-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>Typographie & Spacing</div>
                                    <div className="s-field" style={{ marginBottom: '1.25rem' }}>
                                      <div className="s-label">Taille police ({style.fontSize})</div>
                                      <input type="range" min="10" max="24" step="1" value={parseInt(style.fontSize) || 14} onChange={e => update('fontSize', `${e.target.value}px`)} style={{ width: '100%' }} />
                                    </div>
                                    <div className="s-field" style={{ marginBottom: '1.25rem' }}>
                                      <div className="s-label">Épaisseur police</div>
                                      <select className="s-input" value={style.fontWeight} onChange={e => update('fontWeight', e.target.value)}>
                                        <option value="400">400 (Normal)</option>
                                        <option value="500">500 (Médium)</option>
                                        <option value="600">600 (Semi-gras)</option>
                                        <option value="700">700 (Gras)</option>
                                        <option value="800">800 (Extra-gras)</option>
                                        <option value="900">900 (Noir)</option>
                                      </select>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                      <div className="s-field">
                                        <div className="s-label">Padding H ({style.paddingX})</div>
                                        <input type="range" min="4" max="60" step="1" value={parseInt(style.paddingX) || 16} onChange={e => update('paddingX', `${e.target.value}px`)} style={{ width: '100%' }} />
                                      </div>
                                      <div className="s-field">
                                        <div className="s-label">Padding V ({style.paddingY})</div>
                                        <input type="range" min="4" max="40" step="1" value={parseInt(style.paddingY) || 12} onChange={e => update('paddingY', `${e.target.value}px`)} style={{ width: '100%' }} />
                                      </div>
                                    </div>
                                    <div className="s-field" style={{ marginTop: '1.25rem' }}>
                                      <div className="s-label">Taille Icône ({style.iconSize})</div>
                                      <input type="range" min="0.8" max="2.5" step="0.1" value={parseFloat(style.iconSize) || 1.2} onChange={e => update('iconSize', `${e.target.value}em`)} style={{ width: '100%' }} />
                                    </div>
                                  </div>

                                  {/* SECTION: SURVOL & EFFETS */}
                                  <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--a-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>Interactivité & Effets</div>
                                    <div className="s-field" style={{ marginBottom: '1.25rem' }}>
                                      <div className="s-label">Animation au survol</div>
                                      <select className="s-input" value={style.hoverEffect} onChange={e => update('hoverEffect', e.target.value as any)}>
                                        <option value="lift">Élévation (Premium Lift)</option>
                                        <option value="scale">Effet Zoom (Scale Up)</option>
                                        <option value="glow">Luminescence (Glow)</option>
                                        <option value="slide">Glissement (Slide)</option>
                                        <option value="underline">Soulignement (Underline)</option>
                                        <option value="none">Aucune</option>
                                      </select>
                                    </div>
                                    <div className="s-field" style={{ marginBottom: '1.25rem' }}>
                                      <div className="s-label">Intensité de l'ombre ({style.shadowIntensity})</div>
                                      <input type="range" min="0" max="3" step="0.1" value={style.shadowIntensity || 1} onChange={e => update('shadowIntensity', e.target.value)} style={{ width: '100%' }} />
                                    </div>
                                    <div className="s-field" style={{ marginBottom: '1.25rem' }}>
                                      <div className="s-label">Arrondi ({style.borderRadius})</div>
                                      <input type="range" min="0" max="100" step="1" value={parseInt(style.borderRadius) || 10} onChange={e => update('borderRadius', `${e.target.value}px`)} style={{ width: '100%' }} />
                                    </div>
                                    <div className="s-field">
                                      <div className="s-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Ombre portée (Box Shadow)</span>
                                        <button
                                          onClick={() => {
                                            const hex = style.bgType === 'gradient' ? style.gradColor1 : style.bgColor
                                            const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
                                            update('boxShadow', `0 12px 28px rgba(${r},${g},${b},0.35)`)
                                          }}
                                          style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--a-primary)', background: 'rgba(232,53,42,0.08)', border: '1px solid rgba(232,53,42,0.2)', borderRadius: '6px', padding: '0.15rem 0.5rem', cursor: 'pointer' }}
                                        >Auto ✨</button>
                                      </div>
                                      <textarea className="s-input" style={{ fontSize: '0.72rem', height: '60px', fontFamily: 'monospace' }} value={style.boxShadow} onChange={e => update('boxShadow', e.target.value)} placeholder="0 10px 20px rgba(0,0,0,0.1)" />
                                    </div>
                                    <div className="s-field" style={{ marginTop: '1.25rem' }}>
                                      <div className="s-label">Ombre au survol (Hover Shadow)</div>
                                      <textarea className="s-input" style={{ fontSize: '0.72rem', height: '60px', fontFamily: 'monospace' }} value={style.hoverBoxShadow || ''} onChange={e => update('hoverBoxShadow', e.target.value)} placeholder="Hérité..." />
                                    </div>

                                    {/* GLOW CONTROLS */}
                                    <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(232,53,42,0.04))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '14px', padding: '1.25rem', marginTop: '1.25rem' }}>
                                      <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        ✨ Glow Effect
                                      </div>
                                      <div className="s-field" style={{ marginBottom: '1rem' }}>
                                        <div className="s-label" style={{ marginBottom: '0.4rem' }}>Glow Normal</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px', gap: '0.5rem' }}>
                                          <div className="color-field">
                                            <div className="color-swatch-wrap"><input type="color" value={colorInputValue(style.glowColor || '', '#6366f1')} onChange={e => update('glowColor', e.target.value)} /></div>
                                            <input className="s-input" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }} value={style.glowColor || ''} onChange={e => update('glowColor', e.target.value)} placeholder="Désactivé" />
                                          </div>
                                          <input className="s-input" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }} value={style.glowBlur || ''} onChange={e => update('glowBlur', e.target.value)} placeholder="20px" />
                                        </div>
                                        {style.glowColor && (
                                          <button onClick={() => update('glowColor', '')} style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>✕ Supprimer glow</button>
                                        )}
                                      </div>
                                      <div className="s-field">
                                        <div className="s-label" style={{ marginBottom: '0.4rem' }}>Glow au survol</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px', gap: '0.5rem' }}>
                                          <div className="color-field">
                                            <div className="color-swatch-wrap"><input type="color" value={colorInputValue(style.hoverGlowColor || '', '#e8352a')} onChange={e => update('hoverGlowColor', e.target.value)} /></div>
                                            <input className="s-input" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }} value={style.hoverGlowColor || ''} onChange={e => update('hoverGlowColor', e.target.value)} placeholder="Désactivé" />
                                          </div>
                                          <input className="s-input" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }} value={style.hoverGlowBlur || ''} onChange={e => update('hoverGlowBlur', e.target.value)} placeholder="25px" />
                                        </div>
                                        {style.hoverGlowColor && (
                                          <button onClick={() => update('hoverGlowColor', '')} style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>✕ Supprimer glow hover</button>
                                        )}
                                      </div>
                                    </div>

                                    <div className="s-field" style={{ marginTop: '1.25rem' }}>
                                      <div className="s-label">Vitesse Transition ({style.transition})</div>
                                      <input className="s-input" value={style.transition} onChange={e => update('transition', e.target.value)} placeholder="300ms" />
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}

                <div style={{ marginTop: '3rem', padding: '2.5rem', borderRadius: '24px', background: 'var(--a-card)', border: '1px solid var(--a-border)', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(232,53,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--a-primary)' }}>
                    <Sparkles size={30} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--a-text)' }}>Conseil de Design ProExcel</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--a-text2)', lineHeight: 1.6, maxWidth: '800px' }}>
                      Pour un look "Apple-style" premium, utilisez des arrondis entre 10px et 14px, des dégradés subtils et une ombre portée douce. Les animations de type "Élévation" augmentent considérablement le taux de conversion de vos boutons d&apos;appel à l&apos;action.
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* TAB: ANALYTICS */}
            {activeTab === 'tab-analytics' && (
              <div className="settings-panel active">
                <div className="sp-section-title">Rentabilité & Analytiques</div>
                
                {(() => {
                  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
                  const totalCost = orders.reduce((sum, o) => {
                    let orderCost = 0
                    const cart = Array.isArray(o.cart) ? o.cart : (typeof o.cart === 'string' ? JSON.parse(o.cart) : [])
                    cart.forEach((item: any) => {
                      const product = products.find(p => p.id === (item.id || item.productId))
                      if (product?.costPrice) {
                        orderCost += product.costPrice * (item.qty || item.quantity || 1)
                      }
                    });
                    return sum + orderCost
                  }, 0)
                  const netProfit = totalRevenue - totalCost
                  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
                  const target = parseFloat(settings.analytics_target_margin) || 30

                  return (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                        <div className="settings-card" style={{ background: 'var(--a-card)', border: '1px solid var(--a-border)', padding: '2rem' }}>
                          <div style={{ color: 'var(--a-text2)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>REVENUS BRUTS</div>
                          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--a-text)' }}>{totalRevenue.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 600 }}>MAD</span></div>
                        </div>
                        <div className="settings-card" style={{ background: 'var(--a-card)', border: '1px solid var(--a-border)', padding: '2rem' }}>
                          <div style={{ color: 'var(--a-text2)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>COÛT TOTAL (STOCK)</div>
                          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ef4444' }}>- {totalCost.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 600 }}>MAD</span></div>
                        </div>
                        <div className="settings-card" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, transparent 100%)', border: '2px solid rgba(34,197,94,0.2)', padding: '2rem' }}>
                          <div style={{ color: 'var(--a-text2)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>BÉNÉFICE NET</div>
                          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#22c55e' }}>{netProfit.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 600 }}>MAD</span></div>
                        </div>
                      </div>

                      <div className="settings-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--a-text)' }}>Marge Bénéficiaire Globale</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--a-text2)' }}>Calculé sur la base de {orders.length} commandes</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: margin >= target ? '#22c55e' : '#eab308' }}>{margin.toFixed(1)}%</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--a-text2)' }}>Objectif : {target}%</div>
                          </div>
                        </div>
                        <div style={{ height: '12px', background: 'var(--a-bg)', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(margin, 100)}%`, height: '100%', background: margin >= target ? '#22c55e' : '#eab308', transition: 'width 1s ease' }} />
                        </div>
                      </div>

                      <div className="settings-card" style={{ padding: '2rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--a-text)', marginBottom: '1.5rem' }}>Configuration des Objectifs</div>
                        <div className="s-group" style={{ maxWidth: '300px' }}>
                          <div className="s-label">Marge cible (%)</div>
                          <input type="number" className="s-input" value={settings.analytics_target_margin} onChange={e => updateKey('analytics_target_margin', e.target.value)} />
                          <p style={{ fontSize: '0.72rem', color: 'var(--a-text2)', marginTop: '0.5rem' }}>Une alerte visuelle s&apos;affichera si la marge réelle descend sous ce seuil.</p>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* TAB: ADVANCED */}
            {activeTab === 'tab-advanced' && (
              <div className="settings-panel active">
                <div className="sp-section-title">Configuration Avancée & SEO</div>
                <div className="settings-card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                      <div className="s-label">Titre SEO du site</div>
                      <input className="s-input" value={settings.seo_title} onChange={e => updateKey('seo_title', e.target.value)} />
                    </div>
                    <div>
                      <div className="s-label">Meta Description</div>
                      <textarea className="s-input" value={settings.seo_desc} onChange={e => updateKey('seo_desc', e.target.value)} />
                    </div>
                    <div>
                      <div className="s-label">Mots-clés (séparés par des virgules)</div>
                      <input className="s-input" value={settings.seo_keywords} onChange={e => updateKey('seo_keywords', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="sp-section-title" style={{ marginTop: '1.5rem' }}>Notifications Push</div>
                <div className="settings-card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <div className="s-label" style={{ fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                        Notifications de commandes
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--a-text2)', margin: 0, lineHeight: 1.5 }}>
                        Recevez une notification push sur cet appareil à chaque nouvelle commande.
                        Fonctionne sur Chrome desktop, Android Chrome et PWA.
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'flex-start' }}>
                      <button
                        onClick={enablePushNotifications}
                        disabled={pushStatus === 'loading' || pushStatus === 'success'}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          padding: '0.6rem 1.25rem', borderRadius: '9px', fontWeight: 700,
                          fontSize: '0.85rem', cursor: pushStatus === 'loading' || pushStatus === 'success' ? 'not-allowed' : 'pointer',
                          background: pushStatus === 'success' ? 'var(--a-green)' : 'var(--a-primary)',
                          color: '#fff', border: 'none', opacity: pushStatus === 'loading' ? 0.7 : 1,
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Bell size={15} />
                        {pushStatus === 'loading' ? 'Activation…'
                          : pushStatus === 'success' ? 'Notifications activées ✓'
                          : 'Activer les notifications de commandes'}
                      </button>
                      {pushStatus === 'success' && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--a-green)', fontWeight: 600 }}>
                          ✓ Notifications activées avec succès sur cet appareil.
                        </span>
                      )}
                      {pushStatus === 'denied' && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--a-red, #e53e3e)', fontWeight: 600 }}>
                          ✗ Permission refusée. Autorisez les notifications dans les paramètres du navigateur.
                        </span>
                      )}
                      {pushStatus === 'unsupported' && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--a-text2)', fontWeight: 600 }}>
                          ✗ Les notifications push ne sont pas supportées par ce navigateur.
                        </span>
                      )}
                      {pushStatus === 'error' && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--a-red, #e53e3e)', fontWeight: 600, wordBreak: 'break-word' }}>
                          ✗ {pushError || 'Échec de l\'activation. Consultez la console pour les détails.'}
                        </span>
                      )}

                      <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <button
                          onClick={sendTestNotification}
                          disabled={testStatus === 'loading'}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1rem', borderRadius: '9px', fontWeight: 600,
                            fontSize: '0.8rem', cursor: testStatus === 'loading' ? 'not-allowed' : 'pointer',
                            background: 'transparent', color: 'var(--a-primary)',
                            border: '1.5px solid var(--a-primary)',
                            opacity: testStatus === 'loading' ? 0.6 : 1,
                            transition: 'all 0.2s', whiteSpace: 'nowrap',
                          }}
                        >
                          {testStatus === 'loading' ? 'Envoi…' : '🔔 Envoyer une notification test'}
                        </button>
                        {testStatus === 'success' && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--a-green)', fontWeight: 600 }}>
                            ✓ {testMessage}
                          </span>
                        )}
                        {testStatus === 'error' && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--a-red, #e53e3e)', fontWeight: 600, wordBreak: 'break-word' }}>
                            ✗ {testMessage}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}



          </div>
        </div>
      </div>
    </div>
  )
}

function ButtonDraftPreview({ btnId, label, style, state }: { btnId: string, label: string, style: ButtonStyle, state: 'normal' | 'hover' | 'active' }) {
  const isHover = state === 'hover'
  const isActive = state === 'active'

  const effectiveHoverBgType = style.hoverBgType ?? style.bgType
  const finalBg = isHover
    ? (effectiveHoverBgType === 'gradient'
      ? `linear-gradient(${style.gradDir}, ${style.hoverGradColor1 || style.gradColor1} 0%, ${style.hoverGradColor2 || style.gradColor2} 100%)`
      : (style.hoverBgColor || style.bgColor))
    : (style.bgType === 'gradient'
      ? `linear-gradient(${style.gradDir}, ${style.gradColor1} 0%, ${style.gradColor2} 100%)`
      : style.bgColor)

  const finalTransform = isHover
    ? (style.hoverEffect === 'lift' ? 'translateY(-5px)' : style.hoverEffect === 'scale' ? 'scale(1.05)' : 'none')
    : (isActive ? 'scale(0.95)' : 'none')

  const normalGlow = style.glowColor ? `,0 0 ${style.glowBlur || '20px'} ${style.glowColor}` : ''
  const hoverGlow = style.hoverGlowColor ? `,0 0 ${style.hoverGlowBlur || '25px'} ${style.hoverGlowColor}` : ''
  const baseShadow = isHover ? (style.hoverBoxShadow || style.boxShadow) : style.boxShadow
  const glowSuffix = isHover ? hoverGlow : normalGlow

  const inlineStyles: React.CSSProperties = {
    background: finalBg,
    color: isHover ? (style.hoverTextColor || style.textColor) : style.textColor,
    border: `${style.borderWidth} ${style.borderStyle} ${isHover ? (style.hoverBorderColor || style.borderColor) : style.borderColor}`,
    borderRadius: style.borderRadius,
    padding: `${style.paddingY} ${style.paddingX}`,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight as any,
    boxShadow: `${baseShadow}${glowSuffix}`,
    transition: style.transition,
    transform: finalTransform,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    outline: 'none',
    whiteSpace: 'nowrap',
    textDecoration: isHover && style.hoverEffect === 'underline' ? 'underline' : 'none',
    filter: isHover && style.hoverEffect === 'glow' ? 'brightness(1.08) drop-shadow(0 0 8px currentColor)' : 'none'
  }

  let IconComp = null
  const s = parseFloat(style.iconSize) || 1.2
  const iconStyle = { fontSize: style.iconSize, width: `${s}em`, height: `${s}em` }

  if (btnId.includes('cart')) IconComp = <ShoppingCart style={iconStyle} />
  if (btnId.includes('map')) IconComp = <MapPin style={iconStyle} />
  if (btnId.includes('search')) IconComp = <FileText style={iconStyle} />
  if (btnId.includes('login') || btnId.includes('register')) IconComp = <User style={iconStyle} />
  if (btnId.includes('send')) IconComp = <Send style={iconStyle} />
  if (btnId.includes('checkout')) IconComp = <ShieldCheck style={iconStyle} />

  return (
    <div style={inlineStyles}>
      {IconComp}
      {label}
    </div>
  )
}
