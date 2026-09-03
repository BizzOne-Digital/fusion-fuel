import type { LocalizedRichText, LocalizedString, Locale } from '@/types';
import { DEFAULT_CURRENCY } from '@/lib/constants';

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getLocalized(
  value: LocalizedString | LocalizedRichText | undefined,
  locale: Locale,
  fallback = ''
): string {
  if (!value) return fallback;
  return value[locale] || value.en || fallback;
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

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Convert Mongoose lean documents (ObjectId, Date, etc.) to plain JSON for Client Components. */
export function serializeForClient<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
