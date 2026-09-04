/** Menu page — product and cup size reference for ordering. */

export const MENU_PRODUCT_SIZE_OPTIONS = [
  { slug: 'loaded-teas', name: 'Loaded Teas', menuHref: '/menu?category=mega-teas' },
  { slug: 'protein-coffees', name: 'Protein Coffees', menuHref: '/menu?category=protein-coffee' },
  { slug: 'mega-teas', name: 'Mega Teas', menuHref: '/menu?category=mega-tea-kits' },
] as const;

export const MENU_CUP_SIZE_OPTIONS = [
  { slug: '5oz', name: '5 oz' },
  { slug: '9oz', name: '9 oz' },
  { slug: '12oz', name: '12 oz' },
] as const;

export type MenuProductSizeSlug = (typeof MENU_PRODUCT_SIZE_OPTIONS)[number]['slug'];
export type MenuCupSizeSlug = (typeof MENU_CUP_SIZE_OPTIONS)[number]['slug'];

export function menuProductSizeOption(slug: string) {
  return MENU_PRODUCT_SIZE_OPTIONS.find((option) => option.slug === slug);
}

export function menuCupSizeOption(slug: string) {
  return MENU_CUP_SIZE_OPTIONS.find((option) => option.slug === slug);
}
