/** Refreshers / Loaded Teas menu from client poster. */

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export const LOADED_TEA_STANDARD_PRICES = {
  '24oz': 6.9,
  '32oz': 8.9,
} as const;

export const LOADED_TEA_PREMIUM_SLUGS = ['mango-breeze', 'yellowstone'] as const;

export const LOADED_TEA_PREMIUM_PRICES = {
  '24oz': 10.99,
  '32oz': 12.99,
} as const;

export const LOADED_TEAS_MENU = {
  headline: 'Refreshers / Loaded Teas',
  servingNote: '24 oz & 32 oz',
  sizes: [
    { slug: '24oz', name: '24 oz', price: LOADED_TEA_STANDARD_PRICES['24oz'] },
    { slug: '32oz', name: '32 oz', price: LOADED_TEA_STANDARD_PRICES['32oz'] },
  ] as const,
  items: [
    {
      slug: 'bloom',
      name: 'Bloom',
      ingredients: ['Blackberry', 'Strawberry', 'Cucumber'],
    },
    {
      slug: 'cherry-sunset',
      name: 'Cherry Sunset',
      ingredients: ['Orange', 'Cherry'],
    },
    {
      slug: 'flamingo',
      name: 'Flamingo',
      ingredients: ['Lemon Lime', 'Strawberry', 'Cherry'],
    },
    {
      slug: 'good-vibes',
      name: 'Good Vibes',
      ingredients: ['Orange', 'Pineapple', 'Strawberry'],
    },
    {
      slug: 'island-oasis',
      name: 'Island Oasis',
      ingredients: ['Orange', 'Strawberry'],
    },
    {
      slug: 'mai-tai',
      name: 'Mai Tai',
      ingredients: ['Pineapple', 'Coconut', 'Strawberry'],
    },
    {
      slug: 'summer-vibes',
      name: 'Summer Vibes',
      ingredients: ['Passion fruit', 'Pineapple'],
    },
    {
      slug: 'mermaid-tail',
      name: 'Mermaid Tail',
      ingredients: ['Lemon Lime', 'Blueberry', 'Pineapple', 'Cotton Candy'],
    },
    {
      slug: 'sweet-lava',
      name: 'Sweet Lava',
      ingredients: ['Pomegranate', 'Strawberry'],
    },
    {
      slug: 'sun-kissed',
      name: 'Sun Kissed',
      ingredients: ['Lemon Lime', 'Fruit Punch', 'Orange'],
    },
    {
      slug: 'sunny-dayz',
      name: 'Sunny Dayz',
      ingredients: ['Pineapple', 'Mango', 'Coconut'],
    },
    {
      slug: 'wonder-woman',
      name: 'Wonder Woman',
      ingredients: ['Pomegranate', 'Blueberry'],
    },
    {
      slug: 'watermelon-berry',
      name: 'Watermelon Berry',
      ingredients: ['Pomegranate', 'Watermelon'],
    },
    {
      slug: 'strawberry-lemonade',
      name: 'Strawberry/Lemonade',
      ingredients: ['Lemon Lime', 'Strawberry lemonade'],
    },
    {
      slug: 'south-shore-wave',
      name: 'South Shore Wave',
      ingredients: ['Lemon Lime', 'Blueberry', 'Green Apple'],
    },
    {
      slug: 'tropical-breeze',
      name: 'Tropical Breeze',
      ingredients: ['Watermelon', 'Orange', 'Pineapple', 'Strawberry'],
    },
    {
      slug: 'sweet-tart',
      name: 'Sweet Tart',
      ingredients: ['Lemon Lime', 'Strawberry/lemonade', 'Blueberry'],
    },
    {
      slug: 'mango-breeze',
      name: 'Mango Breeze',
      ingredients: ['Mango/Peach', 'Cherry', 'Collagen', 'Protein', 'Energy'],
      boosted: true,
    },
    {
      slug: 'yellowstone',
      name: 'Yellowstone',
      ingredients: ['Mango/Peach', 'Pineapple', 'Collagen', 'Protein', 'Energy'],
      boosted: true,
    },
  ],
} as const;

export type LoadedTeaMenuItem = (typeof LOADED_TEAS_MENU.items)[number];

export function loadedTeaIsPremium(itemSlug: string): boolean {
  return (LOADED_TEA_PREMIUM_SLUGS as readonly string[]).includes(itemSlug);
}

export function loadedTeaSizePriceCents(sizeSlug: string, itemSlug?: string): number {
  const isPremium = itemSlug ? loadedTeaIsPremium(itemSlug) : false;
  const prices = isPremium ? LOADED_TEA_PREMIUM_PRICES : LOADED_TEA_STANDARD_PRICES;
  const price = prices[sizeSlug as keyof typeof prices];
  return price != null ? Math.round(price * 100) : 0;
}

export function loadedTeaItemPricingNote(itemSlug: string): string {
  const sizes = loadedTeaIsPremium(itemSlug) ? LOADED_TEA_PREMIUM_PRICES : LOADED_TEA_STANDARD_PRICES;
  return Object.entries(sizes)
    .map(([slug, price]) => {
      const label = slug === '24oz' ? '24 oz' : '32 oz';
      return `${label} ${formatUsd(price)}`;
    })
    .join(' · ');
}

export function loadedTeaPricingSummary(): string {
  const standard = Object.entries(LOADED_TEA_STANDARD_PRICES)
    .map(([slug, price]) => {
      const label = slug === '24oz' ? '24 oz' : '32 oz';
      return `${label} ${formatUsd(price)}`;
    })
    .join(' · ');
  const premium = Object.entries(LOADED_TEA_PREMIUM_PRICES)
    .map(([slug, price]) => {
      const label = slug === '24oz' ? '24 oz' : '32 oz';
      return `${label} ${formatUsd(price)}`;
    })
    .join(' · ');
  return `Most teas: ${standard} · Mango Breeze & Yellowstone: ${premium}`;
}

export function loadedTeaPricingNote(): string {
  return loadedTeaPricingSummary();
}

export function loadedTeaDescriptionHtml(item: LoadedTeaMenuItem): string {
  const ingredientsHtml = `<p><strong>Ingredients:</strong></p><ul>${item.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join('')}</ul>`;
  const boostNote =
    'boosted' in item && item.boosted
      ? '<p><em>Includes collagen, protein &amp; energy boost.</em></p>'
      : '';

  return [
    `<p><strong>${item.name}</strong> — ${LOADED_TEAS_MENU.headline}.</p>`,
    `<p><strong>Sizes:</strong> ${LOADED_TEAS_MENU.servingNote}</p>`,
    ingredientsHtml,
    boostNote,
    `<p><strong>Pricing:</strong> ${loadedTeaItemPricingNote(item.slug)}</p>`,
  ].join('');
}
