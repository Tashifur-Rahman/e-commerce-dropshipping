// ── Toast Notifications ──────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ── Cart Badge ────────────────────────────────────────────────────────────────
async function updateCartBadge() {
  try {
    const cart  = await CartAPI.get();
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = cart.count || 0;
      badge.style.display = cart.count > 0 ? 'flex' : 'none';
    }
  } catch { /* silent */ }
}

// ── Render Stars ──────────────────────────────────────────────────────────────
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  let   stars = '';
  for (let i = 0; i < full; i++) stars += '★';
  if (half) stars += '½';
  return `<span class="stars">${stars}</span>`;
}

// ── Format currency ───────────────────────────────────────────────────────────
function formatPrice(n) {
  return '$' + Number(n).toFixed(2);
}

// ── Redirect helper ───────────────────────────────────────────────────────────
function goTo(page) { window.location.href = page; }

// ── Navigation active state ───────────────────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    a.classList.toggle('active', href === path);
  });
}

// ── Auth UI update ─────────────────────────────────────────────────────────────
function updateAuthNav() {
  const user    = getUser();
  const userBtn = document.getElementById('nav-user-btn');
  if (!userBtn) return;

  if (user) {
    userBtn.textContent = user.isAdmin ? '⚙ Admin' : `Hi, ${user.name.split(' ')[0]}`;
    userBtn.onclick = () => {
      if (user.isAdmin) goTo('pages/admin.html');
      else { clearAuth(); location.reload(); }
    };
  } else {
    userBtn.textContent = 'Login';
    userBtn.onclick = () => goTo('pages/login.html');
  }
}

// ── DOMContentLoaded bootstrap ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  updateAuthNav();
  updateCartBadge();
});