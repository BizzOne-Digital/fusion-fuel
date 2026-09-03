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
  price: 10,
  heroImage: {
    url: '/images/mega-tea-kits/hero.jpg',
    alt: 'Mega Tea Kit with colorful flavor pouches and an iced loaded tea',
  },
  includes: [
    'Lift Off',
    'Aloe Vera',
    'NRG or Tea',
    'Collagen',
    'Flavor Enhancer',
  ] as const,
  flavorPickerLimit: 1,
  optionalAddOns: [
    { slug: 'mtk-lift-off', name: 'Lift Off', price: 10 },
    { slug: 'mtk-aloe-vera', name: 'Aloe Vera', price: 10 },
    { slug: 'mtk-nrg-or-tea', name: 'NRG or Tea', price: 10 },
    { slug: 'mtk-collagen', name: 'Collagen', price: 10 },
    { slug: 'mtk-flavor-enhancer', name: 'Flavor Enhancer', price: 10 },
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

export function megaTeaKitDescriptionHtml(collectionName?: string): string {
  const includesList = MEGA_TEA_KITS_MENU.includes
    .map((item) => `<li>${item}</li>`)
    .join('');
  const title = collectionName
    ? megaTeaKitProductName(collectionName)
    : 'Mega Tea Kit';

  return [
    `<p><strong>${title}</strong> — ${MEGA_TEA_KITS_MENU.headline}.</p>`,
    `<p>${MEGA_TEA_KITS_MENU.description}</p>`,
    `<p><strong>Price:</strong> ${formatUsd(MEGA_TEA_KITS_MENU.price)}</p>`,
    `<p><strong>Each kit includes:</strong></p>`,
    `<ul>${includesList}</ul>`,
    `<p>Choose your flavor enhancer on this page — the preview image updates when you select a flavor.</p>`,
  ].join('');
}

export function megaTeaKitFlavorNote(flavorName: string): string {
  return `Flavor: ${flavorName}`;
}

export function megaTeaKitShortDescription(collectionName?: string): string {
  const label = collectionName ? megaTeaKitProductName(collectionName) : 'Mega Tea Kit';
  return `${label}. ${MEGA_TEA_KITS_MENU.description} Includes ${megaTeaKitIncludesSummary()}. ${formatUsd(MEGA_TEA_KITS_MENU.price)}.`;
}
