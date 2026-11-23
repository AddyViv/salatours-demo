/**
 * SALATOURS RZR — DEMO ZENTRA DIGITAL
 * Edita este bloque con los enlaces oficiales antes de entregar.
 * Los perfiles de redes quedan deliberadamente vacíos: no inventamos URLs.
 */
const APP_CONFIG = {
  whatsapp: '527225936998', // +52 722 593 6998, publicado en el folleto del cliente
  facebook: '',             // https://www.facebook.com/PERFIL_OFICIAL
  instagram: '',            // https://www.instagram.com/PERFIL_OFICIAL/
  tiktok: '',               // https://www.tiktok.com/@PERFIL_OFICIAL
};

const PRICES = {
  2: { chico: 2200, grande: 2500 },
  4: { chico: 2500, grande: 3200 },
};

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
});
const wa = (message) => `https://wa.me/${APP_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;

const waMessages = {
  general: '¡Hola, Salatours RZR! Vi su página web y me gustaría conocer las experiencias, fechas disponibles y cómo reservar. 🌄',
  parapente: '¡Hola, Salatours RZR! Me interesa el vuelo en parapente anunciado a $1,990 por persona. ¿Me pueden compartir disponibilidad y condiciones?',
  rutas: '¡Hola, Salatours RZR! Vi sus rutas de Valle de Bravo. ¿Me pueden informar qué recorridos están disponibles y sus tarifas?',
};

for (const link of document.querySelectorAll('[data-wa]')) {
  const kind = link.dataset.wa;
  link.href = wa(waMessages[kind] || waMessages.general);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
}

// Configurador interactivo de RZR.
let people = 2;
let trip = 'chico';
const priceEl = document.getElementById('route-price');
const summaryEl = document.getElementById('route-summary');
const routeLink = document.getElementById('route-book');

function updatePrice() {
  const price = PRICES[people][trip];
  const tripName = trip === 'chico' ? 'Recorrido chico' : 'Recorrido grande';
  priceEl.innerHTML = `${formatter.format(price)} <small>MXN</small>`;
  summaryEl.textContent = `RZR ${people} plazas · ${tripName}`;
  routeLink.href = wa(`¡Hola, Salatours RZR! Me interesa reservar el ${tripName.toLowerCase()} en RZR de ${people} plazas, anunciado a ${formatter.format(price)} MXN. ¿Tienen disponibilidad?`);
  document.querySelectorAll('[data-people]').forEach((btn) => {
    const active = Number(btn.dataset.people) === people;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-trip]').forEach((btn) => {
    const active = btn.dataset.trip === trip;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

document.querySelectorAll('[data-people]').forEach((button) => {
  button.addEventListener('click', () => {
    people = Number(button.dataset.people);
    updatePrice();
  });
});
document.querySelectorAll('[data-trip]').forEach((button) => {
  button.addEventListener('click', () => {
    trip = button.dataset.trip;
    updatePrice();
  });
});
updatePrice();

// Menú responsivo.
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  mobileMenu.hidden = true;
}
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
  mobileMenu.hidden = isOpen;
});
mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

// Scroll, cabecera y animaciones respetando reduced-motion.
const header = document.querySelector('.site-header');
const progressBar = document.getElementById('scroll-progress');
let ticking = false;
function updateScroll() {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 28);
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${total ? Math.min(100, Math.max(0, y / total * 100)) : 0}%`;
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
}, {passive:true});
window.addEventListener('resize', updateScroll);
updateScroll();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.08, rootMargin:'0px 0px 35px 0px'});
  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
} else {
  document.querySelectorAll('.reveal').forEach((item) => item.classList.add('visible'));
}

// Redes sociales: solo abrir URLs verificadas.
let toastTimeout;
function toast(message) {
  const node = document.getElementById('toast');
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {node.hidden = true;}, 4600);
}
for (const button of document.querySelectorAll('[data-social]')) {
  button.addEventListener('click', () => {
    const network = button.dataset.social;
    const url = APP_CONFIG[network];
    if (url && /^https:\/\//.test(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast(`Estamos preparando el enlace oficial de ${network} para la versión final.`);
    }
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
