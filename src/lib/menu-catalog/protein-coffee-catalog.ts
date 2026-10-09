import { proteinCoffeeIcedPriceCents } from '@/lib/protein-coffee-menu';
import type {
  LoadedTeaAddOnConfig,
  LoadedTeaSizeConfig,
  ProteinCoffeeCatalogData,
  ProteinCoffeeFlavorConfig,
} from '@/types/menu-catalog';

export function normalizeProteinCoffeeSizes(
  stored: unknown,
  defaults: LoadedTeaSizeConfig[]
): LoadedTeaSizeConfig[] {
  if (!Array.isArray(stored) || stored.length === 0) {
    return defaults.map((entry) => ({ ...entry }));
  }

  return stored.map((entry, index) => {
    const def = defaults.find((d) => d.slug === (entry as LoadedTeaSizeConfig)?.slug) ?? defaults[index];
    const row = entry as Partial<LoadedTeaSizeConfig>;
    const slug = row.slug?.trim() || def?.slug || `size-${index}`;
    const name = row.name?.trim() || def?.name || slug;
    const price =
      typeof row.price === 'number' && Number.isFinite(row.price)
        ? row.price
        : (def?.price ?? 0);

    return { slug, name, price, hidden: row.hidden };
  });
}

function normalizeFlavorSizePrices(
  stored: unknown,
  sizeSlugs: string[]
): Partial<Record<string, number>> | undefined {
  if (!stored || typeof stored !== 'object') return undefined;
  const raw = stored as Record<string, unknown>;
  const out: Partial<Record<string, number>> = {};
  for (const slug of sizeSlugs) {
    const value = raw[slug];
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
      out[slug] = value;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function normalizeProteinCoffeeFlavors(
  stored: unknown,
  defaults: ProteinCoffeeFlavorConfig[],
  sizeSlugs: string[]
): ProteinCoffeeFlavorConfig[] {
  if (!Array.isArray(stored) || stored.length === 0) {
    return defaults.map((entry) => ({ ...entry }));
  }

  return stored.map((entry, index) => {
    const def = defaults.find((d) => d.slug === (entry as ProteinCoffeeFlavorConfig)?.slug) ?? defaults[index];
    const row = entry as Partial<ProteinCoffeeFlavorConfig>;
    const slug = row.slug?.trim() || def?.slug || `flavor-${index}`;
    const name = row.name?.trim() || def?.name || slug;
    const image = row.image?.trim() || def?.image;
    const sizePrices = normalizeFlavorSizePrices(row.sizePrices, sizeSlugs) ?? def?.sizePrices;

    return { slug, name, image, hidden: row.hidden, sizePrices };
  });
}

export function normalizeProteinCoffeeAddOns(
  stored: unknown,
  defaults: LoadedTeaAddOnConfig[]
): LoadedTeaAddOnConfig[] {
  if (!Array.isArray(stored) || stored.length === 0) {
    return defaults.map((entry) => ({ ...entry }));
  }

  return stored.map((entry, index) => {
    const def = defaults.find((d) => d.slug === (entry as LoadedTeaAddOnConfig)?.slug) ?? defaults[index];
    const row = entry as Partial<LoadedTeaAddOnConfig>;
    const slug = row.slug?.trim() || def?.slug || `pcof-addon-${index}`;
    const name = row.name?.trim() || def?.name || slug;
    const price =
      typeof row.price === 'number' && Number.isFinite(row.price) ? row.price : (def?.price ?? 0);

    return {
      slug,
      name,
      description: row.description?.trim() || def?.description,
      price,
      hidden: row.hidden,
    };
  });
}

export function normalizeProteinCoffeeCatalogData(
  merged: ProteinCoffeeCatalogData,
  defaults: ProteinCoffeeCatalogData
): ProteinCoffeeCatalogData {
  const sizes = normalizeProteinCoffeeSizes(merged.sizes, defaults.sizes);
  const sizeSlugs = sizes.map((s) => s.slug);

  return {
    ...merged,
    sizes,
    flavors: normalizeProteinCoffeeFlavors(merged.flavors, defaults.flavors, sizeSlugs),
    addOns: normalizeProteinCoffeeAddOns(merged.addOns, defaults.addOns),
    formula1Flavors: normalizeProteinCoffeeAddOns(merged.formula1Flavors, defaults.formula1Flavors),
  };
}

function normalizeProteinCoffeeSizeSlug(part: string): string {
  const lower = part.toLowerCase();
  if (lower === 'iced24') return '24oz';
  if (lower === 'iced32') return '32oz';
  return lower;
}

export function parseProteinCoffeeVariantSku(
  variantSku: string
): { sizeSlug: string; flavorSlug?: string } | null {
  const raw = variantSku.trim();
  if (!raw) return null;

  const dot = raw.indexOf('.');
  if (dot > 0) {
    const base = raw.slice(0, dot);
    const flavorSlug = raw.slice(dot + 1).toLowerCase();
    const sizePart = base.replace(/^FFB-PCOF-/i, '');
    if (!sizePart) return null;
    return { sizeSlug: normalizeProteinCoffeeSizeSlug(sizePart), flavorSlug };
  }

  const match = /^FFB-PCOF-(.+)$/i.exec(raw);
  if (!match) return null;
  return { sizeSlug: normalizeProteinCoffeeSizeSlug(match[1]) };
}

/** Price in cents from admin catalog (sizes + optional per-flavor overrides), then static menu fallback. */
export function resolveProteinCoffeeSizePriceCents(
  catalog: ProteinCoffeeCatalogData | undefined,
  sizeSlug: string,
  flavorSlug?: string
): number {
  if (flavorSlug && catalog) {
    const flavor = catalog.flavors.find((f) => f.slug === flavorSlug && !f.hidden);
    const override = flavor?.sizePrices?.[sizeSlug];
    if (typeof override === 'number' && Number.isFinite(override) && override >= 0) {
      return Math.round(override * 100);
    }
  }

  const catalogSize = catalog?.sizes.find((s) => s.slug === sizeSlug && !s.hidden);
  if (catalogSize && catalogSize.price > 0) {
    return Math.round(catalogSize.price * 100);
  }

  return proteinCoffeeIcedPriceCents(sizeSlug);
}
