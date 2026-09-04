/** Make Your Own Loaded Tea — six drink builders with required and optional modifiers. */

export const MAKE_YOUR_OWN_LOADED_TEA_MENU = {
  slug: 'make-your-own-loaded-tea',
  headline: 'Make Your Own Loaded Tea',
  description:
    'Choose your drink style, pick your flavors and boosters, then add optional extras for $1 each.',
  image: {
    url: '/images/loaded-teas/hero.jpg',
    alt: 'Colorful layered Fusion Fuel loaded tea with ice',
  },
} as const;

export const MYOLT_PRODUCT_SLUG_PREFIX = 'myolt-';

export const MYOLT_FLAVORS = [
  'Strawberry',
  'Watermelon',
  'Blue Raspberry',
  'Peach',
  'Pineapple',
  'Mango',
  'Grape',
  'Green Apple',
  'Cherry',
  'Fruit Punch',
  'Lemonade',
  'Pink Lemonade',
  'Orange',
  'Passion Fruit',
] as const;

export const MYOLT_ALOE_OPTIONS = ['Mango', 'Mandarin', 'Cranberry', 'Original'] as const;

export const MYOLT_LIFTOFF_OPTIONS = [
  'Lemon-Lime',
  'Pomegranate-Berry',
  'Tropical Fruit',
  'Pineapple',
] as const;

export const MYOLT_HERBAL_TEA_OPTIONS = ['Original', 'Lemon', 'Peach', 'Raspberry'] as const;

export const MYOLT_COLLAGEN_OPTIONS = ['Unflavored', 'Strawberry Lemonade'] as const;

export const MYOLT_HYDRATION_OPTIONS = [
  'No hydration add-on',
  'H24 Hydrate — Watermelon',
  'CR7 Drive',
  'H3O',
] as const;

export const MYOLT_PAID_ADDON_PRICE = 1;

export const MYOLT_OPTIONAL_ADDONS = {
  probiotics: { label: 'Probiotics', addInSlug: 'myolt-probiotics' },
  fiber: { label: 'Fiber', addInSlug: 'myolt-fiber' },
  aloe: { label: 'Aloe', addInSlug: 'myolt-aloe' },
  collagen: { label: 'Collagen', addInSlug: 'myolt-collagen' },
  'herbal-tea': { label: 'Herbal tea', addInSlug: 'myolt-herbal-tea' },
  'immunity-essentials': { label: 'Immunity Essentials', addInSlug: 'myolt-immunity-essentials' },
  creatine: { label: 'Creatine', addInSlug: 'myolt-creatine' },
} as const;

export type MyoltOptionalAddonKey = keyof typeof MYOLT_OPTIONAL_ADDONS;

export interface MyoltRequiredGroup {
  id: string;
  title: string;
  options: readonly string[];
}

export interface MyoltDrink {
  slug: string;
  name: string;
  price: number;
  includedSummary: string;
  websiteNotice: string;
  requiredGroups: MyoltRequiredGroup[];
  optionalAddons: MyoltOptionalAddonKey[];
  hydration: boolean;
}

export const MYOLT_DRINKS: MyoltDrink[] = [
  {
    slug: 'kids-refresher',
    name: 'Kids Refresher — Caffeine-Free',
    price: 6,
    includedSummary: 'Aloe + one flavor',
    websiteNotice:
      'Caffeine-free. Does not include LiftOff, NRG or Herbal Tea Concentrate.',
    requiredGroups: [
      { id: 'aloe', title: 'Choose Aloe', options: MYOLT_ALOE_OPTIONS },
      { id: 'flavor', title: 'Choose one flavor', options: MYOLT_FLAVORS },
    ],
    optionalAddons: ['probiotics', 'fiber'],
    hydration: true,
  },
  {
    slug: 'mini-energy',
    name: 'Mini Energy',
    price: 7,
    includedSummary: 'LiftOff + one flavor',
    websiteNotice: 'Contains caffeine from LiftOff.',
    requiredGroups: [
      { id: 'liftoff', title: 'Choose LiftOff', options: MYOLT_LIFTOFF_OPTIONS },
      { id: 'flavor', title: 'Choose one flavor', options: MYOLT_FLAVORS },
    ],
    optionalAddons: ['aloe', 'collagen', 'herbal-tea'],
    hydration: true,
  },
  {
    slug: 'beauty-refresher',
    name: 'Beauty Refresher',
    price: 8,
    includedSummary: 'Aloe + collagen + one flavor',
    websiteNotice:
      'Caffeine-free when prepared without LiftOff, NRG or Herbal Tea Concentrate.',
    requiredGroups: [
      { id: 'aloe', title: 'Choose Aloe', options: MYOLT_ALOE_OPTIONS },
      { id: 'collagen', title: 'Choose Collagen', options: MYOLT_COLLAGEN_OPTIONS },
      { id: 'flavor', title: 'Choose one flavor', options: MYOLT_FLAVORS },
    ],
    optionalAddons: ['probiotics', 'fiber'],
    hydration: true,
  },
  {
    slug: 'energy-tea',
    name: 'Energy Tea',
    price: 9,
    includedSummary: 'Herbal tea + LiftOff + one flavor',
    websiteNotice: 'Contains caffeine from Herbal Tea Concentrate and LiftOff.',
    requiredGroups: [
      { id: 'herbal-tea', title: 'Choose Herbal Tea', options: MYOLT_HERBAL_TEA_OPTIONS },
      { id: 'liftoff', title: 'Choose LiftOff', options: MYOLT_LIFTOFF_OPTIONS },
      { id: 'flavor', title: 'Choose one flavor', options: MYOLT_FLAVORS },
    ],
    optionalAddons: ['aloe', 'collagen'],
    hydration: true,
  },
  {
    slug: 'mega-tea',
    name: 'Mega Tea',
    price: 10,
    includedSummary: 'LiftOff + herbal tea + aloe + one flavor',
    websiteNotice: 'Contains caffeine from Herbal Tea Concentrate and LiftOff.',
    requiredGroups: [
      { id: 'herbal-tea', title: 'Choose Herbal Tea', options: MYOLT_HERBAL_TEA_OPTIONS },
      { id: 'liftoff', title: 'Choose LiftOff', options: MYOLT_LIFTOFF_OPTIONS },
      { id: 'aloe', title: 'Choose Aloe', options: MYOLT_ALOE_OPTIONS },
      { id: 'flavor', title: 'Choose one flavor', options: MYOLT_FLAVORS },
    ],
    optionalAddons: ['collagen', 'probiotics', 'fiber'],
    hydration: true,
  },
  {
    slug: 'mega-beauty-tea',
    name: 'Mega Beauty Tea',
    price: 12,
    includedSummary: 'LiftOff + herbal tea + aloe + collagen + one flavor',
    websiteNotice: 'Contains caffeine from Herbal Tea Concentrate and LiftOff.',
    requiredGroups: [
      { id: 'herbal-tea', title: 'Choose Herbal Tea', options: MYOLT_HERBAL_TEA_OPTIONS },
      { id: 'liftoff', title: 'Choose LiftOff', options: MYOLT_LIFTOFF_OPTIONS },
      { id: 'aloe', title: 'Choose Aloe', options: MYOLT_ALOE_OPTIONS },
      { id: 'collagen', title: 'Choose Collagen', options: MYOLT_COLLAGEN_OPTIONS },
      { id: 'flavor', title: 'Choose one flavor', options: MYOLT_FLAVORS },
    ],
    optionalAddons: ['probiotics', 'fiber', 'immunity-essentials', 'creatine'],
    hydration: true,
  },
];

export function myoltProductSlug(drinkSlug: string): string {
  return `${MYOLT_PRODUCT_SLUG_PREFIX}${drinkSlug}`;
}

export function isMakeYourOwnLoadedTeaProduct(slug: string): boolean {
  return slug.startsWith(MYOLT_PRODUCT_SLUG_PREFIX);
}

export function myoltDrinkFromProductSlug(slug: string): MyoltDrink | undefined {
  if (!isMakeYourOwnLoadedTeaProduct(slug)) return undefined;
  const drinkSlug = slug.slice(MYOLT_PRODUCT_SLUG_PREFIX.length);
  return MYOLT_DRINKS.find((drink) => drink.slug === drinkSlug);
}

export function myoltPriceCents(drink: MyoltDrink): number {
  return Math.round(drink.price * 100);
}

export function myoltPaidAddonPriceCents(): number {
  return Math.round(MYOLT_PAID_ADDON_PRICE * 100);
}

export function myoltAdditionalFlavorAddInSlug(): string {
  return 'myolt-additional-flavor';
}

export function myoltHydrationAddInSlug(): string {
  return 'myolt-hydration-support';
}

export function myoltOptionalAddInSlugs(): string[] {
  const slugs = new Set<string>([
    myoltAdditionalFlavorAddInSlug(),
    myoltHydrationAddInSlug(),
    ...Object.values(MYOLT_OPTIONAL_ADDONS).map((addon) => addon.addInSlug),
  ]);
  return [...slugs];
}

export function myoltHydrationIsPaid(hydration: string): boolean {
  return hydration !== MYOLT_HYDRATION_OPTIONS[0];
}

export interface MyoltOrderInput {
  drink: MyoltDrink;
  required: Record<string, string>;
  extraFlavors: string[];
  optionalAddons: MyoltOptionalAddonKey[];
  hydration: string;
}

export function myoltOrderNotes(input: MyoltOrderInput): string {
  const lines = [`${input.drink.name}`];

  for (const group of input.drink.requiredGroups) {
    const value = input.required[group.id];
    if (value) lines.push(`${group.title}: ${value}`);
  }

  if (input.extraFlavors.length > 0) {
    lines.push(`Additional flavors: ${input.extraFlavors.join(', ')}`);
  }

  for (const key of input.optionalAddons) {
    lines.push(MYOLT_OPTIONAL_ADDONS[key].label);
  }

  if (myoltHydrationIsPaid(input.hydration)) {
    lines.push(`Hydration: ${input.hydration}`);
  }

  return lines.join(' · ');
}

export function myoltPaidAddonCount(input: MyoltOrderInput): number {
  let count = input.extraFlavors.length + input.optionalAddons.length;
  if (myoltHydrationIsPaid(input.hydration)) count += 1;
  return count;
}

export function myoltLinePriceCents(input: MyoltOrderInput): number {
  return myoltPriceCents(input.drink) + myoltPaidAddonCount(input) * myoltPaidAddonPriceCents();
}

export function myoltRequiredComplete(drink: MyoltDrink, required: Record<string, string>): boolean {
  return drink.requiredGroups.every((group) => Boolean(required[group.id]?.trim()));
}

export function myoltProductShortDescription(drink: MyoltDrink): string {
  return `Included: ${drink.includedSummary}. Optional add-ons $${MYOLT_PAID_ADDON_PRICE} each.`;
}

export function myoltProductDescriptionHtml(drink: MyoltDrink): string {
  const requiredHtml = drink.requiredGroups
    .map((group) => `<li><strong>${group.title}:</strong> ${group.options.join(', ')}</li>`)
    .join('');

  const optionalLabels = [
    'Additional flavor',
    ...drink.optionalAddons.map((key) => MYOLT_OPTIONAL_ADDONS[key].label),
    ...(drink.hydration ? ['Hydration option'] : []),
  ];

  return `<p>${drink.includedSummary}</p><p><strong>Required modifiers</strong></p><ul>${requiredHtml}</ul><p><strong>Optional modifiers (+$${MYOLT_PAID_ADDON_PRICE} each)</strong></p><ul>${optionalLabels.map((label) => `<li>${label}</li>`).join('')}</ul><p><em>${drink.websiteNotice}</em></p>`;
}
