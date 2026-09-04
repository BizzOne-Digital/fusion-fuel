/** Make Your Own Loaded Tea — browse flavor collections and order. */

import { LOADED_TEA_PRODUCT_SLUG } from '@/lib/loaded-teas-menu';

export const MAKE_YOUR_OWN_LOADED_TEA_MENU = {
  slug: 'make-your-own-loaded-tea',
  headline: 'Make Your Own Loaded Tea',
  description:
    'Browse 100+ loaded tea flavors across our collections, then build your drink with your choice of size and add-ons.',
  image: {
    url: '/images/loaded-teas/hero.jpg',
    alt: 'Colorful layered Fusion Fuel loaded tea with ice',
  },
  orderHref: `/products/${LOADED_TEA_PRODUCT_SLUG}`,
} as const;
