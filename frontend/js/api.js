// ── API Configuration ────────────────────────────────────────────────────────
// Always points to the Express backend on port 5000.
// Works whether you open the HTML directly OR visit http://localhost:5000
const BASE_URL = 'http://localhost:5000';

// ── Session ID (guest cart identifier) ──────────────────────────────────────
function getSessionId() {
  let id = localStorage.getItem('dropshop_session');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).slice(2) + Date.now();
    localStorage.setItem('dropshop_session', id);
  }
  return id;
}

// ── Auth Token ───────────────────────────────────────────────────────────────
function getToken()      { return localStorage.getItem('dropshop_token'); }
function getUser()       { const u = localStorage.getItem('dropshop_user'); return u ? JSON.parse(u) : null; }
function setAuth(data)   { localStorage.setItem('dropshop_token', data.token); localStorage.setItem('dropshop_user', JSON.stringify(data.user)); }
function clearAuth()     { localStorage.removeItem('dropshop_token'); localStorage.removeItem('dropshop_user'); }

// ── Core Fetch Wrapper ───────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token   = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(BASE_URL + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

// ── Products API ─────────────────────────────────────────────────────────────
const ProductsAPI = {
  getAll:    (params = {}) => apiFetch('/api/products?' + new URLSearchParams(params)),
  getOne:    (id)          => apiFetch(`/api/products/${id}`),
  create:    (body)        => apiFetch('/api/products', { method: 'POST', body: JSON.stringify(body) }),
  update:    (id, body)    => apiFetch(`/api/products/${id}`, { method: 'PUT',  body: JSON.stringify(body) }),
  delete:    (id)          => apiFetch(`/api/products/${id}`, { method: 'DELETE' }),
  seedDemo:  ()            => apiFetch('/api/products/seed/demo', { method: 'POST' }),
};

// ── Cart API ──────────────────────────────────────────────────────────────────
const CartAPI = {
  get:    ()                 => apiFetch(`/api/cart/${getSessionId()}`),
  add:    (productId, qty=1) => apiFetch(`/api/cart/${getSessionId()}/add`,    { method: 'POST',   body: JSON.stringify({ productId, quantity: qty }) }),
  update: (productId, qty)   => apiFetch(`/api/cart/${getSessionId()}/update`, { method: 'PUT',    body: JSON.stringify({ productId, quantity: qty }) }),
  remove: (productId)        => apiFetch(`/api/cart/${getSessionId()}/remove/${productId}`, { method: 'DELETE' }),
  clear:  ()                 => apiFetch(`/api/cart/${getSessionId()}/clear`,  { method: 'DELETE' }),
};

// ── Orders API ────────────────────────────────────────────────────────────────
const OrdersAPI = {
  place:     (customer, paymentMethod) => apiFetch('/api/orders', { method: 'POST', body: JSON.stringify({ sessionId: getSessionId(), customer, paymentMethod }) }),
  getAll:    ()                        => apiFetch('/api/orders'),
  updateStatus: (id, status)           => apiFetch(`/api/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

// ── Auth API ──────────────────────────────────────────────────────────────────
const AuthAPI = {
  login:    (email, password)            => apiFetch('/api/auth/login',    { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password, adminSecret) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, adminSecret }) }),
  me:       ()                           => apiFetch('/api/auth/me'),
};