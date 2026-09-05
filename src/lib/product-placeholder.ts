import type { IProduct } from '@/models/Product';
import { PROTEIN_COFFEE_PRODUCT_SLUG } from '@/lib/protein-coffee-menu';
import { LOADED_TEA_PRODUCT_SLUG } from '@/lib/loaded-teas-menu';
import { PROTEIN_SHAKE_PRODUCT_SLUG } from '@/lib/protein-shakes-menu';

/** Generic stock images — show a styled text card instead. */
export const GENERIC_PRODUCT_IMAGE_URLS = new Set([
  '/images/mega-tea.png',
  '/images/acai-bowl.png',
  '/images/protein-coffee.png',
  '/images/waffle.png',
  '/images/protein-treat.png',
  '/images/mega-tea-kit.png',
  '/images/protein-shake.png',
  '/images/hero-drinks.png',
]);

export const CATEGORY_CARD_STYLES: Record<
  string,
  { gradient: string; label: string; badge: string }
> = {
  'mega-teas': {
    gradient: 'from-lime/30 via-pink/15 to-white',
    label: 'Loaded Tea',
    badge: 'bg-pink text-white',
  },
  'protein-coffee': {
    gradient: 'from-carbon via-carbon/90 to-carbon/75',
    label: 'Protein Coffee',
    badge: 'bg-lime text-ink',
  },
  'protein-shakes': {
    gradient: 'from-lime/25 via-yellow/20 to-white',
    label: 'Protein Shake',
    badge: 'bg-pink text-white',
  },
  'acai-bowls': {
    gradient: 'from-purple-200/80 via-pink-100/60 to-white',
    label: 'Açaí Bowl',
    badge: 'bg-purple-600 text-white',
  },
  waffles: {
    gradient: 'from-amber-100 via-orange-50 to-white',
    label: 'Protein Waffle',
    badge: 'bg-amber-500 text-white',
  },
  'protein-treats': {
    gradient: 'from-pink/20 via-lime/15 to-white',
    label: 'Protein Treats',
    badge: 'bg-pink text-white',
  },
  'donut-of-the-day': {
    gradient: 'from-pink/25 via-rose-100/60 to-white',
    label: 'Donut of the Day',
    badge: 'bg-pink text-white',
  },
  default: {
    gradient: 'from-cream via-white to-cream',
    label: 'Menu Item',
    badge: 'bg-carbon text-white',
  },
};

export function inferProductCategorySlug(productSlug: string): string {
  if (productSlug.startsWith('loaded-tea-')) return 'mega-teas';
  if (productSlug === LOADED_TEA_PRODUCT_SLUG) return 'mega-teas';
  if (productSlug.startsWith('mega-tea-kit-')) return 'mega-tea-kits';
  if (productSlug === PROTEIN_COFFEE_PRODUCT_SLUG || productSlug.startsWith('protein-coffee-')) {
    return 'protein-coffee';
  }
  if (productSlug === PROTEIN_SHAKE_PRODUCT_SLUG || productSlug.startsWith('protein-shake-')) {
    return 'protein-shakes';
  }
  if (productSlug.startsWith('acai-bowl-')) return 'acai-bowls';
  if (productSlug.startsWith('waffle-')) return 'waffles';
  if (productSlug.startsWith('myolt-')) return 'mega-teas';
  if (productSlug.includes('protein-truffles')) return 'protein-treats';
  if (productSlug.includes('protein-mini-donuts')) return 'protein-treats';
  if (productSlug.includes('pie-in-a-cup')) return 'protein-treats';
  if (productSlug.includes('protein') && productSlug.includes('treat')) return 'protein-treats';
  if (productSlug.includes('treat') || productSlug.includes('bite')) return 'protein-treats';
  return 'default';
}

export function productUsesPlaceholderCard(product: IProduct): boolean {
  const url = product.images?.[0]?.url?.trim();
  if (!url) return true;
  return GENERIC_PRODUCT_IMAGE_URLS.has(url) || url.startsWith('/placeholders/');
}

export function getCategoryCardStyle(categorySlug: string) {
  return CATEGORY_CARD_STYLES[categorySlug] ?? CATEGORY_CARD_STYLES.default;
}
