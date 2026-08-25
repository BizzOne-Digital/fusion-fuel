/** Donut of the Day — rotating daily selection, no fixed product list. */

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export const DONUT_OF_THE_DAY_MENU = {
  slug: 'donut-of-the-day',
  headline: 'Donut of the Day',
  description:
    'Fresh mini donuts with a rotating daily selection — sprinkles, glazes, cookies & cream, and more.',
  pack: { count: 4, price: 4.99 },
  footnote: 'Flavors change daily. Ask in store for today’s pick.',
  image: '/images/donut-of-the-day.png',
} as const;

export function donutOfTheDayPricingSummary(): string {
  const { pack } = DONUT_OF_THE_DAY_MENU;
  return `Mini donuts — ${pack.count} for ${formatUsd(pack.price)}`;
}
