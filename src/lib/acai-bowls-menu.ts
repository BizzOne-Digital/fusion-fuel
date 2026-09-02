/** Açaí & Protein Bowls menu — pick fruits, toppings, and paid extras. */

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export const ACAI_BOWLS_MENU = {
  headline: 'Açaí & Protein Bowls',
  footnote: 'Gluten free Granola & Protein available for additional fee.',
  extraFruitPrice: 1,
  extraToppingPrice: 1,
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
  extraFruits: ['Strawberry', 'Banana', 'Blueberry', 'Kiwi'] as const,
  extraToppings: [
    'Strawberries',
    'Banana',
    'Kiwi',
    'Blueberries',
    'Granola',
    'Peanut Butter',
    'Nutella',
    'Chocolate Chips',
    'Sliced Almonds',
    'Coconut Flakes',
    'Condensed Milk',
    'Caramel Drizzle',
  ] as const,
  items: [
    {
      slug: 'dubai-acai-bowl',
      name: 'Dubai Açaí Bowl',
      kind: 'acai' as const,
      description:
        'Pick 2 fruits — includes pistachio sauce & Nutella, then pick 1 more topping.',
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
      description: 'Choose up to 3 fruits and 2 toppings.',
      picks: { fruits: 3, toppings: 2 },
      image: '/images/acai-regular-bowl.png',
      size: '12 oz',
      price: 11.99,
    },
    {
      slug: 'protein-bowl-crunchy-monkey',
      name: 'Protein Bowl — Crunchy Monkey',
      kind: 'protein' as const,
      description: 'Crunchy Monkey protein bowl — pick 2 fruits and 2 toppings.',
      picks: { fruits: 2, toppings: 2 },
      placeholder: true,
      size: '12 oz',
      price: 11.99,
    },
    {
      slug: 'tropical-acai-bowl',
      name: 'Tropical Açaí Bowl',
      kind: 'acai' as const,
      description: 'Choose up to 3 fruits and 2 toppings.',
      picks: { fruits: 3, toppings: 2 },
      image: '/images/acai-tropical-bowl.png',
      size: '12 oz',
      price: 11.99,
    },
    {
      slug: 'protein-bowl-berry',
      name: 'Protein Bowl — Berry',
      kind: 'protein' as const,
      description: 'Berry protein bowl — pick 2 fruits and 2 toppings.',
      picks: { fruits: 2, toppings: 2 },
      placeholder: true,
      size: '12 oz',
      price: 11.99,
    },
  ],
} as const;

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

export function acaiBowlModifierSlug(kind: 'extra-fruit' | 'extra-topping', name: string): string {
  const base = name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `acai-${kind}-${base}`;
}

export function acaiBowlExtraAddInSlugs(): string[] {
  return [
    ...ACAI_BOWLS_MENU.extraFruits.map((name) => acaiBowlModifierSlug('extra-fruit', name)),
    ...ACAI_BOWLS_MENU.extraToppings.map((name) => acaiBowlModifierSlug('extra-topping', name)),
  ];
}

export function acaiBowlPriceCents(item: AcaiBowlMenuItem): number {
  return 'price' in item && item.price != null ? Math.round(item.price * 100) : 0;
}

export function acaiBowlPricingSummary(): string {
  return `Açaí & tropical bowls ${ACAI_BOWLS_MENU.defaultSize} ${formatUsd(11.99)} · Dubai ${formatUsd(14.99)} · Extra fruits & toppings ${formatUsd(ACAI_BOWLS_MENU.extraToppingPrice)} each`;
}

export function acaiBowlOrderNotes(input: {
  includedFruits: string[];
  includedToppings: string[];
  extraFruits: string[];
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
  if (input.extraFruits.length) {
    parts.push(`Extra fruits: ${input.extraFruits.join(', ')}`);
  }
  if (input.extraToppings.length) {
    parts.push(`Extra toppings: ${input.extraToppings.join(', ')}`);
  }

  return parts.join(' · ');
}

export function acaiBowlDescriptionHtml(item: AcaiBowlMenuItem): string {
  const config = acaiBowlModifierConfig(item);
  const parts = [
    `<p><strong>${item.name}</strong> — ${ACAI_BOWLS_MENU.headline}.</p>`,
    `<p>${item.description}</p>`,
  ];

  if ('size' in item && item.size && 'price' in item && item.price != null) {
    parts.push(`<p><strong>Size:</strong> ${item.size} — <strong>${formatUsd(item.price)}</strong></p>`);
  }

  if (config.fixedIncludes.length) {
    parts.push(`<p><strong>Includes:</strong> ${config.fixedIncludes.join(' & ')}.</p>`);
  }

  parts.push(
    `<p><strong>Choose Your Fruits</strong> — select up to ${config.includedFruitMax}: ${ACAI_BOWLS_MENU.includedFruits.join(', ')}.</p>`
  );

  if (config.includedToppingMax > 0) {
    parts.push(
      `<p><strong>Choose Your Toppings</strong> — select up to ${config.includedToppingMax}: ${ACAI_BOWLS_MENU.includedToppings.join(', ')}.</p>`
    );
  }

  parts.push(
    `<p><strong>Extra Fruits</strong> — ${formatUsd(ACAI_BOWLS_MENU.extraFruitPrice)} each: ${ACAI_BOWLS_MENU.extraFruits.join(', ')}.</p>`,
    `<p><strong>Extra Toppings</strong> — ${formatUsd(ACAI_BOWLS_MENU.extraToppingPrice)} each: ${ACAI_BOWLS_MENU.extraToppings.join(', ')}.</p>`,
    `<p><em>${ACAI_BOWLS_MENU.footnote}</em></p>`
  );

  return parts.join('');
}
