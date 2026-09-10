import { SITE_IMAGES } from './site-images';

export const LIFESTYLE_IMAGES = [
  { url: SITE_IMAGES.megaTea, alt: 'Loaded Tea drinks' },
  { url: SITE_IMAGES.acaiBowl, alt: 'Açaí bowl' },
  { url: SITE_IMAGES.proteinCoffee, alt: 'Protein coffee' },
  { url: SITE_IMAGES.catering, alt: 'Catering spread' },
  { url: SITE_IMAGES.waffle, alt: 'Waffles' },
] as const;

export const BRAND_POSTERS = [
  {
    url: SITE_IMAGES.introPoster,
    alt: 'Fusion Fuel & Boost Co. brand poster',
    title: 'Fusion Fuel',
    href: '/about',
  },
  {
    url: SITE_IMAGES.monthlyTeaClubPoster,
    alt: 'Monthly Mega Tea Club poster',
    title: 'Monthly Tea Club',
    href: '/menu?category=monthly-tea-club',
  },
  {
    url: SITE_IMAGES.loadedTeasMenu,
    alt: 'Loaded teas menu poster',
    title: 'Loaded Teas',
    href: '/menu?category=make-your-own-loaded-tea',
  },
  {
    url: SITE_IMAGES.proteinCoffeeMenu,
    alt: 'Protein coffee menu poster',
    title: 'Protein Coffee',
    href: '/menu?category=protein-coffee',
  },
  {
    url: SITE_IMAGES.proteinShake,
    alt: 'Protein shakes menu poster',
    title: 'Protein Shakes',
    href: '/menu?category=protein-shakes',
  },
] as const;
