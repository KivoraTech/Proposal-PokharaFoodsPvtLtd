// ============================================================
// POKHARA FOODS — corporate site interactions (Modern Artisan)
// ============================================================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

/* ---------- Navbar state on scroll ---------- */
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- Counter animation ---------- */
const animateCounter = el => {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  if (isNaN(target)) return;
  const duration = 1500;
  const start = performance.now();
  const tick = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString('en-IN') + suffix;
  };
  requestAnimationFrame(tick);
};
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-value[data-count]').forEach(el => counterObserver.observe(el));

/* ---------- Mini trade calculator ---------- */
const MINI_SKUS = [
  { name: 'Bakeland Digestive', ws: 51, perCarton: 20 },
  { name: 'Bakeland Marie', ws: 26, perCarton: 30 },
  { name: 'Bakeland Coco Crunch', ws: 38, perCarton: 24 },
  { name: 'Bakeland Cheese Cream', ws: 34, perCarton: 24 },
  { name: 'Bakeland Oat Mari', ws: 68, perCarton: 16 },
  { name: 'Bakeland Rusk', ws: 80, perCarton: 12 },
  { name: 'Bakeland Butter Magic', ws: 30, perCarton: 30 },
];
const fmtNPR = n => 'Rs. ' + Math.round(n).toLocaleString('en-IN');

const miniSku = document.getElementById('miniSku');
const miniQty = document.getElementById('miniQty');
const miniValue = document.getElementById('miniValue');

const computeMini = () => {
  const sku = MINI_SKUS[miniSku.value] || MINI_SKUS[0];
  const qty = Math.max(1, parseInt(miniQty.value, 10) || 1);
  miniValue.textContent = fmtNPR(qty * sku.perCarton * sku.ws);
};

if (miniSku) {
  miniSku.innerHTML = MINI_SKUS
    .map((s, i) => `<option value="${i}">${s.name} — ${fmtNPR(s.ws)}/pack</option>`)
    .join('');
  miniSku.addEventListener('change', computeMini);
  miniQty.addEventListener('input', computeMini);
  computeMini();
}

/* ---------- Contact form (demo) ---------- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', () => {
    const name = document.getElementById('cfName').value.trim();
    const email = document.getElementById('cfEmail').value.trim();
    if (!name || !email) return;
    const success = document.getElementById('cfSuccess');
    success.classList.add('show');
    contactForm.reset();
    setTimeout(() => success.classList.remove('show'), 6000);
  });
}

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
