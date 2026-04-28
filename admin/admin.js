// ─── ADMIN DATA (mock data stored in localStorage) ───

const ADMIN_PRODUCTS = JSON.parse(localStorage.getItem('proexcel_products') || 'null') || [
  { id:1, title:"Mathématiques – 2ème Bac Sciences", price:89, compare:120, category:"Mathématiques", stock:15, isPromo:true, isBestOffer:true, isNew:false, g1:"#1a237e", g2:"#3949ab", emoji:"📐" },
  { id:2, title:"Physique-Chimie – 2ème Bac PC", price:79, compare:105, category:"Sciences", stock:8, isPromo:true, isBestOffer:true, isNew:false, g1:"#880e4f", g2:"#c2185b", emoji:"⚗️" },
  { id:3, title:"SVT – 1ère Bac Sciences", price:65, compare:85, category:"Sciences", stock:20, isPromo:false, isBestOffer:true, isNew:false, g1:"#1b5e20", g2:"#388e3c", emoji:"🔬" },
  { id:4, title:"Langue Française – Tronc Commun", price:55, compare:72, category:"Langues", stock:30, isPromo:false, isBestOffer:true, isNew:false, g1:"#4a148c", g2:"#7b1fa2", emoji:"📖" },
  { id:5, title:"Histoire-Géographie – 3ème Collège", price:58, compare:75, category:"Histoire & Géo", stock:25, isPromo:false, isBestOffer:false, isNew:false, g1:"#bf360c", g2:"#e64a19", emoji:"🗺️" },
  { id:6, title:"English for Baccalaureate", price:69, compare:90, category:"Langues", stock:18, isPromo:true, isBestOffer:true, isNew:true, g1:"#006064", g2:"#00838f", emoji:"🇬🇧" },
  { id:7, title:"Philosophie – Terminale Bac", price:59, compare:79, category:"Philosophie", stock:12, isPromo:false, isBestOffer:false, isNew:false, g1:"#37474f", g2:"#607d8b", emoji:"🧠" },
  { id:8, title:"Économie et Gestion – 2ème Bac", price:72, compare:95, category:"Économie", stock:14, isPromo:true, isBestOffer:true, isNew:false, g1:"#e65100", g2:"#ef6c00", emoji:"📈" },
  { id:9, title:"Informatique & Algorithmes", price:85, compare:110, category:"Informatique", stock:6, isPromo:true, isBestOffer:true, isNew:true, g1:"#1a1a2e", g2:"#16213e", emoji:"💻" },
  { id:10, title:"اللغة العربية – الجذع المشترك", price:49, compare:65, category:"اللغة العربية", stock:35, isPromo:false, isBestOffer:false, isNew:false, g1:"#3e2723", g2:"#5d4037", emoji:"📜" },
  { id:11, title:"Tronc Commun – Pack Complet", price:299, compare:420, category:"Pack", stock:10, isPromo:true, isBestOffer:true, isNew:false, g1:"#1a3a6e", g2:"#2563eb", emoji:"🎒" },
  { id:12, title:"Technologie Industrielle – 1ère Bac", price:78, compare:99, category:"Technologie", stock:9, isPromo:false, isBestOffer:false, isNew:true, g1:"#283593", g2:"#3f51b5", emoji:"⚙️" },
];

const ADMIN_CATEGORIES = [
  { id:1, name:"Mathématiques", emoji:"📐", color:"#1e40af", count:3 },
  { id:2, name:"Sciences", emoji:"⚗️", color:"#065f46", count:4 },
  { id:3, name:"Langues", emoji:"🌍", color:"#6b21a8", count:3 },
  { id:4, name:"Histoire & Géo", emoji:"🗺️", color:"#7f1d1d", count:2 },
  { id:5, name:"Économie", emoji:"📈", color:"#7c2d12", count:2 },
  { id:6, name:"Informatique", emoji:"💻", color:"#0f172a", count:2 },
  { id:7, name:"Philosophie", emoji:"🧠", color:"#1e1b4b", count:1 },
  { id:8, name:"Technologie", emoji:"⚙️", color:"#1e3a5f", count:2 },
  { id:9, name:"اللغة العربية", emoji:"📜", color:"#451a03", count:2 },
  { id:10, name:"Pack", emoji:"🎒", color:"#1a3a6e", count:1 },
];

// Get real orders only (no mock data)
function generateOrders() {
  const stored = localStorage.getItem('proexcel_orders');
  return stored ? JSON.parse(stored) : [];
}

function getOrders() { return generateOrders(); }

function clearAllOrders() {
  if (!confirm('Supprimer TOUTES les commandes ? Cette action est irréversible.')) return;
  localStorage.setItem('proexcel_orders', JSON.stringify([]));
  adminToast('🗑️', 'Toutes les commandes supprimées', 'La liste est maintenant vide.');
  if (typeof renderOrders === 'function') renderOrders();
  if (typeof renderDashboardOrders === 'function') renderDashboardOrders();
}

// ─── THEME ───
function getAdminTheme() { return localStorage.getItem('admin_theme') || 'light'; }
function setAdminTheme(t) {
  localStorage.setItem('admin_theme', t);
  document.documentElement.setAttribute('data-admin-theme', t);
  document.querySelectorAll('.sidebar-theme-btn').forEach(btn => {
    btn.textContent = (t === 'dark' ? '☀️' : '🌙') + ' ' + (t === 'dark' ? 'Mode clair' : 'Mode sombre');
  });
}
function toggleAdminTheme() { setAdminTheme(getAdminTheme() === 'dark' ? 'light' : 'dark'); }

// ─── CHART DATA ───
const CHART_DATA = {
  week: { labels: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'], values: [1250,2100,1800,3200,2800,4100,3600] },
  month: { labels: ['S1','S2','S3','S4'], values: [8400,12200,9800,14600] },
  year: { labels: ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'], values: [5200,6800,8100,7400,9200,10500,8900,7600,11200,12800,9400,13600] }
};

function renderChart(period) {
  const data = CHART_DATA[period];
  const area = document.getElementById('chartArea');
  if (!area) return;
  const max = Math.max(...data.values);
  area.innerHTML = data.labels.map((lbl, i) => {
    const pct = (data.values[i] / max * 100).toFixed(1);
    return `<div class="chart-bar-wrap">
      <div class="chart-bar" style="height:${pct}%;min-height:6px">
        <div class="chart-bar-tooltip">${data.values[i].toLocaleString()} DH</div>
      </div>
      <div class="chart-label">${lbl}</div>
    </div>`;
  }).join('');
  document.querySelectorAll('.chart-filter').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.period === period);
  });
}

// ─── TOP PRODUCTS ───
function renderTopProducts() {
  const container = document.getElementById('topProducts');
  if (!container) return;
  const orders = getOrders();
  const salesMap = {};
  orders.forEach(o => {
    o.cart?.forEach(item => {
      salesMap[item.productId] = (salesMap[item.productId] || 0) + item.qty;
    });
  });
  const sorted = ADMIN_PRODUCTS.map(p => ({ ...p, soldUnits: salesMap[p.id] || Math.floor(Math.random() * 60 + 10) }))
    .sort((a, b) => b.soldUnits - a.soldUnits).slice(0, 5);
  const maxSold = sorted[0]?.soldUnits || 1;
  container.innerHTML = sorted.map((p, i) => {
    const rankClass = i === 0 ? 'tp-rank-1' : i === 1 ? 'tp-rank-2' : i === 2 ? 'tp-rank-3' : '';
    const pct = (p.soldUnits / maxSold * 100).toFixed(0);
    return `<div class="top-product-item">
      <div class="tp-rank ${rankClass}">${i+1}</div>
      <div class="tp-img">
        <div style="width:38px;height:48px;background:linear-gradient(145deg,${p.g1},${p.g2});border-radius:3px 5px 5px 3px;display:flex;align-items:center;justify-content:center;font-size:1.1rem">${p.emoji}</div>
      </div>
      <div class="tp-info">
        <div class="tp-name">${p.title}</div>
        <div class="tp-cat">${p.category}</div>
        <div class="tp-bar-wrap"><div class="tp-bar" style="width:${pct}%"></div></div>
      </div>
      <div class="tp-right">
        <div class="tp-sales">${p.soldUnits} vendus</div>
        <div class="tp-revenue">${(p.soldUnits * p.price).toLocaleString()} DH</div>
      </div>
    </div>`;
  }).join('');
}

// ─── VISITORS WIDGET ───
function renderVisitors() {
  const wrap = document.getElementById('visitorsRow');
  if (!wrap) return;
  const vals = Array.from({length: 14}, () => Math.floor(Math.random() * 80 + 20));
  const max = Math.max(...vals);
  wrap.innerHTML = vals.map(v => `<div class="visitor-bar" style="height:${(v/max*100).toFixed(0)}%" title="${v} visiteurs"></div>`).join('');
}

// ─── ADMIN TABLE ───
function renderDashboardOrders() {
  const tbody = document.getElementById('recentOrdersTbody');
  if (!tbody) return;
  const orders = getOrders().slice(0, 8);
  tbody.innerHTML = orders.map(o => {
    const statusClass = { completed:'status-completed', processing:'status-processing', pending:'status-pending', shipped:'status-shipped', cancelled:'status-cancelled' }[o.status] || 'status-pending';
    const statusLabel = { completed:'Complété', processing:'En cours', pending:'En attente', shipped:'Expédié', cancelled:'Annulé' }[o.status] || o.status;
    const d = new Date(o.date);
    return `<tr>
      <td><span class="order-id">#${o.orderNum}</span></td>
      <td><span class="cust-name">${o.name}</span><br><span style="font-size:0.72rem;color:var(--a-text2)">${o.city}</span></td>
      <td style="color:var(--a-text2);font-size:0.8rem">${d.toLocaleDateString('fr-FR')}</td>
      <td><span class="order-amount">${o.total} DH</span></td>
      <td><span class="status-badge ${statusClass}">● ${statusLabel}</span></td>
      <td>
        <div style="display:flex;gap:0.4rem">
          <button class="btn-action" onclick="viewOrder('${o.orderNum}')">Voir</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function viewOrder(num) {
  location.href = 'orders.html?order=' + num;
}

// ─── TOAST ───
function adminToast(icon, title, msg, type = 'success') {
  let t = document.getElementById('adminToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'adminToast';
    t.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:var(--a-card);border:1.5px solid var(--a-border);border-radius:12px;padding:1rem 1.4rem;display:flex;align-items:center;gap:0.85rem;z-index:9999;transform:translateX(130%);transition:transform 0.4s;max-width:340px;box-shadow:var(--a-shadow-lg);font-family:Inter,sans-serif';
    t.innerHTML = '<span id="aTIcon" style="font-size:1.4rem"></span><div><div id="aTTitle" style="font-weight:700;font-size:0.88rem;margin-bottom:0.15rem;color:var(--a-text)"></div><div id="aTMsg" style="font-size:0.78rem;color:var(--a-text2)"></div></div>';
    document.body.appendChild(t);
  }
  document.getElementById('aTIcon').textContent = icon;
  document.getElementById('aTTitle').textContent = title;
  document.getElementById('aTMsg').textContent = msg;
  t.style.transform = 'translateX(0)';
  clearTimeout(t._t);
  t._t = setTimeout(() => t.style.transform = 'translateX(130%)', 3000);
}

// ─── TOGGLE SWITCH ───
function initToggles() {
  document.querySelectorAll('.toggle-switch').forEach(sw => {
    sw.addEventListener('click', () => sw.classList.toggle('on'));
  });
}

// ─── SETTINGS TABS ───
function switchSettingsTab(id) {
  document.querySelectorAll('.settings-nav-item').forEach(el => el.classList.toggle('active', el.dataset.tab === id));
  document.querySelectorAll('.settings-panel').forEach(el => el.classList.toggle('active', el.id === id));
}

// ─── COLOR SYNC ───
function syncColor(inputId, hexId) {
  const colorInput = document.getElementById(inputId);
  const hexInput = document.getElementById(hexId);
  if (!colorInput || !hexInput) return;
  colorInput.addEventListener('input', () => { hexInput.value = colorInput.value; });
  hexInput.addEventListener('input', () => {
    if (/^#[0-9a-fA-F]{6}$/.test(hexInput.value)) colorInput.value = hexInput.value;
  });
}

// ─── LOGOUT ───
function adminLogout() {
  if (confirm('Voulez-vous vous déconnecter ?')) {
    if (typeof Store !== 'undefined') Store.adminLogout();
    else {
      localStorage.removeItem('proexcel_admin');
      localStorage.removeItem('proexcel_admin_token');
    }
    location.href = '../login.html';
  }
}

// ─── NOTIFICATIONS ───
function initNotifications() {
  const topbarActions = document.querySelector('.topbar-actions');
  if (!topbarActions) return;

  const orders = getOrders();
  const lastSeen = parseInt(localStorage.getItem('admin_notif_seen') || '0');
  const newOrders = orders.filter(o => new Date(o.date).getTime() > lastSeen);
  const count = newOrders.length;

  const wrap = document.createElement('div');
  wrap.className = 'notif-wrap';
  wrap.innerHTML = `
    <button class="notif-bell" id="notifBell" onclick="toggleNotifPanel()" title="Notifications">
      🔔${count > 0 ? `<span class="notif-badge">${count > 9 ? '9+' : count}</span>` : ''}
    </button>
    <div class="notif-panel" id="notifPanel">
      <div class="notif-panel-head">
        <span>Notifications</span>
        <span class="notif-mark-seen" onclick="markNotifSeen()">Tout lu ✓</span>
      </div>
      <div class="notif-list">
        ${count === 0
          ? '<div class="notif-empty">Aucune nouvelle notification</div>'
          : newOrders.map(o => `
            <div class="notif-item" onclick="markNotifSeen();location.href='orders.html?order=${o.orderNum}'">
              <div class="notif-item-icon">🛒</div>
              <div class="notif-item-body">
                <div class="notif-item-title">Nouvelle commande #${o.orderNum}</div>
                <div class="notif-item-sub">${o.name || '–'} · ${o.total} DH</div>
                <div class="notif-item-time">${new Date(o.date).toLocaleString('fr-FR',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'})}</div>
              </div>
            </div>`).join('')}
      </div>
    </div>`;

  // Insert before first child of topbar-actions
  topbarActions.insertBefore(wrap, topbarActions.firstChild);

  // Close panel when clicking outside
  document.addEventListener('click', e => {
    const panel = document.getElementById('notifPanel');
    const bell = document.getElementById('notifBell');
    if (panel && bell && !wrap.contains(e.target)) panel.classList.remove('open');
  });
}

function toggleNotifPanel() {
  const panel = document.getElementById('notifPanel');
  if (panel) panel.classList.toggle('open');
}

function markNotifSeen() {
  localStorage.setItem('admin_notif_seen', Date.now().toString());
  const bell = document.getElementById('notifBell');
  if (bell) {
    const badge = bell.querySelector('.notif-badge');
    if (badge) badge.remove();
  }
  const list = document.querySelector('.notif-list');
  if (list) list.innerHTML = '<div class="notif-empty">Aucune nouvelle notification</div>';
  const panel = document.getElementById('notifPanel');
  if (panel) panel.classList.remove('open');
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', async () => {
  const theme = getAdminTheme();
  document.documentElement.setAttribute('data-admin-theme', theme);
  document.querySelectorAll('.sidebar-theme-btn').forEach(btn => {
    btn.textContent = (theme === 'dark' ? '☀️' : '🌙') + ' ' + (theme === 'dark' ? 'Mode clair' : 'Mode sombre');
  });
  document.querySelectorAll('.sidebar-theme-btn').forEach(btn => btn.addEventListener('click', toggleAdminTheme));
  document.querySelectorAll('.sidebar-logout').forEach(btn => btn.addEventListener('click', adminLogout));
  initToggles();

  // ─── Auth: vérifier le token JWT ───
  if (typeof Store !== 'undefined') {
    const token = localStorage.getItem('proexcel_admin_token');
    if (!token) {
      location.href = '../login.html';
      return;
    }
    const valid = await Store.verifyToken();
    if (!valid) {
      location.href = '../login.html';
      return;
    }

    // Charger les produits depuis l'API et mettre à jour ADMIN_PRODUCTS
    Store.fetchProducts().then(() => {
      const ap = Store.getProducts();
      if (ap.length) {
        ADMIN_PRODUCTS.length = 0;
        ap.forEach(p => ADMIN_PRODUCTS.push({
          ...p,
          compare: p.compareAtPrice,
        }));
      }
      if (typeof renderTopProducts === 'function') renderTopProducts();
      if (typeof renderDashboardOrders === 'function') renderDashboardOrders();
      if (typeof filterProducts === 'function') filterProducts();
    }).catch(() => {});
  }

  initNotifications();
});
