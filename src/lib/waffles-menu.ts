/** Protein waffles menu — customize up to 5 included toppings + paid extras. */

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

const WAFFLE_WEBSITE_DESCRIPTION =
  'Build your perfect protein waffle! Choose up to 5 toppings from our fresh fruits, spreads, syrups, nuts and sweet extras. Additional toppings are $1 each.';

export const WAFFLES_MENU = {
  headline: 'Protein Waffles',
  price: 12.99,
  extraToppingPrice: 1,
  includedToppingMax: 5,
  websiteDescription: WAFFLE_WEBSITE_DESCRIPTION,
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
        'Chocolate Drizzle',
        'Condensed Milk',
        'Dulce de Leche',
      ] as const,
    },
    {
      label: 'Nuts & Seeds',
      items: ['Chia Seeds', 'Sliced Almonds', 'Walnuts', 'Pecans', 'Coconut Flakes'] as const,
    },
    {
      label: 'Dry Toppings & Mix-Ins',
      items: [
        'Dark Chocolate Chips',
        'White Chocolate Chips',
        'Oreo Crumbs',
        'Cinnamon',
        'Marshmallows',
        'Powdered Sugar',
      ] as const,
    },
    {
      label: 'Other',
      items: ['Whipped Cream'] as const,
    },
  ],
  items: [
    {
      slug: 'birthday-cake',
      name: 'Birthday Cake',
      description: 'Rainbow sprinkles, condensed milk & whipped cream.',
      image: '/images/waffle-birthday-cake.png',
    },
    {
      slug: 'crunchy-monkey',
      name: 'Crunchy Monkey',
      description: 'Bananas, walnuts, coconut flakes, caramel drizzle & condensed milk.',
      image: '/images/waffles/crunchy-monkey.png',
    },
    {
      slug: 'build-your-own',
      name: 'Create Your Own Waffle',
      description: WAFFLE_WEBSITE_DESCRIPTION,
      image: '/images/waffles/berry-nutella.png',
    },
  ],
} as const;

export type WaffleMenuItem = (typeof WAFFLES_MENU.items)[number];

export function waffleAllToppings(): string[] {
  return WAFFLES_MENU.toppingGroups.flatMap((group) => [...group.items]);
}

export function isWaffleProduct(slug: string): boolean {
  return slug.startsWith('waffle-');
}

export const WAFFLE_BUILD_YOUR_OWN_SLUG = 'waffle-build-your-own';

export function isWaffleBuildYourOwnProduct(slug: string): boolean {
  return slug === WAFFLE_BUILD_YOUR_OWN_SLUG;
}

export function waffleMenuItem(productSlug: string): WaffleMenuItem | null {
  if (!isWaffleProduct(productSlug)) return null;
  const itemSlug = productSlug.replace(/^waffle-/, '');
  return WAFFLES_MENU.items.find((item) => item.slug === itemSlug) ?? null;
}

export function waffleExtraModifierSlug(topping: string): string {
  const base = topping
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `waffle-extra-${base}`;
}

export function waffleExtraAddInSlugs(): string[] {
  return waffleAllToppings().map((topping) => waffleExtraModifierSlug(topping));
}

export function wafflePriceCents(): number {
  return Math.round(WAFFLES_MENU.price * 100);
}

export function wafflePricingSummary(): string {
  return `All waffles ${formatUsd(WAFFLES_MENU.price)} · Up to ${WAFFLES_MENU.includedToppingMax} toppings included · Extra toppings ${formatUsd(WAFFLES_MENU.extraToppingPrice)} each`;
}

export function waffleOrderNotes(input: {
  includedToppings: string[];
  extraToppings: string[];
}): string {
  const parts: string[] = [];
  if (input.includedToppings.length) {
    parts.push(`Toppings: ${input.includedToppings.join(', ')}`);
  }
  if (input.extraToppings.length) {
    parts.push(`Extra toppings: ${input.extraToppings.join(', ')}`);
  }
  return parts.join(' · ');
}

export function waffleShortDescription(item: WaffleMenuItem): string {
  if (item.slug === 'build-your-own') {
    return `Pick up to 5 toppings included. ${formatUsd(WAFFLES_MENU.price)}.`;
  }
  return `${item.description} ${formatUsd(WAFFLES_MENU.price)}.`;
}

export function waffleDescriptionHtml(_item: WaffleMenuItem): string {
  return '';
}
