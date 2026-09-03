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

export function proteinCoffeeFlavorImage(flavorSlug: string): { url: string; alt: string } {
  const flavor = PROTEIN_COFFEE.flavors.find((entry) => entry.slug === flavorSlug);
  const index = PROTEIN_COFFEE.flavors.findIndex((entry) => entry.slug === flavorSlug);
  const image =
    index >= 0
      ? PROTEIN_COFFEE.galleryImages[index % PROTEIN_COFFEE.galleryImages.length]
      : PROTEIN_COFFEE.galleryImages[0];

  return { url: image.url, alt: flavor?.name ?? image.alt };
}

export function proteinCoffeeVariantSku(sizeSlug: string): string {
  const size = PROTEIN_COFFEE.icedSizes.find((entry) => entry.slug === sizeSlug);
  return size ? `FFB-PCOF-${size.variantSuffix}` : '';
}

export function proteinCoffeeFlavorList(): string {
  return PROTEIN_COFFEE.flavors.map((flavor) => flavor.name).join(', ');
}

export function proteinCoffeeProductShortDescription(): string {
  return 'Iced protein coffee — choose your flavor, size, and add-ons.';
}

export function proteinCoffeeProductDescriptionHtml(): string {
  return '';
}

export function proteinCoffeeDescriptionHtml(_flavorName: string): string {
  return '';
}
