/* ─── CONFIG ─────────────────────────────────────────────────
   Cambia esta URL a la dirección de tu servidor cuando lo despliegues.
   En desarrollo local: http://localhost:3001
   ─────────────────────────────────────────────────────────── */
const API = window.DIARY_API_URL || 'http://localhost:3001/api';

/* ─── SAKURA PETALS ─────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('sakura-canvas');
  const ctx    = canvas.getContext('2d');
  let petals   = [];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function rnd(a, b) { return a + Math.random() * (b - a); }

  function mkPetal() {
    return { x: rnd(0, canvas.width), y: rnd(-100, -10), size: rnd(5, 12),
             speedY: rnd(.6, 1.6), speedX: rnd(-.5, .5), drift: rnd(.003, .009),
             angle: rnd(0, Math.PI * 2), spin: rnd(-.015, .015),
             alpha: rnd(.5, .9), hue: rnd(335, 355) };
  }

  for (let i = 0; i < 28; i++) { const p = mkPetal(); p.y = rnd(0, canvas.height); petals.push(p); }

  function drawPetal(p) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.globalAlpha = p.alpha;
    const g = ctx.createRadialGradient(0,0,0,0,0,p.size);
    g.addColorStop(0, `hsla(${p.hue},80%,85%,1)`); g.addColorStop(1, `hsla(${p.hue},70%,75%,0)`);
    ctx.beginPath(); ctx.ellipse(0, 0, p.size*.6, p.size, 0, 0, Math.PI*2);
    ctx.fillStyle = g; ctx.fill(); ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.x += p.speedX + Math.sin(p.y * p.drift) * .5; p.y += p.speedY; p.angle += p.spin;
      if (p.y > canvas.height + 20) Object.assign(p, mkPetal());
      drawPetal(p);
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ─── NAV ───────────────────────────────────────────────────── */
(function () {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });
  hamburger.addEventListener('click', () => nav.classList.toggle('menu-open'));
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('menu-open')));
})();

/* ─── COUNTER ANIMATION ─────────────────────────────────────── */
function animateCount(el, target, duration = 1800) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ─── SCROLL REVEAL ─────────────────────────────────────────── */
(function () {
  function observe(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  window.__observeReveal = observe;
  observe('.section-header');
})();

/* ─── API HELPERS ───────────────────────────────────────────── */
async function apiFetch(path) {
  try {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) throw new Error(res.status);
    return res.json();
  } catch (err) {
    console.warn(`[diary] API ${path} no disponible — mostrando datos de ejemplo`);
    return null;
  }
}

/* ─── LOAD STATS ────────────────────────────────────────────── */
async function loadStats() {
  const stats = await apiFetch('/stats');
  const days  = stats?.days        ?? 12;
  const places = stats?.places     ?? 31;
  const food   = stats?.restaurants ?? 47;

  const dEl = document.getElementById('stat-days');
  const pEl = document.getElementById('stat-places');
  const fEl = document.getElementById('stat-food');

  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCount(dEl, days,   1800);
      animateCount(pEl, places, 2000);
      animateCount(fEl, food,   2200);
      io.disconnect();
    }
  }, { threshold: .5 });
  io.observe(document.getElementById('hero'));
}

/* ─── LOAD DIARY ENTRIES ────────────────────────────────────── */
function formatDate(iso) {
  const d = new Date(iso);
  return {
    day:   String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleString('es-ES', { month: 'long' }),
  };
}

function buildEntryCard(entry) {
  const { day, month } = formatDate(entry.date);
  const tags = (entry.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
  const img  = entry.photo_url
    ? `<div class="entry-card-img" style="background-image:url('${entry.photo_url}')"></div>`
    : '';

  return `
    <article class="diary-entry" data-id="${entry.id}">
      <div class="entry-date-col">
        <div class="entry-dot"></div>
        <div class="entry-date">
          <span class="entry-day-num">${day}</span>
          <span class="entry-month">${month}</span>
        </div>
      </div>
      <div class="entry-card">
        ${img}
        <div class="entry-card-body">
          <div class="entry-meta">
            <span class="entry-location">${entry.location ? `📍 ${entry.location}` : ''}</span>
            <span class="entry-mood">${entry.mood || ''}</span>
          </div>
          <h3 class="entry-title">${entry.title}</h3>
          <p class="entry-text">${entry.body}</p>
          ${tags ? `<div class="entry-tags">${tags}</div>` : ''}
        </div>
      </div>
    </article>`;
}

async function loadEntries() {
  const entries = await apiFetch('/entries');
  if (!entries || !entries.length) return; // keep static fallback HTML

  const timeline = document.querySelector('.diary-timeline');
  if (!timeline) return;

  // Keep only the "add via WhatsApp" placeholder
  const placeholder = timeline.querySelector('.diary-entry-new');
  timeline.innerHTML = '';
  if (placeholder) timeline.appendChild(placeholder);

  // Prepend real entries (newest last so order reads chronologically top-to-bottom)
  entries.slice().reverse().forEach(entry => {
    timeline.insertAdjacentHTML('afterbegin', buildEntryCard(entry));
  });

  window.__observeReveal('.diary-entry');
}

/* ─── LOAD RESTAURANTS ──────────────────────────────────────── */
function buildFoodCard(r) {
  const stars = '★'.repeat(Math.round(r.rating)) + '☆'.repeat(5 - Math.round(r.rating));
  const img   = r.photo_url
    ? `<div class="food-img" style="background-image:url('${r.photo_url}')"></div>`
    : `<div class="food-img food-img-placeholder"></div>`;

  return `
    <div class="food-card" data-cat="${r.category || 'otro'}">
      ${img}
      <div class="food-body">
        <div class="food-header">
          <div>
            <h3 class="food-name">${r.name}</h3>
            <p class="food-location">📍 ${r.location || r.city || 'Japón'}</p>
          </div>
          <div class="food-rating">
            <span class="stars">${stars}</span>
            <span class="rating-num">${r.rating.toFixed(1)}</span>
          </div>
        </div>
        <p class="food-desc">${r.description || ''}</p>
        <div class="food-tags">
          <span class="tag tag-food">${r.category || 'otro'}</span>
          <span class="tag tag-food">${r.price_range || '¥¥'}</span>
        </div>
      </div>
    </div>`;
}

async function loadRestaurants() {
  const rests = await apiFetch('/restaurants');
  if (!rests || !rests.length) return;

  const grid = document.querySelector('.food-grid');
  if (!grid) return;

  const addCard = grid.querySelector('.food-card-add');
  grid.innerHTML = '';
  rests.forEach(r => grid.insertAdjacentHTML('beforeend', buildFoodCard(r)));
  if (addCard) grid.appendChild(addCard);

  window.__observeReveal('.food-card');
  initFoodFilter();
}

/* ─── LOAD GALLERY ──────────────────────────────────────────── */
function buildGalleryItem(photo) {
  const isUploaded = photo.url.startsWith('/uploads/');
  const src = isUploaded ? `${API.replace('/api', '')}${photo.url}` : photo.url;
  return `
    <div class="gallery-item" style="background-image:url('${src}')">
      <div class="gallery-caption">${photo.caption || photo.location || ''}</div>
    </div>`;
}

async function loadGallery() {
  const photos = await apiFetch('/gallery');
  if (!photos || !photos.length) return;

  const masonry = document.querySelector('.gallery-masonry');
  if (!masonry) return;

  const addSlot = masonry.querySelector('.gallery-add-photo');
  masonry.innerHTML = '';
  photos.slice(0, 10).forEach(p => masonry.insertAdjacentHTML('beforeend', buildGalleryItem(p)));
  if (addSlot) masonry.appendChild(addSlot);

  window.__observeReveal('.gallery-item');
  initLightbox();
}

/* ─── FOOD FILTER ───────────────────────────────────────────── */
function initFoodFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.food-card[data-cat]');

  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c => c.classList.toggle('hidden', f !== 'all' && c.dataset.cat !== f));
  }));
}

/* ─── GALLERY LIGHTBOX ──────────────────────────────────────── */
function initLightbox() {
  const items = document.querySelectorAll('.gallery-item:not(.gallery-add-photo)');

  let overlay = document.getElementById('lightbox-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.92);backdrop-filter:blur(8px);align-items:center;justify-content:center;cursor:zoom-out;flex-direction:column;gap:1rem;';
    const img = document.createElement('div');
    img.id = 'lightbox-img';
    img.style.cssText = 'max-width:90vw;max-height:82vh;border-radius:16px;overflow:hidden;background-size:cover;background-position:center;';
    const cap = document.createElement('p');
    cap.id = 'lightbox-cap';
    cap.style.cssText = 'color:rgba(255,255,255,.6);font-size:.85rem;letter-spacing:.1em;font-family:"Playfair Display",serif;font-style:italic;';
    overlay.appendChild(img); overlay.appendChild(cap);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => { overlay.style.display = 'none'; });
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const imgEl = document.getElementById('lightbox-img');
      const capEl = document.getElementById('lightbox-cap');
      imgEl.style.width  = Math.min(item.offsetWidth  * 2.5, window.innerWidth  * .88) + 'px';
      imgEl.style.height = Math.min(item.offsetHeight * 2.5, window.innerHeight * .72) + 'px';
      imgEl.style.backgroundImage = item.style.backgroundImage;
      capEl.textContent = item.querySelector('.gallery-caption')?.textContent || '';
      overlay.style.display = 'flex';
    });
  });
}

/* ─── WHATSAPP DEMO ─────────────────────────────────────────── */
(function () {
  const input    = document.getElementById('wa-demo-input');
  const sendBtn  = document.getElementById('wa-send-btn');
  const messages = document.getElementById('wa-messages');

  const replies = [
    "¡Genial! He añadido eso a tu diario. ¿Quieres que busque restaurantes cerca? 🗺️",
    "Perfecto, ¡foto guardada en la galería! La titulé con tu ubicación automáticamente 📸",
    "Buena elección. Lo he registrado como restaurante ✨ ¿Rating del 1 al 5?",
    "Marcado en tu mapa de viaje 🌸 Son 15 min en metro desde Shibuya.",
    "¡Qué bonito! He creado una entrada nueva en tu diario con ese momento.",
    "Claro, te traduzco el menú: Tonkotsu ramen · Gyoza · Karaage. ¿Pedimos? 🥢",
  ];

  let idx = 0;
  function now() { const d = new Date(); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; }

  function addMsg(text, isUser) {
    const div = document.createElement('div');
    div.className = `wa-msg ${isUser ? 'wa-msg-user' : 'wa-msg-bot'}`;
    div.innerHTML = `<p>${text}</p><span class="wa-time">${now()}</span>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function send() {
    const t = input.value.trim();
    if (!t) return;
    addMsg(t, true);
    input.value = '';
    setTimeout(() => { addMsg(replies[idx++ % replies.length], false); }, 700 + Math.random() * 400);
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
})();

/* ─── ACTIVE NAV ────────────────────────────────────────────── */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-link'));
        const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (link) link.classList.add('active-link');
      }
    });
  }, { threshold: .4 });
  document.querySelectorAll('section[id], header[id]').forEach(s => io.observe(s));
})();

/* ─── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadEntries();
  loadRestaurants();
  loadGallery();

  // Init static fallbacks (food filter, lightbox) in case API is offline
  initFoodFilter();
  initLightbox();
});
