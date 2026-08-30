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
      image: '/images/loaded-teas/cherry-sunset.png',
    },
    {
      slug: 'flamingo',
      name: 'Flamingo',
      ingredients: ['Lemon Lime', 'Strawberry', 'Cherry'],
      image: '/images/loaded-teas/flamingo.png',
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
      image: '/images/loaded-teas/island-oasis.png',
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
      image: '/images/loaded-teas/summer-vibes.png',
    },
    {
      slug: 'mermaid-tail',
      name: 'Mermaid Tail',
      ingredients: ['Lemon Lime', 'Blueberry', 'Pineapple', 'Cotton Candy'],
      image: '/images/loaded-teas/mermaid-tail.png',
    },
    {
      slug: 'sweet-lava',
      name: 'Sweet Lava',
      ingredients: ['Pomegranate', 'Strawberry'],
      image: '/images/loaded-teas/sweet-lava.png',
    },
    {
      slug: 'sun-kissed',
      name: 'Sun Kissed',
      ingredients: ['Lemon Lime', 'Fruit Punch', 'Orange'],
      image: '/images/loaded-teas/sun-kissed.png',
    },
    {
      slug: 'sunny-dayz',
      name: 'Sunny Dayz',
      ingredients: ['Pineapple', 'Mango', 'Coconut'],
      image: '/images/loaded-teas/sunny-dayz.png',
    },
    {
      slug: 'wonder-woman',
      name: 'Wonder Woman',
      ingredients: ['Pomegranate', 'Blueberry'],
      image: '/images/loaded-teas/wonder-woman.png',
    },
    {
      slug: 'watermelon-berry',
      name: 'Watermelon Berry',
      ingredients: ['Pomegranate', 'Watermelon'],
      image: '/images/loaded-teas/watermelon-berry.png',
    },
    {
      slug: 'strawberry-lemonade',
      name: 'Strawberry/Lemonade',
      ingredients: ['Lemon Lime', 'Strawberry lemonade'],
      image: '/images/loaded-teas/strawberry-lemonade.png',
    },
    {
      slug: 'south-shore-wave',
      name: 'South Shore Wave',
      ingredients: ['Lemon Lime', 'Blueberry', 'Green Apple'],
      image: '/images/loaded-teas/south-shore-wave.png',
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
      image: '/images/loaded-teas/sweet-tart.png',
    },
    {
      slug: 'mango-breeze',
      name: 'Mango Breeze',
      ingredients: ['Mango/Peach', 'Cherry', 'Collagen', 'Protein', 'Energy'],
      boosted: true,
      image: '/images/loaded-teas/mango-breeze.png',
    },
    {
      slug: 'yellowstone',
      name: 'Yellowstone',
      ingredients: ['Mango/Peach', 'Pineapple', 'Collagen', 'Protein', 'Energy'],
      boosted: true,
      image: '/images/loaded-teas/yellowstone.png',
    },
    {
      slug: 'detox',
      name: 'Detox',
      ingredients: [
        'Fiber',
        'Collagen',
        'Raspberry herbal tea',
        'Probiotics',
        'Aloe mandarin',
      ],
      servingNote: 'Hot / Cold',
      image: '/images/loaded-teas/detox.png',
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

export function loadedTeaShortDescription(item: LoadedTeaMenuItem): string {
  const serving =
    'servingNote' in item && item.servingNote ? ` (${item.servingNote})` : '';
  return `${item.ingredients.join(', ')}${serving}. ${loadedTeaItemPricingNote(item.slug)}.`;
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
  const servingHtml =
    'servingNote' in item && item.servingNote
      ? `<p><strong>Served:</strong> ${item.servingNote}</p>`
      : '';
  const boostNote =
    'boosted' in item && item.boosted
      ? '<p><em>Includes collagen, protein &amp; energy boost.</em></p>'
      : '';

  return [
    `<p><strong>${item.name}</strong> — ${LOADED_TEAS_MENU.headline}.</p>`,
    ingredientsHtml,
    servingHtml,
    boostNote,
  ]
    .filter(Boolean)
    .join('');
}
