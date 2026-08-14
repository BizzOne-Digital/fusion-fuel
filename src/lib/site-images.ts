/** Local brand photography assets (replace in /public/images/ when client supplies final photos). */
export const SITE_IMAGES = {
  hero: '/images/hero-drinks.png',
  heroDrinks: '/images/hero-drinks.png',
  megaTea: '/images/mega-tea.png',
  megaTeaKit: '/images/mega-tea-kit.png',
  acaiBowl: '/images/acai-bowl.png',
  proteinCoffee: '/images/protein-coffee.png',
  proteinShake: '/images/protein-shake.png',
  waffle: '/images/waffle.png',
  donut: '/images/donut.png',
  proteinTreat: '/images/protein-treat.png',
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
    'mega-tea-kits': '/images/mega-tea-kit.png',
    'acai-bowls': '/images/acai-bowl.png',
    'protein-coffee': '/images/protein-coffee.png',
    'protein-shakes': '/images/protein-shake.png',
    waffles: '/images/waffle.png',
    donuts: '/images/donut.png',
    'protein-treats': '/images/protein-treat.png',
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
    'mega-tea-kit-program-club': '/images/mega-tea-kit.png',
  } as Record<string, string>,
  productDefaults: {
    default: '/images/mega-tea.png',
    kit: '/images/mega-tea-kit.png',
    'mega-teas': '/images/mega-tea.png',
    'acai-bowls': '/images/acai-bowl.png',
    'protein-coffee': '/images/protein-coffee.png',
    'protein-shakes': '/images/protein-shake.png',
    waffles: '/images/waffle.png',
    donuts: '/images/donut.png',
    'protein-treats': '/images/protein-treat.png',
  } as Record<string, string>,
} as const;

/** Client flavor photos live in /public/flavours/{slug}.png */
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
  if (flavor.image?.url) {
    return { url: flavor.image.url, alt: flavor.image.alt || name };
  }
  return getFlavorImage(flavor.slug, name);
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
