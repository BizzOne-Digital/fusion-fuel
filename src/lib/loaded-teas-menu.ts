/** Refreshers / Loaded Teas menu from client poster. */

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export const LOADED_TEAS_MENU = {
  headline: 'Refreshers / Loaded Teas',
  servingNote: '24 oz & 32 oz',
  sizes: [
    { slug: '24oz', name: '24 oz' },
    { slug: '32oz', name: '32 oz', price: 8 },
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

export function loadedTeaSizePriceCents(sizeSlug: string): number {
  const size = LOADED_TEAS_MENU.sizes.find((entry) => entry.slug === sizeSlug);
  return size && 'price' in size && size.price != null ? Math.round(size.price * 100) : 0;
}

export function loadedTeaPricingNote(): string {
  const priced = LOADED_TEAS_MENU.sizes.filter(
    (size): size is (typeof LOADED_TEAS_MENU.sizes)[number] & { price: number } =>
      'price' in size && size.price != null
  );
  if (priced.length === 0) return 'Contact for pricing.';
  return priced.map((size) => `${size.name} ${formatUsd(size.price)}`).join(' · ');
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
    `<p><strong>Pricing:</strong> ${loadedTeaPricingNote()}</p>`,
  ].join('');
}
