/** Protein coffee menu from client poster — iced sizes and flavor list. */

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export const PROTEIN_COFFEE_PRODUCT_SLUG = 'protein-coffee';

export const PROTEIN_COFFEE = {
  headline: 'Protein Coffee',
  servingNote: 'Iced only — 24 oz & 32 oz',
  galleryImages: [
    {
      url: '/images/protein-coffee/iced-lineup.png',
      alt: 'Lineup of iced protein coffees on the counter',
    },
    {
      url: '/images/protein-coffee/mocha-drizzle.png',
      alt: 'Iced protein coffee with chocolate drizzle and straws',
    },
  ] as const,
  icedSizes: [
    { slug: '24oz', name: '24 oz Iced', price: 6.99, variantSuffix: 'ICED24' },
    { slug: '32oz', name: '32 oz Iced', price: 8.99, variantSuffix: 'ICED32' },
  ] as const,
  icedAddOn: {
    slug: 'fat-reducing-donut-shot-dulce-de-leche',
    name: 'Fat Reducing Donut Shot — Dulce de Leche',
    price: 6,
    note: 'Iced protein coffee only — Dulce de Leche flavor.',
  },
  footerNotes: [
    'Add fat-reducing donut shot (Dulce de Leche) to iced coffee',
    'Ask for flavor available',
  ],
  flavors: [
    { slug: 'house-blend', name: 'House Blend' },
    { slug: 'hazelnut', name: 'Hazelnut' },
    { slug: 'salted-caramel', name: 'Salted Caramel' },
    { slug: 'french-vanilla', name: 'French Vanilla' },
    { slug: 'white-chocolate', name: 'White Chocolate' },
    { slug: 'brown-sugar-cinnamon', name: 'Brown Sugar Cinnamon' },
    { slug: 'caramel-macchiato', name: 'Caramel Macchiato' },
    { slug: 'mocha', name: 'Mocha' },
    { slug: 'dirty-vanilla-chai', name: 'Dirty Vanilla Chai' },
  ],
} as const;

export type ProteinCoffeeFlavor = (typeof PROTEIN_COFFEE.flavors)[number];

export function proteinCoffeeIcedPriceCents(sizeSlug: string): number {
  const size = PROTEIN_COFFEE.icedSizes.find((entry) => entry.slug === sizeSlug);
  return size ? Math.round(size.price * 100) : 0;
}

export function proteinCoffeePricingSummary(): string {
  return PROTEIN_COFFEE.icedSizes
    .map((size) => `${size.name} ${formatUsd(size.price)}`)
    .join(' · ');
}

export function isProteinCoffeeProduct(slug: string): boolean {
  return slug === PROTEIN_COFFEE_PRODUCT_SLUG;
}

export function proteinCoffeeFlavorNote(flavorName: string): string {
  return `Flavor: ${flavorName}`;
}

export function proteinCoffeeProductDescriptionHtml(): string {
  const { icedAddOn, icedSizes, flavors } = PROTEIN_COFFEE;
  const sizeLines = icedSizes
    .map((size) => `<li><strong>${size.name}</strong> — ${formatUsd(size.price)}</li>`)
    .join('');

  return [
    `<p><strong>${PROTEIN_COFFEE.headline}</strong> — iced only.</p>`,
    `<p><strong>Iced sizes:</strong></p><ul>${sizeLines}</ul>`,
    `<p><strong>Flavors:</strong> ${flavors.map((flavor) => flavor.name).join(', ')}.</p>`,
    `<p><strong>Iced add-on:</strong> ${icedAddOn.name} — ${formatUsd(icedAddOn.price)} (${icedAddOn.note})</p>`,
    `<p>Contains caffeine. Not recommended for all audiences.</p>`,
  ].join('');
}

export function proteinCoffeeDescriptionHtml(flavorName: string): string {
  const { icedAddOn, icedSizes } = PROTEIN_COFFEE;
  const sizeLines = icedSizes
    .map((size) => `<li><strong>${size.name}</strong> — ${formatUsd(size.price)}</li>`)
    .join('');

  return [
    `<p><strong>${flavorName}</strong> protein coffee.</p>`,
    `<p><strong>Iced sizes:</strong></p><ul>${sizeLines}</ul>`,
    `<p><strong>Iced add-on:</strong> ${icedAddOn.name} — ${formatUsd(icedAddOn.price)} (${icedAddOn.note})</p>`,
    `<p>Contains caffeine. Not recommended for all audiences.</p>`,
  ].join('');
}
