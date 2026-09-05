/** Mega Tea Kits — one kit product per flavor collection. */

import { FLAVOR_COLLECTIONS, MENU_FLAVORS, type FlavorCollectionSlug } from '@/lib/menu-flavors';

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

/** @deprecated Legacy single-kit slug — archived in seed. */
export const MEGA_TEA_KIT_PRODUCT_SLUG = 'mega-tea-kit-builder';

export const MEGA_TEA_KITS_MENU = {
  headline: 'Mega Tea Kits',
  description: 'Make loaded teas at home with premium boosters and your choice of flavor enhancer.',
  price: 12,
  heroImage: {
    url: '/images/mega-tea-kits/hero.jpg',
    alt: 'Mega Tea Kit with colorful flavor pouches and an iced loaded tea',
  },
  factsImage: {
    url: '/images/mega-tea-kits/facts.jpg',
    alt: 'Mega Tea Kit facts — individually packaged kits with herbal tea, LiftOff, collagen, aloe, and beverage enhancer',
  },
  kitProducts: [
    'Herbal Tea Concentrate',
    'LiftOff',
    'Collagen',
    'Aloe',
    'Beverage Enhancer',
  ] as const,
  convenienceNote:
    'Mega Tea Kits are individually packaged for consumer convenience — everything you need to make loaded tea at home.',
  includes: [
    'Probiotics',
    'Collagen',
    'Lift Off',
    'NRG',
    'Tea',
  ] as const,
  flavorPickerLimit: 1,
  optionalAddOns: [
    { slug: 'mtk-probiotics', name: 'Probiotics', price: 2 },
    { slug: 'mtk-collagen', name: 'Collagen', price: 3 },
    { slug: 'mtk-lift-off', name: 'Lift Off', price: 3 },
    { slug: 'mtk-nrg', name: 'NRG', price: 2 },
    { slug: 'mtk-tea', name: 'Tea', price: 2 },
  ] as const,
} as const;

export function megaTeaKitOptionalAddInSlugs(): string[] {
  return MEGA_TEA_KITS_MENU.optionalAddOns.map((addOn) => addOn.slug);
}

export const MEGA_TEA_KIT_COLLECTIONS = FLAVOR_COLLECTIONS.map((collection) => ({
  collectionSlug: collection.slug,
  productSlug: `mega-tea-kit-${collection.slug}`,
  name: collection.name,
  description: collection.description,
}));

export function megaTeaKitCollectionFlavorNames(collectionSlug: FlavorCollectionSlug): string[] {
  return MENU_FLAVORS.filter((flavor) => flavor.collection === collectionSlug).map(
    (flavor) => flavor.name
  );
}

export function megaTeaKitCollectionFlavorList(collectionSlug: FlavorCollectionSlug): string {
  return megaTeaKitCollectionFlavorNames(collectionSlug).join(', ');
}

export interface MegaTeaKitMenuFlavor {
  slug: string;
  name: string;
  color: string;
  isNew: boolean;
}

export function megaTeaKitCollectionMenuFlavors(
  collectionSlug: FlavorCollectionSlug
): MegaTeaKitMenuFlavor[] {
  return MENU_FLAVORS.filter((flavor) => flavor.collection === collectionSlug).map((flavor) => ({
    slug: flavor.slug,
    name: flavor.name,
    color: flavor.color,
    isNew: flavor.isNew,
  }));
}

export function megaTeaKitProductSlug(collectionSlug: string): string {
  return `mega-tea-kit-${collectionSlug}`;
}

export function isMegaTeaKitProduct(slug: string): boolean {
  return slug.startsWith('mega-tea-kit-') && slug !== MEGA_TEA_KIT_PRODUCT_SLUG;
}

export function megaTeaKitCollectionFromProduct(slug: string): FlavorCollectionSlug | null {
  if (!isMegaTeaKitProduct(slug)) return null;
  return slug.replace('mega-tea-kit-', '') as FlavorCollectionSlug;
}

export function megaTeaKitProductName(collectionName: string): string {
  return `Mega Tea Kit — ${collectionName}`;
}

export function megaTeaKitPriceCents(): number {
  return Math.round(MEGA_TEA_KITS_MENU.price * 100);
}

export function megaTeaKitPricingSummary(): string {
  return `${formatUsd(MEGA_TEA_KITS_MENU.price)} each`;
}

export function megaTeaKitIncludesSummary(): string {
  return MEGA_TEA_KITS_MENU.includes.join(', ');
}

export function megaTeaKitDescriptionHtml(_collectionName?: string): string {
  return '';
}

export function megaTeaKitFlavorNote(flavorName: string): string {
  return `Flavor: ${flavorName}`;
}

export function megaTeaKitShortDescription(collectionName?: string): string {
  const label = collectionName ? megaTeaKitProductName(collectionName) : 'Mega Tea Kit';
  return `${label}. ${megaTeaKitPricingSummary()}.`;
}
