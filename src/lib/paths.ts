export type Locale = 'da' | 'en';

export const locales: Locale[] = ['da', 'en'];

/** Prefix a site path with Astro's base so GitHub Pages (`/dibf-dk/`) and localhost both work. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  if (!path || path === '/') return base;

  const hashIndex = path.indexOf('#');
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : '';
  let pathname = (hashIndex >= 0 ? path.slice(0, hashIndex) : path).replace(/^\/+/, '');
  if (!pathname) return `${base}${hash}`;

  const isFile = /\.[a-z0-9]+$/i.test(pathname);
  if (!isFile && !pathname.endsWith('/')) pathname += '/';
  return `${base}${pathname}${hash}`;
}

/** Add language prefix (except Danish) and the site base. */
export function localizePath(path: string, locale: Locale = 'da'): string {
  const hashIndex = path.indexOf('#');
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : '';
  let pathname = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  if (locale !== 'da') {
    pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  }
  return withBase(pathname + hash);
}
