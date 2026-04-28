// ─── TRANSLATIONS ───
const T = {
  fr: {
    nav_home: "Accueil", nav_offers: "Meilleures Offres", nav_about: "À Propos", nav_contact: "Contact",
    nav_login: "Connexion",
    search_ph: "Rechercher…",
    hero1_tag: "Rentrée Scolaire 2026", hero1_title: "Tous vos manuels", hero1_span: "en un seul endroit",
    hero1_sub: "Découvrez notre sélection complète de livres scolaires pour le primaire, collège et lycée au Maroc.",
    hero1_btn1: "Explorer le catalogue ›", hero1_btn2: "En savoir plus",
    hero2_tag: "Offres Spéciales", hero2_title: "Économisez jusqu'à", hero2_span: "30% sur les packs",
    hero2_sub: "Achetez vos livres en pack et économisez. Livraison gratuite pour les commandes supérieures à 499 DH.",
    hero2_btn1: "Voir les offres ›", hero2_btn2: "Voir les packs",
    hero3_tag: "Nouveautés 2026", hero3_title: "Les nouveaux", hero3_span: "livres sont arrivés",
    hero3_sub: "Informatique, Technologie, Langues… Découvrez les dernières parutions pour préparer votre baccalauréat.",
    hero3_btn1: "Voir les nouveautés ›",
    cat_title: "Nos Catégories", cat_tag: "Parcourir", cat_sub: "Des livres pour tous les niveaux et toutes les matières du système éducatif marocain",
    promo_tag: "Offre Limitée", promo_h2: "Livraison Gratuite", promo_span: "dès 499 DH",
    promo_p: "Commandez plus de livres et bénéficiez de la livraison gratuite partout au Maroc!",
    feat_tag: "Tendances", feat_title: "Livres en Vedette", feat_sub: "Les manuels les plus demandés cette saison",
    offers_tag: "Promotions", offers_title: "Offres Spéciales", offers_sub: "Des prix réduits sur une sélection de livres scolaires",
    see_all: "Voir toutes les offres ›",
    about_tag: "Notre Histoire", about_h2a: "ProExcel", about_span: "Votre Maktaba",
    about_p1: "Depuis plus de 10 ans, ProExcel est la référence en matière de livres scolaires et parascolaires au Maroc. Nous proposons une sélection rigoureuse des meilleurs manuels pour accompagner les élèves du primaire au baccalauréat.",
    about_p2: "Notre équipe de spécialistes choisit chaque titre avec soin pour vous garantir la qualité et la conformité avec les programmes officiels du Ministère de l'Éducation Nationale.",
    hours_head: "🕐 Horaires d'Ouverture",
    h_mon: "Lundi – Vendredi", h_mon_t: "08:30 – 19:00",
    h_sat: "Samedi", h_sat_t: "09:00 – 18:00",
    h_sun: "Dimanche", h_sun_t: "10:00 – 14:00",
    h_hol: "Jours fériés", h_hol_t: "Fermé",
    open_maps: "Ouvrir dans Maps",
    promo_tag_banner: "Offre Limitée",
    stat1: "Titres disponibles", stat2: "Clients satisfaits", stat3: "Économies max",
    stat4: "Années d'expérience", stat5: "Titres en stock", stat6: "Clients fidèles", stat7: "Livraison rapide",
    add_cart: "+ Ajouter au panier",
    quick_add: "+ Ajouter au panier",
    checkout_btn: "Procéder au paiement",
    cart_empty: "Votre panier est vide",
    cart_empty_p: "Découvrez nos livres scolaires et ajoutez-les à votre panier",
    cart_browse: "Explorer le catalogue",
    offers_h1: "Meilleures Offres", offers_ph: "Rechercher…",
    filter_title: "Filtres", filter_clear: "Effacer",
    filter_cat: "Catégories", filter_price: "Prix Maximum", filter_stock: "Disponibilité",
    filter_instock: "En stock", filter_sale: "En promotion",
    sort_def: "Trier par défaut", sort_pa: "Prix croissant", sort_pd: "Prix décroissant",
    sort_rating: "Mieux notés", sort_new: "Nouveautés",
    checkout_title: "Finaliser la commande",
    checkout_sub: "Remplissez vos informations pour passer commande",
    checkout_info: "Informations client",
    checkout_name: "Nom complet", checkout_name_ph: "Votre nom et prénom",
    checkout_phone: "Téléphone", checkout_phone_ph: "06 00 00 00 00",
    checkout_address: "Adresse complète", checkout_address_ph: "Rue, numéro, appartement...",
    checkout_city: "Ville", checkout_city_ph: "Sélectionner votre ville",
    checkout_order: "Votre commande",
    checkout_subtotal: "Sous-total", checkout_shipping: "Livraison", checkout_total: "Total",
    checkout_free: "Gratuit 🎉",
    checkout_btn_order: "Commander maintenant",
    checkout_secure: "Paiement sécurisé à la livraison",
    ty_badge: "Commande confirmée",
    ty_title: "Merci pour votre commande !",
    ty_order: "Commande n°",
    ty_message: "Votre commande a été reçue et est en cours de traitement. Vous serez contacté sous 24h pour la confirmation de livraison.",
    ty_step1: "Commande reçue", ty_step2: "En préparation", ty_step3: "Livraison sous 48h",
    ty_btn1: "Retour à l'accueil", ty_btn2: "Suivre ma commande",
    footer_desc: "Votre librairie scolaire de confiance au Maroc. Des livres de qualité pour réussir votre année scolaire.",
    footer_nav: "Navigation", footer_cat: "Catégories", footer_info: "Infos",
    footer_return: "Politique de retour", footer_cgu: "Conditions d'utilisation",
    footer_privacy: "Confidentialité", footer_shipping: "Livraison & Expédition",
    promo_h2_html: 'Livraison Gratuite<br>dès <span class="text-gold">499 DH</span>',
    livres: "livres",
  },
  ar: {
    nav_home: "الرئيسية", nav_offers: "أفضل العروض", nav_about: "من نحن", nav_contact: "اتصل بنا",
    nav_login: "تسجيل الدخول",
    search_ph: "ابحث...",
    hero1_tag: "الدخول المدرسي 2026", hero1_title: "جميع كتبك المدرسية", hero1_span: "في مكان واحد",
    hero1_sub: "اكتشف مجموعتنا الكاملة من الكتب المدرسية للابتدائي والإعدادي والثانوي في المغرب.",
    hero1_btn1: "استكشاف الكتالوج ›", hero1_btn2: "اعرف أكثر",
    hero2_tag: "عروض خاصة", hero2_title: "وفر حتى", hero2_span: "30% على الحزم",
    hero2_sub: "اشترِ كتبك في حزمة ووفر. شحن مجاني للطلبات أكثر من 499 درهم.",
    hero2_btn1: "عرض العروض ›", hero2_btn2: "عرض الحزم",
    hero3_tag: "جديد 2026", hero3_title: "الكتب الجديدة", hero3_span: "وصلت",
    hero3_sub: "معلوماتية، تكنولوجيا، لغات... اكتشف آخر الإصدارات للتحضير للبكالوريا.",
    hero3_btn1: "عرض الجديد ›",
    cat_title: "فئاتنا", cat_tag: "تصفح", cat_sub: "كتب لجميع المستويات والمواد في المنظومة التعليمية المغربية",
    promo_tag: "عرض محدود", promo_h2: "شحن مجاني", promo_span: "من 499 درهم",
    promo_p: "اطلب أكثر من الكتب واستفد من الشحن المجاني في جميع أنحاء المغرب!",
    feat_tag: "رائج", feat_title: "الكتب المميزة", feat_sub: "الكتب الدراسية الأكثر طلبًا هذا الموسم",
    offers_tag: "تخفيضات", offers_title: "عروض خاصة", offers_sub: "أسعار مخفضة على مجموعة من الكتب المدرسية",
    see_all: "عرض جميع العروض ›",
    about_tag: "قصتنا", about_h2a: "ProExcel", about_span: "مكتبتك",
    about_p1: "منذ أكثر من 10 سنوات، تُعد ProExcel المرجع في مجال الكتب المدرسية والتكميلية في المغرب. نقدم مجموعة دقيقة من أفضل الكتب لمرافقة الطلاب من الابتدائي حتى البكالوريا.",
    about_p2: "يختار فريق متخصص لدينا كل عنوان بعناية لضمان الجودة والتوافق مع البرامج الرسمية لوزارة التربية الوطنية.",
    hours_head: "🕐 ساعات العمل",
    h_mon: "الاثنين – الجمعة", h_mon_t: "08:30 – 19:00",
    h_sat: "السبت", h_sat_t: "09:00 – 18:00",
    h_sun: "الأحد", h_sun_t: "10:00 – 14:00",
    h_hol: "أيام العطلة", h_hol_t: "مغلق",
    open_maps: "فتح في الخرائط",
    promo_tag_banner: "عرض محدود",
    stat1: "عنوان متاح", stat2: "عميل راضٍ", stat3: "أقصى توفير",
    stat4: "سنوات خبرة", stat5: "عنوان في المخزون", stat6: "عميل وفي", stat7: "توصيل سريع",
    add_cart: "+ أضف للسلة",
    quick_add: "+ أضف للسلة",
    checkout_btn: "إتمام الدفع",
    cart_empty: "سلة التسوق فارغة",
    cart_empty_p: "اكتشف كتبنا المدرسية وأضفها إلى سلتك",
    cart_browse: "استكشاف الكتالوج",
    offers_h1: "أفضل العروض", offers_ph: "بحث...",
    filter_title: "الفلاتر", filter_clear: "مسح",
    filter_cat: "الفئات", filter_price: "السعر الأقصى", filter_stock: "التوفر",
    filter_instock: "في المخزون", filter_sale: "في التخفيض",
    sort_def: "الترتيب الافتراضي", sort_pa: "السعر تصاعدي", sort_pd: "السعر تنازلي",
    sort_rating: "الأعلى تقييمًا", sort_new: "الأحدث",
    checkout_title: "إتمام الطلب",
    checkout_sub: "أكمل معلوماتك لتأكيد الطلب",
    checkout_info: "معلومات العميل",
    checkout_name: "الاسم الكامل", checkout_name_ph: "اسمك ولقبك",
    checkout_phone: "الهاتف", checkout_phone_ph: "06 00 00 00 00",
    checkout_address: "العنوان الكامل", checkout_address_ph: "الشارع، الرقم، الشقة...",
    checkout_city: "المدينة", checkout_city_ph: "اختر مدينتك",
    checkout_order: "طلبك",
    checkout_subtotal: "المجموع الفرعي", checkout_shipping: "الشحن", checkout_total: "المجموع",
    checkout_free: "مجاني 🎉",
    checkout_btn_order: "اطلب الآن",
    checkout_secure: "الدفع عند الاستلام آمن",
    ty_badge: "تم تأكيد الطلب",
    ty_title: "شكرًا على طلبك!",
    ty_order: "رقم الطلب",
    ty_message: "تم استلام طلبك وهو قيد المعالجة. سيتم التواصل معك خلال 24 ساعة لتأكيد التوصيل.",
    ty_step1: "تم استلام الطلب", ty_step2: "قيد التحضير", ty_step3: "توصيل خلال 48 ساعة",
    ty_btn1: "العودة للرئيسية", ty_btn2: "تتبع طلبي",
    footer_desc: "مكتبتك المدرسية الموثوقة في المغرب. كتب جيدة لنجاح سنتك الدراسية.",
    footer_nav: "التنقل", footer_cat: "الفئات", footer_info: "معلومات",
    footer_return: "سياسة الإرجاع", footer_cgu: "شروط الاستخدام",
    footer_privacy: "الخصوصية", footer_shipping: "التوصيل والشحن",
    promo_h2_html: 'شحن مجاني<br>من <span class="text-gold">499 درهم</span>',
    livres: "كتاب",
  }
};

// ─── THEME SYSTEM ───
function getTheme() { return localStorage.getItem('proexcel_theme') || 'dark'; }
function setTheme(t) {
  localStorage.setItem('proexcel_theme', t);
  document.documentElement.setAttribute('data-theme', t);
  document.querySelectorAll('.btn-theme').forEach(btn => {
    btn.textContent = t === 'dark' ? '☀️' : '🌙';
    btn.title = t === 'dark' ? 'Mode clair' : 'Mode sombre';
  });
}
function toggleTheme() { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); }

// ─── LANGUAGE SYSTEM ───
function getLang() { return localStorage.getItem('proexcel_lang') || 'fr'; }
function setLang(lang) {
  localStorage.setItem('proexcel_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('.btn-lang').forEach(btn => {
    btn.textContent = lang === 'fr' ? 'عربي' : 'FR';
    btn.title = lang === 'fr' ? 'Switch to Arabic' : 'Passer au français';
  });
  applyTranslations(lang);
  // Re-rendre le contenu dynamique sur toutes les pages
  const page = document.body?.dataset?.page;
  if (page === 'home') refreshHomeContent();
  else if (page === 'offers') applyFilters();
  else if (page === 'product') initProduct();
  else if (page === 'cart') initCart();
  else if (page === 'checkout') initCheckout();
}
function toggleLang() { setLang(getLang() === 'fr' ? 'ar' : 'fr'); }

function t(key) { return (T[getLang()] || T.fr)[key] || (T.fr[key] || key); }

function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = (T[lang] || T.fr)[key];
    if (val !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
      else el.textContent = val;
    }
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const val = (T[lang] || T.fr)[key];
    if (val !== undefined) el.innerHTML = val;
  });
}

// ─── PRODUCT DATA ───
const PRODUCTS_DEFAULT = [
  {
    id: 1, title: "Mathématiques – 2ème Bac Sciences", author: "Ahmed Berrada",
    price: 89, compareAtPrice: 120, category: "Mathématiques",
    g1: "#1a237e", g2: "#3949ab", emoji: "📐",
    variants: [{label:"Brochée",price:89},{label:"Reliée",price:115},{label:"Numérique",price:55}],
    stock: 15, rating: 4.8, reviewCount: 124, isPromo: true, isBestOffer: true, isNew: false,
    description: `<p>Manuel complet de mathématiques pour les élèves de 2ème Bac Sciences Maths et Sciences Physiques. Couvre l'intégralité du programme officiel marocain avec des exercices progressifs et des corrections détaillées.</p>
<ul><li>Analyse (limites, dérivées, intégrales)</li><li>Algèbre (matrices, espaces vectoriels)</li><li>Probabilités et statistiques</li><li>Géométrie dans l'espace</li></ul>
<p>Plus de 400 exercices corrigés avec méthodes et astuces pour réussir le baccalauréat.</p>`,
    reviews: [
      { name: "Youssef M.", rating: 5, comment: "Excellent manuel, très complet et bien structuré. J'ai réussi mon bac avec mention grâce à ce livre!", date: "15 Mar 2026" },
      { name: "Fatima Z.", rating: 5, comment: "Les exercices corrigés sont vraiment utiles. Je recommande vivement.", date: "2 Jan 2026" },
      { name: "Hamza K.", rating: 4, comment: "Bon livre mais certains chapitres manquent d'exemples pratiques.", date: "18 Nov 2025" }
    ]
  },
  {
    id: 2, title: "Physique-Chimie – 2ème Bac PC", author: "Omar Salmi",
    price: 79, compareAtPrice: 105, category: "Sciences",
    g1: "#880e4f", g2: "#c2185b", emoji: "⚗️",
    variants: [{label:"Brochée",price:79},{label:"Reliée",price:102}],
    stock: 8, rating: 4.6, reviewCount: 89, isPromo: true, isBestOffer: true, isNew: false,
    description: `<p>Cours complet de Physique-Chimie pour le Baccalauréat Sciences Physiques.</p>
<ul><li>Mécanique (cinématique, dynamique, oscillations)</li><li>Électricité (courant alternatif, RLC)</li><li>Chimie organique et minérale</li><li>Nucléaire et radioactivité</li></ul>`,
    reviews: [
      { name: "Amine B.", rating: 5, comment: "Très bien expliqué, les schémas sont clairs.", date: "20 Feb 2026" },
      { name: "Sara L.", rating: 4, comment: "Bon livre, j'aurais aimé plus d'exercices de bac.", date: "5 Dec 2025" }
    ]
  },
  {
    id: 3, title: "SVT – 1ère Bac Sciences", author: "Collectif",
    price: 65, compareAtPrice: 85, category: "Sciences",
    g1: "#1b5e20", g2: "#388e3c", emoji: "🔬",
    variants: [{label:"Brochée",price:65}],
    stock: 20, rating: 4.4, reviewCount: 67, isPromo: false, isBestOffer: true, isNew: false,
    description: `<p>Manuel de Sciences de la Vie et de la Terre pour la 1ère Bac Sciences.</p>
<ul><li>La cellule et la reproduction</li><li>Immunologie</li><li>Génétique moléculaire</li><li>Géologie et tectonique des plaques</li></ul>`,
    reviews: [{ name: "Nadia R.", rating: 4, comment: "Les illustrations sont magnifiques et très utiles.", date: "10 Jan 2026" }]
  },
  {
    id: 4, title: "Langue Française – Tronc Commun", author: "Leila Mansouri",
    price: 55, compareAtPrice: 72, category: "Langues",
    g1: "#4a148c", g2: "#7b1fa2", emoji: "📖",
    variants: [{label:"Brochée",price:55},{label:"Reliée",price:72}],
    stock: 30, rating: 4.3, reviewCount: 145, isPromo: false, isBestOffer: true, isNew: false,
    description: `<p>Guide complet de la langue française pour le tronc commun.</p>
<ul><li>Grammaire et syntaxe avancées</li><li>Conjugaison et modes verbaux</li><li>Techniques de rédaction</li><li>Textes littéraires commentés</li></ul>`,
    reviews: [{ name: "Khadija A.", rating: 5, comment: "Excellent pour améliorer son français. Très complet!", date: "8 Mar 2026" }]
  },
  {
    id: 5, title: "Histoire-Géographie – 3ème Collège", author: "Rachid Benali",
    price: 58, compareAtPrice: 75, category: "Histoire & Géo",
    g1: "#bf360c", g2: "#e64a19", emoji: "🗺️",
    variants: [{label:"Brochée",price:58}],
    stock: 25, rating: 4.2, reviewCount: 52, isPromo: false, isBestOffer: false, isNew: false,
    description: `<p>Manuel d'Histoire-Géographie pour la 3ème année du collège.</p>
<ul><li>La mondialisation</li><li>Guerres mondiales</li><li>Le Maroc dans le monde arabe</li><li>Géographie physique et humaine</li></ul>`,
    reviews: [{ name: "Iliass M.", rating: 4, comment: "Très bon manuel avec beaucoup de documents.", date: "15 Feb 2026" }]
  },
  {
    id: 6, title: "English for Baccalaureate – 2ème Bac", author: "Fatima Zohra",
    price: 69, compareAtPrice: 90, category: "Langues",
    g1: "#006064", g2: "#00838f", emoji: "🇬🇧",
    variants: [{label:"Brochée",price:69},{label:"Reliée",price:90},{label:"Numérique",price:42}],
    stock: 18, rating: 4.7, reviewCount: 201, isPromo: true, isBestOffer: true, isNew: true,
    description: `<p>Préparation complète à l'épreuve d'anglais du baccalauréat marocain.</p>
<ul><li>Reading comprehension strategies</li><li>Essay writing techniques</li><li>Grammar and vocabulary</li><li>Past exam papers with model answers</li></ul>`,
    reviews: [
      { name: "Mehdi S.", rating: 5, comment: "This book really helped me score high in the bac!", date: "25 Mar 2026" },
      { name: "Zineb O.", rating: 5, comment: "Perfect for self-study. Very well organized.", date: "1 Feb 2026" }
    ]
  },
  {
    id: 7, title: "Philosophie – Terminale Bac", author: "Hassan Alaoui",
    price: 59, compareAtPrice: 79, category: "Philosophie",
    g1: "#37474f", g2: "#607d8b", emoji: "🧠",
    variants: [{label:"Brochée",price:59}],
    stock: 12, rating: 4.1, reviewCount: 38, isPromo: false, isBestOffer: false, isNew: false,
    description: `<p>Introduction à la philosophie pour les élèves de terminale.</p>
<ul><li>La conscience et l'identité</li><li>La liberté et la morale</li><li>La vérité et la connaissance</li><li>La politique et la justice</li></ul>`,
    reviews: [{ name: "Amal T.", rating: 4, comment: "Bonne introduction mais un peu trop dense.", date: "20 Jan 2026" }]
  },
  {
    id: 8, title: "Économie et Gestion – 2ème Bac", author: "Karim Idrissi",
    price: 72, compareAtPrice: 95, category: "Économie",
    g1: "#e65100", g2: "#ef6c00", emoji: "📈",
    variants: [{label:"Brochée",price:72},{label:"Reliée",price:94}],
    stock: 14, rating: 4.5, reviewCount: 76, isPromo: true, isBestOffer: true, isNew: false,
    description: `<p>Manuel complet d'économie et gestion pour le baccalauréat Sciences Économiques.</p>
<ul><li>Microéconomie et macroéconomie</li><li>Comptabilité générale</li><li>Management des organisations</li><li>Commerce international et mondialisation</li></ul>`,
    reviews: [{ name: "Soufiane B.", rating: 5, comment: "Très complet, couvre tout le programme.", date: "12 Mar 2026" }]
  },
  {
    id: 9, title: "Informatique & Algorithmes – Lycée", author: "Youssef Tahiri",
    price: 85, compareAtPrice: 110, category: "Informatique",
    g1: "#1a1a2e", g2: "#16213e", emoji: "💻",
    variants: [{label:"Brochée",price:85},{label:"Numérique",price:52}],
    stock: 6, rating: 4.9, reviewCount: 93, isPromo: true, isBestOffer: true, isNew: true,
    description: `<p>Introduction à l'algorithmique et à la programmation pour les lycéens.</p>
<ul><li>Algorithmique et structures de données</li><li>Introduction à Python</li><li>Bases de données relationnelles</li><li>Réseaux informatiques</li></ul>`,
    reviews: [
      { name: "Reda A.", rating: 5, comment: "Le meilleur livre d'informatique que j'ai trouvé!", date: "28 Mar 2026" },
      { name: "Imane C.", rating: 5, comment: "Python bien expliqué même pour les débutants.", date: "10 Feb 2026" }
    ]
  },
  {
    id: 10, title: "اللغة العربية – الجذع المشترك", author: "عبد الله الناصري",
    price: 49, compareAtPrice: 65, category: "اللغة العربية",
    g1: "#3e2723", g2: "#5d4037", emoji: "📜",
    variants: [{label:"Brochée",price:49}],
    stock: 35, rating: 4.0, reviewCount: 188, isPromo: false, isBestOffer: false, isNew: false,
    description: `<p>كتاب شامل في اللغة العربية للجذع المشترك.</p>
<ul><li>النحو والصرف</li><li>البلاغة والأسلوب</li><li>الأدب العربي القديم والحديث</li><li>التعبير والإنشاء</li></ul>`,
    reviews: [{ name: "محمد ك.", rating: 4, comment: "كتاب ممتاز ومفيد جداً للدراسة.", date: "5 Mar 2026" }]
  },
  {
    id: 11, title: "Tronc Commun – Pack Complet", author: "Collectif ProExcel",
    price: 299, compareAtPrice: 420, category: "Pack",
    g1: "#1a3a6e", g2: "#2563eb", emoji: "🎒",
    variants: [{label:"Pack Standard",price:299},{label:"Pack Premium",price:380}],
    stock: 10, rating: 4.9, reviewCount: 312, isPromo: true, isBestOffer: true, isNew: false,
    description: `<p>Pack complet de tous les manuels pour le Tronc Commun. Économisez 121 DH!</p>
<ul><li>Mathématiques Tronc Commun</li><li>Physique-Chimie Tronc Commun</li><li>SVT Tronc Commun</li><li>Langue Française + Anglais</li></ul>`,
    reviews: [{ name: "Dounia M.", rating: 5, comment: "Super rapport qualité/prix! Tous les livres sont excellents.", date: "1 Apr 2026" }]
  },
  {
    id: 12, title: "Technologie Industrielle – 1ère Bac", author: "Said Benhaddou",
    price: 78, compareAtPrice: 99, category: "Technologie",
    g1: "#283593", g2: "#3f51b5", emoji: "⚙️",
    variants: [{label:"Brochée",price:78},{label:"Reliée",price:99}],
    stock: 9, rating: 4.3, reviewCount: 44, isPromo: false, isBestOffer: false, isNew: true,
    description: `<p>Manuel de technologie industrielle pour la 1ère Bac Sciences et Technologies.</p>
<ul><li>Dessin industriel et normes</li><li>Mécanique des solides</li><li>Électrotechnique appliquée</li><li>Automatismes industriels</li></ul>`,
    reviews: [{ name: "Tariq F.", rating: 4, comment: "Bon livre avec des exemples pratiques.", date: "22 Feb 2026" }]
  }
];

// Normalize product from admin-saved format to front-end format
function normalizeProduct(p) {
  const compareAtPrice = p.compareAtPrice || p.compare || p.price;
  let variants = p.variants;
  if (!variants || !variants.length) {
    variants = [{ label: 'Standard', price: p.price }];
  } else if (variants[0] && variants[0].options !== undefined) {
    // Admin format (variant groups) – flatten to simple {label, price}
    const flat = [];
    variants.forEach(g => {
      (g.options || []).forEach(opt => flat.push({ label: opt.label, price: opt.price || p.price }));
    });
    variants = flat.length ? flat : [{ label: 'Standard', price: p.price }];
  }
  return {
    id: p.id, title: p.title, author: p.author || 'ProExcel',
    price: p.price, compareAtPrice,
    category: p.category || '',
    g1: p.g1 || '#1a237e', g2: p.g2 || '#3949ab', emoji: p.emoji || '📦',
    variants, stock: p.stock || 0,
    rating: p.rating || 4.5, reviewCount: p.reviewCount || 0,
    isPromo: !!p.isPromo, isBestOffer: !!p.isBestOffer, isNew: !!p.isNew,
    description: p.description || `<p>${p.title}</p>`,
    reviews: p.reviews || [],
    media: p.media || [],
  };
}

function loadProducts() {
  const stored = localStorage.getItem('proexcel_products');
  if (stored) {
    try {
      const arr = JSON.parse(stored);
      if (Array.isArray(arr) && arr.length) return arr.map(normalizeProduct);
    } catch(e) {}
  }
  return PRODUCTS_DEFAULT;
}

let PRODUCTS = loadProducts();

let CATEGORIES = [
  { name: "Mathématiques", emoji: "📐", count: 3, color: "rgba(59,130,246,0.15)", glow: "rgba(59,130,246,0.5)" },
  { name: "Sciences", emoji: "⚗️", count: 4, color: "rgba(236,72,153,0.15)", glow: "rgba(236,72,153,0.5)" },
  { name: "Langues", emoji: "🌍", count: 3, color: "rgba(34,197,94,0.15)", glow: "rgba(34,197,94,0.5)" },
  { name: "Histoire & Géo", emoji: "🗺️", count: 2, color: "rgba(239,68,68,0.15)", glow: "rgba(239,68,68,0.5)" },
  { name: "Économie", emoji: "📈", count: 2, color: "rgba(245,158,11,0.15)", glow: "rgba(245,158,11,0.5)" },
  { name: "Informatique", emoji: "💻", count: 2, color: "rgba(99,102,241,0.15)", glow: "rgba(99,102,241,0.5)" },
  { name: "Philosophie", emoji: "🧠", count: 1, color: "rgba(107,114,128,0.15)", glow: "rgba(107,114,128,0.5)" },
  { name: "Technologie", emoji: "⚙️", count: 2, color: "rgba(20,184,166,0.15)", glow: "rgba(20,184,166,0.5)" },
  { name: "اللغة العربية", emoji: "📜", count: 2, color: "rgba(161,102,56,0.15)", glow: "rgba(161,102,56,0.5)" },
  { name: "Pack", emoji: "🎒", count: 1, color: "rgba(37,99,235,0.15)", glow: "rgba(37,99,235,0.5)" }
];

// ─── CART (localStorage) ───
function getCart() {
  try { return JSON.parse(localStorage.getItem('proexcel_cart') || '[]'); }
  catch { return []; }
}
function saveCart(cart) { localStorage.setItem('proexcel_cart', JSON.stringify(cart)); }

function addToCart(productId, variantLabel, qty = 1, variantPrice) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const v = product.variants.find(v => v.label === variantLabel) || product.variants[0];
  const price = variantPrice || (v ? v.price : product.price);
  const cart = getCart();
  const key = `${productId}_${variantLabel}`;
  const existing = cart.find(i => i.key === key);
  if (existing) { existing.qty += qty; }
  else { cart.push({ key, productId, variant: variantLabel, qty, price, title: product.title }); }
  saveCart(cart);
  updateCartBadge();
  showToast('✅', getLang() === 'ar' ? 'أضيف للسلة' : 'Ajouté au panier', `${product.title} × ${qty}`);
}

function removeFromCart(key) { saveCart(getCart().filter(i => i.key !== key)); updateCartBadge(); }
function updateQty(key, qty) {
  const cart = getCart();
  const item = cart.find(i => i.key === key);
  if (item) { item.qty = Math.max(1, qty); saveCart(cart); }
}
function getCartCount() { return getCart().reduce((s, i) => s + i.qty, 0); }
function getCartSubtotal() { return getCart().reduce((s, i) => s + i.price * i.qty, 0); }
function getShipping(subtotal) { return subtotal >= 499 ? 0 : 25; }
function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ─── TOAST ───
function showToast(icon, title, msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-icon"></div><div><div class="toast-title"></div><div class="toast-msg"></div></div>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-icon').textContent = icon;
  toast.querySelector('.toast-title').textContent = title;
  toast.querySelector('.toast-msg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── BOOK COVER HTML ───
function bookCoverHTML(product, w, h) {
  if (product.media && product.media.length > 0) {
    return `<img src="${product.media[0].src}" alt="${product.title}" style="width:${w}px;height:${h}px;object-fit:cover;border-radius:5px;display:block">`;
  }
  return `<div class="book-cover" style="width:${w}px;height:${h}px;background:linear-gradient(145deg,${product.g1},${product.g2})">
    <div class="book-spine"></div>
    <div class="book-title-cover">${product.title}</div>
    <div class="book-author-cover">${product.author || ''}</div>
    <div class="book-deco">${product.emoji}</div>
  </div>`;
}

// ─── RENDER PRODUCT CARD ───
function productCardHTML(p) {
  const basePrice = p.variants[0]?.price ?? p.price;
  const disc = Math.round((1 - basePrice / p.compareAtPrice) * 100);
  let badge = '';
  if (p.isPromo) badge = `<span class="product-badge badge-promo">${getLang()==='ar'?'تخفيض':'Promo'}</span>`;
  else if (p.isNew) badge = `<span class="product-badge badge-new">${getLang()==='ar'?'جديد':'Nouveau'}</span>`;
  else if (p.isBestOffer) badge = `<span class="product-badge badge-best">${getLang()==='ar'?'الأفضل':'Best'}</span>`;
  else if (p.stock <= 5) badge = `<span class="product-badge badge-stock">${getLang()==='ar'?'آخر المخزون':'Stock'}</span>`;
  const addTxt = t('quick_add');
  return `<div class="product-card" onclick="location.href='product.html?id=${p.id}'">
    ${badge}
    <div class="product-img-wrap">
      ${bookCoverHTML(p, 110, 155)}
      <div class="quick-add">
        <button class="btn-quick" onclick="event.stopPropagation();addToCart(${p.id},'${p.variants[0].label}',1,${p.variants[0].price})">${addTxt}</button>
      </div>
    </div>
    <div class="product-info">
      <div class="product-cat">${p.category}</div>
      <div class="product-name">${p.title}</div>
      <div class="product-prices">
        <span class="p-current">${basePrice} DH</span>
        <span class="p-compare">${p.compareAtPrice} DH</span>
        <span class="p-discount">-${disc}%</span>
        ${p.isBestOffer ? `<span class="p-best">⭐ ${getLang()==='ar'?'الأفضل':'Best'}</span>` : ''}
      </div>
    </div>
  </div>`;
}

// ─── APPLY SLIDER MEDIA FROM SETTINGS ───
function applySliderMedia() {
  try {
    const slides = JSON.parse(localStorage.getItem('settings_slides') || 'null');
    if (!slides) return;
    const slideEls = document.querySelectorAll('.slide');
    slides.forEach((s, i) => {
      if (!slideEls[i] || !s.mediaSrc) return;
      const bg = slideEls[i].querySelector('.slide-bg');
      if (!bg) return;
      if (s.mediaType === 'video') {
        bg.style.background = 'none';
        const vid = document.createElement('video');
        vid.src = s.mediaSrc;
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1.06)';
        bg.appendChild(vid);
      } else {
        bg.style.backgroundImage = `url('${s.mediaSrc}')`;
        bg.style.backgroundSize = 'cover';
        bg.style.backgroundPosition = 'center';
      }
    });
  } catch(e) {}
}

// ─── SLIDER ───
function initSlider() {
  const slider = document.querySelector('.slider');
  if (!slider) return;
  const slides = slider.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let current = 0, timer;
  function goTo(n) {
    slides[current].classList.remove('active'); dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active'); dots[current]?.classList.add('active');
    slider.style.transform = `translateX(-${current * 100}%)`;
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }
  function autoPlay() { timer = setInterval(next, 5000); }
  slides[0]?.classList.add('active'); dots[0]?.classList.add('active'); autoPlay();
  document.querySelector('.arrow-next')?.addEventListener('click', () => { clearInterval(timer); next(); autoPlay(); });
  document.querySelector('.arrow-prev')?.addEventListener('click', () => { clearInterval(timer); prev(); autoPlay(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(timer); goTo(i); autoPlay(); }));
}

// ─── SEARCH OVERLAY ───
function initSearch() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!overlay) return;
  document.querySelectorAll('.open-search').forEach(el => {
    el.addEventListener('click', () => { overlay.classList.add('open'); setTimeout(() => input?.focus(), 100); });
  });
  document.querySelector('.close-overlay')?.addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  input?.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q || q.length < 2) { results.innerHTML = ''; return; }
    const found = PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
    ).slice(0, 6);
    results.innerHTML = found.length
      ? found.map(p => `<div class="sr-item" onclick="location.href='product.html?id=${p.id}'">
          <div class="sr-item-img">${bookCoverHTML(p, 44, 54)}</div>
          <div><div class="sr-item-name">${p.title}</div><div class="sr-item-price">${p.price} DH</div></div>
        </div>`).join('')
      : `<div style="padding:1.5rem;text-align:center;color:var(--text2);font-size:.85rem">${getLang()==='ar'?'لا نتائج':'Aucun résultat'}</div>`;
  });
}

// ─── MOBILE MENU ───
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const menu = document.getElementById('mobileNav');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
}

// ─── HOMEPAGE ───
function initHome() {
  initSlider();
  applySliderMedia();
  const catGrid = document.getElementById('categoriesGrid');
  if (catGrid) {
    catGrid.innerHTML = CATEGORIES.map(c => `
      <div class="category-card" onclick="location.href='best-offers.html?cat=${encodeURIComponent(c.name)}'" style="--cat-color:${c.color};--cat-glow:${c.glow}">
        <div class="cat-icon" style="background:${c.color}">${c.emoji}</div>
        <div class="cat-name">${c.name}</div>
        <div class="cat-count">${c.count} ${t('livres')}</div>
      </div>`).join('');
  }
  const promoGrid = document.getElementById('promoGrid');
  if (promoGrid) promoGrid.innerHTML = PRODUCTS.filter(p => p.isPromo).slice(0, 8).map(productCardHTML).join('');
  const featGrid = document.getElementById('featGrid');
  if (featGrid) featGrid.innerHTML = PRODUCTS.slice(0, 4).map(productCardHTML).join('');
}

// Re-render only the dynamic grid sections (without re-init slider)
function refreshHomeContent() {
  const catGrid = document.getElementById('categoriesGrid');
  if (catGrid) {
    catGrid.innerHTML = CATEGORIES.map(c => `
      <div class="category-card" onclick="location.href='best-offers.html?cat=${encodeURIComponent(c.name)}'" style="--cat-color:${c.color};--cat-glow:${c.glow}">
        <div class="cat-icon" style="background:${c.color}">${c.emoji}</div>
        <div class="cat-name">${c.name}</div>
        <div class="cat-count">${c.count} ${t('livres')}</div>
      </div>`).join('');
  }
  const promoGrid = document.getElementById('promoGrid');
  if (promoGrid) promoGrid.innerHTML = PRODUCTS.filter(p => p.isPromo).slice(0, 8).map(productCardHTML).join('');
  const featGrid = document.getElementById('featGrid');
  if (featGrid) featGrid.innerHTML = PRODUCTS.slice(0, 4).map(productCardHTML).join('');
}

// ─── PRODUCT PAGE ───
function initProduct() {
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id'));
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
  document.title = `${p.title} – ProExcel`;
  const bc = document.getElementById('breadcrumb');
  if (bc) bc.innerHTML = `<a href="index.html">${t('nav_home')}</a> › <a href="best-offers.html">${p.category}</a> › ${p.title.substring(0,30)}…`;
  document.getElementById('pTitle').textContent = p.title;
  // Gallery with arrows – use uploaded media if available
  let productImages;
  if (p.media && p.media.length > 0) {
    productImages = p.media.map(m => ({ src: m.src }));
  } else {
    productImages = Array.from({length: 3}, () => ({ html: bookCoverHTML(p, 180, 250) }));
  }
  if (document.getElementById('mainImg')) {
    initGallery(productImages);
    // Add arrows to main image
    const mainImgWrap = document.getElementById('mainImg').parentElement;
    if (mainImgWrap && !mainImgWrap.querySelector('.gal-arrow-prev')) {
      const arrowPrev = document.createElement('button');
      arrowPrev.className = 'gal-arrow-prev';
      arrowPrev.innerHTML = '‹';
      arrowPrev.onclick = galleryPrev;
      const arrowNext = document.createElement('button');
      arrowNext.className = 'gal-arrow-next';
      arrowNext.innerHTML = '›';
      arrowNext.onclick = galleryNext;
      mainImgWrap.style.position = 'relative';
      mainImgWrap.appendChild(arrowPrev);
      mainImgWrap.appendChild(arrowNext);
    }
  }
  const starsEl = document.getElementById('pStars');
  if (starsEl) starsEl.textContent = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));
  document.getElementById('pReviewCount').textContent = getLang()==='ar' ? `${p.reviewCount} تقييم` : `${p.reviewCount} avis`;
  const baseVariantPrice = p.variants[0]?.price ?? p.price;
  const disc = Math.round((1 - baseVariantPrice / p.compareAtPrice) * 100);
  document.getElementById('pPrice').textContent = `${baseVariantPrice} DH`;
  document.getElementById('pCompare').textContent = `${p.compareAtPrice} DH`;
  document.getElementById('pDiscount').textContent = `-${disc}%`;
  const stockEl = document.getElementById('pStock');
  if (stockEl) {
    if (p.stock > 10) stockEl.innerHTML = `<span class="in-stock">✓ ${getLang()==='ar'?'متوفر':'En stock'} (${p.stock})</span>`;
    else if (p.stock > 0) stockEl.innerHTML = `<span class="low-stock">⚠ ${getLang()==='ar'?'آخر المخزون':'Dernier stock'} (${p.stock})</span>`;
    else stockEl.innerHTML = `<span style="color:var(--red)">✗ ${getLang()==='ar'?'غير متوفر':'Rupture de stock'}</span>`;
  }
  const varOpts = document.getElementById('variantOpts');
  if (varOpts) {
    varOpts.innerHTML = p.variants.map((v, i) =>
      `<button class="v-btn${i===0?' sel':''}" data-label="${v.label}" data-price="${v.price}" onclick="selectVariant(this,${JSON.stringify(v).replace(/"/g,'&quot;')})">${v.label} <span style="font-size:0.72rem;opacity:0.75;margin-left:4px">${v.price} DH</span></button>`).join('');
  }
  function getSelectedVariant() {
    const sel = document.querySelector('.v-btn.sel');
    return sel ? { label: sel.dataset.label, price: parseFloat(sel.dataset.price) } : p.variants[0];
  }
  const btnATC = document.getElementById('btnATC');
  const btnBuy = document.getElementById('btnBuy');
  const btnMinus = document.getElementById('qtyMinus');
  const btnPlus = document.getElementById('qtyPlus');
  if (btnATC) btnATC.onclick = () => {
    const v = getSelectedVariant();
    const q = parseInt(document.getElementById('qtyInput')?.value || 1);
    addToCart(p.id, v.label, q, v.price);
  };
  if (btnBuy) btnBuy.onclick = () => {
    const v = getSelectedVariant();
    const q = parseInt(document.getElementById('qtyInput')?.value || 1);
    addToCart(p.id, v.label, q, v.price);
    location.href = 'cart.html';
  };
  if (btnMinus) btnMinus.onclick = () => {
    const inp = document.getElementById('qtyInput');
    if (parseInt(inp.value) > 1) inp.value = parseInt(inp.value) - 1;
  };
  if (btnPlus) btnPlus.onclick = () => {
    const inp = document.getElementById('qtyInput');
    inp.value = parseInt(inp.value) + 1;
  };
  document.getElementById('tabDesc').innerHTML = `<div class="desc-content">${p.description}</div>`;
  const revContainer = document.getElementById('tabReviews');
  if (revContainer) {
    revContainer.innerHTML = p.reviews.map(r => `
      <div class="review-card">
        <div class="rv-head">
          <div><div class="rv-name">${r.name}</div><div class="rv-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div></div>
          <div class="rv-date">${r.date}</div>
        </div>
        <div class="rv-text">${r.comment}</div>
      </div>`).join('');
  }
  const relGrid = document.getElementById('relatedGrid');
  if (relGrid) {
    const related = PRODUCTS.filter(x => x.id !== p.id && (x.category === p.category || x.isPromo)).slice(0, 4);
    relGrid.innerHTML = related.map(productCardHTML).join('');
  }
}

function selectVariant(btn, variant) {
  document.querySelectorAll('.v-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  if (variant && document.getElementById('pPrice')) {
    document.getElementById('pPrice').textContent = `${variant.price} DH`;
    const disc = document.getElementById('pCompare');
    if (disc) {
      const comparePrice = parseFloat(disc.textContent);
      if (comparePrice) {
        const discPct = Math.round((1 - variant.price / comparePrice) * 100);
        const discEl = document.getElementById('pDiscount');
        if (discEl && discPct > 0) discEl.textContent = `-${discPct}%`;
      }
    }
  }
}
function selectThumb(thumb) {
  document.querySelectorAll('.thumb').forEach((t, i) => {
    t.classList.toggle('active', t === thumb);
    if (t === thumb) selectGalleryThumb(i);
  });
}

// ─── CART PAGE ───
function initCart() { renderCart(); }

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  const empty = document.getElementById('emptyCart');
  const filled = document.getElementById('filledCart');
  if (!container) return;
  if (cart.length === 0) {
    empty?.style && (empty.style.display = 'block');
    filled?.style && (filled.style.display = 'none');
    return;
  }
  empty?.style && (empty.style.display = 'none');
  filled?.style && (filled.style.display = 'block');
  const countEl = document.getElementById('cartCountText');
  if (countEl) countEl.textContent = getLang()==='ar' ? `${cart.length} منتج` : `${cart.length} article${cart.length > 1 ? 's' : ''}`;
  container.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.productId);
    if (!p) return '';
    return `<div class="cart-item" id="ci_${item.key.replace(/[^a-z0-9]/gi,'_')}">
      <div class="ci-img">${bookCoverHTML(p, 78, 96)}</div>
      <div class="ci-info">
        <div class="ci-title">${item.title}</div>
        <div class="ci-variant">${item.variant}</div>
        <div class="ci-unit">${getLang()==='ar'?'سعر الوحدة:':'Prix unitaire:'} <strong>${item.price} DH</strong></div>
        <div class="qty-wrap" style="margin-top:.5rem">
          <button class="q-btn" onclick="changeQty('${item.key}',-1)">−</button>
          <input class="q-input" type="number" min="1" value="${item.qty}" onchange="setQty('${item.key}',this.value)" style="width:52px">
          <button class="q-btn" onclick="changeQty('${item.key}',1)">+</button>
        </div>
      </div>
      <div class="ci-right">
        <div class="ci-total">${(item.price * item.qty).toFixed(0)} DH</div>
        <button class="btn-rm" onclick="removeItem('${item.key}')">🗑 ${getLang()==='ar'?'حذف':'Supprimer'}</button>
      </div>
    </div>`;
  }).join('');
  updateSummary();
}

function changeQty(key, delta) {
  const cart = getCart();
  const item = cart.find(i => i.key === key);
  if (item) { item.qty = Math.max(1, item.qty + delta); saveCart(cart); renderCart(); }
}
function setQty(key, val) {
  const cart = getCart();
  const item = cart.find(i => i.key === key);
  if (item) { item.qty = Math.max(1, parseInt(val) || 1); saveCart(cart); renderCart(); }
}
function removeItem(key) {
  removeFromCart(key); renderCart();
  showToast('🗑', getLang()==='ar'?'تم الحذف':'Article supprimé', getLang()==='ar'?'تمت إزالة المنتج':'L\'article a été retiré du panier');
}

function updateSummary() {
  const subtotal = getCartSubtotal();
  const shipping = getShipping(subtotal);
  const total = subtotal + shipping;
  const el = (id) => document.getElementById(id);
  if (el('sumSubtotal')) el('sumSubtotal').textContent = `${subtotal} DH`;
  if (el('sumShipping')) el('sumShipping').textContent = shipping === 0 ? (getLang()==='ar'?'مجاني 🎉':'Gratuit 🎉') : `${shipping} DH`;
  if (el('sumTotal')) el('sumTotal').textContent = `${total} DH`;
  const note = el('shippingNote');
  if (note) {
    if (shipping === 0) {
      note.textContent = getLang()==='ar' ? '🎉 شحن مجاني للطلبات أكثر من 499 درهم' : '🎉 Livraison gratuite pour les commandes ≥ 499 DH';
      note.style.display = 'flex';
    } else {
      const diff = 499 - subtotal;
      note.textContent = getLang()==='ar' ? `🚚 ${diff} درهم أخرى للشحن المجاني!` : `🚚 Plus que ${diff} DH pour la livraison gratuite!`;
      note.style.borderColor = 'rgba(59,130,246,0.3)'; note.style.color = 'var(--primary)';
      note.style.background = 'rgba(59,130,246,0.05)'; note.style.display = 'flex';
    }
  }
}

// ─── CHECKOUT PAGE ───
function initCheckout() {
  const cart = getCart();
  const container = document.getElementById('checkoutProducts');
  const subtotalEl = document.getElementById('coSubtotal');
  const shippingEl = document.getElementById('coShipping');
  const totalEl = document.getElementById('coTotal');

  if (container) {
    if (cart.length === 0) {
      container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text2)">${getLang()==='ar'?'السلة فارغة':'Panier vide'}</div>`;
    } else {
      container.innerHTML = cart.map(item => {
        const p = PRODUCTS.find(x => x.id === item.productId);
        if (!p) return '';
        return `<div class="checkout-product">
          <div class="checkout-prod-img">${bookCoverHTML(p, 58, 72)}</div>
          <div class="checkout-prod-info">
            <div class="checkout-prod-name">${item.title}</div>
            <div class="checkout-prod-var">${item.variant}</div>
            <div class="checkout-prod-qty">× ${item.qty}</div>
          </div>
          <div class="checkout-prod-price">${(item.price * item.qty).toFixed(0)} DH</div>
        </div>`;
      }).join('');
    }
  }

  const subtotal = getCartSubtotal();
  const shipping = getShipping(subtotal);
  const total = subtotal + shipping;
  if (subtotalEl) subtotalEl.textContent = `${subtotal} DH`;
  if (shippingEl) shippingEl.textContent = shipping === 0 ? (getLang()==='ar'?'مجاني':'Gratuit') : `${shipping} DH`;
  if (totalEl) totalEl.textContent = `${total} DH`;

  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) checkoutForm.onsubmit = async e => {
    e.preventDefault();
    const name = document.getElementById('co_name')?.value.trim();
    const phone = document.getElementById('co_phone')?.value.trim();
    const address = document.getElementById('co_address')?.value.trim();
    const city = document.getElementById('co_city')?.value;
    if (!name || !phone || !address || !city) {
      showToast('⚠️', getLang()==='ar'?'خطأ':'Erreur', getLang()==='ar'?'يرجى ملء جميع الحقول':'Veuillez remplir tous les champs');
      return;
    }
    const orderNum = 'PE' + Date.now().toString().slice(-6);
    const order = { orderNum, name, phone, address, city, cart, total, date: new Date().toISOString() };

    // Envoyer au backend via le store
    if (typeof Store !== 'undefined') {
      try {
        await Store.submitOrder({ name, phone, address, city, total, cart });
      } catch (err) {
        console.warn('[Store] Envoi commande échoué, sauvegarde locale:', err.message);
      }
    }

    // Sauvegarde locale comme cache/fallback
    const orders = JSON.parse(localStorage.getItem('proexcel_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('proexcel_orders', JSON.stringify(orders));
    localStorage.setItem('proexcel_last_order', JSON.stringify(order));
    saveCart([]);
    location.href = `thank-you.html?order=${orderNum}`;
  };
}

// ─── BEST OFFERS PAGE ───
function initOffers() {
  const params = new URLSearchParams(location.search);
  const presetCat = params.get('cat');
  const catFilters = document.getElementById('catFilters');
  if (catFilters) {
    catFilters.innerHTML = CATEGORIES.map(c => `
      <label class="f-opt">
        <input type="checkbox" value="${c.name}" ${presetCat === c.name ? 'checked' : ''} onchange="applyFilters()">
        ${c.emoji} ${c.name} <span style="color:var(--text2);font-size:.72rem;margin-left:auto">(${c.count})</span>
      </label>`).join('');
  }
  const rangeInput = document.getElementById('priceRange');
  const rangeVal = document.getElementById('rangeVal');
  if (rangeInput) {
    rangeInput.addEventListener('input', () => { rangeVal.textContent = `0 – ${rangeInput.value} DH`; applyFilters(); });
  }
  document.getElementById('sortSelect')?.addEventListener('change', applyFilters);
  document.getElementById('clearFilters')?.addEventListener('click', () => {
    document.querySelectorAll('#catFilters input').forEach(cb => cb.checked = false);
    document.querySelectorAll('#stockFilters input').forEach(cb => cb.checked = false);
    if (rangeInput) { rangeInput.value = rangeInput.max; rangeVal.textContent = `0 – ${rangeInput.max} DH`; }
    applyFilters();
  });
  applyFilters();
}

function applyFilters() {
  const checkedCats = [...document.querySelectorAll('#catFilters input:checked')].map(i => i.value);
  const maxPrice = parseInt(document.getElementById('priceRange')?.value || 500);
  const inStock = document.getElementById('filterInStock')?.checked;
  const onSale = document.getElementById('filterSale')?.checked;
  const sort = document.getElementById('sortSelect')?.value || 'default';
  let filtered = PRODUCTS.filter(p => {
    if (checkedCats.length && !checkedCats.includes(p.category)) return false;
    if (p.price > maxPrice) return false;
    if (inStock && p.stock === 0) return false;
    if (onSale && !p.isPromo) return false;
    return true;
  });
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else if (sort === 'new') filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  const grid = document.getElementById('offersGrid');
  const count = document.getElementById('offersCount');
  if (count) count.textContent = `${filtered.length} ${getLang()==='ar'?'منتج':'produit'}${filtered.length !== 1 && getLang()!=='ar' ? 's' : ''} ${getLang()==='ar'?'وُجد':'trouvé'}${filtered.length !== 1 && getLang()!=='ar' ? 's' : ''}`;
  if (grid) {
    if (filtered.length === 0) {
      grid.innerHTML = `<div class="no-results"><div class="no-results-icon">🔍</div><p>${getLang()==='ar'?'لا توجد نتائج':'Aucun produit trouvé avec ces critères.'}</p></div>`;
    } else {
      grid.innerHTML = filtered.map(productCardHTML).join('');
    }
  }
}

// ─── CONTACT FORM ───
function initContact() {
  document.getElementById('contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('✅', getLang()==='ar'?'تم الإرسال!':'Message envoyé!', getLang()==='ar'?'سنرد عليك في أقرب وقت':'Nous vous répondrons dans les plus brefs délais.');
    e.target.reset();
  });
}

// ─── TABS (product page) ───
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.id === tabId));
}

// ─── SCROLL GRID (horizontal carousel arrows) ───
function scrollGrid(gridId, dir) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const cardWidth = grid.querySelector('.product-card')?.offsetWidth || 240;
  grid.scrollBy({ left: dir * (cardWidth + 16) * 2, behavior: 'smooth' });
}

// ─── LOAD STORE SETTINGS (logo, favicon, social icons, home sections) ───
function applyStoreSettings() {
  try {
    const s = JSON.parse(localStorage.getItem('proexcel_settings') || '{}');

    // Logo – image uniquement (sans texte)
    if (s.logoBase64) {
      document.querySelectorAll('header .logo, .f-brand .logo').forEach(el => {
        el.innerHTML = `<img src="${s.logoBase64}" alt="ProExcel" style="height:38px;width:auto;object-fit:contain;display:block;flex-shrink:0">`;
        el.style.display = 'flex';
        el.style.alignItems = 'center';
      });
    }

    // Favicon
    if (s.faviconBase64) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
      link.href = s.faviconBase64;
    }

    // Social icons in footer
    if (s.socialIcons) {
      const idMap = { facebook: 'footerFacebook', instagram: 'footerInstagram', tiktok: 'footerTiktok', youtube: 'footerYoutube' };
      Object.entries(idMap).forEach(([key, elId]) => {
        const el = document.getElementById(elId);
        if (s.socialIcons[key] && el) {
          el.innerHTML = `<img src="${s.socialIcons[key]}" style="width:22px;height:22px;object-fit:contain;border-radius:4px" alt="${key}">`;
        }
      });
    }

    // Home section titles (applied via data-i18n override)
    if (s.homeSections) {
      const hs = s.homeSections;
      const setText = (sel, val) => { if (val) document.querySelectorAll(sel).forEach(el => el.textContent = val); };
      setText('[data-i18n="feat_tag"]', hs.featTag);
      setText('[data-i18n="feat_title"]', hs.featTitle);
      setText('[data-i18n="feat_sub"]', hs.featSub);
      setText('[data-i18n="offers_tag"]', hs.promoTag);
      setText('[data-i18n="offers_title"]', hs.promoTitle);
      setText('[data-i18n="offers_sub"]', hs.promoSub);
      setText('[data-i18n="promo_p"]', hs.bannerText);
    }

    // Store name in title
    if (s.store?.name) {
      document.querySelectorAll('[data-store-name]').forEach(el => el.textContent = s.store.name);
    }
  } catch(e) {}
}

// ─── PRODUCT GALLERY (with arrows) ───
let galleryImages = [];
let galleryCurrent = 0;

function initGallery(images) {
  galleryImages = images;
  galleryCurrent = 0;
  renderGalleryMain();
  renderGalleryThumbs();
}

function renderGalleryMain() {
  const mainEl = document.getElementById('mainImg');
  if (!mainEl) return;
  mainEl.classList.remove('gal-fade');
  void mainEl.offsetWidth;
  const img = galleryImages[galleryCurrent];
  if (img && img.src) {
    mainEl.innerHTML = `<img src="${img.src}" alt="Product" style="max-height:420px;max-width:100%;object-fit:contain;border-radius:10px">`;
  } else if (img && img.html) {
    mainEl.innerHTML = img.html;
  }
  mainEl.classList.add('gal-fade');
}

function renderGalleryThumbs() {
  const thumbsEl = document.getElementById('thumbs');
  if (!thumbsEl) return;
  thumbsEl.innerHTML = galleryImages.map((img, i) => {
    const content = img.src ? `<img src="${img.src}" style="width:100%;height:100%;object-fit:cover;border-radius:6px">` : img.html || '';
    return `<div class="thumb ${i === galleryCurrent ? 'active' : ''}" onclick="selectGalleryThumb(${i})" style="overflow:hidden">${content}</div>`;
  }).join('');
}

function selectGalleryThumb(i) {
  galleryCurrent = i;
  renderGalleryMain();
  document.querySelectorAll('.thumb').forEach((t, idx) => {
    t.classList.toggle('active', idx === i);
    if (idx === i) t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
}

function galleryNext() {
  galleryCurrent = (galleryCurrent + 1) % galleryImages.length;
  renderGalleryMain();
  renderGalleryThumbs();
}

function galleryPrev() {
  galleryCurrent = (galleryCurrent - 1 + galleryImages.length) % galleryImages.length;
  renderGalleryMain();
  renderGalleryThumbs();
}

// ─── HEADER INLINE SEARCH ───
function initHeaderSearch() {
  const input = document.getElementById('headerSearchInput');
  const dropdown = document.getElementById('headerSearchDropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q || q.length < 2) { dropdown.classList.remove('open'); return; }
    const found = PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
    ).slice(0, 6);
    if (found.length === 0) {
      dropdown.innerHTML = `<div class="hsd-empty">${getLang()==='ar'?'لا نتائج':'Aucun résultat'}</div>`;
    } else {
      dropdown.innerHTML = found.map(p => `
        <div class="hsd-item" onclick="location.href='product.html?id=${p.id}'">
          <div class="hsd-img">${bookCoverHTML(p, 38, 48)}</div>
          <div>
            <div class="hsd-name">${p.title}</div>
            <div class="hsd-price">${p.price} DH</div>
          </div>
        </div>`).join('');
    }
    dropdown.classList.add('open');
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { dropdown.classList.remove('open'); input.blur(); }
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) { dropdown.classList.remove('open'); location.href = `best-offers.html?search=${encodeURIComponent(q)}`; }
    }
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) dropdown.classList.remove('open');
  });
}

// ─── PAGE TRANSITIONS ───
function initPageTransitions() {
  const pt = document.createElement('div');
  pt.className = 'page-transition';
  pt.id = 'pageTransition';
  document.body.appendChild(pt);

  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('javascript') || this.target === '_blank') return;
      e.preventDefault();
      pt.classList.add('pt-out');
      setTimeout(() => { location.href = href; }, 260);
    });
  });
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme and language (inline script in <head> handles flash prevention,
  // this ensures UI buttons and translations are updated)
  const savedTheme = getTheme();
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.querySelectorAll('.btn-theme').forEach(btn => {
    btn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  });

  const savedLang = getLang();
  document.documentElement.lang = savedLang;
  document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('.btn-lang').forEach(btn => {
    btn.textContent = savedLang === 'fr' ? 'عربي' : 'FR';
  });
  // Bind toggles
  document.querySelectorAll('.btn-theme').forEach(btn => btn.addEventListener('click', toggleTheme));
  document.querySelectorAll('.btn-lang').forEach(btn => btn.addEventListener('click', toggleLang));

  applyStoreSettings();
  applyTranslations(savedLang); // après settings pour que la langue gagne toujours
  updateCartBadge();
  initSearch();
  initHeaderSearch();
  initMobileMenu();
  initPageTransitions();

  const page = document.body.dataset.page;
  if (page === 'home') initHome();
  else if (page === 'product') initProduct();
  else if (page === 'cart') initCart();
  else if (page === 'offers') initOffers();
  else if (page === 'contact') initContact();
  else if (page === 'checkout') initCheckout();

  // ─── Synchronisation avec le backend ───
  if (typeof Store !== 'undefined') {
    Store.init().then(() => {
      const ap = Store.getProducts();
      const ac = Store.getCategories();
      if (ap.length) { PRODUCTS.length = 0; ap.forEach(p => PRODUCTS.push(p)); }
      if (ac.length) { CATEGORIES.length = 0; ac.forEach(c => CATEGORIES.push(c)); }
      if (page === 'home') refreshHomeContent();
      else if (page === 'offers') applyFilters();
      else if (page === 'product') initProduct();
    });
  }
});
