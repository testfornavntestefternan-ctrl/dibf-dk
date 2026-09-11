import { messages } from '../i18n/messages';
import type { Locale } from '../lib/paths';
import { locales } from '../lib/paths';

const LOCALE_KEY = 'dibs-locale';

export function getLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_KEY) || localStorage.getItem('dibf-locale');
    if (stored === 'en') return 'en';
    if (stored === 'da' || stored === 'ar') return 'da';
  } catch {
    /* ignore */
  }
  return 'da';
}

export function setLocale(locale: Locale) {
  localStorage.setItem(LOCALE_KEY, locale);
  applyI18n(locale);
  window.dispatchEvent(new CustomEvent('dibf:locale'));
}

export function applyI18n(locale: Locale = getLocale()) {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = 'ltr';
  root.dataset.locale = locale;

  const dict = messages[locale];
  const fallback = messages.da;
  const text = (key: string) => dict[key] ?? fallback[key];

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    const value = text(key);
    if (value) el.textContent = value;
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => {
    const key = el.dataset.i18nAria;
    if (!key) return;
    const value = text(key);
    if (value) el.setAttribute('aria-label', value);
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-alt]').forEach((el) => {
    const key = el.dataset.i18nAlt;
    if (!key) return;
    const value = text(key);
    if (value) el.setAttribute('alt', value);
  });
  document.querySelectorAll<HTMLButtonElement>('[data-locale]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.locale === locale));
  });
  const theme = root.dataset.theme === 'dark' ? 'dark' : 'light';
  const themeKey = theme === 'light' ? 'theme.toDark' : 'theme.toLight';
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    const value = text(themeKey);
    if (value) btn.setAttribute('aria-label', value);
  });
}

export function initI18n() {
  applyI18n();
  document.querySelectorAll<HTMLButtonElement>('[data-locale]').forEach((btn) => {
    if (btn.dataset.ready === '1') return;
    btn.dataset.ready = '1';
    btn.addEventListener('click', () => {
      const next = btn.dataset.locale;
      if (next === 'da' || next === 'en') setLocale(next);
    });
  });
}

export { locales };
