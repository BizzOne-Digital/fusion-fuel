import connectDB from '@/lib/mongodb';
import Page from '@/models/Page';
import type { IPage } from '@/models/Page';
import type { Locale } from '@/types';
import { SITE_IMAGES } from '@/lib/site-images';
import { CATERING_TAGLINE, DELIVERY, MONTHLY_TEA_CLUB } from '@/lib/brand-content';

const HOME_FALLBACK_SECTIONS = [
  { key: 'hero', type: 'custom' as const, order: 0, visible: true },
  { key: 'mega-tea', type: 'image_text' as const, order: 1, visible: true },
  { key: 'categories', type: 'features' as const, order: 2, visible: true },
  { key: 'flavors', type: 'custom' as const, order: 3, visible: true },
  { key: 'acai', type: 'image_text' as const, order: 4, visible: true },
  { key: 'protein', type: 'image_text' as const, order: 5, visible: true },
  { key: 'treats', type: 'gallery' as const, order: 6, visible: true },
  { key: 'kit-club', type: 'cta' as const, order: 7, visible: true },
  { key: 'kit-sizes', type: 'features' as const, order: 8, visible: true },
  { key: 'add-ins', type: 'features' as const, order: 9, visible: true },
  { key: 'catering', type: 'cta' as const, order: 10, visible: true },
  { key: 'how-it-works', type: 'features' as const, order: 11, visible: true },
  { key: 'special-offer', type: 'text' as const, order: 12, visible: true },
  { key: 'featured-products', type: 'gallery' as const, order: 13, visible: true },
  { key: 'lifestyle', type: 'gallery' as const, order: 14, visible: true },
  { key: 'testimonials', type: 'text' as const, order: 15, visible: true },
  { key: 'instagram', type: 'cta' as const, order: 16, visible: true },
  { key: 'final-cta', type: 'cta' as const, order: 17, visible: true },
];

export async function getPageByKey(pageKey: string): Promise<IPage | null> {
  try {
    await connectDB();
    return Page.findOne({ pageKey, status: 'published' }).lean<IPage>();
  } catch {
    return null;
  }
}

export async function getPublishedPages(): Promise<IPage[]> {
  try {
    await connectDB();
    return Page.find({ status: 'published' }).sort({ pageKey: 1 }).lean<IPage[]>();
  } catch {
    return [];
  }
}

export function getHomeFallback(locale: Locale) {
  return {
    pageKey: 'home',
    title: {
      en: 'Fusion Fuel & Boost Co.',
      es: 'Fusion Fuel & Boost Co.',
    },
    hero: {
      title: {
        en: 'FUEL YOUR DAY. BOOST YOUR LIFE.',
        es: 'IMPULSA TU DÍA. POTENCIA TU VIDA.',
      },
      subtitle: {
        en: `${MONTHLY_TEA_CLUB.taglines.primary} Loaded Teas, Monthly Tea Club kits, and catering — ${MONTHLY_TEA_CLUB.taglines.secondary}`,
        es: `${MONTHLY_TEA_CLUB.taglines.primary} Loaded Teas, kits del Monthly Tea Club y catering — ${MONTHLY_TEA_CLUB.taglines.secondary}`,
      },
      backgroundImage: {
        url: SITE_IMAGES.hero,
        alt: locale === 'es' ? 'Bebidas Loaded Tea' : 'Loaded Tea drinks',
      },
      cta: {
        label: { en: MONTHLY_TEA_CLUB.cta, es: MONTHLY_TEA_CLUB.cta },
        href: '/products/mega-tea-kit-builder',
        variant: 'primary' as const,
      },
    },
    sections: HOME_FALLBACK_SECTIONS,
    seo: {
      title: 'Fusion Fuel & Boost Co. | Premium Fuel for Body and Mind',
      description:
        `${MONTHLY_TEA_CLUB.name}, Loaded Teas, and loaded tea kits. ${CATERING_TAGLINE} ${DELIVERY.local}`,
    },
  };
}
