export type ButtonStyle = {
  bgType: 'solid' | 'gradient'
  bgColor: string
  gradColor1: string
  gradColor2: string
  gradDir: string
  textColor: string
  hoverBgType?: 'solid' | 'gradient'
  hoverBgColor: string
  hoverGradColor1: string
  hoverGradColor2: string
  hoverTextColor: string
  borderColor: string
  borderWidth: string
  borderStyle: string
  borderRadius: string
  paddingY: string
  paddingX: string
  fontSize: string
  fontWeight: string
  boxShadow: string
  hoverEffect: 'none' | 'lift' | 'scale' | 'glow' | 'slide' | 'underline'
  shadowIntensity: number
  transition: string
  iconSize: string
  hoverBorderColor?: string
  hoverBoxShadow?: string
  glowColor?: string
  glowBlur?: string
  hoverGlowColor?: string
  hoverGlowBlur?: string
}

export type ButtonDefinition = {
  id: string
  label: string
  location: string
  default: ButtonStyle
}

export type ButtonPage = {
  id: string
  label: string
  buttons: ButtonDefinition[]
}

const primary: ButtonStyle = {
  bgType: 'gradient',
  bgColor: '#e8352a',
  gradColor1: '#e8352a',
  gradColor2: '#ff7a00',
  gradDir: '135deg',
  textColor: '#ffffff',
  hoverBgColor: '#c1121f',
  hoverGradColor1: '#c1121f',
  hoverGradColor2: '#e05c00',
  hoverTextColor: '#ffffff',
  borderColor: 'transparent',
  borderWidth: '0px',
  borderStyle: 'solid',
  borderRadius: '10px',
  paddingY: '0.85rem',
  paddingX: '1.75rem',
  fontSize: '0.9rem',
  fontWeight: '700',
  boxShadow: '0 12px 28px rgba(232,53,42,0.28)',
  hoverEffect: 'lift',
  shadowIntensity: 1,
  transition: '220ms',
  iconSize: '1.2em',
}

const outline: ButtonStyle = {
  ...primary,
  bgType: 'solid',
  bgColor: 'transparent',
  textColor: '#e8352a',
  hoverBgColor: 'rgba(232,53,42,0.08)',
  hoverTextColor: '#e8352a',
  borderColor: '#e8352a',
  borderWidth: '1.5px',
  fontWeight: '600',
  boxShadow: 'none',
}

const ghost: ButtonStyle = {
  ...primary,
  bgType: 'solid',
  bgColor: 'rgba(255,255,255,0.1)',
  textColor: '#ffffff',
  hoverBgColor: 'rgba(255,255,255,0.18)',
  hoverTextColor: '#ffffff',
  borderColor: 'rgba(255,255,255,0.28)',
  borderWidth: '1.5px',
  fontWeight: '600',
  boxShadow: '0 12px 26px rgba(0,0,0,0.18)',
}

const success: ButtonStyle = {
  ...primary,
  gradColor1: '#22c55e',
  gradColor2: '#16a34a',
  hoverGradColor1: '#16a34a',
  hoverGradColor2: '#15803d',
  boxShadow: '0 12px 28px rgba(34,197,94,0.28)',
}

const danger: ButtonStyle = {
  ...primary,
  bgType: 'solid',
  bgColor: '#ef4444',
  gradColor1: '#ef4444',
  gradColor2: '#dc2626',
  hoverBgColor: '#dc2626',
  hoverGradColor1: '#dc2626',
  hoverGradColor2: '#b91c1c',
  borderRadius: '8px',
  paddingY: '0.58rem',
  paddingX: '1rem',
  fontSize: '0.82rem',
  fontWeight: '700',
  boxShadow: '0 10px 22px rgba(239,68,68,0.24)',
  hoverEffect: 'scale',
  transition: '180ms',
}

const icon: ButtonStyle = {
  ...primary,
  bgType: 'solid',
  bgColor: 'rgba(255,255,255,0.95)',
  textColor: '#111827',
  hoverBgColor: '#e8352a',
  hoverTextColor: '#ffffff',
  borderColor: 'rgba(0,0,0,0.08)',
  borderWidth: '1px',
  borderRadius: '999px',
  paddingY: '0.62rem',
  paddingX: '0.62rem',
  fontSize: '0.86rem',
  fontWeight: '700',
  boxShadow: '0 12px 24px rgba(0,0,0,0.14)',
}

const tab: ButtonStyle = {
  ...outline,
  borderColor: '#d7dde8',
  textColor: '#111827',
  hoverTextColor: '#e8352a',
  hoverBgColor: 'rgba(232,53,42,0.08)',
  borderRadius: '8px',
  paddingY: '0.62rem',
  paddingX: '1rem',
  fontSize: '0.86rem',
}

const adminPrimary: ButtonStyle = {
  ...primary,
  bgType: 'solid',
  bgColor: '#c0392b',
  hoverBgColor: '#a83226',
  boxShadow: '0 10px 24px rgba(192,57,43,0.22)',
}

export const BUTTON_STYLE_PAGES: ButtonPage[] = [
  {
    id: 'home',
    label: 'Page d\'accueil',
    buttons: [
      { id: 'home-hero-primary', label: 'Bouton Hero Principal', location: 'Slider (CTA 1)', default: primary },
      { id: 'home-hero-secondary', label: 'Bouton Hero Secondaire', location: 'Slider (CTA 2)', default: ghost },
      { id: 'home-cat-card', label: 'Bouton Catégorie', location: 'Section Rayons', default: primary },
      { id: 'home-shop-now', label: 'Bouton Acheter (Section)', location: 'Sections Produits', default: primary },
      { id: 'home-best-offers', label: 'Voir toutes les offres', location: 'Section Meilleures Offres', default: outline },
      { id: 'home-promo-strip', label: 'Bouton Bandelette Promo', location: 'Bandelette sous Hero', default: ghost },
      { id: 'home-product-card-add', label: 'Bouton Ajout Rapide', location: 'Cartes Produits (Icône)', default: icon },
      { id: 'home-search-btn', label: 'Bouton Recherche (Navbar)', location: 'Barre de navigation', default: icon },
    ],
  },
  {
    id: 'product',
    label: 'Page Produit',
    buttons: [
      { id: 'product-add-cart', label: 'Ajouter au Panier', location: 'Page Détails', default: primary },
      { id: 'product-buy-now', label: 'Acheter Maintenant', location: 'Page Détails', default: success },
      { id: 'product-quantity', label: 'Sélecteur Quantité (+/-)', location: 'Page Détails', default: icon },
      { id: 'product-variant', label: 'Option de Variante', location: 'Page Détails', default: outline },
      { id: 'product-tab', label: 'Onglet Description/Avis', location: 'Bas de page', default: outline },
      { id: 'product-review-open', label: 'Bouton Écrire un Avis', location: 'Section Avis', default: outline },
      { id: 'product-review-submit', label: 'Envoyer l\'Avis', location: 'Formulaire Avis', default: primary },
      { id: 'product-gallery-arrow', label: 'Flèches Galerie', location: 'Galerie Images', default: { ...outline, borderRadius: '50%', paddingX: '12px', paddingY: '12px' } },
    ],
  },
  {
    id: 'cart',
    label: 'Page Panier',
    buttons: [
      { id: 'cart-checkout', label: 'Passer à la Caisse', location: 'Page Panier', default: success },
      { id: 'cart-continue', label: 'Continuer les Achats', location: 'Bas de page panier', default: outline },
      { id: 'cart-empty', label: 'Vider le Panier', location: 'Page Panier (Bas)', default: danger },
      { id: 'cart-empty-browse', label: 'Parcourir les Livres', location: 'Panier Vide', default: primary },
      { id: 'cart-quantity', label: 'Sélecteur Quantité (+/-)', location: 'Ligne Produit Panier', default: icon },
      { id: 'cart-remove', label: 'Supprimer du Panier', location: 'Ligne Produit Panier', default: icon },
      { id: 'cart-summary-continue', label: 'Bouton Continuer (Résumé)', location: 'Pied de résumé', default: ghost },
    ],
  },
  {
    id: 'checkout',
    label: 'Page Checkout',
    buttons: [
      { id: 'checkout-submit', label: 'Confirmer la Commande', location: 'Formulaire Paiement', default: success },
      { id: 'checkout-promo', label: 'Appliquer Code Promo', location: 'Résumé Commande', default: primary },
    ],
  },
  {
    id: 'account',
    label: 'Compte / Connexion',
    buttons: [
      { id: 'account-login', label: 'Se Connecter', location: 'Page Connexion', default: primary },
      { id: 'account-register', label: 'Créer un Compte', location: 'Page Inscription', default: primary },
      { id: 'account-logout', label: 'Se Déconnecter', location: 'Menu Client', default: { ...outline, textColor: '#ef4444' } },
    ],
  },
  {
    id: 'contact',
    label: 'Page Contact',
    buttons: [
      { id: 'contact-send', label: 'Envoyer le Message', location: 'Formulaire Contact', default: primary },
      { id: 'contact-map', label: 'Ouvrir Google Maps', location: 'Section Localisation', default: outline },
    ],
  },
  {
    id: 'about',
    label: 'À Propos',
    buttons: [
      { id: 'about-catalog', label: 'Explorer le Catalogue', location: 'Bas de page', default: primary },
      { id: 'about-map', label: 'Voir sur la Carte', location: 'Section Localisation', default: outline },
    ],
  },
  {
    id: 'admin',
    label: 'Interface Admin',
    buttons: [
      { id: 'admin-save-action', label: 'Sauvegarder tout', location: 'Topbar Admin', default: adminPrimary },
      { id: 'admin-upload-action', label: 'Bouton Upload Image', location: 'Formulaires Admin', default: outline },
      { id: 'admin-danger-action', label: 'Supprimer / Réinitialiser', location: 'Actions critiques', default: danger },
      { id: 'admin-primary-action', label: 'Action Principale', location: 'Modales & Pages', default: adminPrimary },
      { id: 'admin-secondary-action', label: 'Action Secondaire', location: 'Navigation & Tables', default: outline },
    ],
  },
]

export const REAL_BUTTON_IDS = new Set(
  BUTTON_STYLE_PAGES.flatMap(page => page.buttons.map(button => button.id))
)

export function buttonCssClass(id: string) {
  return `proexcel-btn-${id}`
}

export function findButtonDefinition(id: string) {
  for (const page of BUTTON_STYLE_PAGES) {
    const button = page.buttons.find(item => item.id === id)
    if (button) return button
  }
  return null
}

export function normalizeButtonStyle(raw: Partial<ButtonStyle> & Record<string, unknown>, fallback: ButtonStyle = primary): ButtonStyle {
  const legacy = raw as Record<string, string | undefined>
  const legacyEffect = legacy.hoverAnimation === 'moveUp' ? 'lift' : legacy.hoverAnimation

  return {
    ...fallback,
    ...raw,
    hoverBgColor: raw.hoverBgColor ?? legacy.hoverBg ?? fallback.hoverBgColor,
    hoverGradColor1: raw.hoverGradColor1 ?? legacy.hoverGrad1 ?? fallback.hoverGradColor1,
    hoverGradColor2: raw.hoverGradColor2 ?? legacy.hoverGrad2 ?? fallback.hoverGradColor2,
    hoverTextColor: raw.hoverTextColor ?? legacy.hoverText ?? fallback.hoverTextColor,
    paddingY: raw.paddingY ?? legacy.paddingV ?? fallback.paddingY,
    paddingX: raw.paddingX ?? legacy.paddingH ?? fallback.paddingX,
    hoverEffect: raw.hoverEffect ?? (legacyEffect as ButtonStyle['hoverEffect']) ?? fallback.hoverEffect,
    transition: raw.transition ?? legacy.transitionSpeed ?? fallback.transition,
    borderStyle: raw.borderStyle ?? legacy.borderStyle ?? fallback.borderStyle,
    boxShadow: raw.boxShadow ?? legacy.boxShadow ?? fallback.boxShadow,
    shadowIntensity: raw.shadowIntensity ?? fallback.shadowIntensity,
    iconSize: raw.iconSize ?? fallback.iconSize,
    hoverBorderColor: raw.hoverBorderColor ?? fallback.hoverBorderColor,
    hoverBoxShadow: raw.hoverBoxShadow ?? fallback.hoverBoxShadow,
    hoverBgType: raw.hoverBgType ?? fallback.hoverBgType,
    glowColor: raw.glowColor ?? fallback.glowColor,
    glowBlur: raw.glowBlur ?? fallback.glowBlur,
    hoverGlowColor: raw.hoverGlowColor ?? fallback.hoverGlowColor,
    hoverGlowBlur: raw.hoverGlowBlur ?? fallback.hoverGlowBlur,
  }
}

export function sanitizeButtonStyles(raw: unknown): Record<string, ButtonStyle> {
  if (!raw || typeof raw !== 'object') return {}

  const cleaned: Record<string, ButtonStyle> = {}
  Object.entries(raw as Record<string, Partial<ButtonStyle> & Record<string, unknown>>).forEach(([id, style]) => {
    if (!REAL_BUTTON_IDS.has(id)) return
    const definition = findButtonDefinition(id)
    if (!definition) return
    cleaned[id] = normalizeButtonStyle(style, definition.default)
  })
  return cleaned
}

function cssBg(style: ButtonStyle, hover = false) {
  const effectiveBgType = hover ? (style.hoverBgType ?? style.bgType) : style.bgType
  if (effectiveBgType === 'gradient') {
    const first = hover ? style.hoverGradColor1 : style.gradColor1
    const second = hover ? style.hoverGradColor2 : style.gradColor2
    return `linear-gradient(${style.gradDir}, ${first} 0%, ${second} 100%)`
  }
  return hover ? style.hoverBgColor : style.bgColor
}

function hoverTransform(style: ButtonStyle) {
  if (style.hoverEffect === 'lift') return 'transform:translateY(-2px) scale(1.015);'
  if (style.hoverEffect === 'scale') return 'transform:scale(1.045);'
  if (style.hoverEffect === 'slide') return 'transform:translateX(3px);'
  if (style.hoverEffect === 'glow') return 'filter:brightness(1.08) drop-shadow(0 0 8px currentColor);'
  if (style.hoverEffect === 'underline') return 'text-decoration:underline!important;'
  return 'transform:none;'
}

export function buildButtonCSS(id: string, rawStyle: Partial<ButtonStyle> & Record<string, unknown>) {
  const definition = findButtonDefinition(id)
  const style = normalizeButtonStyle(rawStyle, definition?.default)
  const cls = buttonCssClass(id)

  const normalGlow = style.glowColor ? `,0 0 ${style.glowBlur || '20px'} ${style.glowColor}` : ''
  const hoverGlow = style.hoverGlowColor ? `,0 0 ${style.hoverGlowBlur || '25px'} ${style.hoverGlowColor}` : ''

  return `.${cls}{background:${cssBg(style)}!important;color:${style.textColor}!important;border:${style.borderWidth} ${style.borderStyle || 'solid'} ${style.borderColor}!important;border-radius:${style.borderRadius}!important;padding:${style.paddingY} ${style.paddingX}!important;font-size:${style.fontSize}!important;font-weight:${style.fontWeight}!important;box-shadow:${style.boxShadow}${normalGlow}!important;transition:all ${style.transition} ease!important;display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;text-decoration:none;cursor:pointer;}.${cls} svg{width:${style.iconSize}!important;height:${style.iconSize}!important;}.${cls}:hover{background:${cssBg(style, true)}!important;color:${style.hoverTextColor}!important;border-color:${style.hoverBorderColor || style.borderColor}!important;${hoverTransform(style)}box-shadow:${style.hoverBoxShadow || style.boxShadow}${hoverGlow}!important;}.${cls}:disabled{opacity:0.62;cursor:not-allowed;transform:none!important;}`
}

export function buildButtonStyleSheet(styles: Record<string, Partial<ButtonStyle> & Record<string, unknown>>) {
  return Object.entries(sanitizeButtonStyles(styles))
    .map(([id, style]) => buildButtonCSS(id, style))
    .join('\n')
}
