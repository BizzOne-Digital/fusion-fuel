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
  heroImage: {
    url: '/images/loaded-teas/hero.jpg',
    alt: 'Colorful layered Fusion Fuel loaded tea with ice',
  },
  sizes: [
    { slug: '24oz', name: '24 oz', price: LOADED_TEA_STANDARD_PRICES['24oz'] },
    { slug: '32oz', name: '32 oz', price: LOADED_TEA_STANDARD_PRICES['32oz'] },
  ] as const,
  optionalAddOns: [
    {
      slug: 'ltea-probiotics',
      name: 'Probiotics',
      description: 'Gut health',
      price: 2,
    },
    {
      slug: 'ltea-collagen',
      name: 'Collagen',
      description: 'Improves skin, nails, hair, reduce cellulite',
      price: 3,
    },
    {
      slug: 'ltea-immunity-shot',
      name: 'Immunity Shot',
      description: '1,000mg vitamin C, Zinc Multivitamins',
      price: 2,
    },
    {
      slug: 'ltea-extra-caffeine',
      name: 'Extra Caffeine',
      description: '45–85 mg',
      price: 2,
    },
    {
      slug: 'ltea-fat-reducing-shot',
      name: 'Fat Reducing Shot',
      description: 'Targets belly fat & control hunger (optional flavors)',
      price: 6,
    },
    {
      slug: 'ltea-nitric-oxide',
      name: 'Nitric Oxide',
      description: 'Improves circulation, no stimulant',
      price: 3,
    },
    {
      slug: 'ltea-protein-boost',
      name: 'Protein Boost',
      description: '7g of protein',
      price: 3,
    },
    {
      slug: 'ltea-tea-or-coffee-shot',
      name: 'Tea or Coffee Shot',
      description: '40 mg',
      price: 2,
    },
    {
      slug: 'ltea-boba',
      name: 'Boba',
      description: 'Strawberry & Mango',
      price: 2,
    },
    {
      slug: 'ltea-extra-b12',
      name: 'Extra B12',
      description: '75mg',
      price: 3,
    },
    {
      slug: 'ltea-greens',
      name: 'Greens',
      description:
        'Vegan, non-GMO, turmeric, ginger, ashwagandha, wheatgrass, super foods, and more',
      price: 2,
    },
  ] as const,
  items: [
    {
      slug: 'bloom',
      name: 'Bloom',
      ingredients: ['Blackberry', 'Strawberry', 'Cucumber'],
      image: '/images/loaded-teas/bloom.png',
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

export const LOADED_TEA_PRODUCT_SLUG = 'loaded-tea';

export const LOADED_TEA_CHIP_COLORS = [
  '#E8F000',
  '#FF3F72',
  '#FFE500',
  '#CDDC39',
  '#FF4081',
  '#A4C639',
  '#FF5722',
  '#00BCD4',
] as const;

export function loadedTeaIsPremium(itemSlug: string): boolean {
  return (LOADED_TEA_PREMIUM_SLUGS as readonly string[]).includes(itemSlug);
}

export function isLoadedTeaProduct(slug: string): boolean {
  return slug === LOADED_TEA_PRODUCT_SLUG;
}

export function loadedTeaFlavorNote(flavorName: string): string {
  return `Flavor: ${flavorName}`;
}

export function loadedTeaItemImage(item: LoadedTeaMenuItem): { url: string; alt: string } {
  const image = 'image' in item && item.image ? item.image : null;
  if (image) {
    return { url: image, alt: item.name };
  }
  return { url: LOADED_TEAS_MENU.heroImage.url, alt: item.name };
}

export function loadedTeaChipColor(index: number): string {
  return LOADED_TEA_CHIP_COLORS[index % LOADED_TEA_CHIP_COLORS.length];
}

export function loadedTeaVariantSku(sizeSlug: string, itemSlug: string): string {
  const sizeKey = sizeSlug.replace('oz', '');
  return loadedTeaIsPremium(itemSlug) ? `FFB-LTEA-P${sizeKey}` : `FFB-LTEA-${sizeKey}`;
}

export function loadedTeaProductShortDescription(): string {
  return `${LOADED_TEAS_MENU.servingNote}. ${loadedTeaPricingSummary()}`;
}

export function loadedTeaProductDescriptionHtml(): string {
  return '';
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

export function loadedTeaOptionalAddInSlugs(): string[] {
  return LOADED_TEAS_MENU.optionalAddOns.map((addOn) => addOn.slug);
}

export function loadedTeaOptionalAddOnsSummary(): string {
  return LOADED_TEAS_MENU.optionalAddOns.map((addOn) => addOn.name).join(' · ');
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
