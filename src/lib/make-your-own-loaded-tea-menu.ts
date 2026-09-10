/** Make Your Own Loaded Tea — six drink builders with required and optional modifiers. */

export const MAKE_YOUR_OWN_LOADED_TEA_MENU = {
  slug: 'make-your-own-loaded-tea',
  headline: 'Make Your Own Loaded Tea',
  description:
    'Choose your drink style, pick your flavors and boosters, then add optional extras.',
  image: {
    url: '/images/loaded-teas/hero.jpg',
    alt: 'Colorful layered Fusion Fuel loaded tea with ice',
  },
} as const;

/** Sub-views under Menu → Loaded Teas (`mega-teas` category). */
export const LOADED_TEAS_MENU_VIEWS = {
  loadedTeas: 'loaded-teas',
  makeYourOwn: 'make-your-own',
} as const;

export function loadedTeasMenuHref(view?: string): string {
  if (!view) return '/menu?category=mega-teas';
  return `/menu?category=mega-teas&view=${view}`;
}

export const MYOLT_PRODUCT_SLUG_PREFIX = 'myolt-';

export const MYOLT_EXTRA_SELECTION_PRICE = 1;

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

export const MYOLT_ALOE_OPTIONS = [
  'Mango',
  'Mandarin',
  'Cranberry',
  'Regular',
  'Grape',
  'Cola',
  'Ginger',
] as const;

export const MYOLT_LIFTOFF_OPTIONS = [
  'Lemon-Lime',
  'Pomegranate-Berry',
  'Tropical Fruit',
  'Pineapple',
  'Cola',
  'Ginger',
] as const;

export const MYOLT_HERBAL_TEA_OPTIONS = [
  'Original',
  'Lemon',
  'Raspberry',
  'Peach',
  'Cinnamon',
  'Chai',
  'Sweet Ginger',
] as const;

export const MYOLT_COLLAGEN_OPTIONS = ['Unflavored', 'Strawberry Lemonade'] as const;

export const MYOLT_ADDON_HERBAL_TEA_FLAVORS = MYOLT_HERBAL_TEA_OPTIONS;

export const MYOLT_ADDON_NRG_FLAVORS = ['Orange', 'Mango', 'Lemon'] as const;

export const MYOLT_ADDON_FIBER_FLAVORS = ['Unflavoured', 'Tropical Twist', 'Apple Cider'] as const;

export const MYOLT_ADDON_HYDRATION_FLAVORS = ['H3O', 'CR7', 'Watermelon'] as const;

export const MYOLT_ADDON_COLLAGEN_FLAVORS = ['Strawberry', 'Lemonade'] as const;

export const MYOLT_OPTIONAL_ADDONS = {
  probiotics: { label: 'Probiotics', addInSlug: 'myolt-probiotics', price: 2 },
  collagen: {
    label: 'Collagen',
    addInSlug: 'myolt-collagen',
    price: 3,
    flavorOptions: MYOLT_ADDON_COLLAGEN_FLAVORS,
  },
  hydration: {
    label: 'Hydration',
    addInSlug: 'myolt-hydration-support',
    price: 3,
    flavorOptions: MYOLT_ADDON_HYDRATION_FLAVORS,
  },
  'immunity-shot': { label: 'Immunity Shot', addInSlug: 'myolt-immunity-shot', price: 2 },
  nrg: {
    label: 'NRG',
    addInSlug: 'myolt-nrg',
    price: 2,
    flavorOptions: MYOLT_ADDON_NRG_FLAVORS,
  },
  'fat-reducing-shot': { label: 'Fat Reducing Shot', addInSlug: 'myolt-fat-reducing-shot', price: 6 },
  'nitric-oxide': { label: 'Nitric Oxide', addInSlug: 'myolt-nitric-oxide', price: 3 },
  'protein-boost': { label: 'Protein Boost', addInSlug: 'myolt-protein-boost', price: 3 },
  'herbal-tea': {
    label: 'Herbal Tea',
    addInSlug: 'myolt-herbal-tea',
    price: 2,
    flavorOptions: MYOLT_ADDON_HERBAL_TEA_FLAVORS,
  },
  'coffee-shot': { label: 'Coffee Shot', addInSlug: 'myolt-coffee-shot', price: 2 },
  'fiber-creatine': { label: 'Fiber Creatine', addInSlug: 'myolt-fiber-creatine', price: 2 },
  fiber: {
    label: 'Fiber',
    addInSlug: 'myolt-fiber',
    price: 2,
    flavorOptions: MYOLT_ADDON_FIBER_FLAVORS,
  },
  boba: { label: 'Boba', addInSlug: 'myolt-boba', price: 2 },
  'extra-b12': { label: 'Extra B12', addInSlug: 'myolt-extra-b12', price: 3 },
  greens: { label: 'Greens', addInSlug: 'myolt-greens', price: 2 },
  aloe: { label: 'Aloe', addInSlug: 'myolt-aloe', price: 1 },
  'immunity-essentials': {
    label: 'Immunity Essentials',
    addInSlug: 'myolt-immunity-essentials',
    price: 1,
  },
  creatine: { label: 'Creatine', addInSlug: 'myolt-creatine', price: 1 },
} as const;

export type MyoltOptionalAddonKey = keyof typeof MYOLT_OPTIONAL_ADDONS;

export const MYOLT_STANDARD_BOOST_ADDONS: MyoltOptionalAddonKey[] = [
  'probiotics',
  'collagen',
  'hydration',
  'immunity-shot',
  'nrg',
  'fat-reducing-shot',
  'nitric-oxide',
  'protein-boost',
  'herbal-tea',
  'coffee-shot',
  'fiber-creatine',
  'boba',
  'extra-b12',
  'greens',
];

export type MyoltOptionalAddonQuantities = Partial<Record<MyoltOptionalAddonKey, number>>;

export type MyoltOptionalAddonFlavors = Partial<Record<MyoltOptionalAddonKey, string[]>>;

export interface MyoltRequiredGroup {
  id: string;
  title: string;
  options: readonly string[];
  multiSelect?: boolean;
  /** First N selections are included in the base price. */
  includedCount?: number;
  /** Price per selection beyond includedCount (defaults to $1). */
  extraSelectionPrice?: number;
}

export interface MyoltDrink {
  slug: string;
  name: string;
  price: number;
  includedSummary: string;
  websiteNotice: string;
  requiredGroups: MyoltRequiredGroup[];
  optionalAddons: MyoltOptionalAddonKey[];
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
      { id: 'aloe', title: 'Choose Aloe', options: MYOLT_ALOE_OPTIONS, multiSelect: true },
      { id: 'flavor', title: 'Choose flavors', options: MYOLT_FLAVORS, multiSelect: true },
    ],
    optionalAddons: ['probiotics', 'fiber', 'hydration'],
  },
  {
    slug: 'mini-energy',
    name: 'Mini Energy',
    price: 7,
    includedSummary: 'LiftOff + one flavor',
    websiteNotice: 'Contains caffeine from LiftOff.',
    requiredGroups: [
      {
        id: 'liftoff',
        title: 'Choose LiftOff',
        options: MYOLT_LIFTOFF_OPTIONS,
        multiSelect: true,
        includedCount: 1,
      },
      {
        id: 'flavor',
        title: 'Choose flavors',
        options: MYOLT_FLAVORS,
        multiSelect: true,
        includedCount: 1,
      },
    ],
    optionalAddons: [...MYOLT_STANDARD_BOOST_ADDONS],
  },
  {
    slug: 'beauty-refresher',
    name: 'Beauty Refresher',
    price: 8,
    includedSummary: 'Aloe + collagen + one flavor',
    websiteNotice:
      'Caffeine-free when prepared without LiftOff, NRG or Herbal Tea Concentrate.',
    requiredGroups: [
      {
        id: 'aloe',
        title: 'Choose Aloe',
        options: MYOLT_ALOE_OPTIONS,
        multiSelect: true,
        includedCount: 1,
        extraSelectionPrice: 2,
      },
      { id: 'collagen', title: 'Choose Collagen', options: MYOLT_COLLAGEN_OPTIONS },
      {
        id: 'flavor',
        title: 'Choose flavors',
        options: MYOLT_FLAVORS,
        multiSelect: true,
        includedCount: 1,
        extraSelectionPrice: 1,
      },
    ],
    optionalAddons: [...MYOLT_STANDARD_BOOST_ADDONS],
  },
  {
    slug: 'energy-tea',
    name: 'Energy Tea',
    price: 9,
    includedSummary: 'Herbal tea + LiftOff + one flavor',
    websiteNotice: 'Contains caffeine from Herbal Tea Concentrate and LiftOff.',
    requiredGroups: [
      {
        id: 'herbal-tea',
        title: 'Choose Herbal Tea',
        options: MYOLT_HERBAL_TEA_OPTIONS,
        multiSelect: true,
        includedCount: 1,
      },
      {
        id: 'liftoff',
        title: 'Choose LiftOff',
        options: MYOLT_LIFTOFF_OPTIONS,
        multiSelect: true,
        includedCount: 1,
      },
      {
        id: 'flavor',
        title: 'Choose flavors',
        options: MYOLT_FLAVORS,
        multiSelect: true,
        includedCount: 1,
      },
    ],
    optionalAddons: [...MYOLT_STANDARD_BOOST_ADDONS],
  },
  {
    slug: 'mega-tea',
    name: 'Mega Tea',
    price: 10,
    includedSummary: 'LiftOff + herbal tea + aloe + one flavor',
    websiteNotice: 'Contains caffeine from Herbal Tea Concentrate and LiftOff.',
    requiredGroups: [
      {
        id: 'herbal-tea',
        title: 'Choose Herbal Tea',
        options: MYOLT_HERBAL_TEA_OPTIONS,
        multiSelect: true,
        includedCount: 1,
      },
      {
        id: 'liftoff',
        title: 'Choose LiftOff',
        options: MYOLT_LIFTOFF_OPTIONS,
        multiSelect: true,
        includedCount: 1,
      },
      {
        id: 'aloe',
        title: 'Choose Aloe',
        options: MYOLT_ALOE_OPTIONS,
        multiSelect: true,
        includedCount: 1,
        extraSelectionPrice: 2,
      },
      {
        id: 'flavor',
        title: 'Choose flavors',
        options: MYOLT_FLAVORS,
        multiSelect: true,
        includedCount: 1,
      },
    ],
    optionalAddons: [...MYOLT_STANDARD_BOOST_ADDONS],
  },
  {
    slug: 'mega-beauty-tea',
    name: 'Mega Beauty Tea',
    price: 12,
    includedSummary: 'LiftOff + herbal tea + aloe + collagen + one flavor',
    websiteNotice: 'Contains caffeine from Herbal Tea Concentrate and LiftOff.',
    requiredGroups: [
      {
        id: 'herbal-tea',
        title: 'Choose Herbal Tea',
        options: MYOLT_HERBAL_TEA_OPTIONS,
        multiSelect: true,
        includedCount: 1,
      },
      {
        id: 'liftoff',
        title: 'Choose LiftOff',
        options: MYOLT_LIFTOFF_OPTIONS,
        multiSelect: true,
        includedCount: 1,
      },
      {
        id: 'aloe',
        title: 'Choose Aloe',
        options: MYOLT_ALOE_OPTIONS,
        multiSelect: true,
        includedCount: 1,
        extraSelectionPrice: 2,
      },
      { id: 'collagen', title: 'Choose Collagen', options: MYOLT_COLLAGEN_OPTIONS },
      {
        id: 'flavor',
        title: 'Choose flavors',
        options: MYOLT_FLAVORS,
        multiSelect: true,
        includedCount: 1,
      },
    ],
    optionalAddons: [...MYOLT_STANDARD_BOOST_ADDONS],
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

export function myoltAddonPriceCents(key: MyoltOptionalAddonKey): number {
  return Math.round(MYOLT_OPTIONAL_ADDONS[key].price * 100);
}

export function myoltAddonHasFlavorOptions(key: MyoltOptionalAddonKey): boolean {
  return 'flavorOptions' in MYOLT_OPTIONAL_ADDONS[key];
}

export function myoltAddonFlavorOptions(key: MyoltOptionalAddonKey): readonly string[] {
  const addon = MYOLT_OPTIONAL_ADDONS[key];
  return 'flavorOptions' in addon && addon.flavorOptions ? addon.flavorOptions : [];
}

export function myoltOptionalAddInSlugs(): string[] {
  return Object.values(MYOLT_OPTIONAL_ADDONS).map((addon) => addon.addInSlug);
}

export function myoltGroupExtraSelectionPriceCents(group: MyoltRequiredGroup): number {
  const price = group.extraSelectionPrice ?? MYOLT_EXTRA_SELECTION_PRICE;
  return Math.round(price * 100);
}

export interface MyoltOrderInput {
  drink: MyoltDrink;
  required: Record<string, string[]>;
  optionalAddons: MyoltOptionalAddonQuantities;
  addonFlavors: MyoltOptionalAddonFlavors;
}

export function myoltExtraSelectionTotalCents(input: MyoltOrderInput): number {
  let total = 0;
  for (const group of input.drink.requiredGroups) {
    const included = group.includedCount ?? 0;
    if (included === 0) continue;
    const selected = (input.required[group.id] ?? []).length;
    if (selected > included) {
      total += (selected - included) * myoltGroupExtraSelectionPriceCents(group);
    }
  }
  return total;
}

export function myoltOrderNotes(input: MyoltOrderInput): string {
  const lines = [`${input.drink.name}`];

  for (const group of input.drink.requiredGroups) {
    const values = input.required[group.id] ?? [];
    if (values.length > 0) {
      lines.push(`${group.title}: ${values.join(', ')}`);
    }
  }

  for (const key of input.drink.optionalAddons) {
    const qty = input.optionalAddons[key] ?? 0;
    if (qty === 0) continue;
    const addon = MYOLT_OPTIONAL_ADDONS[key];
    const flavors = input.addonFlavors[key] ?? [];
    if (flavors.length > 0) {
      lines.push(`${addon.label}: ${flavors.join(', ')}`);
    } else {
      lines.push(qty > 1 ? `${addon.label} x${qty}` : addon.label);
    }
  }

  return lines.join(' · ');
}

export function myoltLinePriceCents(input: MyoltOrderInput): number {
  const addonTotal = input.drink.optionalAddons.reduce((sum, key) => {
    const qty = input.optionalAddons[key] ?? 0;
    return sum + qty * myoltAddonPriceCents(key);
  }, 0);
  return myoltPriceCents(input.drink) + addonTotal + myoltExtraSelectionTotalCents(input);
}

export function myoltRequiredComplete(
  drink: MyoltDrink,
  required: Record<string, string[]>
): boolean {
  return drink.requiredGroups.every((group) => {
    const min = group.includedCount ?? 1;
    return (required[group.id] ?? []).length >= min;
  });
}

export function myoltAddonSelectionComplete(
  drink: MyoltDrink,
  optionalAddons: MyoltOptionalAddonQuantities,
  addonFlavors: MyoltOptionalAddonFlavors
): boolean {
  for (const key of drink.optionalAddons) {
    const qty = optionalAddons[key] ?? 0;
    if (qty === 0) continue;
    if (!myoltAddonHasFlavorOptions(key)) continue;
    const flavors = addonFlavors[key] ?? [];
    if (flavors.length !== qty || flavors.some((flavor) => !flavor)) return false;
  }
  return true;
}

export function myoltProductShortDescription(drink: MyoltDrink): string {
  const addonPrices = drink.optionalAddons
    .map((key) => `${MYOLT_OPTIONAL_ADDONS[key].label} $${MYOLT_OPTIONAL_ADDONS[key].price}`)
    .join(', ');
  return `Included: ${drink.includedSummary}. Optional add-ons: ${addonPrices}.`;
}

export function myoltProductDescriptionHtml(drink: MyoltDrink): string {
  const requiredHtml = drink.requiredGroups
    .map((group) => `<li><strong>${group.title}:</strong> ${group.options.join(', ')}</li>`)
    .join('');

  const optionalLabels = drink.optionalAddons.map(
    (key) => `${MYOLT_OPTIONAL_ADDONS[key].label} (+$${MYOLT_OPTIONAL_ADDONS[key].price})`
  );

  return `<p>${drink.includedSummary}</p><p><strong>Required modifiers</strong></p><ul>${requiredHtml}</ul><p><strong>Add-ons</strong></p><ul>${optionalLabels.map((label) => `<li>${label}</li>`).join('')}</ul><p><em>${drink.websiteNotice}</em></p>`;
}
