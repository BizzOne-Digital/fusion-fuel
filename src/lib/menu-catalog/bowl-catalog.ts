import {
  ACAI_BOWLS_MENU,
  type AcaiBowlModifierConfig,
  acaiBowlExtraToppingNames,
  acaiBowlExtraToppingPriceCents,
  acaiBowlItemSlug,
  acaiBowlMenuItem,
  acaiBowlModifierConfig,
  acaiBowlModifierSlug,
} from '@/lib/acai-bowls-menu';
import type { IAddIn } from '@/models/AddIn';
import type { IProduct } from '@/models/Product';
import { getAddInUnitPrice } from '@/lib/product-add-ins';
import type { BowlCategoryCatalogData, BowlTypeConfig } from '@/types/menu-catalog';
import type { Locale } from '@/types';

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function slugifyBowlTypeName(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return base || `bowl-${Date.now()}`;
}

export function uniqueBowlTypeSlug(name: string, existingSlugs: string[]): string {
  const base = slugifyBowlTypeName(name);
  if (!existingSlugs.includes(base)) return base;
  let index = 2;
  while (existingSlugs.includes(`${base}-${index}`)) {
    index += 1;
  }
  return `${base}-${index}`;
}

export function defaultNewBowlType(existingSlugs: string[]): BowlCategoryCatalogData['types'][number] {
  const slug = uniqueBowlTypeSlug('new-bowl', existingSlugs);
  return {
    slug,
    name: 'New bowl',
    description: '',
    price: 11.99,
    picksFruits: 2,
    picksToppings: 2,
  };
}

type ExtraTopping = BowlCategoryCatalogData['extraToppings'][number];

export function mergeBowlExtraToppingsForSync(
  primary: ExtraTopping[],
  secondary: ExtraTopping[]
): ExtraTopping[] {
  const map = new Map<string, ExtraTopping>();
  for (const row of secondary) {
    const name = row.name?.trim();
    if (!name) continue;
    map.set(name, row);
  }
  for (const row of primary) {
    const name = row.name?.trim();
    if (!name) continue;
    map.set(name, row);
  }
  const ordered: ExtraTopping[] = [];
  for (const row of primary) {
    const name = row.name?.trim();
    if (!name || !map.has(name)) continue;
    ordered.push(map.get(name)!);
    map.delete(name);
  }
  for (const row of map.values()) {
    ordered.push(row);
  }
  return ordered;
}

export function isBowlExtraToppingAddIn(slug: string): boolean {
  return slug.startsWith('acai-extra-topping-');
}

export function bowlExtraToppingNameFromAddIn(addIn: IAddIn): string {
  return addIn.name.en?.trim() || addIn.name.es?.trim() || addIn.slug;
}

export function resolveBowlExtraToppingsForStorefront(
  product: IProduct,
  productAddIns: IAddIn[],
  catalog?: BowlCategoryCatalogData,
  locale: Locale = 'en'
): {
  names: string[];
  priceCents: Record<string, number>;
  subtitle: string;
} {
  const bowlAddIns = productAddIns.filter((addIn) => isBowlExtraToppingAddIn(addIn.slug));
  const bySlug = new Map(bowlAddIns.map((addIn) => [addIn.slug, addIn]));

  const catalogNames = catalog ? bowlExtraToppingNames(catalog) : [];
  const namesFromAddIns = bowlAddIns.map((addIn) => bowlExtraToppingNameFromAddIn(addIn));

  let names: string[];
  if (catalogNames.length > 0) {
    const visibleCatalog = catalogNames.filter((name) =>
      bySlug.has(acaiBowlModifierSlug('extra-topping', name))
    );
    const extrasOnlyOnProduct = namesFromAddIns.filter((name) => !catalogNames.includes(name));
    names =
      visibleCatalog.length > 0
        ? [...visibleCatalog, ...extrasOnlyOnProduct]
        : namesFromAddIns.length > 0
          ? namesFromAddIns
          : acaiBowlExtraToppingNames();
  } else if (namesFromAddIns.length > 0) {
    names = namesFromAddIns;
  } else {
    names = acaiBowlExtraToppingNames();
  }

  const priceCents: Record<string, number> = {};
  for (const name of names) {
    const addIn = bySlug.get(acaiBowlModifierSlug('extra-topping', name));
    if (addIn) {
      priceCents[name] = getAddInUnitPrice(product, addIn);
    } else if (catalog) {
      priceCents[name] = bowlExtraToppingPriceCents(catalog, name);
    } else {
      priceCents[name] = acaiBowlExtraToppingPriceCents(name);
    }
  }

  const subtitle = catalog
    ? bowlExtraToppingsSubtitle(catalog, locale)
    : locale === 'es'
      ? 'Precios en cada topping'
      : 'Prices shown on each topping';

  return { names, priceCents, subtitle };
}

function isExtraTopping(value: unknown): value is ExtraTopping {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ExtraTopping).name === 'string' &&
    (value as ExtraTopping).name.trim().length > 0
  );
}

/** Repair legacy/corrupt extraToppings arrays (e.g. bare numbers or strings). */
export function normalizeBowlExtraToppings(
  stored: unknown,
  defaults: ExtraTopping[]
): ExtraTopping[] {
  if (!Array.isArray(stored) || stored.length === 0) {
    return defaults.map((entry) => ({ ...entry }));
  }

  const fallbackPrice = defaults[0]?.price ?? 1;

  const normalized = stored.map((entry, index) => {
    const defaultRow = defaults[index];

    if (typeof entry === 'string' && entry.trim()) {
      const match = defaults.find((d) => d.name === entry.trim());
      return { name: entry.trim(), price: match?.price ?? fallbackPrice, hidden: match?.hidden };
    }

    if (typeof entry === 'number' && Number.isFinite(entry)) {
      return {
        name: defaultRow?.name ?? `Extra topping ${index + 1}`,
        price: entry,
        hidden: defaultRow?.hidden,
      };
    }

    if (isExtraTopping(entry)) {
      const name = entry.name.trim() || defaultRow?.name || `Extra topping ${index + 1}`;
      const match = defaults.find((d) => d.name === name);
      return {
        name,
        price:
          typeof entry.price === 'number' && Number.isFinite(entry.price)
            ? entry.price
            : (match?.price ?? defaultRow?.price ?? fallbackPrice),
        hidden: entry.hidden ?? match?.hidden,
      };
    }

    if (defaultRow) {
      return { ...defaultRow };
    }

    return { name: `Extra topping ${index + 1}`, price: fallbackPrice };
  });

  return normalized.filter((row) => row.name.trim().length > 0);
}

export function normalizeBowlCategoryData(
  merged: BowlCategoryCatalogData,
  defaults: BowlCategoryCatalogData
): BowlCategoryCatalogData {
  return {
    ...merged,
    extraToppingDefaultPrice:
      typeof merged.extraToppingDefaultPrice === 'number' &&
      Number.isFinite(merged.extraToppingDefaultPrice)
        ? merged.extraToppingDefaultPrice
        : defaults.extraToppingDefaultPrice,
    extraToppings: normalizeBowlExtraToppings(merged.extraToppings, defaults.extraToppings),
  };
}

export function bowlCatalogTypeForProduct(
  catalog: BowlCategoryCatalogData,
  productSlug: string
): BowlTypeConfig | null {
  const itemSlug = acaiBowlItemSlug(productSlug);
  if (!itemSlug) return null;
  const type = catalog.types.find((entry) => entry.slug === itemSlug);
  if (!type || type.hidden) return null;
  return type;
}

export function resolveBowlModifierConfig(
  productSlug: string,
  catalog?: BowlCategoryCatalogData
): AcaiBowlModifierConfig | null {
  const catalogType = catalog ? bowlCatalogTypeForProduct(catalog, productSlug) : null;
  if (catalogType) {
    return {
      includedFruitMax: catalogType.picksFruits,
      includedToppingMax: catalogType.picksToppings,
      fixedIncludes: catalogType.includes ? [...catalogType.includes] : [],
    };
  }

  const menuItem = acaiBowlMenuItem(productSlug);
  return menuItem ? acaiBowlModifierConfig(menuItem) : null;
}

export function bowlIncludedFruitOptions(catalog?: BowlCategoryCatalogData): readonly string[] {
  if (catalog?.fruits?.length) return catalog.fruits;
  return ACAI_BOWLS_MENU.includedFruits;
}

export function bowlIncludedToppingOptions(catalog?: BowlCategoryCatalogData): readonly string[] {
  if (catalog?.toppings?.length) return catalog.toppings;
  return ACAI_BOWLS_MENU.includedToppings;
}

export function bowlFootnote(catalog?: BowlCategoryCatalogData): string {
  const trimmed = catalog?.footnote?.trim();
  return trimmed || ACAI_BOWLS_MENU.footnote;
}

export function bowlExtraToppingNames(catalog: BowlCategoryCatalogData): string[] {
  return catalog.extraToppings
    .filter((row) => !row.hidden && row.name.trim())
    .map((row) => row.name.trim());
}

export function bowlExtraToppingPriceCents(
  catalog: BowlCategoryCatalogData,
  toppingName: string
): number {
  const row = catalog.extraToppings.find(
    (entry) => entry.name === toppingName && !entry.hidden
  );
  const dollars =
    row && typeof row.price === 'number' && Number.isFinite(row.price)
      ? row.price
      : catalog.extraToppingDefaultPrice;
  return Math.round(dollars * 100);
}

export function bowlExtraToppingPriceMap(
  catalog: BowlCategoryCatalogData
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const name of bowlExtraToppingNames(catalog)) {
    map[name] = bowlExtraToppingPriceCents(catalog, name);
  }
  return map;
}

export function bowlExtraToppingsSubtitle(
  catalog: BowlCategoryCatalogData,
  locale: Locale
): string {
  const rows = catalog.extraToppings.filter((row) => !row.hidden && row.name.trim());
  if (rows.length === 0) {
    return locale === 'es'
      ? 'Precios en cada topping'
      : 'Prices shown on each topping';
  }

  const byPrice = new Map<number, string[]>();
  for (const row of rows) {
    const price =
      typeof row.price === 'number' && Number.isFinite(row.price)
        ? row.price
        : catalog.extraToppingDefaultPrice;
    const list = byPrice.get(price) ?? [];
    list.push(row.name.trim());
    byPrice.set(price, list);
  }

  if (byPrice.size === 1) {
    const price = [...byPrice.keys()][0] ?? catalog.extraToppingDefaultPrice;
    return locale === 'es'
      ? `Cada topping extra ${formatUsd(price)}`
      : `Each extra topping ${formatUsd(price)}`;
  }

  const segments = [...byPrice.entries()]
    .sort(([a], [b]) => a - b)
    .map(([price, names]) => {
      const label = formatUsd(price);
      if (names.length === 1) {
        return `${names[0]} ${label}`;
      }
      if (names.length <= 3) {
        const joined = names.join(locale === 'es' ? ' y ' : ' and ');
        return `${joined} ${label}`;
      }
      return locale === 'es' ? `La mayoría ${label}` : `Most toppings ${label}`;
    });

  return segments.join(locale === 'es' ? '; ' : '; ');
}
