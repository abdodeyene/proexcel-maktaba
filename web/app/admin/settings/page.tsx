'use client'
import { useEffect, useRef, useState } from 'react'

const TABS = [
  { id: 'tab-colors', icon: '🎨', title: 'Couleurs', sub: 'Thème & boutons' },
  { id: 'tab-store', icon: '🏪', title: 'Informations', sub: 'Logo, nom, contact' },
  { id: 'tab-slider', icon: '🖼️', title: 'Hero Slider', sub: 'Images & diapositives' },
  { id: 'tab-features', icon: '✨', title: 'Bandelette', sub: 'Icônes & textes sous slider' },
  { id: 'tab-home', icon: '🏠', title: 'Page d\'accueil', sub: 'Titres des sections' },
  { id: 'tab-about', icon: '📄', title: 'À Propos', sub: 'Images de la section histoire' },
  { id: 'tab-map', icon: '📍', title: 'Horaires', sub: 'Adresse & ouverture' },
  { id: 'tab-sales', icon: '📈', title: 'Marketing', sub: 'Livraison, Promos, Pixels' },
  { id: 'tab-advanced', icon: '🔧', title: 'Avancé', sub: 'SEO, scripts' },
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
}

type Feature = {
  icon: string
  titleFr: string
  titleAr: string
  subFr: string
  subAr: string
}

const DEFAULT_FEATURES: Feature[] = [
  { icon: '🚚', titleFr: 'Livraison 48h', titleAr: 'توصيل خلال 48 ساعة', subFr: 'Partout au Maroc', subAr: 'في جميع أنحاء المغرب' },
  { icon: '🔒', titleFr: 'Paiement Sécurisé', titleAr: 'دفع آمن', subFr: 'Transactions protégées', subAr: 'معاملات محمية' },
  { icon: '📚', titleFr: '1200+ Titres', titleAr: '+1200 عنوان', subFr: 'Catalogue complet', subAr: 'كتالوج شامل' },
  { icon: '⭐', titleFr: '15K+ Clients', titleAr: '+15000 عميل', subFr: 'Clients satisfaits', subAr: 'عملاء راضون' },
]

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('tab-colors')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [slides, setSlides] = useState<Slide[]>([
    { tag: 'Rentrée Scolaire 2026', title: 'Tous vos manuels', span: 'en un seul endroit', sub: 'Découvrez notre sélection complète de livres scolaires.', btn1: 'Explorer le catalogue ›', btn1Link: '/best-offers', btn2: 'En savoir plus', btn2Link: '/#about', image: '', bgColor1: '#0e1e3a', bgColor2: '#070B14' },
    { tag: 'Offres Spéciales', title: 'Économisez jusqu\'à', span: '30% sur les packs', sub: 'Livraison gratuite pour les commandes supérieures à 499 DH.', btn1: 'Voir les offres ›', btn1Link: '/best-offers', btn2: '', btn2Link: '', image: '', bgColor1: '#1a0a10', bgColor2: '#070B14' },
  ])
  const [slideUploading, setSlideUploading] = useState<number | null>(null)
  const slideImgRef = useRef<HTMLInputElement>(null)
  const [uploadingSlideIdx, setUploadingSlideIdx] = useState<number | null>(null)
  const [features, setFeatures] = useState<Feature[]>(DEFAULT_FEATURES)

  // Combined settings state
  const [settings, setSettings] = useState({
    col_primary: '#3b82f6',
    col_secondary: '#8b5cf6',
    col_promo: '#ef4444',
    col_success: '#22c55e',
    btn_normal: '#3b82f6',
    btn_hover: '#2563eb',
    btn_text: '#ffffff',
    home_bg1: '#0a0f1e',
    home_bg2: '#0d1b3e',

    store_name: 'ProExcel Maktaba',
    store_slogan: 'La bibliothèque scolaire de référence au Maroc',
    store_emoji: '📚',
    store_email: 'contact@proexcel.ma',
    store_phone: '+212 6 00 00 00 00',
    store_whatsapp: '+212600000000',
    store_address: 'Casablanca, Maroc',
    store_facebook: '',
    store_instagram: '',
    store_twitter: '',
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
  })

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
        }
      })
      .catch(console.error)
  }, [])

  async function saveSettings() {
    setLoading(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`
        },
        body: JSON.stringify({ ...settings, hero_slides: JSON.stringify(slides), features_strip: JSON.stringify(features) })
      })
      if (res.ok) {
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
    try {
      const formData = new FormData()
      formData.append('files', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}` },
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      const { urls } = await res.json()
      if (urls[0]) {
        const updated = slides.map((s, i) => i === idx ? { ...s, [field]: urls[0] } : s)
        setSlides(updated)
      }
    } catch (e) { console.error(e) }
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

  return (
    <div>
      {/* TOPBAR */}
      <div className="admin-topbar">
        <div className="topbar-title">Paramètres <span>Configuration globale</span></div>
        <div className="topbar-actions">
          <button className="btn-new" onClick={saveSettings} disabled={loading}>
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
                <div className="sp-section-title">Couleurs de la boutique</div>
                <div className="sp-grid-2">
                  {[
                    { key: 'col_primary', label: 'Couleur principale', desc: 'Hero, boutons, liens actifs' },
                    { key: 'col_secondary', label: 'Couleur secondaire', desc: 'Badges, accents' },
                    { key: 'col_promo', label: 'Couleur promos', desc: 'Badges réductions' },
                    { key: 'col_success', label: 'Couleur succès', desc: 'Confirmations, statuts' },
                  ].map(c => (
                    <div key={c.key} className="cp-section" style={{ background: 'var(--a-card)', border: '1px solid var(--a-border)', borderRadius: '14px', padding: '1.5rem' }}>
                      <div className="cp-section-head" style={{ marginBottom: '1.25rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.label}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--a-text2)' }}>{c.desc}</span>
                      </div>
                      <div className="color-field">
                        <div className="color-swatch-wrap">
                          <input 
                            type="color" 
                            value={settings[c.key as keyof typeof settings]} 
                            onChange={e => updateKey(c.key, e.target.value)} 
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <input 
                            className="seo-input" 
                            style={{ fontFamily: 'monospace' }} 
                            value={settings[c.key as keyof typeof settings]} 
                            onChange={e => updateKey(c.key, e.target.value)} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sp-section-title" style={{ marginTop: '2rem' }}>Boutons & Fond</div>
                <div className="cp-section" style={{ background: 'var(--a-card)', border: '1px solid var(--a-border)', borderRadius: '14px', padding: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
                    {[
                      { key: 'btn_normal', label: 'Bouton normal' },
                      { key: 'btn_hover', label: 'Bouton hover' },
                      { key: 'btn_text', label: 'Texte bouton' },
                    ].map(c => (
                      <div key={c.key}>
                        <div className="s-label">{c.label}</div>
                        <div className="color-field">
                          <div className="color-swatch-wrap">
                            <input 
                              type="color" 
                              value={settings[c.key as keyof typeof settings]} 
                              onChange={e => updateKey(c.key, e.target.value)} 
                            />
                          </div>
                          <input 
                            className="seo-input" 
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
                                    const fd = new FormData()
                                    fd.append('files', file)
                                    const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd })
                                    if (res.ok) {
                                      const { urls } = await res.json()
                                      if (urls[0]) updateKey(item.settingKey, urls[0])
                                    }
                                    e.target.value = ''
                                  }}
                                />
                                <span className="btn-action" style={{ display: 'inline-block', cursor: 'pointer', fontSize: '0.78rem' }}>📷 Upload</span>
                              </label>
                              {currentVal && (
                                <button className="btn-action btn-action-red" style={{ fontSize: '0.72rem' }} onClick={() => updateKey(item.settingKey, '')}>Supprimer</button>
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
                      { key: 'store_twitter', label: 'Twitter URL' },
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
                        <button className="btn-action" onClick={() => moveSlide(idx, -1)} disabled={idx === 0} title="Monter">▲</button>
                        <button className="btn-action" onClick={() => moveSlide(idx, 1)} disabled={idx === slides.length - 1} title="Descendre">▼</button>
                        <button className="btn-action btn-action-red" onClick={() => removeSlide(idx)} disabled={slides.length <= 1} title="Supprimer">✕</button>
                      </div>
                    </div>

                    {/* Background image Desktop */}
                    <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '250px' }}>
                        <div className="s-label">Image de fond (Bureau)</div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          {slide.image ? (
                            <div style={{ width: '120px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--a-border)', flexShrink: 0 }}>
                              <img src={slide.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ) : (
                            <div style={{ width: '120px', height: '70px', borderRadius: '8px', background: `radial-gradient(ellipse at 60% 50%, ${slide.bgColor1} 0%, ${slide.bgColor2} 100%)`, flexShrink: 0, border: '1px solid var(--a-border)' }} />
                          )}
                          <div style={{ flex: 1 }}>
                            <label style={{ cursor: 'pointer' }}>
                              <input type="file" accept="image/*" hidden onChange={e => { if (e.target.files?.[0]) uploadSlideImage(idx, e.target.files[0], 'image'); e.target.value = '' }} />
                              <span className="btn-action" style={{ display: 'inline-block', cursor: 'pointer' }}>
                                {slideUploading === idx ? '⏳ Upload…' : '📷 Desktop'}
                              </span>
                            </label>
                            {slide.image && (
                              <button className="btn-action btn-action-red" style={{ marginLeft: '0.5rem' }} onClick={() => updateSlide(idx, 'image', '')}>✕</button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ flex: 1, minWidth: '250px' }}>
                        <div className="s-label">Image de fond (Mobile)</div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          {slide.imageMobile ? (
                            <div style={{ width: '60px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--a-border)', flexShrink: 0 }}>
                              <img src={slide.imageMobile} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ) : (
                            <div style={{ width: '60px', height: '70px', borderRadius: '8px', background: `radial-gradient(ellipse at 60% 50%, ${slide.bgColor1} 0%, ${slide.bgColor2} 100%)`, flexShrink: 0, border: '1px solid var(--a-border)' }} />
                          )}
                          <div style={{ flex: 1 }}>
                            <label style={{ cursor: 'pointer' }}>
                              <input type="file" accept="image/*" hidden onChange={e => { if (e.target.files?.[0]) uploadSlideImage(idx, e.target.files[0], 'imageMobile'); e.target.value = '' }} />
                              <span className="btn-action" style={{ display: 'inline-block', cursor: 'pointer' }}>
                                {slideUploading === idx ? '⏳ Upload…' : '📱 Mobile'}
                              </span>
                            </label>
                            {slide.imageMobile && (
                              <button className="btn-action btn-action-red" style={{ marginLeft: '0.5rem' }} onClick={() => updateSlide(idx, 'imageMobile', '')}>✕</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Image (right-side visual) */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div className="s-label" style={{ marginBottom: '0.4rem' }}>
                        🖼️ Image produit (visuel côté droit) — PNG fond transparent recommandé
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        {slide.productImage ? (
                          <div style={{ width: '130px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--a-border)', flexShrink: 0, background: 'repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 0 0 / 12px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={slide.productImage} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          </div>
                        ) : (
                          <div style={{ width: '130px', height: '80px', borderRadius: '8px', border: '2px dashed var(--a-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--a-text2)', fontSize: '0.75rem', textAlign: 'center', padding: '0.5rem' }}>
                            Aucune image
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{ cursor: 'pointer' }}>
                            <input type="file" accept="image/*" hidden onChange={e => { if (e.target.files?.[0]) uploadSlideImage(idx, e.target.files[0], 'productImage'); e.target.value = '' }} />
                            <span className="btn-action" style={{ display: 'inline-block', cursor: 'pointer' }}>
                              {slideUploading === idx ? '⏳ Upload…' : '🏷️ Image produit'}
                            </span>
                          </label>
                          {slide.productImage && (
                            <button className="btn-action btn-action-red" onClick={() => updateSlide(idx, 'productImage', '')}>✕ Supprimer</button>
                          )}
                          <div style={{ fontSize: '0.7rem', color: 'var(--a-text2)', maxWidth: '200px', lineHeight: 1.4 }}>
                            Remplace l&apos;illustration automatique. PNG transparent recommandé.
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
                  </div>
                ))}

                <button
                  className="btn-new"
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
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--a-text2)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Icône</label>
                        <input
                          type="text"
                          value={f.icon}
                          onChange={e => setFeatures(features.map((x, i) => i === idx ? { ...x, icon: e.target.value } : x))}
                          placeholder="🚚"
                          style={{ width: '100%', padding: '0.5rem', background: 'var(--a-card)', border: '1px solid var(--a-border)', borderRadius: '6px', color: 'var(--a-text)', fontSize: '1.2rem', textAlign: 'center', outline: 'none' }}
                        />
                      </div>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '0.75rem' }}>
                      <div />
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
              </div>
            )}

            {/* TAB: ABOUT IMAGES */}
            {activeTab === 'tab-about' && (
              <div className="settings-panel active">
                <div className="sp-section-title">Images de la section Histoire (page À Propos)</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--a-text2)', marginBottom: '1.5rem' }}>
                  Ces photos apparaissent dans la grille 2×2 à côté du texte de présentation. Si aucune photo n&apos;est définie, un dégradé sombre est affiché.
                </div>
                <div className="settings-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {[
                      { settingKey: 'about_img_1', label: 'Photo 1' },
                      { settingKey: 'about_img_2', label: 'Photo 2' },
                      { settingKey: 'about_img_3', label: 'Photo 3' },
                      { settingKey: 'about_img_4', label: 'Photo 4' },
                    ].map(item => {
                      const currentVal = (settings as Record<string, string>)[item.settingKey] || ''
                      return (
                        <div key={item.settingKey}>
                          <div className="s-label">{item.label}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            {currentVal ? (
                              <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--a-border)', flexShrink: 0 }}>
                                <img src={currentVal} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            ) : (
                              <div style={{ width: '80px', height: '60px', borderRadius: '8px', border: '2px dashed var(--a-border)', flexShrink: 0, background: 'linear-gradient(135deg, #0e1e3a, #070B14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--a-text2)', fontSize: '0.7rem' }}>
                                vide
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
                                    const fd = new FormData()
                                    fd.append('files', file)
                                    const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd })
                                    if (res.ok) {
                                      const { urls } = await res.json()
                                      if (urls[0]) updateKey(item.settingKey, urls[0])
                                    }
                                    e.target.value = ''
                                  }}
                                />
                                <span className="btn-action" style={{ display: 'inline-block', cursor: 'pointer', fontSize: '0.78rem' }}>📷 Upload</span>
                              </label>
                              {currentVal && (
                                <button className="btn-action btn-action-red" style={{ fontSize: '0.72rem' }} onClick={() => updateKey(item.settingKey, '')}>Supprimer</button>
                              )}
                            </div>
                          </div>
                          {currentVal && (
                            <input className="s-input" style={{ marginTop: '0.25rem', fontSize: '0.78rem', fontFamily: 'monospace' }} value={currentVal} onChange={e => updateKey(item.settingKey, e.target.value)} placeholder="URL de l'image" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MAP & HOURS */}
            {activeTab === 'tab-map' && (
              <div className="settings-panel active">
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
                        <div className="hours-day">{day.label}</div>
                        <div className="hours-time">
                          <input 
                            className="s-input" 
                            style={{ flex: 1 }} 
                            value={settings[day.key as keyof typeof settings]} 
                            onChange={e => updateKey(day.key, e.target.value)} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SALES & MARKETING */}
            {activeTab === 'tab-sales' && (
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

            {/* TAB: ADVANCED */}
            {activeTab === 'tab-advanced' && (
              <div className="settings-panel active">
                <div className="sp-section-title">Configuration SEO</div>
                <div className="settings-card">
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <div className="s-label">Meta Titre (SEO)</div>
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
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
