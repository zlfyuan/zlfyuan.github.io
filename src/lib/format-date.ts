/**
 * Format a date in a locale-aware way.
 */
import type { Locale } from '~/i18n';

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(locale: Locale, opts: Intl.DateTimeFormatOptions) {
  const key = locale + JSON.stringify(opts);
  let fmt = formatterCache.get(key);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, opts);
    formatterCache.set(key, fmt);
  }
  return fmt;
}

export function formatDate(date: Date | string, locale: Locale = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return getFormatter(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}

export function formatDateShort(date: Date | string, locale: Locale = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return getFormatter(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

export function formatYearMonth(date: Date | string, locale: Locale = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return getFormatter(locale, { year: 'numeric', month: 'long' }).format(d);
}

/**
 * Word count for Chinese-aware text.
 * - Counts CJK characters individually.
 * - Counts consecutive ASCII chunks as 1 word each.
 */
export function countWords(text: string): number {
  if (!text) return 0;
  const cjk = (text.match(/[一-鿿㐀-䶿]/g) || []).length;
  const stripped = text
    .replace(/[一-鿿㐀-䶿]+/g, ' ')
    .trim();
  const ascii = stripped ? stripped.split(/\s+/).length : 0;
  return cjk + ascii;
}

/**
 * Estimated reading time in minutes (Chinese: ~300 chars/min, English: ~200 wpm).
 */
export function readingTime(text: string, locale: Locale = 'zh-CN'): number {
  const words = countWords(text);
  const wpm = locale === 'zh-CN' ? 300 : 200;
  return Math.max(1, Math.round(words / wpm));
}
