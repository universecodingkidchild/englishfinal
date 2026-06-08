const order = ['intro', 'gather', 'build', 'share', 'sources'];
const labels = { intro: 'Intro', gather: 'Gather', build: 'Build', share: 'Share', sources: 'Sources' };
const views = [...document.querySelectorAll('.view')];
const links = [...document.querySelectorAll('nav a')];
const progress = document.getElementById('progress');
const deckNum = document.getElementById('deckNum');
const deckLabel = document.getElementById('deckLabel');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const deckTotal = document.getElementById('deckTotal');
if (deckTotal) deckTotal.textContent = String(order.length).padStart(2, '0');

// reveal elements as they enter the viewport
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

let current = 0;

function show(id) {
  const idx = order.indexOf(id);
  current = idx < 0 ? 0 : idx;
  const targetId = order[current];

  views.forEach(v => v.classList.toggle('on', v.id === targetId));
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + targetId));

  // deck readout
  deckNum.textContent = String(current + 1).padStart(2, '0');
  deckLabel.textContent = labels[targetId];
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === order.length - 1;

  window.scrollTo({ top: 0, behavior: 'instant' });

  // re-arm reveals so each slide animates on entry
  const target = views[current];
  target.querySelectorAll('.r, .reveal-lines').forEach(el => { el.classList.remove('in'); io.observe(el); });
}

function route() { show((location.hash || '#intro').slice(1)); }
function go(delta) {
  const next = Math.min(Math.max(current + delta, 0), order.length - 1);
  if (next !== current) location.hash = '#' + order[next];
}

function tick() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
}

prevBtn.addEventListener('click', () => go(-1));
nextBtn.addEventListener('click', () => go(1));
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') go(1);
  else if (e.key === 'ArrowLeft') go(-1);
});
window.addEventListener('hashchange', route);
window.addEventListener('scroll', tick, { passive: true });
route();
tick();