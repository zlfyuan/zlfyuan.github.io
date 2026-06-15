/**
 * i18n helper — UI string lookup + locale detection
 *
 * @example
 *   const locale = getLocaleFromUrl(Astro.url);
 *   const t = ui(locale);
 *   <h1>{t('nav.home')}</h1>
 */
import zhCN from './ui.zh-CN.json';
import en from './ui.en.json';

export const LOCALES = ['zh-CN', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'zh-CN';

const dictionaries: Record<Locale, Record<string, string>> = {
  'zh-CN': zhCN,
  en,
};

export const localeLabels: Record<Locale, string> = {
  'zh-CN': '简体中文',
  en: 'English',
};

/**
 * Build a translator bound to a locale.
 * Falls back to zh-CN if a key is missing in the active dictionary.
 */
export function ui(locale: Locale) {
  const dict = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
  const fallback = dictionaries[DEFAULT_LOCALE];
  return (key: string): string => dict[key] ?? fallback[key] ?? key;
}

/**
 * Detect the locale from a URL/path by reading its first segment.
 *
 * - `/zh-CN/blog/...`  → 'zh-CN'
 * - `/en/blog/...`     → 'en'
 * - `/`, `/404`, ...   → DEFAULT_LOCALE
 *
 * Manual parsing is more predictable than `getLocaleByPath` for our static
 * site (which throws on locale-less paths).
 */
export function getLocaleFromUrl(url: URL | string): Locale {
  const path = typeof url === 'string' ? url : url.pathname;
  const segments = path.split('/').filter(Boolean);
  const first = segments[0];
  return (LOCALES as readonly string[]).includes(first) ? (first as Locale) : DEFAULT_LOCALE;
}

/**
 * Build a localized path for a route. Pass the route without a locale prefix.
 * Always produces a trailing slash (matches site `trailingSlash: 'always'`).
 *
 * @example
 *   localizedPath('/blog/', 'en')  // '/en/blog/'
 *   localizedPath('/', 'zh-CN')    // '/zh-CN/'
 *   localizedPath('', 'zh-CN')     // '/zh-CN/'
 */
export function localizedPath(path: string, locale: Locale): string {
  let clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === '/') return `/${locale}/`;
  if (!clean.endsWith('/')) clean = `${clean}/`;
  return `/${locale}${clean}`;
}

/**
 * Get the other locale (used by language switcher).
 */
export function otherLocale(locale: Locale): Locale {
  return locale === 'zh-CN' ? 'en' : 'zh-CN';
}

/**
 * Compute a path that, when navigated to from the current page, lands on the
 * same logical route under the target locale.
 */
export function switchLocalePath(currentPath: string, target: Locale): string {
  // strip current locale prefix
  const stripped = currentPath.replace(/^\/(zh-CN|en)(?=\/|$)/, '') || '/';
  return localizedPath(stripped, target);
}
