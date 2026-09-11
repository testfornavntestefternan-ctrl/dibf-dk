import type { Locale } from './paths';

export type CmsRole = 'editor';

export type Localized = Record<Locale, string>;

export type CmsNews = {
  id: string;
  date: string;
  title: Localized;
  body: Localized;
};

export type CmsImage = {
  id: string;
  src: string;
  alt: Localized;
};

export type CmsData = {
  news: CmsNews[];
  images: CmsImage[];
  texts: Partial<Record<Locale, Record<string, string>>>;
};

export type CmsSession = {
  username: string;
  role: CmsRole;
};

export const CMS_STORAGE_KEY = 'dibs-cms-v1';
export const CMS_SESSION_KEY = 'dibs-cms-session';

export const emptyLocalized = (): Localized => ({ da: '', en: '' });

export const emptyCms = (): CmsData => ({
  news: [],
  images: [],
  texts: { da: {}, en: {} },
});

/** Default admin account — username Admin, password Asmaaallah99 */
export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD_HASH =
  '103bcfac5c55a012b7bb0dbec08af9275ea9c41414de214627dac6baa53e17d1';

export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  if (username.trim().toLowerCase() !== ADMIN_USERNAME) return false;
  const hash = await sha256Hex(password);
  return hash === ADMIN_PASSWORD_HASH;
}
