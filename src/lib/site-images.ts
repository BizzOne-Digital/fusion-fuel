/** Local brand photography assets (replace in /public/images/ when client supplies final photos). */
import { FLAVOR_IMAGE_BY_SLUG } from './flavor-image-manifest';

export const SITE_IMAGES = {
  hero: '/images/hero-drinks.png',
  introPoster: '/brand/fusion-fuel-intro-poster.png',
  monthlyTeaClubPoster: '/brand/monthly-mega-tea-club-poster.jpg',
  heroDrinks: '/images/hero-drinks.png',
  megaTea: '/images/mega-tea.png',
  megaTeaKit: '/images/mega-tea-kits/hero.jpg',
  acaiBowl: '/images/acai-bowl.png',
  proteinCoffee: '/images/protein-coffee/iced-lineup.png',
  proteinCoffeeMenu: '/brand/protein-coffee-menu.png',
  loadedTeasMenu: '/brand/loaded-teas-menu.png',
  proteinShake: '/images/protein-shakes/menu-poster.jpg',
  waffle: '/images/waffles/berry-nutella.png',
  donut: '/images/donut-of-the-day.png',
  proteinTreat: '/images/pie-in-a-cup/oreo.png',
  pieInACup: '/images/pie-in-a-cup/oreo.png',
  catering: '/images/catering.png',
  aboutTeam: '/images/about-team.png',
  productsHero: '/images/mega-tea.png',
  booking: '/images/catering.png',
  pricing: '/images/mega-tea-kit.png',
  contact: '/images/about-team.png',
  faq: '/images/mega-tea.png',
  testimonials: '/images/catering.png',
  categories: {
    'mega-teas': '/images/mega-tea.png',
    'mega-tea-kits': '/images/mega-tea-kits/hero.jpg',
    'monthly-tea-club': '/brand/monthly-mega-tea-club-poster.jpg',
    'acai-bowls': '/images/acai-bowl.png',
    'protein-coffee': '/images/protein-coffee/iced-lineup.png',
    'protein-shakes': '/images/protein-shakes/menu-poster.jpg',
    waffles: '/images/waffles/berry-nutella.png',
    'donut-of-the-day': '/images/donut-of-the-day.png',
    donuts: '/images/donut-of-the-day.png',
    'make-your-own-loaded-tea': '/images/loaded-teas/hero.jpg',
    'bulk-products': '/images/mega-tea-kit.png',
    'protein-treats': '/images/protein-treats/protein-truffles.png',
    'add-ins': '/images/mega-tea-kit.png',
    'new-and-seasonal-items': '/images/mega-tea.png',
  } as Record<string, string>,
  services: {
    default: '/images/catering.png',
    'corporate-catering': '/images/catering.png',
    'medical-office-catering': '/images/catering.png',
    'school-catering': '/images/catering.png',
    'wedding-catering': '/images/catering.png',
    'private-party-catering': '/images/catering.png',
    'special-event-catering': '/images/catering.png',
    'mega-tea-kit-program-club': '/brand/monthly-mega-tea-club-poster.jpg',
  } as Record<string, string>,
  productDefaults: {
    default: '/images/mega-tea.png',
    kit: '/images/mega-tea-kits/hero.jpg',
    'mega-teas': '/images/mega-tea.png',
    'acai-bowls': '/images/acai-bowl.png',
    'protein-coffee': '/images/protein-coffee/iced-lineup.png',
    'protein-shakes': '/images/protein-shakes/menu-poster.jpg',
    waffles: '/images/waffles/berry-nutella.png',
    'donut-of-the-day': '/images/donut-of-the-day.png',
    donuts: '/images/donut-of-the-day.png',
    'make-your-own-loaded-tea': '/images/loaded-teas/hero.jpg',
    'protein-treats': '/images/protein-treats/protein-truffles.png',
  } as Record<string, string>,
} as const;

/** Client flavor photos live in /public/{collection folder}/{flavor name}.png */
export const FLAVOR_IMAGE_DIR = '/flavours';

export function getFlavorImagePath(slug: string): string {
  return `${FLAVOR_IMAGE_DIR}/${slug}.png`;
}

export function getFlavorImage(slug: string, alt = 'Loaded tea flavor') {
  return { url: getFlavorImagePath(slug), alt };
}

export function resolveFlavorImage(
  flavor: { slug: string; image?: { url?: string; alt?: string } },
  name: string
) {
  const manifest = FLAVOR_IMAGE_BY_SLUG[flavor.slug];
  if (manifest?.url) {
    return { url: manifest.url, alt: name };
  }
  if (flavor.image?.url) {
    return { url: flavor.image.url, alt: flavor.image.alt || name };
  }
  return { url: '', alt: name };
}

export function getCategoryImage(slug: string): string {
  return SITE_IMAGES.categories[slug] ?? SITE_IMAGES.megaTea;
}

export function getServiceImage(slug: string): string {
  return SITE_IMAGES.services[slug] ?? SITE_IMAGES.services.default;
}

export function getProductFallbackImage(categorySlug?: string, productType?: string): string {
  if (productType === 'kit') return SITE_IMAGES.megaTeaKit;
  if (categorySlug && SITE_IMAGES.productDefaults[categorySlug]) {
    return SITE_IMAGES.productDefaults[categorySlug];
  }
  return SITE_IMAGES.productDefaults.default;
}
