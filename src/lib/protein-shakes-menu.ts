/** Protein shakes menu — 24 oz & 32 oz sizes. */

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export const PROTEIN_SHAKE_PRICES = {
  '24oz': 8.9,
  '32oz': 10.9,
} as const;

export const PROTEIN_SHAKES_MENU = {
  headline: 'Protein Shakes',
  servingNote: '24 oz & 32 oz',
  heroImage: {
    url: '/images/protein-shakes/menu-poster.jpg',
    alt: 'Fusion Fuel & Boost Co. protein shakes — six flavors in 24 oz and 32 oz cups',
  },
  sizes: [
    { slug: '24oz', name: '24 oz', price: PROTEIN_SHAKE_PRICES['24oz'], variantSuffix: '24' },
    { slug: '32oz', name: '32 oz', price: PROTEIN_SHAKE_PRICES['32oz'], variantSuffix: '32' },
  ] as const,
  items: [
    {
      slug: 'banana-split',
      name: 'Banana Split',
      image: '/images/protein-shakes/banana-split.jpg',
    },
    {
      slug: 'brownie-batter',
      name: 'Brownie Batter',
      image: '/images/protein-shakes/brownie-batter.jpg',
    },
    {
      slug: 'strawberry-cookie',
      name: 'Strawberry Cookie',
      image: '/images/protein-shakes/strawberry-cookie.jpg',
    },
    {
      slug: 'strawberry-banana',
      name: 'Strawberry Banana',
      image: '/images/protein-shakes/strawberry-banana.jpg',
    },
    {
      slug: 'chunky-monkey',
      name: 'Chunky Monkey',
      image: '/images/protein-shakes/chunky-monkey.jpg',
    },
    {
      slug: 'smores',
      name: "S'mores",
      image: '/images/protein-shakes/smores.jpg',
    },
    {
      slug: 'dulce-de-leche',
      name: 'Dulce de Leche',
      image: '/images/protein-shakes/dulce-de-leche.jpg',
    },
    {
      slug: 'strawberry-cheesecake',
      name: 'Strawberry Cheesecake',
      image: '/images/protein-shakes/strawberry-cheesecake.jpg',
    },
    {
      slug: 'birthday-cake',
      name: 'Birthday Cake',
      image: '/images/protein-shakes/birthday-cake.png',
    },
    {
      slug: 'mango-pineapple',
      name: 'Mango Pineapple',
      image: '/images/protein-shakes/mango-pineapple.png',
    },
    {
      slug: 'tropical-green-glow',
      name: 'Tropical Green Glow',
      image: '/images/protein-shakes/tropical-green-glow.png',
    },
    {
      slug: 'pb-and-j',
      name: 'PB&J Protein Shake',
      image: '/images/protein-shakes/pb-and-j.png',
    },
    {
      slug: 'oreo',
      name: 'Oreo',
      image: '/images/protein-shakes/oreo.jpg',
    },
  ],
  optionalAddOns: [
    { slug: 'pshk-extra-protein', name: 'Extra Protein', price: 3.0 },
    { slug: 'pshk-collagen', name: 'Collagen', price: 3.0 },
    { slug: 'pshk-fiber', name: 'Fiber', price: 2.0 },
    { slug: 'pshk-probiotics', name: 'Probiotics', price: 2.0 },
    { slug: 'pshk-creatine', name: 'Creatine', price: 2.0 },
    { slug: 'pshk-greens-blend', name: 'Greens Blend', price: 2.0 },
    { slug: 'pshk-immunity-support', name: 'Immunity Support', price: 2.0 },
    { slug: 'pshk-fat-reducing-shot', name: 'Fat-Reducing Shot', price: 6.0 },
  ] as const,
} as const;

export type ProteinShakeMenuItem = (typeof PROTEIN_SHAKES_MENU.items)[number];

export const PROTEIN_SHAKE_PRODUCT_SLUG = 'protein-shake';

/** @deprecated Legacy per-flavor product slugs — use {@link PROTEIN_SHAKE_PRODUCT_SLUG} */
export function proteinShakeProductSlug(itemSlug: string): string {
  return `protein-shake-${itemSlug}`;
}

export function isProteinShakeProduct(slug: string): boolean {
  return slug === PROTEIN_SHAKE_PRODUCT_SLUG;
}

export function proteinShakeFlavorNote(flavorName: string): string {
  return `Flavor: ${flavorName}`;
}

export function proteinShakeItemImage(item: ProteinShakeMenuItem): { url: string; alt: string } {
  return { url: item.image, alt: item.name };
}

export function proteinShakeVariantSku(sizeSlug: string): string {
  const size = PROTEIN_SHAKES_MENU.sizes.find((entry) => entry.slug === sizeSlug);
  return size ? `FFB-PSHK-${size.variantSuffix}` : '';
}

export function proteinShakeProductShortDescription(): string {
  return `${PROTEIN_SHAKES_MENU.servingNote}. ${proteinShakePricingSummary()}`;
}

export function proteinShakeProductDescriptionHtml(): string {
  return '';
}

export function proteinShakeSizePriceCents(sizeSlug: string): number {
  const size = PROTEIN_SHAKES_MENU.sizes.find((entry) => entry.slug === sizeSlug);
  return size ? Math.round(size.price * 100) : 0;
}

export function proteinShakePricingSummary(): string {
  return PROTEIN_SHAKES_MENU.sizes
    .map((size) => `${size.name} ${formatUsd(size.price)}`)
    .join(' · ');
}

export function proteinShakeOptionalAddInSlugs(): string[] {
  return PROTEIN_SHAKES_MENU.optionalAddOns.map((addOn) => addOn.slug);
}

export function proteinShakeOptionalAddOnsSummary(): string {
  return PROTEIN_SHAKES_MENU.optionalAddOns
    .map((addOn) => `${addOn.name} ${formatUsd(addOn.price)}`)
    .join(' · ');
}

export function proteinShakeShortDescription(item: ProteinShakeMenuItem): string {
  return `${item.name} protein shake. ${proteinShakePricingSummary()}.`;
}

export function proteinShakeDescriptionHtml(item: ProteinShakeMenuItem): string {
  const sizeLines = PROTEIN_SHAKES_MENU.sizes
    .map((size) => `<li><strong>${size.name}</strong> — ${formatUsd(size.price)}</li>`)
    .join('');

  return [
    `<p><strong>${item.name}</strong> — ${PROTEIN_SHAKES_MENU.headline}.</p>`,
    `<p><strong>Sizes:</strong></p><ul>${sizeLines}</ul>`,
  ].join('');
}
