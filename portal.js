// ============================================================
// POKHARA FOODS — TRADE PORTAL (Modern Artisan rebuild)
// Catalog · Bulk Inquiry Calculator · Partner Onboarding
// ============================================================

/* ---------- Catalog data (real Bakeland SKUs, demo wholesale pricing) ---------- */
const PRODUCTS = [
  {
    id: 'digestive', name: 'Bakeland Digestive', cat: 'Digestive', fast: true, img: 'assets/biscuit-digestive.jpg',
    desc: 'Whole-wheat digestive biscuits — the family favourite. Golden, crunchy and lightly sweetened.',
    packG: 200, pieces: 24, perCarton: 20, mrp: 60, ws: 51, moq: 10, shelf: '9 months', storage: 'Keep in a cool, dry place',
  },
  {
    id: 'digestive-lite', name: 'Bakeland Digestive Lite', cat: 'Digestive', fast: false, img: 'assets/biscuit-digestive.jpg',
    desc: 'A lighter digestive option — same great crunch with a softer sweetness and high fibre.',
    packG: 200, pieces: 24, perCarton: 20, mrp: 65, ws: 55, moq: 10, shelf: '9 months', storage: 'Keep in a cool, dry place',
  },
  {
    id: 'cococrunch', name: 'Bakeland Coco Crunch', cat: 'Coconut', fast: true, img: 'assets/biscuit-coconut.jpg',
    desc: 'Coconut biscuits with real coconut taste and a crunchy bite — a Bakeland best-seller.',
    packG: 150, pieces: 18, perCarton: 24, mrp: 45, ws: 38, moq: 12, shelf: '6 months', storage: 'Keep in a cool, dry place',
  },
  {
    id: 'marie', name: 'Bakeland Marie', cat: 'Marie', fast: true, img: 'assets/biscuit-marie.jpg',
    desc: 'Classic light Marie biscuits — perfect with a cup of chiya. A staple on every shelf.',
    packG: 100, pieces: 24, perCarton: 30, mrp: 30, ws: 26, moq: 15, shelf: '9 months', storage: 'Keep in a cool, dry place',
  },
  {
    id: 'cheesecream', name: 'Bakeland Cheese Cream', cat: 'Cream', fast: true, img: 'assets/biscuit-cream.jpg',
    desc: 'Two crisp biscuits with a smooth, savoury cheese cream centre — loved by kids and adults.',
    packG: 120, pieces: 16, perCarton: 24, mrp: 40, ws: 34, moq: 12, shelf: '6 months', storage: 'Keep in a cool, dry place',
  },
  {
    id: 'oatmari', name: 'Bakeland Oat Mari', cat: 'Oat', fast: false, img: 'assets/biscuit-oat.jpg',
    desc: 'Oat-enriched mari biscuits — the lighter, wholesome choice for health-conscious homes.',
    packG: 250, pieces: 20, perCarton: 16, mrp: 80, ws: 68, moq: 8, shelf: '9 months', storage: 'Keep in a cool, dry place',
  },
  {
    id: 'rusk', name: 'Bakeland Rusk', cat: 'Rusk', fast: false, img: 'assets/biscuit-rusk.jpg',
    desc: 'Twice-baked golden rusks — firm, crunchy and perfect with tea or milk.',
    packG: 300, pieces: 12, perCarton: 12, mrp: 95, ws: 80, moq: 10, shelf: '9 months', storage: 'Keep in a cool, dry place',
  },
  {
    id: 'buttermagic', name: 'Bakeland Butter Magic', cat: 'Cookie', fast: false, img: 'assets/biscuit-cream.jpg',
    desc: 'Rich, buttery shortbread-style cookies that melt in the mouth — a premium treat.',
    packG: 100, pieces: 24, perCarton: 30, mrp: 35, ws: 30, moq: 15, shelf: '6 months', storage: 'Keep in a cool, dry place',
  },
];

const CATS = ['All', 'Digestive', 'Coconut', 'Marie', 'Cream', 'Oat', 'Rusk', 'Cookie'];

const DISTRICTS = [
  'Baglung', 'Banke', 'Bhaktapur', 'Chitwan', 'Dang', 'Dhankuta', 'Gorkha',
  'Jhapa', 'Kailali', 'Kathmandu', 'Kaski', 'Lamjung', 'Lalitpur', 'Morang',
  'Myagdi', 'Nawalparasi', 'Palpa', 'Parbat', 'Rupandehi', 'Sunsari',
  'Syangja', 'Tanahun', 'Other',
];

/* ---------- Demo constants ---------- */
const WA_NUMBER = '9779800000000';
const EMAIL = 'sales@bakeland.com.np';

/* ---------- State ---------- */
const state = { filter: 'All', query: '', sort: 'featured', cart: {}, tier: 'retailer' };

/* ---------- Helpers ---------- */
const $ = id => document.getElementById(id);
const fmtNPR = n => 'Rs. ' + Math.round(n).toLocaleString('en-IN');
const fmtKg = n => (Math.round(n * 10) / 10) + ' kg';
const ref = () => 'PF-' + Math.random().toString(36).slice(2, 8).toUpperCase();
const byId = id => PRODUCTS.find(p => p.id === id);
const itemMeta = id => {
  const p = byId(id);
  const cartons = state.cart[id];
  const packs = cartons * p.perCarton;
  const weight = (packs * p.packG) / 1000;
  const value = packs * p.ws;
  return { p, cartons, packs, weight, value };
};

/* ============================================================
   CATALOG
   ============================================================ */
function renderChips() {
  $('catChips').innerHTML = CATS
    .map(c => `<button type="button" class="chip${state.filter === c ? ' active' : ''}" data-cat="${c}">${c}</button>`)
    .join('');
}

function visibleProducts() {
  const q = state.query.trim().toLowerCase();
  let list = PRODUCTS.filter(p =>
    (state.filter === 'All' || p.cat === state.filter) &&
    (!q || (p.name + ' ' + p.cat + ' ' + p.desc).toLowerCase().includes(q))
  );
  switch (state.sort) {
    case 'price-asc': list = [...list].sort((a, b) => a.ws - b.ws); break;
    case 'price-desc': list = [...list].sort((a, b) => b.ws - a.ws); break;
    case 'name': list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
    default: list = [...list].sort((a, b) => (b.fast - a.fast) || a.name.localeCompare(b.name));
  }
  return list;
}

function cardHTML(p) {
  return `
    <article class="p-card">
      <div class="p-img">
        ${p.fast ? '<span class="p-fast">Fast mover</span>' : ''}
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="p-body">
        <span class="p-cat">${p.cat}</span>
        <h3>${p.name}</h3>
        <p class="p-specs">${p.packG}g · ${p.pieces} pcs/pack · ${p.perCarton} packs/carton</p>
        <div class="p-price-row">
          <span class="p-ws">${fmtNPR(p.ws)}</span>
          <span class="p-mrp">MRP ${fmtNPR(p.mrp)}</span>
        </div>
        <p class="p-moq">MOQ ${p.moq} cartons</p>
        <div class="p-actions">
          <button type="button" class="btn btn-primary" data-act="add" data-id="${p.id}">Add</button>
          <button type="button" class="btn btn-outline btn-icon" data-act="details" data-id="${p.id}" aria-label="Details for ${p.name}">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 10.5v5M12 7.6v.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>
    </article>`;
}

function renderCatalog() {
  const list = visibleProducts();
  $('catalogGrid').innerHTML = list.map(cardHTML).join('');
  $('catalogEmpty').hidden = list.length > 0;
  $('catalogCount').textContent = `Showing ${list.length} of ${PRODUCTS.length} products`;
}

/* ---------- Detail modal ---------- */
function openModal(id) {
  const p = byId(id);
  if (!p) return;
  $('modalCard').innerHTML = `
    <div class="modal-head">
      <img src="${p.img}" alt="${p.name}" />
      <button type="button" class="modal-close" data-act="close" aria-label="Close">×</button>
    </div>
    <div class="modal-body">
      <span class="p-cat">${p.cat}${p.fast ? ' · Fast mover' : ''}</span>
      <h3>${p.name}</h3>
      <p class="modal-desc">${p.desc}</p>
      <div class="spec-grid">
        <div><span>Pack size</span><strong>${p.packG} g</strong></div>
        <div><span>Pieces per pack</span><strong>${p.pieces}</strong></div>
        <div><span>Packs per carton</span><strong>${p.perCarton}</strong></div>
        <div><span>Wholesale price</span><strong>${fmtNPR(p.ws)}</strong></div>
        <div><span>MRP</span><strong>${fmtNPR(p.mrp)}</strong></div>
        <div><span>Min. order</span><strong>${p.moq} cartons</strong></div>
        <div><span>Shelf life</span><strong>${p.shelf}</strong></div>
        <div><span>Storage</span><strong>${p.storage}</strong></div>
      </div>
      <div class="modal-add">
        <button type="button" class="btn btn-primary" data-act="add" data-id="${p.id}">Add to bulk inquiry</button>
        <button type="button" class="btn btn-outline" data-act="close">Close</button>
      </div>
    </div>`;
  $('productModal').hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $('productModal').hidden = true;
  document.body.style.overflow = '';
}

/* ============================================================
   BULK INQUIRY CALCULATOR
   ============================================================ */
function cartCount() { return Object.keys(state.cart).length; }

function renderCart() {
  const ids = Object.keys(state.cart);
  const empty = ids.length === 0;
  $('cartEmpty').hidden = !empty;
  $('cartLines').hidden = empty;
  $('totalsCard').hidden = empty;

  $('cartLines').innerHTML = ids.map(id => {
    const { p, cartons, packs, weight, value } = itemMeta(id);
    return `
      <div class="cart-line">
        <div class="cart-line-info">
          <strong>${p.name}</strong>
          <span>${p.packG}g · ${p.perCarton} packs/carton · MOQ ${p.moq}</span>
        </div>
        <div class="stepper">
          <button type="button" data-act="dec" data-id="${id}" aria-label="Decrease">−</button>
          <input type="number" min="1" value="${cartons}" data-act="qty" data-id="${id}" aria-label="Cartons of ${p.name}" />
          <span class="unit">ctn</span>
          <button type="button" data-act="inc" data-id="${id}" aria-label="Increase">+</button>
        </div>
        <div class="cart-line-meta">
          <span>${packs} packs · ${fmtKg(weight)}</span>
          <strong>${fmtNPR(value)}</strong>
        </div>
        <button type="button" class="cart-remove" data-act="rm" data-id="${id}" aria-label="Remove ${p.name}">×</button>
      </div>`;
  }).join('');

  let cartons = 0, packs = 0, weight = 0, value = 0;
  ids.forEach(id => {
    const m = itemMeta(id);
    cartons += m.cartons; packs += m.packs; weight += m.weight; value += m.value;
  });
  $('totCartons').textContent = cartons;
  $('totPacks').textContent = packs.toLocaleString('en-IN');
  $('totWeight').textContent = fmtKg(weight);
  $('totValue').textContent = fmtNPR(value);

  const badge = $('cartBadge');
  const n = cartCount();
  badge.hidden = n === 0;
  badge.textContent = n;
}

function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  renderCart();
  toast('Added to your bulk inquiry');
}

function setQty(id, qty) {
  const p = byId(id);
  const v = Math.max(1, Math.min(999, Math.round(qty) || 1));
  state.cart[id] = v;
  renderCart();
  if (p && v < p.moq) toast(`Tip: MOQ for ${p.name} is ${p.moq} cartons`, 2600);
}

function clearCart() {
  state.cart = {};
  renderCart();
  toast('Order cleared');
}

/* ---------- Inquiry text ---------- */
function buildInquiryText() {
  const ids = Object.keys(state.cart);
  let cartons = 0, value = 0, weight = 0;
  const lines = ids.map(id => {
    const m = itemMeta(id);
    cartons += m.cartons; value += m.value; weight += m.weight;
    return `• ${m.p.name} — ${m.cartons} carton(s) = ${m.packs} packs — ${fmtNPR(m.value)}`;
  });
  return [
    '*New Bulk Inquiry — Pokhara Foods (Bakeland)*',
    '',
    ...lines,
    '',
    `*Total:* ${cartons} cartons · ${fmtKg(weight)}`,
    `*Est. wholesale value:* ${fmtNPR(value)}`,
    '',
    `*Name:* ${$('inqName').value.trim() || '—'}`,
    `*Shop/Company:* ${$('inqCompany').value.trim() || '—'}`,
    `*Phone:* ${$('inqPhone').value.trim() || '—'}`,
    `*District:* ${$('inqDistrict').value || '—'}`,
    $('inqNote').value.trim() ? `*Notes:* ${$('inqNote').value.trim()}` : '',
  ].filter(Boolean).join('\n');
}

function confirmInquiry() {
  const ids = Object.keys(state.cart);
  $('confirmRef').textContent = ref();
  $('confirmSummary').innerHTML = ids.map(id => {
    const m = itemMeta(id);
    return `<li><span>${m.p.name} × ${m.cartons} cartons</span><span>${fmtNPR(m.value)}</span></li>`;
  }).join('');
  $('inquiryForm').hidden = true;
  $('confirmPanel').hidden = false;
  $('confirmPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  state.cart = {};
  renderCart();
}

function sendInquiry(channel) {
  if (cartCount() === 0) { toast('Add products to your inquiry first'); return; }
  const name = $('inqName').value.trim();
  const phone = $('inqPhone').value.trim();
  if (!name || !phone) { toast('Please enter your name and phone number'); $('inqName').focus(); return; }

  const text = buildInquiryText();
  if (channel === 'wa') {
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank');
  } else {
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Bulk Inquiry — Pokhara Foods (Bakeland)')}&body=${encodeURIComponent(text)}`;
  }
  confirmInquiry();
}

/* ============================================================
   PARTNER ONBOARDING
   ============================================================ */
const TIERS = {
  retailer: { label: 'Retailer', moq: '5 cartons' },
  sub: { label: 'Sub-Distributor', moq: '50 cartons' },
  cnf: { label: 'Super-Distributor (C&F)', moq: '200 cartons' },
};

function selectTier(key) {
  state.tier = key;
  document.querySelectorAll('.tier').forEach(t => t.classList.toggle('active', t.dataset.tier === key));
  $('tierLabel').textContent = TIERS[key].label;
}

function buildPartnerText() {
  const f = id => $(id).value.trim();
  return [
    '*New Partner Application — Pokhara Foods (Bakeland)*',
    '',
    `*Tier:* ${TIERS[state.tier].label} (MOQ from ${TIERS[state.tier].moq})`,
    `*Business:* ${f('partBusiness') || '—'}`,
    `*Owner:* ${f('partOwner') || '—'}`,
    `*Phone:* ${f('partPhone') || '—'}`,
    `*District:* ${f('partDistrict') || '—'}`,
    `*Est. volume:* ${f('partVolume') || '—'}`,
    `*Current supplier:* ${f('partSupplier') || '—'}`,
    f('partNote') ? `*Notes:* ${f('partNote')}` : '',
  ].filter(Boolean).join('\n');
}

function confirmPartner() {
  $('partnerRef').textContent = ref();
  $('partnerConfirm').hidden = false;
  $('partnerConfirm').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  $('partnerForm').reset();
}

function submitPartner(notify) {
  const business = $('partBusiness').value.trim();
  const owner = $('partOwner').value.trim();
  const phone = $('partPhone').value.trim();
  if (!business || !owner || !phone) { toast('Please complete the required fields'); return; }
  if (notify) {
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(buildPartnerText()), '_blank');
  }
  confirmPartner();
  toast('Application submitted — thank you!');
}

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer = null;
function toast(msg, ms = 2400) {
  const t = $('toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, ms);
}

/* ============================================================
   REVEAL
   ============================================================ */
let revealObserver;
function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  }
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

/* ============================================================
   BOOT
  ============================================================ */
function boot() {
  const opts = DISTRICTS.map(d => `<option value="${d}">${d}</option>`).join('');
  $('inqDistrict').innerHTML = `<option value="">Your district…</option>` + opts;
  $('partDistrict').innerHTML = `<option value="">Your district…</option>` + opts;

  renderChips();
  renderCatalog();
  renderCart();
  selectTier(state.tier);
  observeReveals();
  $('year').textContent = new Date().getFullYear();

  /* Nav / mobile menu */
  const hamburger = $('hamburger');
  const navLinks = $('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }));

  /* Catalog events */
  $('catChips').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    state.filter = chip.dataset.cat;
    renderChips();
    renderCatalog();
  });

  let searchTimer = null;
  $('searchInput').addEventListener('input', e => {
    state.query = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(renderCatalog, 150);
  });
  $('sortSelect').addEventListener('change', e => { state.sort = e.target.value; renderCatalog(); });
  $('resetFilters').addEventListener('click', () => {
    state.query = ''; state.filter = 'All';
    $('searchInput').value = '';
    renderChips(); renderCatalog();
  });

  $('catalogGrid').addEventListener('click', e => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const { act, id } = btn.dataset;
    if (act === 'add') addToCart(id);
    if (act === 'details') openModal(id);
  });

  /* Modal events */
  $('productModal').addEventListener('click', e => {
    if (e.target === $('productModal')) closeModal();
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const { act, id } = btn.dataset;
    if (act === 'close') closeModal();
    if (act === 'add') { addToCart(id); closeModal(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('productModal').hidden) closeModal(); });

  /* Cart events */
  $('cartLines').addEventListener('click', e => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const { act, id } = btn.dataset;
    if (act === 'inc') setQty(id, state.cart[id] + 1);
    if (act === 'dec') setQty(id, state.cart[id] - 1);
    if (act === 'rm') { delete state.cart[id]; renderCart(); }
  });
  $('cartLines').addEventListener('change', e => {
    const input = e.target.closest('input[data-act="qty"]');
    if (input) setQty(input.dataset.id, parseInt(input.value, 10));
  });
  $('clearCart').addEventListener('click', clearCart);

  /* Inquiry submit */
  $('btnWa').addEventListener('click', () => sendInquiry('wa'));
  $('btnEmail').addEventListener('click', () => sendInquiry('email'));
  $('newInquiry').addEventListener('click', () => {
    $('confirmPanel').hidden = true;
    $('inquiryForm').hidden = false;
    $('inquiryForm').reset();
    $('inqName').focus();
  });

  /* Onboarding events */
  $('tierCards').addEventListener('click', e => {
    const tier = e.target.closest('.tier');
    if (tier) selectTier(tier.dataset.tier);
  });
  $('btnApply').addEventListener('click', () => submitPartner(false));
  $('btnApplyWa').addEventListener('click', () => submitPartner(true));
}

document.addEventListener('DOMContentLoaded', boot);
