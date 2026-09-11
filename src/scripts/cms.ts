import {
  CMS_SESSION_KEY,
  CMS_STORAGE_KEY,
  emptyCms,
  emptyLocalized,
  verifyAdmin,
  type CmsData,
  type CmsImage,
  type CmsNews,
  type CmsSession,
  type Localized,
} from '../lib/cms';
import { getLocale } from './i18n';
import { messages } from '../i18n/messages';
import type { Locale } from '../lib/paths';

function readStore(): CmsData {
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return emptyCms();
    const parsed = JSON.parse(raw) as CmsData;
    return {
      news: parsed.news ?? [],
      images: parsed.images ?? [],
      texts: parsed.texts ?? { da: {}, en: {} },
    };
  } catch {
    return emptyCms();
  }
}

function writeStore(data: CmsData) {
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
}

export function getSession(): CmsSession | null {
  try {
    const raw = sessionStorage.getItem(CMS_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CmsSession;
  } catch {
    return null;
  }
}

function setSession(session: CmsSession | null) {
  if (!session) sessionStorage.removeItem(CMS_SESSION_KEY);
  else sessionStorage.setItem(CMS_SESSION_KEY, JSON.stringify(session));
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function fillLocalized(value: string, locale: Locale): Localized {
  const all = emptyLocalized();
  all[locale] = value;
  if (!all.da) all.da = value;
  if (!all.en) all.en = value;
  return all;
}

function pick(localized: Localized, locale: Locale) {
  return localized[locale] || localized.da || localized.en || '';
}

export function applyCmsContent() {
  const data = readStore();
  const locale = getLocale();
  const overlay = data.texts[locale] ?? {};
  Object.entries(overlay).forEach(([key, value]) => {
    document.querySelectorAll<HTMLElement>(`[data-i18n="${key}"]`).forEach((el) => {
      if (value) el.textContent = value;
    });
  });

  const newsRoot = document.querySelector('[data-cms-news]');
  if (newsRoot) {
    const empty = newsRoot.querySelector('[data-cms-news-empty]');
    newsRoot.querySelectorAll('[data-cms-news-item]').forEach((n) => n.remove());
    if (empty) {
      if (data.news.length === 0) empty.removeAttribute('hidden');
      else empty.setAttribute('hidden', '');
    }
    data.news
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach((item) => {
        const article = document.createElement('article');
        article.className = 'news-card glass';
        article.setAttribute('data-cms-news-item', '');
        article.innerHTML = `<p class="muted">${item.date}</p><h3></h3><p></p>`;
        article.querySelector('h3')!.textContent = pick(item.title, locale);
        article.querySelectorAll('p')[1].textContent = pick(item.body, locale);
        newsRoot.append(article);
      });
  }

  const gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    gallery.querySelectorAll('[data-cms-image]').forEach((n) => n.remove());
    data.images.forEach((item) => {
      const link = document.createElement('a');
      link.href = item.src;
      link.setAttribute('data-cms-image', '');
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = pick(item.alt, locale);
      img.width = 800;
      img.height = 600;
      img.loading = 'lazy';
      link.append(img);
      gallery.append(link);
    });
  }
}

async function handleLogin(form: HTMLFormElement) {
  const error = form.querySelector('[data-cms-error]');
  const username = (form.querySelector('[name="username"]') as HTMLInputElement).value;
  const password = (form.querySelector('[name="password"]') as HTMLInputElement).value;
  const ok = await verifyAdmin(username, password);
  if (!ok) {
    if (error) error.removeAttribute('hidden');
    return;
  }
  setSession({ username: 'Admin', role: 'editor' });
  const next = form.dataset.next || `${import.meta.env.BASE_URL}admin/`;
  window.location.href = next;
}

function requireSession() {
  const session = getSession();
  const gate = document.querySelector('[data-cms-gate]');
  const dash = document.querySelector('[data-cms-dash]');
  if (!gate && !dash) return session;
  if (!session) {
    if (dash) dash.setAttribute('hidden', '');
    if (gate) gate.removeAttribute('hidden');
    return null;
  }
  if (gate) gate.setAttribute('hidden', '');
  if (dash) dash.removeAttribute('hidden');
  return session;
}

function renderDash() {
  const session = requireSession();
  if (!session) return;
  const data = readStore();
  const locale = getLocale();

  const newsList = document.querySelector('[data-cms-news-list]');
  if (newsList) {
    newsList.innerHTML = '';
    data.news.forEach((item) => {
      const row = document.createElement('article');
      row.className = 'cms-row glass';
      row.innerHTML = `<div><strong></strong><p class="muted"></p></div><button class="btn btn--ghost" type="button" data-delete-news></button>`;
      row.querySelector('strong')!.textContent = pick(item.title, locale) || item.title.da;
      row.querySelector('p')!.textContent = item.date;
      const del = row.querySelector('button')!;
      del.dataset.i18n = 'cms.delete';
      del.textContent = messages[locale]['cms.delete'] ?? 'Slet';
      del.addEventListener('click', () => {
        const current = readStore();
        writeStore({ ...current, news: current.news.filter((n) => n.id !== item.id) });
        renderDash();
        applyCmsContent();
      });
      newsList.append(row);
    });
  }

  const imageList = document.querySelector('[data-cms-image-list]');
  if (imageList) {
    imageList.innerHTML = '';
    data.images.forEach((item) => {
      const row = document.createElement('article');
      row.className = 'cms-row glass';
      row.innerHTML = `<img alt="" width="72" height="54" /><div><p></p></div><button class="btn btn--ghost" type="button"></button>`;
      const img = row.querySelector('img')!;
      img.src = item.src;
      img.alt = pick(item.alt, locale);
      row.querySelector('p')!.textContent = pick(item.alt, locale) || item.alt.da;
      const del = row.querySelector('button')!;
      del.dataset.i18n = 'cms.delete';
      del.textContent = messages[locale]['cms.delete'] ?? 'Slet';
      del.addEventListener('click', () => {
        const current = readStore();
        writeStore({ ...current, images: current.images.filter((n) => n.id !== item.id) });
        renderDash();
        applyCmsContent();
      });
      imageList.append(row);
    });
  }

  fillTextForm();
}

function fillTextForm() {
  const textForm = document.querySelector<HTMLFormElement>('[data-cms-text-form]');
  if (!textForm) return;
  const key = (textForm.querySelector('[name="key"]') as HTMLSelectElement | null)?.value;
  const valueEl = textForm.querySelector('[name="value"]') as HTMLTextAreaElement | null;
  if (!key || !valueEl) return;
  valueEl.value = readStore().texts[getLocale()]?.[key] ?? '';
}

function bindDash() {
  const root = document.querySelector('[data-cms-dash]');
  if (!root || root.getAttribute('data-bound') === '1') return;
  root.setAttribute('data-bound', '1');
  const newsForm = document.querySelector<HTMLFormElement>('[data-cms-news-form]');
  newsForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = (newsForm.querySelector('[name="title"]') as HTMLInputElement).value.trim();
    const body = (newsForm.querySelector('[name="body"]') as HTMLTextAreaElement).value.trim();
    if (!title || !body) return;
    const locale = getLocale();
    const data = readStore();
    const item: CmsNews = {
      id: uid(),
      date: new Date().toISOString().slice(0, 10),
      title: fillLocalized(title, locale),
      body: fillLocalized(body, locale),
    };
    writeStore({ ...data, news: [item, ...data.news] });
    newsForm.reset();
    renderDash();
    applyCmsContent();
  });

  const imageForm = document.querySelector<HTMLFormElement>('[data-cms-image-form]');
  imageForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const file = (imageForm.querySelector('[name="image"]') as HTMLInputElement).files?.[0];
    const alt = (imageForm.querySelector('[name="alt"]') as HTMLInputElement).value.trim();
    if (!file) return;
    if (file.size > 900_000) {
      alert('Billedet er for stort (max ca. 900 KB).');
      return;
    }
    const src = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    const locale = getLocale();
    const data = readStore();
    const item: CmsImage = {
      id: uid(),
      src,
      alt: fillLocalized(alt || file.name, locale),
    };
    writeStore({ ...data, images: [item, ...data.images] });
    imageForm.reset();
    renderDash();
    applyCmsContent();
  });

  const textForm = document.querySelector<HTMLFormElement>('[data-cms-text-form]');
  textForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const key = (textForm.querySelector('[name="key"]') as HTMLSelectElement).value;
    const value = (textForm.querySelector('[name="value"]') as HTMLTextAreaElement).value;
    const locale = getLocale();
    const data = readStore();
    const texts = { ...data.texts, [locale]: { ...(data.texts[locale] ?? {}), [key]: value } };
    writeStore({ ...data, texts });
    applyCmsContent();
    const saved = textForm.querySelector('[data-cms-saved]');
    if (saved) saved.removeAttribute('hidden');
  });

  textForm?.querySelector('[name="key"]')?.addEventListener('change', fillTextForm);

  document.querySelector('[data-cms-logout]')?.addEventListener('click', () => {
    setSession(null);
    window.location.href = document.querySelector<HTMLAnchorElement>('[data-cms-home]')?.href ?? '/';
  });
}

export function initCms() {
  const login = document.querySelector<HTMLFormElement>('[data-cms-login]');
  if (login && getSession()) {
    window.location.href = login.dataset.next || `${import.meta.env.BASE_URL}admin/`;
    return;
  }
  if (login && login.dataset.ready !== '1') {
    login.dataset.ready = '1';
    login.addEventListener('submit', (event) => {
      event.preventDefault();
      void handleLogin(login);
    });
  }

  if (document.querySelector('[data-cms-dash], [data-cms-gate]')) {
    renderDash();
    bindDash();
  }

      if (document.documentElement.dataset.cmsLocale !== '1') {
    document.documentElement.dataset.cmsLocale = '1';
    window.addEventListener('dibf:locale', () => {
      applyCmsContent();
      if (document.querySelector('[data-cms-dash]:not([hidden])')) renderDash();
      else fillTextForm();
    });
  }

  applyCmsContent();
}
