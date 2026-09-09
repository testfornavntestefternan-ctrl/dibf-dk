import { applyI18n } from './i18n';

export function initTheme() {
  const root = document.documentElement;
  const stored = localStorage.getItem('dibf-theme');
  const theme = stored ?? 'dark';
  root.dataset.theme = theme;
  syncToggle(theme);
}

function syncToggle(theme: string) {
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    const next = theme === 'dark' ? 'lyst' : 'mørkt';
    btn.setAttribute('aria-pressed', String(theme === 'light'));
    btn.setAttribute('aria-label', `Skift til ${next} tema`);
  });
}

export function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('dibf-theme', next);
  syncToggle(next);
  applyI18n();
  window.dispatchEvent(new CustomEvent('dibf:locale'));
}

export function initNav() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const drawer = document.querySelector<HTMLElement>('[data-drawer]');
  if (!toggle || !drawer) return;
  if (toggle.dataset.ready === '1') return;
  toggle.dataset.ready = '1';

  const setOpen = (open: boolean) => {
    drawer.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setOpen(drawer.dataset.open !== 'true'));
  drawer.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
}

export function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rx = ((0.5 - y) * 8).toFixed(2);
      const ry = ((x - 0.5) * 10).toFixed(2);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

export function initToTop() {
  const btn = document.querySelector<HTMLAnchorElement>('[data-to-top]');
  if (!btn) return;
  const onScroll = () => btn.classList.toggle('is-visible', window.scrollY > 600);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

export function initStars() {
  const canvas = document.querySelector<HTMLCanvasElement>('#starfield');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const stars = Array.from({ length: 90 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.2 + 0.2,
    a: Math.random(),
    s: Math.random() * 0.008 + 0.002,
  }));

  const draw = () => {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      star.a += star.s;
      const alpha = 0.25 + Math.abs(Math.sin(star.a)) * 0.55;
      ctx.beginPath();
      ctx.fillStyle = `rgba(230, 244, 255, ${alpha})`;
      ctx.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  };

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resize();
  window.addEventListener('resize', resize);
  draw();
}

export function initLightbox() {
  if (document.documentElement.dataset.lightbox === '1') return;
  document.documentElement.dataset.lightbox = '1';
  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement | null)?.closest?.('[data-gallery] a');
    if (!link) return;
    const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
    const img = dialog?.querySelector('img');
    if (!dialog || !img) return;
    event.preventDefault();
    img.src = (link as HTMLAnchorElement).href;
    img.alt = link.querySelector('img')?.alt ?? '';
    dialog.showModal();
  });
  document.addEventListener('click', (event) => {
    const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
    if (dialog && event.target === dialog) dialog.close();
  });
}

export function initHashScroll() {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (target) target.scrollIntoView({ block: 'start' });
}

export function boot() {
  initTheme();
  initNav();
  initTilt();
  initToTop();
  initStars();
  initHashScroll();
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.removeEventListener('click', toggleTheme);
    btn.addEventListener('click', toggleTheme);
  });
}
