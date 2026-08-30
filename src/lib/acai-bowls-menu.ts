/** Açaí & Protein Bowls menu — client poster (pick fruits, toppings, bowl styles). */

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export const ACAI_BOWLS_MENU = {
  headline: 'Açaí & Protein Bowls',
  footnote: 'Gluten free Granola & Protein available for additional fee.',
  additionalToppingPrice: 1,
  defaultSize: '12 oz',
  fruits: ['Strawberry', 'Banana', 'Blueberries', 'Kiwi', 'Raspberries'] as const,
  toppings: [
    'Granola',
    'Nutella',
    'Honey',
    'Peanut Butter',
    'Coconut Flakes',
    'Chia seeds',
    'Almond Butter',
    'Pecans',
    'Condensed milk',
    'Chocolate drizzle',
    'Walnuts',
    'Almonds',
    'Chocolate chips',
    'Dulce de leche',
  ] as const,
  items: [
    {
      slug: 'dubai-acai-bowl',
      name: 'Dubai Açaí Bowl',
      kind: 'acai' as const,
      description: 'Pick 2 fruits — includes pistachio sauce & Nutella as your 2 toppings.',
      picks: { fruits: 2, toppings: 2 },
      includes: ['Pistachio sauce', 'Nutella'],
      image: '/images/acai-dubai-bowl.png',
      size: '12 oz',
      price: 14.99,
    },
    {
      slug: 'regular-acai-bowl',
      name: 'Regular Açaí Bowl',
      kind: 'acai' as const,
      description: 'Build your bowl — pick 3 fruits and 2 toppings.',
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
      description: 'Tropical açaí bowl — pick 2 fruits and 2 toppings.',
      picks: { fruits: 2, toppings: 2 },
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

export function acaiBowlPriceCents(item: AcaiBowlMenuItem): number {
  return 'price' in item && item.price != null ? Math.round(item.price * 100) : 0;
}

export function acaiBowlPricingSummary(): string {
  return `Açaí & tropical bowls ${ACAI_BOWLS_MENU.defaultSize} ${formatUsd(11.99)} · Dubai ${formatUsd(14.99)} · Additional toppings ${formatUsd(ACAI_BOWLS_MENU.additionalToppingPrice)} each`;
}

export function acaiBowlDescriptionHtml(item: AcaiBowlMenuItem): string {
  const parts = [
    `<p><strong>${item.name}</strong> — ${ACAI_BOWLS_MENU.headline}.</p>`,
    `<p>${item.description}</p>`,
  ];

  if ('size' in item && item.size && 'price' in item && item.price != null) {
    parts.push(`<p><strong>Size:</strong> ${item.size} — <strong>${formatUsd(item.price)}</strong></p>`);
  }

  if (item.picks.fruits) {
    parts.push(
      `<p>Choose <strong>${item.picks.fruits} fruit${item.picks.fruits > 1 ? 's' : ''}</strong> from: ${ACAI_BOWLS_MENU.fruits.join(', ')}.</p>`
    );
  }

  if ('includes' in item && item.includes?.length) {
    parts.push(`<p>Includes: ${item.includes.join(' & ')}.</p>`);
  } else if ('toppings' in item.picks && item.picks.toppings) {
    parts.push(
      `<p>Choose <strong>${item.picks.toppings} topping${item.picks.toppings > 1 ? 's' : ''}</strong> from: ${ACAI_BOWLS_MENU.toppings.join(', ')}.</p>`
    );
  }

  parts.push(
    `<p>Additional toppings beyond your selection: <strong>${formatUsd(ACAI_BOWLS_MENU.additionalToppingPrice)} each</strong>.</p>`
  );
  parts.push(`<p><em>${ACAI_BOWLS_MENU.footnote}</em></p>`);
  return parts.join('');
}
