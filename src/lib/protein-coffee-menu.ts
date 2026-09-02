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
  optionalAddOns: [
    { slug: 'pcof-collagen', name: 'Collagen', price: 3.0 },
    { slug: 'pcof-fiber-unflavored', name: 'Fiber (Unflavored)', price: 2.0 },
    { slug: 'pcof-probiotics', name: 'Probiotics', price: 2.0 },
    { slug: 'pcof-creatine', name: 'Creatine', price: 2.0 },
    { slug: 'pcof-immunity-essentials', name: 'Immunity Essentials', price: 2.0 },
    { slug: 'pcof-additional-flavoring', name: 'Additional Flavoring', price: 1.0 },
    { slug: 'pcof-cinnamon', name: 'Cinnamon', price: 0.5 },
    { slug: 'pcof-whipped-cream', name: 'Whipped Cream', price: 1.0 },
    { slug: 'pcof-foam', name: 'Foam', price: 1.0 },
    { slug: 'pcof-caramel-drizzle', name: 'Caramel Drizzle', price: 0.5 },
    { slug: 'pcof-chocolate-drizzle', name: 'Chocolate Drizzle', price: 0.5 },
    {
      slug: 'fat-reducing-donut-shot-dulce-de-leche',
      name: 'Fat Reducing Donut Shot — Dulce de Leche',
      price: 6.0,
    },
  ] as const,
  footerNotes: [
    'Optional collagen, fiber, probiotics, creatine, and more',
    'Ask for flavor available',
  ],
  flavors: [
    { slug: 'house-blend', name: 'House Blend' },
    { slug: 'hazelnut', name: 'Hazelnut' },
    { slug: 'salted-caramel', name: 'Salted Caramel' },
    { slug: 'french-vanilla', name: 'French Vanilla' },
    { slug: 'white-chocolate', name: 'White Chocolate' },
    { slug: 'brown-sugar-cinnamon', name: 'Brown Sugar Cinnamon' },
    { slug: 'dirty-vanilla-chai', name: 'Dirty Vanilla Chai' },
    { slug: 'caramel-macchiato', name: 'Caramel Macchiato' },
    { slug: 'mocha', name: 'Mocha' },
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

export function proteinCoffeeOptionalAddInSlugs(): string[] {
  return PROTEIN_COFFEE.optionalAddOns.map((addOn) => addOn.slug);
}

export function proteinCoffeeOptionalAddOnsSummary(): string {
  return PROTEIN_COFFEE.optionalAddOns
    .map((addOn) => `${addOn.name} ${formatUsd(addOn.price)}`)
    .join(' · ');
}

export function isProteinCoffeeProduct(slug: string): boolean {
  return slug === PROTEIN_COFFEE_PRODUCT_SLUG;
}

export function proteinCoffeeFlavorNote(flavorName: string): string {
  return `Flavor: ${flavorName}`;
}

export function proteinCoffeeFlavorList(): string {
  return PROTEIN_COFFEE.flavors.map((flavor) => flavor.name).join(', ');
}

export function proteinCoffeeProductDescriptionHtml(): string {
  const { icedSizes } = PROTEIN_COFFEE;
  const sizeLines = icedSizes
    .map((size) => `<li><strong>${size.name}</strong> — ${formatUsd(size.price)}</li>`)
    .join('');
  const flavorLines = PROTEIN_COFFEE.flavors
    .map((flavor) => `<li>${flavor.name}</li>`)
    .join('');
  const addOnLines = PROTEIN_COFFEE.optionalAddOns
    .map((addOn) => `<li>${addOn.name} — ${formatUsd(addOn.price)}</li>`)
    .join('');

  return [
    `<p><strong>${PROTEIN_COFFEE.headline}</strong> — iced only.</p>`,
    `<p><strong>Iced sizes:</strong></p><ul>${sizeLines}</ul>`,
    `<p><strong>Flavors:</strong></p><ul>${flavorLines}</ul>`,
    `<p><strong>Optional add-ons:</strong></p><ul>${addOnLines}</ul>`,
    `<p>Contains caffeine. Not recommended for all audiences.</p>`,
  ].join('');
}

export function proteinCoffeeDescriptionHtml(flavorName: string): string {
  const { icedSizes } = PROTEIN_COFFEE;
  const sizeLines = icedSizes
    .map((size) => `<li><strong>${size.name}</strong> — ${formatUsd(size.price)}</li>`)
    .join('');
  const addOnLines = PROTEIN_COFFEE.optionalAddOns
    .map((addOn) => `<li>${addOn.name} — ${formatUsd(addOn.price)}</li>`)
    .join('');

  return [
    `<p><strong>${flavorName}</strong> protein coffee.</p>`,
    `<p><strong>Iced sizes:</strong></p><ul>${sizeLines}</ul>`,
    `<p><strong>Optional add-ons:</strong></p><ul>${addOnLines}</ul>`,
    `<p>Contains caffeine. Not recommended for all audiences.</p>`,
  ].join('');
}
