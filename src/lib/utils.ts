import type { LocalizedRichText, LocalizedString, Locale } from '@/types';
import { DEFAULT_CURRENCY } from '@/lib/constants';
import { isSpanishContentPlaceholder } from '@/lib/locale-placeholders';

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getLocalized(
  value: LocalizedString | LocalizedRichText | undefined,
  locale: Locale,
  fallback = ''
): string {
  if (!value) return fallback;
  if (locale === 'es') {
    const es = value.es?.trim();
    if (es && !isSpanishContentPlaceholder(es)) return es;
    return value.en?.trim() || fallback;
  }
  return value.en?.trim() || value.es?.trim() || fallback;
}

export function formatPrice(
  amountMinor: number | null | undefined,
  currency = DEFAULT_CURRENCY,
  locale: Locale = 'en'
): string {
  if (amountMinor == null || amountMinor <= 0) {
    return '—';
  }

  return new Intl.NumberFormat(locale === 'es' ? 'es-US' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amountMinor / 100);
}

export function hasPrice(amountMinor: number | null | undefined): boolean {
  return amountMinor != null && amountMinor > 0;
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
}

/** Rich text / HTML from CMS fields → plain text (admin forms and lists). */
export function richTextToPlainText(html: string): string {
  if (!html) return '';

  const withoutTags = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<[^>]+>/g, '');

  return withoutTags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Strip locale prefix from internal paths so next-intl Link does not double-prefix (/en/en/...). */
export function normalizeAppHref(href: string): string {
  if (
    !href ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#')
  ) {
    return href;
  }

  let path = href.startsWith('/') ? href : `/${href}`;
  const localePattern = /^\/(en|es)(?=\/|$)/;

  while (localePattern.test(path)) {
    const match = path.match(/^\/(en|es)(?=\/|$)(.*)$/);
    if (!match) break;
    path = match[2] ? match[2] : '/';
  }

  return path || '/';
}

/** Convert Mongoose lean documents (ObjectId, Date, etc.) to plain JSON for Client Components. */
export function serializeForClient<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
