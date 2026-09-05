import type { Metadata } from 'next';
import { BRAND, SUPPORTED_LOCALES } from '@/lib/constants';
import { SITE_IMAGES } from '@/lib/site-images';
import { getPageByKey, getHomeFallback } from '@/lib/data/pages';
import type { Locale } from '@/types';

export const DEFAULT_SEO_KEYWORDS = [
  'fusion fuel boost',
  'loaded teas',
  'monthly mega tea club',
  'mega tea kits',
  'protein shakes',
  'protein coffee',
  'acai bowls',
  'catering',
  'tampa bay',
  'florida',
] as const;

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return url.replace(/\/$/, '');
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

export function localePath(locale: Locale, path = ''): string {
  if (!path || path === '/') return `/${locale}`;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${suffix}`;
}

export function buildMetadata(options: {
  title: string;
  description: string;
  locale: Locale;
  path: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const canonical = absoluteUrl(localePath(options.locale, options.path));
  const imagePath = options.image ?? SITE_IMAGES.heroDrinks;
  const imageUrl = imagePath.startsWith('http') ? imagePath : absoluteUrl(imagePath);

  const languages: Record<string, string> = {};
  for (const loc of SUPPORTED_LOCALES) {
    languages[loc] = absoluteUrl(localePath(loc, options.path));
  }

  return {
    title: options.title,
    description: options.description,
    keywords: [...(options.keywords ?? DEFAULT_SEO_KEYWORDS)],
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: 'website',
      locale: options.locale === 'es' ? 'es_US' : 'en_US',
      url: canonical,
      siteName: BRAND.name,
      title: options.title,
      description: options.description,
      images: [{ url: imageUrl, alt: options.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
      images: [imageUrl],
    },
    robots: options.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

const PAGE_FALLBACKS: Record<string, Record<Locale, { title: string; description: string }>> = {
  about: {
    en: {
      title: `About Us | ${BRAND.name}`,
      description:
        'Learn about Fusion Fuel & Boost Co. — loaded teas, protein-forward menu items, mega tea kits, and catering for events across Tampa Bay.',
    },
    es: {
      title: `Sobre nosotros | ${BRAND.name}`,
      description:
        'Conoce Fusion Fuel & Boost Co. — loaded teas, menú con proteína, kits mega tea y catering para eventos en Tampa Bay.',
    },
  },
  services: {
    en: {
      title: `Catering & Services | ${BRAND.name}`,
      description:
        'Corporate catering, weddings, schools, medical offices, and private events. Loaded teas, açaí bowls, and premium fuel for your guests.',
    },
    es: {
      title: `Catering y servicios | ${BRAND.name}`,
      description:
        'Catering corporativo, bodas, escuelas, consultorios médicos y eventos privados con loaded teas y bowls de açaí.',
    },
  },
  pricing: {
    en: {
      title: `Pricing | ${BRAND.name}`,
      description:
        'View menu pricing for loaded teas, mega tea kits, protein shakes, açaí bowls, waffles, and Monthly Mega Tea Club plans.',
    },
    es: {
      title: `Precios | ${BRAND.name}`,
      description:
        'Consulta precios de loaded teas, kits mega tea, batidos de proteína, bowls de açaí, waffles y el Monthly Mega Tea Club.',
    },
  },
  products: {
    en: {
      title: `Shop Products | ${BRAND.name}`,
      description:
        'Browse Fusion Fuel products — loaded teas, mega tea kits, protein coffee, shakes, waffles, and protein treats.',
    },
    es: {
      title: `Productos | ${BRAND.name}`,
      description:
        'Explora productos Fusion Fuel — loaded teas, kits mega tea, café con proteína, batidos, waffles y treats.',
    },
  },
  booking: {
    en: {
      title: `Book Catering | ${BRAND.name}`,
      description:
        'Request a catering quote for your event. Guest counts from 50–150. Loaded teas, açaí bowls, and more for any occasion.',
    },
    es: {
      title: `Reservar catering | ${BRAND.name}`,
      description:
        'Solicita una cotización de catering para tu evento. Loaded teas, bowls de açaí y más para cualquier ocasión.',
    },
  },
  testimonials: {
    en: {
      title: `Testimonials | ${BRAND.name}`,
      description: 'Read what customers and event hosts say about Fusion Fuel & Boost Co. catering and menu favorites.',
    },
    es: {
      title: `Testimonios | ${BRAND.name}`,
      description: 'Lee lo que clientes y anfitriones de eventos dicen sobre Fusion Fuel & Boost Co.',
    },
  },
  faqs: {
    en: {
      title: `FAQs | ${BRAND.name}`,
      description:
        'Frequently asked questions about loaded teas, mega tea kits, Monthly Mega Tea Club, delivery, shipping, and catering.',
    },
    es: {
      title: `Preguntas frecuentes | ${BRAND.name}`,
      description:
        'Preguntas frecuentes sobre loaded teas, kits mega tea, Monthly Mega Tea Club, entrega, envío y catering.',
    },
  },
  contact: {
    en: {
      title: `Contact Us | ${BRAND.name}`,
      description:
        'Contact Fusion Fuel & Boost Co. for catering inquiries, Monthly Mega Tea Club sign-up, orders, and product questions.',
    },
    es: {
      title: `Contacto | ${BRAND.name}`,
      description:
        'Contacta a Fusion Fuel & Boost Co. para catering, suscripción al Monthly Mega Tea Club, pedidos y preguntas.',
    },
  },
  menu: {
    en: {
      title: `Menu | ${BRAND.name}`,
      description:
        'Explore our full menu — loaded teas, mega tea kits, protein shakes, açaí bowls, waffles, Monthly Mega Tea Club, and more.',
    },
    es: {
      title: `Menú | ${BRAND.name}`,
      description:
        'Explora el menú completo — loaded teas, kits mega tea, batidos de proteína, bowls de açaí, waffles y más.',
    },
  },
};

export async function generatePageMetadata(
  pageKey: string,
  locale: Locale,
  path: string
): Promise<Metadata> {
  const page = await getPageByKey(pageKey);
  let title = page?.seo?.title?.trim();
  let description = page?.seo?.description?.trim();

  if (pageKey === 'home') {
    const fallback = getHomeFallback(locale);
    title = title ?? fallback.seo?.title;
    description = description ?? fallback.seo?.description;
  }

  const localizedFallback = PAGE_FALLBACKS[pageKey]?.[locale];
  title = title ?? localizedFallback?.title ?? BRAND.name;
  description =
    description ?? localizedFallback?.description ?? BRAND.tagline[locale];

  return buildMetadata({
    title,
    description,
    locale,
    path,
    image: pageKey === 'home' ? SITE_IMAGES.heroDrinks : undefined,
  });
}

export function noIndexMetadata(locale: Locale, title: string): Metadata {
  return buildMetadata({
    title: `${title} | ${BRAND.name}`,
    description: BRAND.tagline[locale],
    locale,
    path: '',
    noIndex: true,
  });
}
