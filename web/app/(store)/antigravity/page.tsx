'use client'

import { useState, useEffect } from 'react'
import AntigravityProductCard from '@/components/store/AntigravityProductCard'
import { useLang } from '@/components/LangContext'
import { ArrowRight } from 'lucide-react'

type Product = {
  id: number
  title: string
  titleAr?: string | null
  price: number
  compareAtPrice?: number | null
  stock: number
  rating?: number | null
  reviewCount?: number | null
  isNew?: boolean | null
  isBestOffer?: boolean | null
  isPromo?: boolean | null
  colors?: string[] | string | null
  media?: any
  images?: any
}

const FALLBACK_PRODUCTS: Product[] = [
  { id: 6, title: "Maped Crayons De 12 Couleurs", titleAr: "أقلام ملونة مابيد 12 لونًا", price: 30, compareAtPrice: 49, stock: 149, rating: 4.5, reviewCount: 24, isNew: true, isPromo: true, isBestOffer: false, colors: ["#ff3b30","#34c759","#007aff","#ffcc00"], images: ["https://nquytawxdoxxltwcwamy.supabase.co/storage/v1/object/public/uploads/1778703595443-81lhk7v5qe5.jpg"] },
  { id: 7, title: "Deli Crayons De 12 Couleurs", titleAr: "أقلام ملونة ديلي 12 لونًا", price: 20, compareAtPrice: 32, stock: 100, rating: 4.2, reviewCount: 18, isNew: true, isPromo: false, isBestOffer: true, colors: ["#ff9500","#4cd964","#5ac8fa","#5856d6"], images: ["https://nquytawxdoxxltwcwamy.supabase.co/storage/v1/object/public/uploads/1778703888262-lpf1s9dj2ka.jpg"] },
  { id: 8, title: "Maped - Compas à mine - coffret 2 pièces", titleAr: "بركار مابيد - علبة قطعتين", price: 25, compareAtPrice: 39, stock: 100, rating: 4.7, reviewCount: 35, isNew: false, isPromo: false, isBestOffer: true, colors: ["#80ff00","#fe71e4","#333333"], images: ["https://nquytawxdoxxltwcwamy.supabase.co/storage/v1/object/public/uploads/1778711355091-o4ehxzabel.webp"] },
  { id: 9, title: "12 crayons de couleur Faber-Castell", titleAr: "أقلام ملونة فابر كاستل 12 لونًا", price: 22, compareAtPrice: 29, stock: 100, rating: 4.5, reviewCount: 42, isNew: false, isPromo: false, isBestOffer: true, colors: ["#ff2d55","#af52de","#34c759","#007aff"], images: ["https://nquytawxdoxxltwcwamy.supabase.co/storage/v1/object/public/uploads/1778851562563-ck28mlksza5.jpg"] },
  { id: 10, title: "Compas Deli Avec Crayon EG20102", titleAr: "بركار ديلي مع قلم رصاص", price: 20, compareAtPrice: 29, stock: 150, rating: 4.1, reviewCount: 9, isNew: false, isPromo: false, isBestOffer: true, colors: ["#2163d5","#da4376"], images: ["https://nquytawxdoxxltwcwamy.supabase.co/storage/v1/object/public/uploads/1778851666819-5yixem9g222.jpg"] },
  { id: 11, title: "BOITE DE 36 CRAYONS DE COULEUR -DELI-", titleAr: "علبة أقلام ملونة ديلي 36 لونًا", price: 35, compareAtPrice: 49, stock: 120, rating: 4.8, reviewCount: 51, isNew: false, isPromo: false, isBestOffer: true, colors: ["#ff3b30","#ff9500","#4cd964","#5ac8fa","#5856d6","#af52de"], images: ["https://nquytawxdoxxltwcwamy.supabase.co/storage/v1/object/public/uploads/1778851792057-dcbxhjzgub5.png"] },
  { id: 12, title: "COLLE STICK 21G UHU", titleAr: "لاصق يو إتش يو 21 جرام", price: 19, compareAtPrice: 25, stock: 98, rating: 4.4, reviewCount: 15, isNew: false, isPromo: false, isBestOffer: true, colors: [], images: ["https://nquytawxdoxxltwcwamy.supabase.co/storage/v1/object/public/uploads/1778851851898-4o40ai7m0w.webp"] },
  { id: 13, title: "Set de 12 Feutres Fineliners – Deli Linkus 0900", titleAr: "مجموعة 12 قلم تحديد ديلي لينكوس", price: 45, compareAtPrice: 55, stock: 100, rating: 4.6, reviewCount: 29, isNew: false, isPromo: false, isBestOffer: true, colors: ["#34c759","#ffcc00","#ff3b30","#007aff","#5856d6"], images: ["https://nquytawxdoxxltwcwamy.supabase.co/storage/v1/object/public/uploads/1778851954100-g967jk0fwsv.webp"] },
  { id: 14, title: "Pistolet Colle Thermofusible Deli A500061", titleAr: "مسدس لاصق حراري ديلي", price: 65, compareAtPrice: 89, stock: 60, rating: 4.3, reviewCount: 11, isNew: false, isPromo: true, isBestOffer: false, colors: ["#ffcc00","#222222"], images: ["https://nquytawxdoxxltwcwamy.supabase.co/storage/v1/object/public/uploads/1778703888262-lpf1s9dj2ka.jpg"] },
]

// ─── ALL scoped CSS lives here — rendered server-side inside <style> JSX tag ───
const ALL_CSS = `
/* ═══ OUTER SHELL ═══ */
.pxp-outer{background:#E4E3D8;min-height:100vh;padding:60px 24px;box-sizing:border-box}

/* ═══ WHITE PANEL ═══ */
.pxp-panel{max-width:1200px;margin:0 auto;background:#ffffff;border-radius:34px;padding:56px;border:1px solid rgba(0,0,0,0.06);box-shadow:0 20px 60px rgba(0,0,0,0.08);box-sizing:border-box}

/* ═══ SECTION HEADER ═══ */
.pxp-header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:40px;flex-wrap:wrap}
.pxp-title{font-size:30px;font-weight:800;color:#171717;letter-spacing:-0.02em;line-height:1.2;margin:0;font-family:inherit}
.pxp-title-hl{color:#7B8151}
.pxp-btn{background:#7B8151;color:#fff;font-size:14px;font-weight:700;padding:12px 22px;border-radius:999px;display:inline-flex;align-items:center;gap:8px;text-decoration:none;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(123,129,81,0.3);transition:background 220ms ease,transform 220ms ease,box-shadow 220ms ease;white-space:nowrap;flex-shrink:0;font-family:inherit}
.pxp-btn:hover{background:#686d44;transform:translateY(-2px);box-shadow:0 8px 24px rgba(123,129,81,0.45)}
.pxp-btn svg{transition:transform 220ms ease;display:block}
.pxp-btn:hover svg{transform:translateX(3px)}

/* ═══ GRID ═══ */
.pxp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:36px 28px}

/* ═══ SKELETON ═══ */
.pxp-skel-img{border-radius:24px;background:#eeeee9;animation:pxpPulse 1.6s ease infinite}
.pxp-skel-line{background:#eeeee9;border-radius:6px;animation:pxpPulse 1.6s ease infinite}
@keyframes pxpPulse{0%,100%{opacity:1}50%{opacity:0.45}}

/* ═══ TOAST ═══ */
.pxp-toasts{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;max-width:320px;width:100%;pointer-events:none}
.pxp-toasts.rtl{right:auto;left:20px}
.pxp-toast{display:flex;align-items:center;gap:10px;background:#111;color:#fff;padding:12px 16px;border-radius:14px;font-size:13px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.25);animation:pxpFadeIn 0.3s ease both;pointer-events:auto}
.pxp-toast-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;flex-shrink:0}
@keyframes pxpFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* ═══════════════════════════════════════════════
   PRODUCT CARD — transparent, open, no border
═══════════════════════════════════════════════ */
.pxcard{display:flex;flex-direction:column;width:100%;cursor:pointer;background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important;margin:0;border-radius:0!important;transition:transform 260ms ease}
.pxcard:hover{transform:translateY(-4px)}

/* ── Image block ── */
.pxcard-img-wrap{position:relative;width:100%;aspect-ratio:1/1;border-radius:24px;overflow:hidden;background:#F7F7F3;box-shadow:0 4px 16px rgba(0,0,0,0.06);transition:box-shadow 260ms ease;flex-shrink:0}
.pxcard:hover .pxcard-img-wrap{box-shadow:0 18px 45px rgba(0,0,0,0.14)}

/* Next.js Image gets object-fit via style prop but also reinforce here */
.pxcard-img-wrap img{transition:transform 260ms ease!important; object-fit: contain!important; width: 100%!important; height: 100%!important;}
.pxcard:hover .pxcard-img-wrap img{transform:scale(1.04)!important}

/* ── Badge ── */
.pxcard-badge{position:absolute;top:14px;left:14px;z-index:10;color:#fff;font-size:12px;font-weight:800;line-height:1;padding:6px 11px;border-radius:999px;pointer-events:none;user-select:none;letter-spacing:0.01em}
.pxcard-badge-discount{background:#FF1654;box-shadow:0 8px 18px rgba(255,22,84,0.28)}
.pxcard-badge-new{background:#10b981;box-shadow:0 8px 18px rgba(16,185,129,0.25)}
.pxcard-badge-hot{background:#f97316;box-shadow:0 8px 18px rgba(249,115,22,0.25)}

/* ── Floating action icons ── */
.pxcard-actions{position:absolute;top:14px;right:14px;z-index:20;display:flex;flex-direction:column;gap:10px;opacity:0;transform:translateX(8px);transition:opacity 220ms ease,transform 220ms ease}
.pxcard:hover .pxcard-actions{opacity:1;transform:translateX(0)}

.pxcard-icon{width:38px;height:38px;border-radius:50%;background:#ffffff;border:1px solid rgba(0,0,0,0.08);box-shadow:0 8px 20px rgba(0,0,0,0.10);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#222;transition:background 220ms ease,color 220ms ease,transform 220ms ease,box-shadow 220ms ease,border-color 220ms ease;flex-shrink:0;padding:0;outline:none;line-height:1}
.pxcard-icon:hover{transform:scale(1.08);box-shadow:0 10px 24px rgba(0,0,0,0.16)}
.pxcard-icon:active{transform:scale(0.94)!important}
.pxcard-icon-wish:hover,.pxcard-icon-wish.wl-on{background:#FF1654;color:#fff;border-color:transparent}
.pxcard-icon-view:hover{background:#247BA0;color:#fff;border-color:transparent}
.pxcard-icon-cart:hover,.pxcard-icon-cart.cart-adding{background:#7B8151;color:#fff;border-color:transparent}
.pxcard-icon-cart:disabled{background:#f3f4f6!important;color:#d1d5db!important;cursor:not-allowed;box-shadow:none!important;transform:none!important;border-color:transparent}

/* ── Out of stock ── */
.pxcard-oos{position:absolute;inset:0;background:rgba(255,255,255,0.58);backdrop-filter:blur(2px);z-index:15;display:flex;align-items:center;justify-content:center}
.pxcard-oos span{background:#000;color:#fff;font-size:11px;font-weight:700;padding:5px 14px;border-radius:999px;text-transform:uppercase;letter-spacing:0.06em}

/* ── Info section ── */
.pxcard-info{margin-top:16px;display:flex;flex-direction:column;gap:4px}
.pxcard-subtitle{font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:inherit}
.pxcard-name-row{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:4px}
.pxcard-name{font-size:15px;font-weight:600;color:#111;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-decoration:none;flex:1;min-width:0;transition:color 200ms ease;font-family:inherit}
.pxcard-name:hover{color:#247BA0}
.pxcard-stars{display:flex;align-items:center;gap:3px;flex-shrink:0;margin-top:1px}
.pxcard-stars-num{font-size:13px;font-weight:600;color:#333}
.pxcard-prices{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-top:2px}
.pxcard-price{font-size:20px;font-weight:900;color:#111;line-height:1;letter-spacing:-0.02em;font-family:inherit}
.pxcard-currency{font-size:14px;font-weight:600}
.pxcard-compare{font-size:14px;font-weight:400;color:#8A8A8A;text-decoration:line-through}
.pxcard-swatches { display: flex; align-items: center; gap: 7px; margin-top: 12px; flex-wrap: wrap; }
.pxcard-swatch {
  width: 20px !important;
  height: 20px !important;
  border-radius: 50% !important;
  aspect-ratio: 1 / 1 !important;
  border: 1.5px solid rgba(0,0,0,0.12) !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0 !important;
  padding: 0 !important;
  margin: 0;
  outline: none;
  background: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.2);
}
.pxcard-swatch:hover { transform: scale(1.12); }
.pxcard-swatch.sw-active { transform: scale(1.15); box-shadow: 0 0 0 2px var(--bg), 0 0 0 3.5px var(--primary) !important; }

/* ═══ DARK MODE ═══ */
[data-theme="dark"] .pxp-outer,.dark .pxp-outer{background:#101010}
[data-theme="dark"] .pxp-panel,.dark .pxp-panel{background:#181818;border-color:rgba(255,255,255,0.07);box-shadow:0 20px 60px rgba(0,0,0,0.5)}
[data-theme="dark"] .pxp-title,.dark .pxp-title{color:#fff}
[data-theme="dark"] .pxp-skel-img,[data-theme="dark"] .pxp-skel-line,.dark .pxp-skel-img,.dark .pxp-skel-line{background:#252525}
[data-theme="dark"] .pxp-toast,.dark .pxp-toast{background:#fff;color:#111}
[data-theme="dark"] .pxcard-img-wrap,.dark .pxcard-img-wrap{background:#222}
[data-theme="dark"] .pxcard-icon,.dark .pxcard-icon{background:#2A2A2A;border-color:rgba(255,255,255,0.08);color:#e5e7eb}
[data-theme="dark"] .pxcard-name,.dark .pxcard-name{color:#d1d5db}
[data-theme="dark"] .pxcard-subtitle,.dark .pxcard-subtitle{color:#fff}
[data-theme="dark"] .pxcard-price,.dark .pxcard-price{color:#fff}
[data-theme="dark"] .pxcard-stars-num,.dark .pxcard-stars-num{color:#d1d5db}
[data-theme="dark"] .pxcard-compare,.dark .pxcard-compare{color:#6b7280}
[data-theme="dark"] .pxcard-oos,.dark .pxcard-oos{background:rgba(0,0,0,0.6)}
[data-theme="dark"] .pxcard-oos span,.dark .pxcard-oos span{background:#fff;color:#000}
[data-theme="dark"] .pxcard-swatch,.dark .pxcard-swatch{border: 1.5px solid rgba(255,255,255,0.2) !important;}
[data-theme="dark"] .pxcard-swatch.sw-active,.dark .pxcard-swatch.sw-active{box-shadow:0 0 0 2px #0a0a0a,0 0 0 3.5px #fff !important}

/* ═══ RESPONSIVE ═══ */
@media(max-width:900px){.pxp-grid{grid-template-columns:repeat(2,1fr);gap:28px 20px}}
@media(max-width:768px){.pxcard-img-wrap{aspect-ratio:1/1;}.pxp-panel{padding:36px 24px 48px}.pxcard-actions{opacity:1;transform:translateX(0)}.pxcard-icon{width:34px;height:34px}}
@media(max-width:560px){.pxp-grid{grid-template-columns:1fr;gap:32px}.pxp-outer{padding:28px 16px}.pxp-panel{padding:28px 18px 36px;border-radius:22px}.pxp-title{font-size:22px}}
`

export default function AntigravityDemoPage() {
  const { lang, t, isRTL } = useLang()
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS)
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([])

  useEffect(() => {
    setLoading(true)
    fetch('/api/products?limit=50')
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.products ?? [])
        if (list?.length > 0) {
          const items = list.filter((p: any) =>
            p.category === 'OUTILS SCOLAIRES' ||
            ['crayon','compas','colle','deli','maped','feutre','faber','uhu'].some(k =>
              p.title?.toLowerCase().includes(k)
            )
          ).slice(0, 9)
          const merged = [...items, ...FALLBACK_PRODUCTS]
          const seen = new Set<number>()
          const unique = merged.filter(p => { const d = seen.has(p.id); seen.add(p.id); return !d })
          setProducts(unique.slice(0, 9))
        }
      })
      .catch(() => setProducts(FALLBACK_PRODUCTS))
      .finally(() => setLoading(false))

    const onToast = (e: Event) => {
      const { message } = (e as CustomEvent).detail
      const id = Date.now()
      setToasts(prev => [...prev, { id, message }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
    }
    window.addEventListener('toast-notification', onToast)
    return () => window.removeEventListener('toast-notification', onToast)
  }, [])

  return (
    <>
      {/* ─── All scoped CSS — rendered server-side, no hydration delay ─── */}
      <style dangerouslySetInnerHTML={{ __html: ALL_CSS }} />

      <main className="pxp-outer">

        {/* Toast notifications */}
        <div className={`pxp-toasts${isRTL ? ' rtl' : ''}`}>
          {toasts.map(toast => (
            <div key={toast.id} className="pxp-toast">
              <div className="pxp-toast-dot" />
              {toast.message}
            </div>
          ))}
        </div>

        {/* ══════════ WHITE PANEL ══════════ */}
        <div className="pxp-panel">

          {/* Section header */}
          <div className="pxp-header">
            <h1 className="pxp-title">
              {lang === 'ar'
                ? (<>مجموعات <span className="pxp-title-hl">منتجاتنا</span></>)
                : (<>Produits les plus <span className="pxp-title-hl">demandés</span></>)
              }
            </h1>
            <a href="/collections" className="pxp-btn">
              {t('Voir plus', 'عرض المزيد')}
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Product grid */}
          {loading && products.length === 0 ? (
            <div className="pxp-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="pxp-skel-img" style={{ height: 300, marginBottom: 14 }} />
                  <div className="pxp-skel-line" style={{ height: 14, width: '75%', marginBottom: 8 }} />
                  <div className="pxp-skel-line" style={{ height: 13, width: '55%', marginBottom: 8 }} />
                  <div className="pxp-skel-line" style={{ height: 20, width: '35%' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="pxp-grid">
              {products.map((product, index) => (
                <AntigravityProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}

        </div>
        {/* end panel */}

      </main>
    </>
  )
}
