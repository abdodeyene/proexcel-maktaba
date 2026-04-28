// ─── ProExcel Store ──────────────────────────────────────────────────────────
// Connecte le frontend au backend NestJS (localhost:3001)
// Usage: Store.init() au chargement → Store.getProducts() / Store.getCategories()
// ─────────────────────────────────────────────────────────────────────────────

const Store = (() => {
  const API = 'http://localhost:3001/api';

  // ── État interne ─────────────────────────────────────────────────────────
  let _products = [];
  let _categories = [];
  let _token = localStorage.getItem('proexcel_admin_token') || null;
  const _bus = {};

  // ── Bus d'événements ─────────────────────────────────────────────────────
  function on(event, cb) {
    (_bus[event] = _bus[event] || []).push(cb);
    return () => { _bus[event] = (_bus[event] || []).filter(fn => fn !== cb); };
  }
  function emit(event, data) {
    (_bus[event] || []).forEach(fn => fn(data));
  }

  // ── Requête HTTP ─────────────────────────────────────────────────────────
  async function http(path, opts = {}) {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    if (_token) headers.Authorization = `Bearer ${_token}`;
    const res = await fetch(`${API}${path}`, { ...opts, headers });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const err = new Error(body.message || `HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  // ── Authentification admin ───────────────────────────────────────────────
  async function adminLogin(email, password) {
    const data = await http('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    _token = data.access_token;
    localStorage.setItem('proexcel_admin_token', _token);
    localStorage.setItem('proexcel_admin', 'true');
    emit('auth', { loggedIn: true });
    return data;
  }

  function adminLogout() {
    _token = null;
    localStorage.removeItem('proexcel_admin_token');
    localStorage.removeItem('proexcel_admin');
    emit('auth', { loggedIn: false });
  }

  function isAdmin() { return !!_token; }

  async function verifyToken() {
    if (!_token) return false;
    try {
      await http('/auth/me');
      return true;
    } catch (e) {
      if (e.status === 401) adminLogout();
      return false;
    }
  }

  // ── Normalisation produit (API → format frontend) ────────────────────────
  function _normalizeProduct(p) {
    const compareAtPrice = p.compareAtPrice || Math.round((p.price || 0) * 1.35);
    const variants = Array.isArray(p.variants) && p.variants.length
      ? p.variants
      : [{ label: 'Brochée', price: p.price }];
    return {
      id: p.id,
      title: p.title,
      author: p.author || 'ProExcel',
      price: p.price,
      compareAtPrice,
      category: p.category || '',
      g1: p.g1 || '#1a237e',
      g2: p.g2 || '#3949ab',
      emoji: p.emoji || '📦',
      variants,
      stock: p.stock || 0,
      rating: p.rating || 4.5,
      reviewCount: p.reviewCount || 0,
      isPromo: !!p.isPromo,
      isBestOffer: !!p.isBestOffer,
      isNew: !!p.isNew,
      description: p.description || `<p>${p.title}</p>`,
      reviews: p.reviews || [],
      media: p.media || [],
    };
  }

  // ── Produits ─────────────────────────────────────────────────────────────
  async function fetchProducts(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const data = await http(`/products${qs ? '?' + qs : ''}`);
    _products = (Array.isArray(data) ? data : data.items || []).map(_normalizeProduct);
    localStorage.setItem('proexcel_products', JSON.stringify(_products));
    emit('products', _products);
    return _products;
  }

  function getProducts() { return _products; }

  async function createProduct(dto) {
    const data = await http('/products', { method: 'POST', body: JSON.stringify(dto) });
    await fetchProducts();
    return data;
  }

  async function updateProduct(id, dto) {
    const data = await http(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(dto) });
    await fetchProducts();
    return data;
  }

  async function deleteProduct(id) {
    await http(`/products/${id}`, { method: 'DELETE' });
    await fetchProducts();
  }

  // ── Catégories ───────────────────────────────────────────────────────────
  async function fetchCategories() {
    const data = await http('/categories');
    _categories = Array.isArray(data) ? data : [];
    emit('categories', _categories);
    return _categories;
  }

  function getCategories() { return _categories; }

  async function createCategory(dto) {
    const data = await http('/categories', { method: 'POST', body: JSON.stringify(dto) });
    await fetchCategories();
    return data;
  }

  async function updateCategory(id, dto) {
    const data = await http(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(dto) });
    await fetchCategories();
    return data;
  }

  async function deleteCategory(id) {
    await http(`/categories/${id}`, { method: 'DELETE' });
    await fetchCategories();
  }

  // ── Commandes ────────────────────────────────────────────────────────────
  async function submitOrder(orderData) {
    return http('/orders', { method: 'POST', body: JSON.stringify(orderData) });
  }

  async function fetchOrders(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return http(`/orders${qs ? '?' + qs : ''}`);
  }

  async function fetchOrderStats() {
    return http('/orders/stats');
  }

  async function updateOrderStatus(id, status) {
    return http(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }

  async function deleteOrder(id) {
    return http(`/orders/${id}`, { method: 'DELETE' });
  }

  // ── Paramètres ───────────────────────────────────────────────────────────
  async function fetchSettings() {
    return http('/settings');
  }

  async function updateSettings(dto) {
    return http('/settings', { method: 'PATCH', body: JSON.stringify(dto) });
  }

  // ── Upload fichiers ──────────────────────────────────────────────────────
  async function uploadFile(endpoint, file) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${API}${endpoint}`, {
      method: 'POST',
      headers: _token ? { Authorization: `Bearer ${_token}` } : {},
      body: fd,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    return res.json();
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  // Charge produits + catégories depuis l'API. En cas d'erreur, garde le fallback localStorage.
  async function init() {
    try {
      await Promise.all([fetchProducts(), fetchCategories()]);
    } catch (e) {
      console.warn('[Store] Backend indisponible – fallback localStorage actif');
    }
  }

  return {
    on, emit, init,
    adminLogin, adminLogout, isAdmin, verifyToken,
    fetchProducts, getProducts, createProduct, updateProduct, deleteProduct,
    fetchCategories, getCategories, createCategory, updateCategory, deleteCategory,
    submitOrder, fetchOrders, fetchOrderStats, updateOrderStatus, deleteOrder,
    fetchSettings, updateSettings,
    uploadFile,
  };
})();
