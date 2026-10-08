import type { FooterSettings, LegalLink, LocalizedString } from '@/types';
import { mergeLocalizedString, normalizeAppHref } from '@/lib/utils';

/** Canonical footer columns — paths must NOT include locale prefix (/en, /es). */
export const DEFAULT_FOOTER_COLUMNS: FooterSettings['columns'] = [
  {
    title: { en: 'Shop', es: 'Tienda' },
    links: [
      { label: { en: 'Menu', es: 'Menú' }, href: '/menu' },
      { label: { en: 'Mega Tea Kits', es: 'Kits Mega Tea' }, href: '/menu?category=mega-tea-kits' },
      { label: { en: 'Monthly Tea Club', es: 'Club Mensual de Té' }, href: '/menu?category=monthly-tea-club' },
      { label: { en: 'Pricing', es: 'Precios' }, href: '/pricing' },
    ],
  },
  {
    title: { en: 'Company', es: 'Empresa' },
    links: [
      { label: { en: 'About', es: 'Nosotros' }, href: '/about' },
      { label: { en: 'Services', es: 'Servicios' }, href: '/services' },
      { label: { en: 'Testimonials', es: 'Testimonios' }, href: '/testimonials' },
      { label: { en: 'Contact', es: 'Contacto' }, href: '/contact' },
      { label: { en: 'FAQs', es: 'Preguntas' }, href: '/faqs' },
    ],
  },
  {
    title: { en: 'Catering', es: 'Catering' },
    links: [
      { label: { en: 'Book Catering', es: 'Reservar catering' }, href: '/booking' },
      { label: { en: 'Açaí Bowl Events', es: 'Eventos de Açaí' }, href: '/booking' },
      { label: { en: 'My Account', es: 'Mi cuenta' }, href: '/account' },
    ],
  },
];

const LEGACY_PATH_MAP: Record<string, string> = {
  '/products': '/menu',
  '/gallery': '/menu',
  '/catering': '/booking',
};

const REMOVED_PATHS = new Set(['/privacy', '/terms', '/privacy-policy', '/terms-of-service']);

/** Normalize internal hrefs for next-intl Link (no locale prefix, fix legacy routes). */
export function sanitizeFooterHref(href: string): string {
  if (!href) return '/';

  const path = normalizeAppHref(href.trim());
  const [pathname, search] = path.split('?');
  const mapped = LEGACY_PATH_MAP[pathname] ?? pathname;
  return search ? `${mapped}?${search}` : mapped;
}

export type AppLinkTarget = string | { pathname: string; query?: Record<string, string> };

/** Parse href for next-intl Link (supports query strings). */
export function parseAppLinkHref(href: string): AppLinkTarget {
  const sanitized = sanitizeFooterHref(href);

  if (
    sanitized.startsWith('http://') ||
    sanitized.startsWith('https://') ||
    sanitized.startsWith('mailto:') ||
    sanitized.startsWith('tel:')
  ) {
    return sanitized;
  }

  const [pathname, search] = sanitized.split('?');
  if (!search) return pathname || '/';

  const query = Object.fromEntries(new URLSearchParams(search));
  return { pathname: pathname || '/', query };
}

function findDefaultFooterLink(href: string) {
  const normalized = sanitizeFooterHref(href);
  for (const column of DEFAULT_FOOTER_COLUMNS ?? []) {
    const match = column.links.find((link) => sanitizeFooterHref(link.href) === normalized);
    if (match) return match;
  }
  return undefined;
}

function findDefaultFooterColumn(
  title: LocalizedString,
  links: NonNullable<FooterSettings['columns']>[number]['links']
) {
  const en = title.en?.trim()?.toLowerCase();
  const byTitle = (DEFAULT_FOOTER_COLUMNS ?? []).find(
    (column) => column.title.en?.trim()?.toLowerCase() === en
  );
  if (byTitle) return byTitle;

  const firstHref = links[0]?.href;
  if (!firstHref) return undefined;
  const normalized = sanitizeFooterHref(firstHref);
  return (DEFAULT_FOOTER_COLUMNS ?? []).find((column) =>
    column.links.some((link) => sanitizeFooterHref(link.href) === normalized)
  );
}

function mergeFooterColumnsWithDefaults(
  columns: NonNullable<FooterSettings['columns']>
): NonNullable<FooterSettings['columns']> {
  return columns.map((column, index) => {
    const defaultColumn =
      findDefaultFooterColumn(column.title, column.links) ?? DEFAULT_FOOTER_COLUMNS?.[index];
    return {
      ...column,
      title: mergeLocalizedString(column.title, defaultColumn?.title ?? column.title),
      links: column.links.map((link) => {
        const defaultLink = findDefaultFooterLink(link.href);
        return {
          ...link,
          label: mergeLocalizedString(link.label, defaultLink?.label ?? link.label),
        };
      }),
    };
  });
}

function sanitizeFooterColumns(columns: FooterSettings['columns']): NonNullable<FooterSettings['columns']> {
  const sanitized = (columns ?? [])
    .map((column) => ({
      ...column,
      links: (column.links ?? [])
        .map((link) => ({
          ...link,
          href: sanitizeFooterHref(link.href),
        }))
        .filter((link) => {
          const pathname = link.href.split('?')[0];
          return !REMOVED_PATHS.has(pathname);
        }),
    }))
    .filter((column) => column.links.length > 0);

  if (sanitized.length === 0) return sanitized;
  return mergeFooterColumnsWithDefaults(sanitized);
}

function sanitizeLegalLinks(links: LegalLink[]): LegalLink[] {
  return (links ?? [])
    .map((link) => ({ ...link, href: sanitizeFooterHref(link.href) }))
    .filter((link) => {
      const pathname = link.href.split('?')[0];
      return !REMOVED_PATHS.has(pathname);
    });
}

export function resolveFooterColumns(columns?: FooterSettings['columns']): NonNullable<FooterSettings['columns']> {
  const sanitized = sanitizeFooterColumns(columns);
  if (sanitized && sanitized.length > 0) return sanitized;
  return DEFAULT_FOOTER_COLUMNS ?? [];
}

export function sanitizeSiteSettingsLinks<T extends { footer?: FooterSettings; legalLinks?: LegalLink[]; announcement?: { link?: string } }>(
  settings: T
): T {
  return {
    ...settings,
    footer: settings.footer
      ? {
          ...settings.footer,
          columns: resolveFooterColumns(settings.footer.columns),
        }
      : { columns: DEFAULT_FOOTER_COLUMNS },
    legalLinks: sanitizeLegalLinks(settings.legalLinks ?? []),
    announcement: settings.announcement?.link
      ? {
          ...settings.announcement,
          link: sanitizeFooterHref(settings.announcement.link),
        }
      : settings.announcement,
  };
}
