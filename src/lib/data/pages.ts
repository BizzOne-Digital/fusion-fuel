import connectDB from '@/lib/mongodb';
import Page from '@/models/Page';
import type { IPage } from '@/models/Page';
import type { Locale } from '@/types';
import { SITE_IMAGES } from '@/lib/site-images';

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
        en: 'Mega Teas, açaí bowls, protein coffee, and customizable Mega Tea Kits — made to order.',
        es: 'Mega Teas, bowls de açaí, café proteico y Mega Tea Kits personalizables — hechos al momento.',
      },
      backgroundImage: {
        url: SITE_IMAGES.hero,
        alt: locale === 'es' ? 'Bebidas Mega Tea' : 'Mega Tea drinks',
      },
      cta: {
        label: { en: 'Shop Mega Tea Kits', es: 'Comprar Mega Tea Kits' },
        href: '/products',
        variant: 'primary' as const,
      },
    },
    sections: HOME_FALLBACK_SECTIONS,
    seo: {
      title: 'Fusion Fuel & Boost Co. | Premium Fuel for Body and Mind',
      description:
        'Explore Mega Teas, protein coffee, açaí bowls, and customizable Mega Tea Kits. Catering available for corporate, medical, school, and event clients.',
    },
  };
}
