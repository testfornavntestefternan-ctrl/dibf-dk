import { applyI18n } from './i18n';

const THEME_KEY = 'dibs-appearance';

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
  const color = document.querySelector('meta[name="theme-color"]');
  if (color) color.setAttribute('content', theme === 'dark' ? '#071422' : '#f4ead8');
  syncToggle(theme);
}

export function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  applyTheme(stored === 'dark' ? 'dark' : 'light');
}

function syncToggle(theme: string) {
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(theme === 'dark'));
  });
}

export function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
  applyI18n();
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

export function initToTop() {
  const btn = document.querySelector<HTMLAnchorElement>('[data-to-top]');
  if (!btn) return;
  const onScroll = () => btn.classList.toggle('is-visible', window.scrollY > 600);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

export function initHashScroll() {
  const hash = window.location.hash;
  if (!hash) return;
  document.querySelector(hash)?.scrollIntoView({ block: 'start' });
}

export function initMailForm() {
  document.querySelectorAll<HTMLFormElement>('.contact-form').forEach((form) => {
    if (form.dataset.ready === '1') return;
    form.dataset.ready = '1';
    form.addEventListener('submit', (event) => {
      const inbox = form.querySelector<HTMLSelectElement>('[name="to"]')?.value;
      const name = form.querySelector<HTMLInputElement>('[name="name"]')?.value.trim() ?? '';
      const subject = form.querySelector<HTMLInputElement>('[name="subject"]')?.value.trim() ?? '';
      const body = form.querySelector<HTMLTextAreaElement>('[name="body"]')?.value.trim() ?? '';
      if (!inbox) return;
      event.preventDefault();
      const message = name ? `${body}\n\n— ${name}` : body;
      window.location.href = `mailto:${inbox}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    });
  });
}

export function boot() {
  initTheme();
  initNav();
  initToTop();
  initHashScroll();
  initMailForm();
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    if (btn.dataset.themeReady === '1') return;
    btn.dataset.themeReady = '1';
    btn.addEventListener('click', toggleTheme);
  });
}
