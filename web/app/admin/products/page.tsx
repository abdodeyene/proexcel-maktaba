'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  ImageIcon, 
  Eye 
} from '@/components/LucideIcons'
import { formatMoroccanPrice } from '@/lib/format'

type Product = {
  id: number
  title: string
  titleAr?: string | null
  price: number
  compareAtPrice?: number | null
  costPrice?: number | null
  author?: string | null
  category?: string | null
  niveau?: string | null
  subject?: string | null
  stock: number
  isPromo: boolean
  isBestOffer: boolean
  isNew: boolean
  emoji?: string | null
  g1?: string | null
  g2?: string | null
  description?: string | null
  descriptionAr?: string | null
  variants?: unknown | null
  media?: unknown | null
  colors?: unknown | null
}

type MediaItem = { url: string; type: 'image' | 'video' }

const EMPTY = {
  title: '', titleAr: '', author: '', price: '', compareAtPrice: '', costPrice: '',
  category: '', niveau: '', subject: '', emoji: '📦', g1: '#1a237e', g2: '#3949ab',
  stock: '0', isPromo: false, isBestOffer: false, isNew: false,
  description: '', descriptionAr: '',
  variants: [] as string[],
  colors: [] as string[],
}

const SUBJECTS_BY_NIVEAU: Record<string, string[]> = {
  Primaire: ['arabe','francais','anglais','maths','sciences','islamia','tarbia','tchkila','histoire'],
  College:  ['arabe','francais','anglais','maths','svt','pc','histoire','islamia','tarbia','informatique'],
  Lycee:    ['arabe','francais','anglais','maths','svt','pc','falsafa','histoire','islamia','informatique','economie'],
}

const SUBJECT_LABELS: Record<string, string> = {
  arabe: 'Langue Arabe', francais: 'Langue Française', anglais: 'Langue Anglaise',
  maths: 'Mathématiques', sciences: 'Sciences', islamia: 'Éducation Islamique',
  tarbia: 'Éducation Civique', tchkila: 'Arts Plastiques', histoire: 'Histoire-Géo',
  svt: 'SVT', pc: 'Physique-Chimie', informatique: 'Informatique',
  falsafa: 'Philosophie', economie: 'Économie',
}

// ─── Rich Text Editor ───
function RichEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState('3')

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, val)
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, []) // eslint-disable-line

  return (
    <div className="editor-wrap">
      <div className="editor-toolbar">
        <button className="editor-btn" title="Gras" onMouseDown={e => { e.preventDefault(); exec('bold') }}><b>B</b></button>
        <button className="editor-btn" title="Italique" onMouseDown={e => { e.preventDefault(); exec('italic') }}><i>I</i></button>
        <button className="editor-btn" title="Souligné" onMouseDown={e => { e.preventDefault(); exec('underline') }}><u>U</u></button>
        <div className="editor-sep" />
        <select
          className="editor-size-select"
          value={fontSize}
          onChange={e => { setFontSize(e.target.value); exec('fontSize', e.target.value) }}
        >
          <option value="1">Petit</option>
          <option value="2">Normal</option>
          <option value="3">Moyen</option>
          <option value="4">Grand</option>
          <option value="5">Très grand</option>
          <option value="6">Énorme</option>
        </select>
        <div className="editor-sep" />
        <button className="editor-btn" title="Liste à puces" onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList') }}>☰</button>
        <button className="editor-btn" title="Liste numérotée" onMouseDown={e => { e.preventDefault(); exec('insertOrderedList') }}>①</button>
        <div className="editor-sep" />
        <button className="editor-btn" title="Aligner gauche" onMouseDown={e => { e.preventDefault(); exec('justifyLeft') }}>⬛</button>
        <button className="editor-btn" title="Centrer" onMouseDown={e => { e.preventDefault(); exec('justifyCenter') }}>⬜</button>
        <button className="editor-btn" title="Effacer formatage" onMouseDown={e => { e.preventDefault(); exec('removeFormat') }}>✕</button>
      </div>
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Tapez la description du produit..."
        onInput={handleInput}
      />
    </div>
  )
}

// ─── Media Upload ───
function MediaUpload({ media, setMedia }: { media: MediaItem[]; setMedia: (m: MediaItem[]) => void }) {
  const imgRef = useRef<HTMLInputElement>(null)
  const vidRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const uploadFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadError('')
    try {
      const formData = new FormData()
      Array.from(files).forEach(f => formData.append('files', f))
      const token = localStorage.getItem('proexcel_admin_token') || ''
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || `HTTP ${res.status}`)
      }
      const { urls } = await res.json()
      const items: MediaItem[] = urls.map((url: string) => ({
        url,
        type: url.match(/\.(mp4|webm|mov|avi)$/i) ? 'video' as const : 'image' as const,
      }))
      setMedia([...media, ...items])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur upload'
      setUploadError(msg)
      console.error('Upload error:', e)
    } finally {
      setUploading(false)
    }
  }, [media, setMedia])

  const remove = (i: number) => {
    const next = [...media]
    next.splice(i, 1)
    setMedia(next)
  }

  const setPrincipal = (i: number) => {
    if (i === 0) return
    const next = [...media]
    const [item] = next.splice(i, 1)
    next.unshift(item)
    setMedia(next)
  }

  return (
    <div>
      <div
        className={`media-upload-zone ${drag ? 'drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); uploadFiles(e.dataTransfer.files) }}
        onClick={() => imgRef.current?.click()}
      >
        {uploading ? (
          <div style={{ padding: '1rem', color: 'var(--a-primary)', fontWeight: 600 }}>⏳ Chargement en cours…</div>
        ) : (
          <>
            <div className="media-upload-icon">
              <ImageIcon size={28} color="var(--a-text2)" />
            </div>
            <div className="media-upload-text">Glissez des images/vidéos ici</div>
            <div className="media-upload-hint">JPG, PNG, WebP, MP4 · Max 50 MB</div>
            <div className="media-upload-btns" onClick={e => e.stopPropagation()}>
              <button className="btn-upload btn-upload-primary proexcel-btn-admin-upload-action" onClick={() => imgRef.current?.click()}>Images</button>
              <button className="btn-upload proexcel-btn-admin-upload-action" onClick={() => vidRef.current?.click()}>Vidéo</button>
            </div>
          </>
        )}
      </div>

      {uploadError && (
        <div style={{ color: '#e74c3c', fontSize: '0.82rem', marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(231,76,60,0.1)', borderRadius: '6px' }}>
          ⚠ {uploadError}
        </div>
      )}

      {media.length > 0 && (
        <>
          <div style={{ fontSize: '0.75rem', color: 'var(--a-text2)', margin: '0.75rem 0 0.4rem' }}>
            Cliquez sur une image pour la définir comme <strong>principale</strong>
          </div>
          <div className="media-grid">
            {media.map((m, i) => (
              <div
                key={i}
                className="media-thumb"
                style={{ cursor: i > 0 ? 'pointer' : 'default', outline: i === 0 ? '2px solid #c0392b' : 'none', outlineOffset: '2px' }}
                onClick={() => setPrincipal(i)}
                title={i === 0 ? 'Image principale' : 'Cliquer pour définir comme principale'}
              >
                {m.type === 'image'
                  ? <img src={m.url} alt="" />
                  : <video src={m.url} muted />
                }
                {i === 0 && <span className="media-main-badge">⭐ Principal</span>}
                <button className="media-thumb-del" onClick={e => { e.stopPropagation(); remove(i) }}>✕</button>
              </div>
            ))}
          </div>
        </>
      )}

      <input ref={imgRef} type="file" accept="image/*" multiple hidden onChange={e => uploadFiles(e.target.files)} />
      <input ref={vidRef} type="file" accept="video/*" multiple hidden onChange={e => uploadFiles(e.target.files)} />
    </div>
  )
}

// ─── Main Component ───
export default function AdminProducts() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [products, setProducts] = useState<Product[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<typeof EMPTY>(EMPTY)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [newVariant, setNewVariant] = useState('')
  const [newColor, setNewColor] = useState('#3949ab')
  const [selectedColorIdx, setSelectedColorIdx] = useState<number | null>(null)
  const [cats, setCats] = useState<string[]>([])

  function token() { return localStorage.getItem('proexcel_admin_token') || '' }

  function handleUnauthorized() {
    localStorage.removeItem('proexcel_admin_token')
    localStorage.removeItem('proexcel_admin')
    window.location.href = '/login'
  }

  async function load() {
    try {
      const data = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${token()}` }
      }).then(r => r.json())
      setProducts(Array.isArray(data) ? data : (data?.products ?? []))
    } catch (e) { console.error(e) }
  }

  async function loadCats() {
    try {
      const data = await fetch('/api/categories').then(r => r.json())
      if (Array.isArray(data)) setCats(data.map((c: { name: string }) => c.name))
    } catch (e) { console.error(e) }
  }

  useEffect(() => { load(); loadCats() }, [])

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY)
    setMedia([])
    setSelectedColorIdx(null)
    setView('create')
  }

  function openEdit(p: Product) {
    setEditingId(p.id)
    const variants = Array.isArray(p.variants) ? (p.variants as string[]) : []
    const colors = Array.isArray(p.colors) ? (p.colors as string[]) : []
    const images = Array.isArray(p.media) ? (p.media as string[]) : []

    setForm({
      title: p.title, titleAr: p.titleAr || '', author: p.author || '', price: String(p.price),
      compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
      costPrice: (p as any).costPrice ? String((p as any).costPrice) : '',
      category: p.category || '', niveau: p.niveau || '', subject: (p as any).subject || '',
      emoji: p.emoji || '📦',
      g1: p.g1 || '#1a237e', g2: p.g2 || '#3949ab',
      stock: String(p.stock), isPromo: !!p.isPromo,
      isBestOffer: !!p.isBestOffer, isNew: !!p.isNew,
      description: p.description || '', descriptionAr: (p as any).descriptionAr || '',
      variants,
      colors,
    })
    setMedia(images.map(url => ({ url, type: 'image' as const })))
    setSelectedColorIdx(null)
    setView('edit')
  }

  async function saveProduct() {
    setLoading(true)
    setSaveError('')
    const body = {
      title: form.title,
      titleAr: form.titleAr || null,
      author: form.author || null,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      costPrice: form.costPrice ? Number(form.costPrice) : null,
      category: form.category || null,
      niveau: form.niveau || null,
      subject: form.subject || null,
      emoji: form.emoji || '📦',
      g1: form.g1,
      g2: form.g2,
      stock: Number(form.stock),
      isPromo: form.isPromo,
      isBestOffer: form.isBestOffer,
      isNew: form.isNew,
      description: form.description || null,
      descriptionAr: form.descriptionAr || null,
      variants: form.variants,
      colors: form.colors,
      media: media.map(m => m.url),
    }
    const url = editingId ? `/api/products/${editingId}` : '/api/products'
    const method = editingId ? 'PATCH' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        await load()
        setView('list')
      } else if (res.status === 401) {
        handleUnauthorized()
      } else {
        const err = await res.json().catch(() => ({}))
        setSaveError(err.message || `Erreur ${res.status} — produit non sauvegardé`)
      }
    } catch (e) {
      setSaveError('Erreur réseau. Vérifiez la connexion.')
      console.error(e)
    }
    finally { setLoading(false) }
  }

  async function delProduct(id: number) {
    if (!confirm('Supprimer ce produit ?')) return
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token()}` }
      })
      await load()
    } catch (e) { console.error(e) }
  }

  function addVariant() {
    if (!newVariant.trim()) return
    setForm({ ...form, variants: [...form.variants, newVariant.trim()] })
    setNewVariant('')
  }

  function removeVariant(i: number) {
    setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== i) })
  }

  function addColor() {
    if (form.colors.includes(newColor)) return
    setForm({ ...form, colors: [...form.colors, newColor] })
    setSelectedColorIdx(form.colors.length)
  }

  function removeColor(i: number) {
    setForm({ ...form, colors: form.colors.filter((_, idx) => idx !== i) })
    setSelectedColorIdx(null)
  }

  const filtered = products.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filterCat && p.category !== filterCat) return false
    if (filterStatus === 'promo' && !p.isPromo) return false
    if (filterStatus === 'best' && !p.isBestOffer) return false
    if (filterStatus === 'new' && !p.isNew) return false
    if (filterStatus === 'low' && p.stock > 8) return false
    return true
  })

  return (
    <div>
      {/* TOPBAR */}
      <div className="admin-topbar">
        <div className="topbar-title">
          Produits <span>{view === 'list' ? 'Liste des produits' : view === 'create' ? 'Nouveau produit' : 'Modifier produit'}</span>
        </div>
        <div className="topbar-actions">
          {view !== 'list' && (
            <button className="btn-action proexcel-btn-admin-secondary-action" onClick={() => setView('list')}>← Retour à la liste</button>
          )}
          {view === 'list' && (
            <button className="btn-new proexcel-btn-admin-primary-action" onClick={openCreate}><Plus size={16} /> Créer un produit</button>
          )}
        </div>
      </div>

      {/* LIST VIEW */}
      {view === 'list' ? (
        <div className="fade-up">
          <div className="filter-bar">
            <input className="filter-input" placeholder="Rechercher un produit..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="filter-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option value="">Toutes catégories</option>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Tous les statuts</option>
              <option value="promo">En promotion</option>
              <option value="best">Meilleure offre</option>
              <option value="new">Nouveau</option>
              <option value="low">Stock faible</option>
            </select>
            <span style={{ fontSize: '0.82rem', color: 'var(--a-text2)', marginLeft: 'auto' }}>{filtered.length} produits trouvés</span>
          </div>

          <div className="products-admin-grid">
            {filtered.map(p => {
              const images = Array.isArray(p.media) ? (p.media as string[]) : []
              const mainImg = images[0] || null
              const colors = Array.isArray(p.colors) ? (p.colors as string[]) : []

              return (
                <div key={p.id} className="product-admin-card" onClick={() => openEdit(p)}>
                  <div className="product-admin-img" style={{ overflow: 'hidden', background: mainImg ? 'transparent' : `linear-gradient(135deg, ${p.g1 || '#1a237e'}, ${p.g2 || '#3949ab'})` }}>
                    {mainImg ? (
                      <img src={mainImg} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                        <ImageIcon size={32} color="white" />
                      </div>
                    )}
                    <div className="product-admin-badges">
                      {p.isPromo && <span className="status-badge status-completed" style={{ fontSize: '0.65rem' }}>Promo</span>}
                      {p.isNew && <span className="status-badge status-shipped" style={{ fontSize: '0.65rem' }}>Nouveau</span>}
                      {p.isBestOffer && <span className="status-badge status-processing" style={{ fontSize: '0.65rem' }}>Vedette</span>}
                      {p.stock <= 8 && <span className="status-badge status-cancelled" style={{ fontSize: '0.65rem' }}>Stock: {p.stock}</span>}
                    </div>
                  </div>
                  <div className="product-admin-body">
                    <div className="product-admin-cat">{p.category || 'Non classé'}</div>
                    <div className="product-admin-title">{p.title}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                      <span className="product-admin-price">{formatMoroccanPrice(p.price)}</span>
                      {p.compareAtPrice && p.compareAtPrice > p.price ? <span className="product-admin-compare">{formatMoroccanPrice(p.compareAtPrice)}</span> : null}
                    </div>
                    {colors.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                        {colors.slice(0, 5).map((c, i) => (
                          <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.15)' }} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="product-admin-footer">
                    <span>Stock: {p.stock}</span>
                    <div className="product-admin-actions" onClick={e => e.stopPropagation()}>
                      <button className="btn-action proexcel-btn-admin-secondary-action" onClick={() => openEdit(p)} title="Modifier">
                        <Edit size={13} />
                      </button>
                      <button className="btn-action btn-action-red proexcel-btn-admin-danger-action" onClick={() => delProduct(p.id)} title="Supprimer">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--a-text2)' }}>Aucun produit trouvé.</div>
          )}
        </div>
      ) : (
        /* CREATE / EDIT VIEW */
        <div className="admin-content fade-up" style={{ paddingTop: '1rem' }}>
          <div className="create-product-layout">
            {/* LEFT */}
            <div className="create-product-main">

              {/* Title & Category */}
              <div className="a-card" style={{ padding: '1.25rem' }}>
                <input
                  className="cp-title-input"
                  placeholder="Titre du produit (Français)"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
                <input
                  className="cp-title-input"
                  placeholder="عنوان المنتج (بالعربية)"
                  dir="rtl"
                  style={{ marginTop: '0.6rem', fontFamily: "'Noto Kufi Arabic', 'Cairo', sans-serif", fontSize: '1rem' }}
                  value={form.titleAr}
                  onChange={e => setForm({ ...form, titleAr: e.target.value })}
                />
                <select
                  className="cp-cat-select"
                  style={{ marginTop: '0.85rem' }}
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {cats.map(c => <option key={c}>{c}</option>)}
                </select>
                <select
                  className="cp-cat-select"
                  style={{ marginTop: '0.6rem' }}
                  value={form.niveau}
                  onChange={e => setForm({ ...form, niveau: e.target.value, subject: '' })}
                >
                  <option value="">Niveau scolaire (optionnel)</option>
                  <option value="Primaire">Primaire</option>
                  <option value="College">Collège</option>
                  <option value="Lycee">Lycée</option>
                </select>
                <select
                  className="cp-cat-select"
                  style={{ marginTop: '0.6rem' }}
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  disabled={!form.niveau}
                >
                  <option value="">Matière (optionnel)</option>
                  {(SUBJECTS_BY_NIVEAU[form.niveau] || []).map(s => (
                    <option key={s} value={s}>{SUBJECT_LABELS[s] || s}</option>
                  ))}
                </select>
                <input
                  className="cp-title-input"
                  placeholder="Auteur / Éditeur"
                  style={{ marginTop: '0.85rem', fontSize: '0.95rem' }}
                  value={form.author}
                  onChange={e => setForm({ ...form, author: e.target.value })}
                />
              </div>

              {/* Media Upload */}
              <div className="a-card">
                <div className="a-card-header">
                  <span className="a-card-title">Images & Vidéos</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--a-text2)' }}>La 1ère image = image principale</span>
                </div>
                <div style={{ padding: '1rem' }}>
                  <MediaUpload media={media} setMedia={setMedia} />
                </div>
              </div>

              {/* Description FR */}
              <div className="a-card">
                <div className="a-card-header">
                  <span className="a-card-title">🇫🇷 Description (Français)</span>
                </div>
                <div style={{ padding: '1rem' }}>
                  <RichEditor
                    value={form.description}
                    onChange={v => setForm({ ...form, description: v })}
                  />
                </div>
              </div>

              {/* Description AR */}
              <div className="a-card">
                <div className="a-card-header">
                  <span className="a-card-title">🇲🇦 الوصف (بالعربية)</span>
                </div>
                <div style={{ padding: '1rem', direction: 'rtl' }}>
                  <RichEditor
                    value={form.descriptionAr}
                    onChange={v => setForm({ ...form, descriptionAr: v })}
                  />
                </div>
              </div>

              {/* Variants */}
              <div className="cp-section">
                <div className="cp-section-head"><span>Variants</span></div>
                <div className="cp-section-body">
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input
                      className="cp-input"
                      placeholder="Ex: Taille A4, Pack 3, Niveau 2..."
                      value={newVariant}
                      onChange={e => setNewVariant(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addVariant() } }}
                      style={{ flex: 1 }}
                    />
                    <button
                      className="btn-action proexcel-btn-admin-secondary-action"
                      onClick={addVariant}
                      style={{ padding: '0.5rem 1rem', fontWeight: 700 }}
                    >+</button>
                  </div>
                  {form.variants.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {form.variants.map((v, i) => (
                        <span key={i} style={{
                          background: 'var(--a-bg)', border: '1px solid var(--a-border)',
                          borderRadius: '20px', padding: '0.3rem 0.85rem',
                          fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem'
                        }}>
                          {v}
                          <button
                            onClick={() => removeVariant(i)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--a-text2)', padding: '0 2px', fontSize: '0.85rem', lineHeight: 1 }}
                          >×</button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--a-text2)', fontSize: '0.8rem' }}>Aucun variant. Ajoutez des variantes produit ci-dessus.</div>
                  )}
                </div>
              </div>

              {/* Colors */}
              <div className="cp-section">
                <div className="cp-section-head"><span>Couleurs</span></div>
                <div className="cp-section-body">
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.85rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={newColor}
                      onChange={e => setNewColor(e.target.value)}
                      style={{ width: '42px', height: '38px', border: 'none', cursor: 'pointer', borderRadius: '6px', padding: 0 }}
                    />
                    <input
                      className="ss-input"
                      value={newColor}
                      onChange={e => setNewColor(e.target.value)}
                      style={{ fontFamily: 'monospace', width: '90px' }}
                    />
                    <button
                      className="btn-action proexcel-btn-admin-secondary-action"
                      onClick={addColor}
                      style={{ padding: '0.5rem 1rem' }}
                    >+ Ajouter</button>
                  </div>

                  {form.colors.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                      {form.colors.map((c, i) => (
                        <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div
                            onClick={() => setSelectedColorIdx(selectedColorIdx === i ? null : i)}
                            style={{
                              width: '36px', height: '36px', borderRadius: '50%',
                              background: c, cursor: 'pointer',
                              outline: selectedColorIdx === i ? `3px solid ${c}` : '3px solid transparent',
                              outlineOffset: '2px',
                              boxShadow: selectedColorIdx === i ? '0 0 0 5px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.2)',
                              transition: 'all 0.15s',
                            }}
                            title={c}
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); removeColor(i) }}
                            style={{
                              position: 'absolute', top: '-5px', right: '-5px',
                              width: '16px', height: '16px', borderRadius: '50%',
                              background: 'var(--a-red)', color: 'white',
                              border: 'none', cursor: 'pointer',
                              fontSize: '10px', lineHeight: '16px', textAlign: 'center', padding: 0,
                            }}
                          >×</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--a-text2)', fontSize: '0.8rem' }}>Aucune couleur. Sélectionnez une couleur et cliquez "+ Ajouter".</div>
                  )}

                  {selectedColorIdx !== null && form.colors[selectedColorIdx] && (
                    <div style={{
                      marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: 'var(--a-bg)', border: `2px solid ${form.colors[selectedColorIdx]}`,
                      borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.82rem',
                      width: 'fit-content'
                    }}>
                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: form.colors[selectedColorIdx], flexShrink: 0 }} />
                      <span style={{ color: form.colors[selectedColorIdx], fontWeight: 700, fontFamily: 'monospace' }}>
                        {form.colors[selectedColorIdx]}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="cp-section">
                <div className="cp-section-head"><span>Prix</span></div>
                <div className="cp-section-body">
                  <div className="cp-price-grid">
                    <div className="cp-field">
                      <div className="cp-label">Prix de vente (DH) *</div>
                      <input className="cp-input" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Ex: 149" />
                    </div>
                    <div className="cp-field">
                      <div className="cp-label">Prix barré / Prix avant réduction (DH)</div>
                      <input className="cp-input" type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={e => setForm({ ...form, compareAtPrice: e.target.value })} placeholder="Ex: 199" />
                      <div style={{ fontSize: '0.72rem', color: 'var(--a-text2)', marginTop: '0.3rem' }}>Laissez vide si pas de réduction. Doit être supérieur au prix de vente.</div>
                    </div>
                    <div className="cp-field">
                      <div className="cp-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        Prix d&apos;achat / Coût interne (DH)
                        <span style={{ background: 'rgba(192,57,43,0.1)', color: 'var(--a-primary)', fontSize: '0.6rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px', letterSpacing: '0.05em' }}>ADMIN</span>
                      </div>
                      <input className="cp-input" type="number" min="0" step="0.01" value={form.costPrice} onChange={e => setForm({ ...form, costPrice: e.target.value })} placeholder="Ex: 90" />
                      <div style={{ fontSize: '0.72rem', color: 'var(--a-text2)', marginTop: '0.3rem' }}>Jamais affiché aux clients. Sert uniquement au calcul de marge.</div>
                    </div>
                  </div>
                  {form.price && form.costPrice && Number(form.costPrice) > 0 && (
                    <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.9rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--a-text2)' }}>
                      Marge : <strong style={{ color: '#22c55e' }}>
                        {Math.round((Number(form.price) - Number(form.costPrice)) / Number(form.price) * 100)}%
                      </strong> — Bénéfice : <strong style={{ color: '#22c55e' }}>
                        {(Number(form.price) - Number(form.costPrice)).toFixed(2)} DH
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Badges & Homepage */}
              <div className="cp-section">
                <div className="cp-section-head"><span>Badges & Visibilité</span></div>
                <div className="cp-section-body">
                  {[
                    { key: 'isBestOffer', label: 'Page d\'accueil (Vedette)', desc: 'Affiche le produit dans la section Vedette sur la page d\'accueil' },
                    { key: 'isPromo', label: 'En promotion', desc: 'Affiche dans la section Promotions + badge "Promo"' },
                    { key: 'isNew', label: 'Nouveau', desc: 'Affiche le badge "Nouveau"' },
                  ].map(b => (
                    <div key={b.key} className="toggle-row">
                      <div className="toggle-info">
                        <h4>{b.label}</h4>
                        <p>{b.desc}</p>
                      </div>
                      <div
                        className={`toggle-switch ${form[b.key as keyof typeof form] ? 'on' : ''}`}
                        onClick={() => setForm({ ...form, [b.key]: !form[b.key as keyof typeof form] })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="create-product-sidebar">
              {/* Inventory */}
              <div className="sidebar-section">
                <div className="sidebar-section-head">Inventaire</div>
                <div className="sidebar-section-body">
                  <div className="ss-label">Quantité en stock</div>
                  <input className="ss-input" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                </div>
              </div>

              {/* Save */}
              <button
                className="btn-new proexcel-btn-admin-save-action"
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                onClick={saveProduct}
                disabled={loading}
              >
                {loading ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>

          {saveError && (
            <div style={{
              color: '#e74c3c', fontSize: '0.85rem', padding: '0.75rem 1rem',
              background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)',
              borderRadius: '8px', marginBottom: '0.75rem'
            }}>
              ⚠ {saveError}
            </div>
          )}
          <button className="btn-save proexcel-btn-admin-save-action" onClick={saveProduct} disabled={loading}>
            {loading ? 'Enregistrement…' : 'Enregistrer le produit'}
          </button>
        </div>
      )}
    </div>
  )
}
