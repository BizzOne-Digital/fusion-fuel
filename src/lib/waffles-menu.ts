/** Protein waffles menu — client poster (preset waffles + create your own toppings). */

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export const WAFFLES_MENU = {
  headline: 'Protein Waffles',
  price: 12.99,
  additionalToppingPrice: 1,
  buildYourOwnMax: 5,
  toppingGroups: [
    {
      label: 'Fruit',
      items: ['Strawberry', 'Banana', 'Blueberries', 'Kiwi'] as const,
    },
    {
      label: 'Spreads & Syrups',
      items: [
        'Nutella',
        'Honey',
        'Syrup',
        'Peanut Butter',
        'Caramel',
        'Chocolate drizzle',
        'Condensed Milk',
        'Dulce de leche',
      ] as const,
    },
    {
      label: 'Nuts & Seeds',
      items: ['Chia seeds', 'Almonds', 'Walnuts', 'Pecans', 'Coconut Flakes'] as const,
    },
    {
      label: 'Dry Toppings & Mix-ins',
      items: [
        'Chocolate Chip (Dark/White)',
        'Oreo crumbs',
        'Cinnamon',
        'Marshmallows',
        'Powder sugar',
      ] as const,
    },
    {
      label: 'Other',
      items: ['Whipped cream'] as const,
    },
  ],
  items: [
    {
      slug: 'birthday-cake',
      name: 'Birthday Cake',
      description: 'Rainbow sprinkles, condensed milk & whipped cream.',
      includes: ['Rainbow sprinkles', 'Condensed Milk', 'Whipped cream'] as const,
      image: '/images/waffle-birthday-cake.png',
    },
    {
      slug: 'crunchy-monkey',
      name: 'Crunchy Monkey',
      description: 'Bananas, walnuts, coconut flakes, caramel drizzle & condensed milk.',
      includes: [
        'Bananas',
        'Walnuts',
        'Coconut flakes',
        'Caramel drizzle',
        'Condensed Milk',
      ] as const,
      image: '/images/waffles/crunchy-monkey.png',
    },
    {
      slug: 'build-your-own',
      name: 'Create Your Own Waffle',
      description: 'Pick up to 5 toppings from our waffle bar.',
      placeholder: true,
      picks: { max: 5 },
      image: '/images/waffles/berry-nutella.png',
    },
  ],
} as const;

export type WaffleMenuItem = (typeof WAFFLES_MENU.items)[number];

export function waffleAllToppings(): string[] {
  return WAFFLES_MENU.toppingGroups.flatMap((group) => [...group.items]);
}

export function wafflePriceCents(): number {
  return Math.round(WAFFLES_MENU.price * 100);
}

export function wafflePricingSummary(): string {
  return `All waffles ${formatUsd(WAFFLES_MENU.price)} · Additional toppings ${formatUsd(WAFFLES_MENU.additionalToppingPrice)} each`;
}

export function waffleDescriptionHtml(item: WaffleMenuItem): string {
  const parts = [
    `<p><strong>${item.name}</strong> — ${WAFFLES_MENU.headline}.</p>`,
    `<p>${item.description}</p>`,
    `<p><strong>Price:</strong> ${formatUsd(WAFFLES_MENU.price)}</p>`,
  ];

  if ('includes' in item && item.includes?.length) {
    parts.push(`<p><strong>Includes:</strong> ${item.includes.join(', ')}.</p>`);
  }

  if ('picks' in item && item.picks?.max) {
    parts.push(`<p>Choose up to <strong>${item.picks.max}</strong> toppings:</p>`);
    for (const group of WAFFLES_MENU.toppingGroups) {
      parts.push(`<p><strong>${group.label}:</strong> ${group.items.join(', ')}.</p>`);
    }
  }

  parts.push(
    `<p>Additional toppings beyond your selection: <strong>${formatUsd(WAFFLES_MENU.additionalToppingPrice)} each</strong>.</p>`
  );

  return parts.join('');
}
