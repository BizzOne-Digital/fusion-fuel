/** Açaí & Protein Bowls menu — pick fruits, toppings, and paid extras. */

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export const ACAI_BOWL_PRODUCT_DESCRIPTION =
  'A deliciously creamy protein bowl topped with your choice of 2 fresh fruits and 2 toppings.';

export const ACAI_BOWLS_MENU = {
  headline: 'Açaí & Protein Bowls',
  footnote: 'Gluten free Granola & Protein available for additional fee.',
  defaultSize: '12 oz',
  includedFruits: ['Strawberry', 'Banana', 'Blueberry', 'Kiwi'] as const,
  includedToppings: [
    'Granola',
    'Nutella',
    'Honey',
    'Peanut Butter',
    'Coconut Flakes',
    'Chia Seeds',
    'Almond Butter',
    'Pecans',
    'Condensed Milk',
    'Chocolate Drizzle',
    'Walnuts',
    'Sliced Almonds',
    'Chocolate Chips',
    'Dulce de Leche',
  ] as const,
  items: [
    {
      slug: 'dubai-acai-bowl',
      name: 'Dubai Açaí Bowl',
      kind: 'acai' as const,
      description: ACAI_BOWL_PRODUCT_DESCRIPTION,
      picks: { fruits: 2, toppings: 1 },
      includes: ['Pistachio sauce', 'Nutella'],
      image: '/images/acai-dubai-bowl.png',
      size: '12 oz',
      price: 14.99,
    },
    {
      slug: 'regular-acai-bowl',
      name: 'Regular Açaí Bowl',
      kind: 'acai' as const,
      description: ACAI_BOWL_PRODUCT_DESCRIPTION,
      picks: { fruits: 3, toppings: 2 },
      image: '/images/acai-regular-bowl.png',
      size: '12 oz',
      price: 11.99,
    },
    {
      slug: 'protein-bowl-crunchy-monkey',
      name: 'Protein Bowl — Crunchy Monkey',
      kind: 'protein' as const,
      description: ACAI_BOWL_PRODUCT_DESCRIPTION,
      picks: { fruits: 2, toppings: 2 },
      image: '/images/acai-protein-bowl-crunchy-monkey.jpg',
      size: '12 oz',
      price: 11.99,
    },
    {
      slug: 'tropical-acai-bowl',
      name: 'Tropical Açaí Bowl',
      kind: 'acai' as const,
      description: ACAI_BOWL_PRODUCT_DESCRIPTION,
      picks: { fruits: 3, toppings: 2 },
      image: '/images/acai-tropical-bowl.png',
      size: '12 oz',
      price: 11.99,
    },
    {
      slug: 'protein-bowl-berry',
      name: 'Protein Bowl — Berry',
      kind: 'protein' as const,
      description: ACAI_BOWL_PRODUCT_DESCRIPTION,
      picks: { fruits: 2, toppings: 2 },
      image: '/images/acai-protein-bowl-berry.jpg',
      size: '12 oz',
      price: 11.99,
    },
    {
      slug: 'mango-dream-bowl',
      name: 'Mango Dream Bowl',
      kind: 'acai' as const,
      description: ACAI_BOWL_PRODUCT_DESCRIPTION,
      picks: { fruits: 3, toppings: 2 },
      image: '/images/acai-mango-dream-bowl.jpg',
      size: '12 oz',
      price: 11.99,
    },
  ],
} as const;

export const ACAI_BOWL_EXTRA_TOPPINGS = [
  { name: 'Granola', price: 1 },
  { name: 'Nutella', price: 1 },
  { name: 'Honey', price: 1 },
  { name: 'Peanut Butter', price: 1 },
  { name: 'Coconut Flakes', price: 1 },
  { name: 'Chia Seeds', price: 1 },
  { name: 'Almond Butter', price: 1 },
  { name: 'Pecans', price: 1 },
  { name: 'Condensed Milk', price: 1 },
  { name: 'Chocolate Drizzle', price: 1 },
  { name: 'Walnuts', price: 1 },
  { name: 'Sliced Almonds', price: 1 },
  { name: 'Chocolate Chips', price: 1 },
  { name: 'Dulce de Leche', price: 1 },
  { name: 'Gluten Free Granola', price: 3 },
  { name: 'Protein', price: 3 },
] as const;

export type AcaiBowlMenuItem = (typeof ACAI_BOWLS_MENU.items)[number];

export interface AcaiBowlModifierConfig {
  includedFruitMax: number;
  includedToppingMax: number;
  fixedIncludes: string[];
}

export function isAcaiBowlProduct(slug: string): boolean {
  return slug.startsWith('acai-bowl-');
}

export function acaiBowlItemSlug(productSlug: string): string | null {
  if (!isAcaiBowlProduct(productSlug)) return null;
  return productSlug.replace(/^acai-bowl-/, '');
}

export function acaiBowlMenuItem(productSlug: string): AcaiBowlMenuItem | null {
  const itemSlug = acaiBowlItemSlug(productSlug);
  if (!itemSlug) return null;
  return ACAI_BOWLS_MENU.items.find((item) => item.slug === itemSlug) ?? null;
}

export function acaiBowlModifierConfig(item: AcaiBowlMenuItem): AcaiBowlModifierConfig {
  return {
    includedFruitMax: item.picks.fruits,
    includedToppingMax: item.picks.toppings ?? 0,
    fixedIncludes: 'includes' in item && item.includes ? [...item.includes] : [],
  };
}

export function acaiBowlValidateSelections(
  config: AcaiBowlModifierConfig,
  includedFruits: string[],
  includedToppings: string[]
): boolean {
  if (includedFruits.length === 0 || includedFruits.length > config.includedFruitMax) {
    return false;
  }

  if (config.includedToppingMax === 0) {
    return true;
  }

  return (
    includedToppings.length > 0 && includedToppings.length <= config.includedToppingMax
  );
}

export function acaiBowlModifierSlug(kind: 'extra-fruit' | 'extra-topping', name: string): string {
  const base = name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `acai-${kind}-${base}`;
}

export function acaiBowlExtraToppingNames(): string[] {
  return ACAI_BOWL_EXTRA_TOPPINGS.map((topping) => topping.name);
}

export function acaiBowlExtraToppingPriceCents(name: string): number {
  const topping = ACAI_BOWL_EXTRA_TOPPINGS.find((entry) => entry.name === name);
  return topping ? Math.round(topping.price * 100) : 0;
}

export function acaiBowlExtraAddInSlugs(): string[] {
  return ACAI_BOWL_EXTRA_TOPPINGS.map((topping) =>
    acaiBowlModifierSlug('extra-topping', topping.name)
  );
}

export function acaiBowlPriceCents(item: AcaiBowlMenuItem): number {
  return 'price' in item && item.price != null ? Math.round(item.price * 100) : 0;
}

export function acaiBowlPricingSummary(): string {
  return `Açaí & tropical bowls ${ACAI_BOWLS_MENU.defaultSize} ${formatUsd(11.99)} · Dubai ${formatUsd(14.99)} · Extra toppings from ${formatUsd(1)}`;
}

export function acaiBowlOrderNotes(input: {
  includedFruits: string[];
  includedToppings: string[];
  extraToppings: string[];
  fixedIncludes?: string[];
}): string {
  const parts: string[] = [];

  if (input.fixedIncludes?.length) {
    parts.push(`Includes: ${input.fixedIncludes.join(', ')}`);
  }
  if (input.includedFruits.length) {
    parts.push(`Fruits: ${input.includedFruits.join(', ')}`);
  }
  if (input.includedToppings.length) {
    parts.push(`Toppings: ${input.includedToppings.join(', ')}`);
  }
  if (input.extraToppings.length) {
    parts.push(`Extra toppings: ${input.extraToppings.join(', ')}`);
  }

  return parts.join(' · ');
}

export function acaiBowlDescriptionHtml(item: AcaiBowlMenuItem): string {
  const sizeLine =
    'size' in item && item.size && 'price' in item && item.price != null
      ? `<p><strong>Size:</strong> ${item.size} — <strong>${formatUsd(item.price)}</strong></p>`
      : '';

  return [
    `<p><strong>${item.name}</strong> — ${ACAI_BOWLS_MENU.headline}.</p>`,
    item.description ? `<p>${item.description}</p>` : '',
    sizeLine,
    `<p><em>${ACAI_BOWLS_MENU.footnote}</em></p>`,
  ]
    .filter(Boolean)
    .join('');
}

export function acaiBowlShortDescription(item: AcaiBowlMenuItem): string {
  return item.description.trim();
}
