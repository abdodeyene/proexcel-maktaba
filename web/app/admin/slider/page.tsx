'use client'
import { useEffect, useRef, useState } from 'react'
import { Plus, Trash2, Upload, ChevronUp, ChevronDown, Save, Eye, EyeOff, ImageIcon } from '@/components/LucideIcons'

type Slide = {
  id: number
  tag: string
  tagAr: string
  title: string
  titleAr: string
  subtitle: string
  subtitleAr: string
  ctaText: string
  ctaTextAr: string
  ctaLink: string
  ctaText2: string
  ctaLink2: string
  imageUrl: string | null
  bgPosition: string
  textAlign: string
  overlayStrength: string
  titleColor: string
  subtitleColor: string
  tagColor: string
  isActive: boolean
  order: number
}

type ButtonStyle = {
  bgType: 'solid' | 'gradient'
  bgColor: string
  bgGradientStart: string
  bgGradientEnd: string
  bgGradientDirection: string
  textColor: string
  borderRadius: string
  paddingX: string
  paddingY: string
  fontSize: string
  fontWeight: string
  showArrowDot: boolean
  arrowDotColor: string
}

const DEFAULT_BTN: ButtonStyle = {
  bgType: 'solid',
  bgColor: '#ffffff',
  bgGradientStart: '#e11d2e',
  bgGradientEnd: '#000000',
  bgGradientDirection: '135deg',
  textColor: '#111827',
  borderRadius: '999px',
  paddingX: '28px',
  paddingY: '14px',
  fontSize: '0.9rem',
  fontWeight: '700',
  showArrowDot: true,
  arrowDotColor: '#e11d2e',
}

const SIZE_PRESETS = {
  SM: { paddingX: '20px', paddingY: '10px', fontSize: '0.8rem' },
  MD: { paddingX: '28px', paddingY: '14px', fontSize: '0.9rem' },
  LG: { paddingX: '36px', paddingY: '16px', fontSize: '1rem' },
  XL: { paddingX: '44px', paddingY: '18px', fontSize: '1.1rem' },
} as const

const RADIUS_PRESETS = {
  Pill:    '999px',
  Arrondi: '12px',
  Carré:   '6px',
} as const

const EMPTY_SLIDE: Omit<Slide, 'id' | 'order'> = {
  tag: '', tagAr: '',
  title: '', titleAr: '',
  subtitle: '', subtitleAr: '',
  ctaText: 'Explorer le catalogue', ctaTextAr: '',
  ctaLink: '/best-offers',
  ctaText2: '', ctaLink2: '/',
  imageUrl: null,
  bgPosition: 'center',
  textAlign: 'center',
  overlayStrength: 'medium',
  titleColor: '', subtitleColor: '', tagColor: '',
  isActive: true,
}

export default function SliderAdminPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [uploading, setUploading] = useState<number | null>(null)
  const [msg, setMsg] = useState('')
  const [adding, setAdding] = useState(false)
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const [btn, setBtn] = useState<ButtonStyle>(DEFAULT_BTN)
  const [btnSaving, setBtnSaving] = useState(false)

  function token() {
    return typeof window !== 'undefined' ? localStorage.getItem('proexcel_admin_token') || '' : ''
  }

  function flash(text: string) {
    setMsg(text)
    setTimeout(() => setMsg(''), 3000)
  }

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/slides', { headers: { Authorization: `Bearer ${token()}` } })
      const data = await res.json()
      if (Array.isArray(data)) setSlides(data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    load()
    fetch('/api/slider-button-style')
      .then(r => r.json())
      .then((d: Partial<ButtonStyle>) => {
        if (d?.bgType) setBtn({ ...DEFAULT_BTN, ...d })
      })
      .catch(() => {})
  }, [])

  async function addSlide() {
    setAdding(true)
    try {
      const res = await fetch('/api/admin/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(EMPTY_SLIDE),
      })
      const slide = await res.json()
      setSlides(prev => [...prev, slide])
      flash('Slide ajoutée')
    } catch { flash('Erreur lors de l\'ajout') }
    setAdding(false)
  }

  async function deleteSlide(id: number) {
    if (!confirm('Supprimer cette slide ?')) return
    await fetch(`/api/admin/slides/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
    setSlides(prev => prev.filter(s => s.id !== id))
    flash('Slide supprimée')
  }

  async function saveSlide(slide: Slide) {
    setSaving(slide.id)
    try {
      await fetch(`/api/admin/slides/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(slide),
      })
      flash('Enregistré ✓')
    } catch { flash('Erreur de sauvegarde') }
    setSaving(null)
  }

  async function toggleActive(slide: Slide) {
    const updated = { ...slide, isActive: !slide.isActive }
    setSlides(prev => prev.map(s => s.id === slide.id ? updated : s))
    await saveSlide(updated)
  }

  function update(id: number, field: keyof Slide, value: string | boolean | null) {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  async function move(index: number, dir: 'up' | 'down') {
    const next = [...slides]
    const target = dir === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setSlides(next)
    await fetch('/api/admin/slides/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ ids: next.map(s => s.id) }),
    })
  }

  async function saveButtonStyle() {
    setBtnSaving(true)
    try {
      await fetch('/api/slider-button-style', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(btn),
      })
      flash('Style du bouton enregistré ✓')
    } catch { flash('Erreur de sauvegarde') }
    setBtnSaving(false)
  }

  async function uploadImage(slideId: number, file: File) {
    setUploading(slideId)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: form })
      const data = await res.json()
      if (data.url) {
        const updated = slides.find(s => s.id === slideId)!
        const withImg = { ...updated, imageUrl: data.url }
        setSlides(prev => prev.map(s => s.id === slideId ? withImg : s))
        await saveSlide(withImg)
        flash('Image uploadée ✓')
      }
    } catch { flash('Erreur upload') }
    setUploading(null)
  }

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--a-text2, #64748b)' }}>
        Chargement…
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--a-text, #0f172a)', margin: 0 }}>
            Hero Slider
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--a-text2, #64748b)', marginTop: '0.25rem' }}>
            {slides.length} slide{slides.length !== 1 ? 's' : ''} · Contrôlez textes, boutons et styles depuis cette page
          </p>
        </div>
        <button
          onClick={addSlide}
          disabled={adding}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: '#e8352a', color: '#fff', border: 'none',
            padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 600,
            fontSize: '0.875rem', cursor: 'pointer', opacity: adding ? 0.6 : 1,
          }}
        >
          <Plus size={16} />
          Ajouter une slide
        </button>
      </div>

      {/* Flash message */}
      {msg && (
        <div style={{
          background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534',
          padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem',
          fontSize: '0.875rem', fontWeight: 500,
        }}>
          {msg}
        </div>
      )}

      {slides.length === 0 && (
        <div style={{
          background: 'var(--a-card, #fff)', border: '1px dashed var(--a-border, #e2e8f0)',
          borderRadius: '12px', padding: '3rem', textAlign: 'center',
          color: 'var(--a-text2, #64748b)',
        }}>
          <ImageIcon size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p style={{ fontWeight: 500 }}>Aucune slide pour l'instant</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Cliquez sur "Ajouter une slide" pour commencer.</p>
        </div>
      )}

      {/* ── BUTTON STYLE — shown first so controls are immediately visible ── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          marginBottom: '1rem',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #e8352a, #ff7a00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '1rem', flexShrink: 0,
          }}>
            🎨
          </div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--a-text, #0f172a)', margin: 0 }}>
              Style du bouton CTA
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--a-text2, #64748b)', margin: 0 }}>
              Taille · Forme · Couleur · Texte — appliqué à tous les boutons des slides
            </p>
          </div>
        </div>

        <div style={{
          background: 'var(--a-card, #fff)',
          border: '1px solid var(--a-border, #e2e8f0)',
          borderRadius: '12px', padding: '1.5rem',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem',
        }}>
          {/* Background type */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>TYPE DE FOND</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['solid', 'gradient'] as const).map(t => (
                <button key={t} onClick={() => setBtn(b => ({ ...b, bgType: t }))}
                  style={{ padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem', border: '1px solid', background: btn.bgType === t ? '#e8352a' : 'transparent', color: btn.bgType === t ? '#fff' : 'var(--a-text, #0f172a)', borderColor: btn.bgType === t ? '#e8352a' : 'var(--a-border, #e2e8f0)', cursor: 'pointer' }}>
                  {t === 'solid' ? 'Couleur unie' : 'Dégradé'}
                </button>
              ))}
            </div>
          </div>

          {btn.bgType === 'solid' ? (
            <div>
              <label style={labelStyle}>COULEUR DE FOND</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={btn.bgColor} onChange={e => setBtn(b => ({ ...b, bgColor: e.target.value }))} style={{ width: '40px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }} />
                <input type="text" value={btn.bgColor} onChange={e => setBtn(b => ({ ...b, bgColor: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label style={labelStyle}>COULEUR DÉBUT</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="color" value={btn.bgGradientStart} onChange={e => setBtn(b => ({ ...b, bgGradientStart: e.target.value }))} style={{ width: '40px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }} />
                  <input type="text" value={btn.bgGradientStart} onChange={e => setBtn(b => ({ ...b, bgGradientStart: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>COULEUR FIN</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="color" value={btn.bgGradientEnd} onChange={e => setBtn(b => ({ ...b, bgGradientEnd: e.target.value }))} style={{ width: '40px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }} />
                  <input type="text" value={btn.bgGradientEnd} onChange={e => setBtn(b => ({ ...b, bgGradientEnd: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>COULEUR DU TEXTE</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="color" value={btn.textColor} onChange={e => setBtn(b => ({ ...b, textColor: e.target.value }))} style={{ width: '40px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }} />
              <input type="text" value={btn.textColor} onChange={e => setBtn(b => ({ ...b, textColor: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>TAILLE</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(Object.keys(SIZE_PRESETS) as Array<keyof typeof SIZE_PRESETS>).map(size => (
                <button key={size} onClick={() => setBtn(b => ({ ...b, ...SIZE_PRESETS[size] }))}
                  style={{ padding: '0.4rem 0.85rem', fontWeight: 700, fontSize: '0.75rem', border: '1px solid', borderRadius: '8px', background: btn.paddingX === SIZE_PRESETS[size].paddingX ? '#e8352a' : 'transparent', color: btn.paddingX === SIZE_PRESETS[size].paddingX ? '#fff' : 'var(--a-text, #0f172a)', borderColor: btn.paddingX === SIZE_PRESETS[size].paddingX ? '#e8352a' : 'var(--a-border, #e2e8f0)', cursor: 'pointer' }}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>FORME (ARRONDI)</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(Object.keys(RADIUS_PRESETS) as Array<keyof typeof RADIUS_PRESETS>).map(name => (
                <button key={name} onClick={() => setBtn(b => ({ ...b, borderRadius: RADIUS_PRESETS[name] }))}
                  style={{ padding: '0.4rem 0.85rem', fontWeight: 600, fontSize: '0.78rem', border: '1px solid', borderRadius: name === 'Pill' ? '999px' : name === 'Arrondi' ? '8px' : '4px', background: btn.borderRadius === RADIUS_PRESETS[name] ? '#e8352a' : 'transparent', color: btn.borderRadius === RADIUS_PRESETS[name] ? '#fff' : 'var(--a-text, #0f172a)', borderColor: btn.borderRadius === RADIUS_PRESETS[name] ? '#e8352a' : 'var(--a-border, #e2e8f0)', cursor: 'pointer' }}>
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>POINT FLÈCHE</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setBtn(b => ({ ...b, showArrowDot: !b.showArrowDot }))}
                style={{ padding: '0.4rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem', border: '1px solid', background: btn.showArrowDot ? '#e8352a' : 'transparent', color: btn.showArrowDot ? '#fff' : 'var(--a-text2, #64748b)', borderColor: btn.showArrowDot ? '#e8352a' : 'var(--a-border, #e2e8f0)', cursor: 'pointer' }}>
                {btn.showArrowDot ? '● Activé' : '○ Désactivé'}
              </button>
              {btn.showArrowDot && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--a-text2, #64748b)', fontWeight: 600 }}>Couleur :</span>
                  <input type="color" value={btn.arrowDotColor} onChange={e => setBtn(b => ({ ...b, arrowDotColor: e.target.value }))} style={{ width: '36px', height: '28px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }} />
                  <input type="text" value={btn.arrowDotColor} onChange={e => setBtn(b => ({ ...b, arrowDotColor: e.target.value }))} style={{ ...inputStyle, width: '100px' }} />
                </div>
              )}
            </div>
          </div>

          {/* Live preview */}
          <div style={{ gridColumn: '1 / -1', background: 'var(--a-bg, #f8fafc)', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--a-text2, #64748b)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>APERÇU EN DIRECT</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: btn.bgType === 'gradient'
                ? `linear-gradient(${btn.bgGradientDirection}, ${btn.bgGradientStart}, ${btn.bgGradientEnd})`
                : btn.bgColor,
              color: btn.textColor, borderRadius: btn.borderRadius,
              padding: `${btn.paddingY} ${btn.paddingX}`,
              fontSize: btn.fontSize, fontWeight: btn.fontWeight,
              boxShadow: '0 4px 20px rgba(0,0,0,.15)',
            }}>
              {btn.showArrowDot && (
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: btn.arrowDotColor, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>→</span>
              )}
              Explorer le catalogue
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <button onClick={saveButtonStyle} disabled={btnSaving}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#e8352a', color: '#fff', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: btnSaving ? 'not-allowed' : 'pointer', opacity: btnSaving ? 0.6 : 1 }}>
              <Save size={14} />
              {btnSaving ? 'Enregistrement…' : 'Enregistrer le style du bouton'}
            </button>
          </div>
        </div>
      </div>

      {/* ── SLIDES SECTION HEADER ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        marginBottom: '1rem',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '1rem', flexShrink: 0,
        }}>
          🎞️
        </div>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--a-text, #0f172a)', margin: 0 }}>
            Diapositives ({slides.length})
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--a-text2, #64748b)', margin: 0 }}>
            Titre · Sous-titre · Tag · Texte du bouton · Lien · Alignement · Visibilité
          </p>
        </div>
      </div>

      {/* Slides list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              background: 'var(--a-card, #fff)',
              border: `1px solid ${slide.isActive ? 'var(--a-border, #e2e8f0)' : '#fecaca'}`,
              borderRadius: '12px', overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            {/* Slide header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.875rem 1.25rem',
              background: 'var(--a-bg, #f8fafc)',
              borderBottom: '1px solid var(--a-border, #e2e8f0)',
            }}>
              <span style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: '#e8352a', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
              }}>
                {index + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--a-text, #0f172a)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {slide.title || <em style={{ opacity: 0.4 }}>Sans titre</em>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                <button onClick={() => move(index, 'up')} disabled={index === 0} title="Monter"
                  style={{ background: 'none', border: '1px solid var(--a-border, #e2e8f0)', borderRadius: '6px', padding: '4px', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1, color: 'var(--a-text2, #64748b)' }}>
                  <ChevronUp size={14} />
                </button>
                <button onClick={() => move(index, 'down')} disabled={index === slides.length - 1} title="Descendre"
                  style={{ background: 'none', border: '1px solid var(--a-border, #e2e8f0)', borderRadius: '6px', padding: '4px', cursor: index === slides.length - 1 ? 'not-allowed' : 'pointer', opacity: index === slides.length - 1 ? 0.3 : 1, color: 'var(--a-text2, #64748b)' }}>
                  <ChevronDown size={14} />
                </button>
                <button onClick={() => toggleActive(slide)} title={slide.isActive ? 'Désactiver' : 'Activer'}
                  style={{ background: slide.isActive ? '#dcfce7' : '#fee2e2', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: slide.isActive ? '#166534' : '#991b1b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                  {slide.isActive ? <><Eye size={13} /> Active</> : <><EyeOff size={13} /> Inactive</>}
                </button>
                <button onClick={() => deleteSlide(slide.id)} title="Supprimer"
                  style={{ background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '4px', cursor: 'pointer', color: '#991b1b' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Fields */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Image upload */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                {slide.imageUrl ? (
                  <div style={{ position: 'relative', width: '120px', height: '68px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--a-border, #e2e8f0)' }}>
                    <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: '120px', height: '68px', flexShrink: 0, borderRadius: '6px', background: 'var(--a-bg, #f8fafc)', border: '1px dashed var(--a-border, #e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ImageIcon size={20} style={{ opacity: 0.3 }} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>IMAGE DE FOND</label>
                  <input type="text" value={slide.imageUrl ?? ''} onChange={e => update(slide.id, 'imageUrl', e.target.value || null)} placeholder="https://… ou laisser vide pour gradient" style={inputStyle} />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <input ref={el => { fileRefs.current[slide.id] = el }} type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => { if (e.target.files?.[0]) uploadImage(slide.id, e.target.files[0]) }} />
                    <button onClick={() => fileRefs.current[slide.id]?.click()} disabled={uploading === slide.id}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--a-bg, #f8fafc)', border: '1px solid var(--a-border, #e2e8f0)', borderRadius: '6px', padding: '0.35rem 0.7rem', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', color: 'var(--a-text, #0f172a)' }}>
                      <Upload size={12} />
                      {uploading === slide.id ? 'Upload…' : 'Uploader'}
                    </button>
                    <select value={slide.bgPosition} onChange={e => update(slide.id, 'bgPosition', e.target.value)}
                      style={{ ...inputStyle, width: 'auto', fontSize: '0.78rem', padding: '0.35rem 0.6rem' }}>
                      <option value="center">Centre</option>
                      <option value="top">Haut</option>
                      <option value="bottom">Bas</option>
                      <option value="left">Gauche</option>
                      <option value="right">Droite</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Layout controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>ALIGNEMENT DU TEXTE</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(['center', 'left'] as const).map(a => (
                      <button key={a} onClick={() => update(slide.id, 'textAlign', a)}
                        style={{ padding: '0.4rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.78rem', border: '1px solid', background: slide.textAlign === a ? '#e8352a' : 'transparent', color: slide.textAlign === a ? '#fff' : 'var(--a-text, #0f172a)', borderColor: slide.textAlign === a ? '#e8352a' : 'var(--a-border, #e2e8f0)', cursor: 'pointer' }}>
                        {a === 'center' ? '⊟ Centre' : '⊞ Gauche'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>INTENSITÉ DU CALQUE SOMBRE</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(['light', 'medium', 'dark'] as const).map(o => (
                      <button key={o} onClick={() => update(slide.id, 'overlayStrength', o)}
                        style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.75rem', border: '1px solid', background: slide.overlayStrength === o ? '#e8352a' : 'transparent', color: slide.overlayStrength === o ? '#fff' : 'var(--a-text, #0f172a)', borderColor: slide.overlayStrength === o ? '#e8352a' : 'var(--a-border, #e2e8f0)', cursor: 'pointer' }}>
                        {o === 'light' ? 'Clair' : o === 'medium' ? 'Moyen' : 'Sombre'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* French content */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🇫🇷 Contenu Français
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>TAG</label>
                    <input type="text" value={slide.tag} onChange={e => update(slide.id, 'tag', e.target.value)} placeholder="Ex: Rentrée scolaire" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>TEXTE DU BOUTON PRINCIPAL</label>
                    <input type="text" value={slide.ctaText} onChange={e => update(slide.id, 'ctaText', e.target.value)} placeholder="Explorer le catalogue" style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>TITRE <span style={{ fontWeight: 400, color: 'var(--a-text2)' }}>(utilisez \n pour un retour à la ligne)</span></label>
                    <input type="text" value={slide.title} onChange={e => update(slide.id, 'title', e.target.value)} placeholder="Ex: Tous vos manuels\nscolaires," style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>SOUS-TITRE</label>
                    <textarea value={slide.subtitle} onChange={e => update(slide.id, 'subtitle', e.target.value)} placeholder="Description courte de l'offre…" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                </div>
              </div>

              {/* Arabic content */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🇲🇦 Contenu Arabe
                  <span style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--a-text2)', textTransform: 'none' }}>(si vide, utilise le contenu français)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} dir="rtl">
                  <div>
                    <label style={labelStyle}>وسم (TAG)</label>
                    <input type="text" value={slide.tagAr} onChange={e => update(slide.id, 'tagAr', e.target.value)} placeholder="مثال: الدخول المدرسي" style={{ ...inputStyle, textAlign: 'right' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>نص الزر الرئيسي</label>
                    <input type="text" value={slide.ctaTextAr} onChange={e => update(slide.id, 'ctaTextAr', e.target.value)} placeholder="استكشف الكتالوج" style={{ ...inputStyle, textAlign: 'right' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>العنوان الرئيسي</label>
                    <input type="text" value={slide.titleAr} onChange={e => update(slide.id, 'titleAr', e.target.value)} placeholder="مثال: جميع كتبكم المدرسية" style={{ ...inputStyle, textAlign: 'right' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>العنوان الفرعي</label>
                    <textarea value={slide.subtitleAr} onChange={e => update(slide.id, 'subtitleAr', e.target.value)} placeholder="وصف قصير للعرض…" rows={2} style={{ ...inputStyle, resize: 'vertical', textAlign: 'right' }} />
                  </div>
                </div>
              </div>

              {/* CTA links + secondary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>LIEN BOUTON PRINCIPAL</label>
                  <input type="text" value={slide.ctaLink} onChange={e => update(slide.id, 'ctaLink', e.target.value)} placeholder="/best-offers" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>TEXTE BOUTON SECONDAIRE</label>
                  <input type="text" value={slide.ctaText2} onChange={e => update(slide.id, 'ctaText2', e.target.value)} placeholder="(optionnel)" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>LIEN BOUTON SECONDAIRE</label>
                  <input type="text" value={slide.ctaLink2} onChange={e => update(slide.id, 'ctaLink2', e.target.value)} placeholder="/about" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    onClick={() => saveSlide(slide)}
                    disabled={saving === slide.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: '#e8352a', color: '#fff', border: 'none',
                      padding: '0.55rem 1.25rem', borderRadius: '8px',
                      fontWeight: 600, fontSize: '0.875rem',
                      cursor: saving === slide.id ? 'not-allowed' : 'pointer',
                      opacity: saving === slide.id ? 0.6 : 1, width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <Save size={14} />
                    {saving === slide.id ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                </div>
              </div>

              {/* Colors */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--a-text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                  🎨 Couleurs du texte <span style={{ fontWeight: 400, textTransform: 'none' }}>(laisser vide = couleurs par défaut)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  {([
                    { field: 'titleColor' as const, label: 'TITRE', default: '#ffffff' },
                    { field: 'subtitleColor' as const, label: 'SOUS-TITRE', default: 'rgba(255,255,255,0.75)' },
                    { field: 'tagColor' as const, label: 'TAG', default: 'rgba(255,255,255,0.7)' },
                  ]).map(({ field, label, default: def }) => (
                    <div key={field}>
                      <label style={labelStyle}>{label}</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input type="color" value={slide[field] || def}
                          onChange={e => update(slide.id, field, e.target.value)}
                          style={{ width: '36px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
                        <input type="text" value={slide[field]}
                          onChange={e => update(slide.id, field, e.target.value)}
                          placeholder={def}
                          style={{ ...inputStyle, flex: 1 }} />
                        {slide[field] && (
                          <button onClick={() => update(slide.id, field, '')} title="Réinitialiser"
                            style={{ background: 'none', border: 'none', color: 'var(--a-text2)', cursor: 'pointer', fontSize: '1rem', padding: '0 2px' }}>
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  border: '1px solid var(--a-border, #e2e8f0)',
  borderRadius: '8px',
  fontSize: '0.875rem',
  background: 'var(--a-bg, #f8fafc)',
  color: 'var(--a-text, #0f172a)',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: 'var(--a-text2, #64748b)',
  marginBottom: '0.4rem',
  textTransform: 'uppercase',
}
