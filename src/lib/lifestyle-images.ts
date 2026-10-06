import { SITE_IMAGES } from './site-images';
import { BULK_PRODUCTS_MENU } from './bulk-products-menu';
import { LOADED_TEA_PRODUCT_SLUG } from './loaded-teas-menu';

export const LIFESTYLE_IMAGES = [
  { url: SITE_IMAGES.megaTea, alt: 'Loaded Tea drinks' },
  { url: SITE_IMAGES.acaiBowl, alt: 'Açaí bowl' },
  { url: SITE_IMAGES.proteinCoffee, alt: 'Protein coffee' },
  { url: SITE_IMAGES.catering, alt: 'Catering spread' },
  { url: SITE_IMAGES.waffle, alt: 'Waffles' },
] as const;

export const BRAND_POSTERS = [
  {
    url: '/images/menu-highlights/loaded-teas.png',
    alt: 'Colorful layered Fusion Fuel loaded tea with ice',
    title: 'Loaded Teas',
    titleEs: 'Loaded Teas',
    href: `/products/${LOADED_TEA_PRODUCT_SLUG}`,
  },
  {
    url: SITE_IMAGES.monthlyTeaClubPoster,
    alt: 'Monthly Mega Tea Club poster',
    title: 'Monthly Tea Club',
    titleEs: 'Club de Té Mensual',
    href: '/menu?category=monthly-tea-club',
  },
  {
    url: '/images/menu-highlights/mega-tea-kits.jpg',
    alt: 'Mega Tea Kit with colorful flavor pouches and an iced loaded tea',
    title: 'Mega Tea Kits',
    titleEs: 'Mega Tea Kits',
    href: '/menu?category=mega-tea-kits',
  },
  {
    url: '/images/menu-highlights/bulk-wellness-product.png',
    alt: 'Herbalife bulk wellness product kits',
    title: 'Bulk Wellness Product',
    titleEs: 'Producto de Bienestar al por Mayor',
    href: BULK_PRODUCTS_MENU.shopUrl,
    external: true,
  },
] as const;
