import { messages } from './messages';
import type { Locale } from '../lib/paths';

export type { Locale } from '../lib/paths';
export { locales, localizePath, withBase } from '../lib/paths';

export function t(locale: Locale, key: string): string {
  return messages[locale][key] ?? messages.da[key] ?? key;
}

export function dir(_locale: Locale): 'ltr' | 'rtl' {
  return 'ltr';
}
