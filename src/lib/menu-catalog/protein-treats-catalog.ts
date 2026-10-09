import { pieInACupSizePriceCents, proteinTrufflePackPriceCents } from '@/lib/protein-treats-menu';
import type {
  LoadedTeaSizeConfig,
  PieInACupFlavorConfig,
  ProteinTreatPackConfig,
  ProteinTreatsCatalogData,
} from '@/types/menu-catalog';

export function pieSizeVariantSuffix(sizeSlug: string): string {
  const match = /^(\d+)oz$/i.exec(sizeSlug.trim());
  if (match) return `${match[1]}OZ`;
  return sizeSlug.toUpperCase();
}

export function normalizePieInACupSizes(
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
      typeof row.price === 'number' && Number.isFinite(row.price) ? row.price : (def?.price ?? 0);
    return { slug, name, price, hidden: row.hidden };
  });
}

export function normalizePieInACupFlavors(
  stored: unknown,
  defaults: PieInACupFlavorConfig[]
): PieInACupFlavorConfig[] {
  if (!Array.isArray(stored) || stored.length === 0) {
    return defaults.map((entry) => ({ ...entry }));
  }
  return stored.map((entry, index) => {
    const def = defaults.find((d) => d.slug === (entry as PieInACupFlavorConfig)?.slug) ?? defaults[index];
    const row = entry as Partial<PieInACupFlavorConfig>;
    const slug = row.slug?.trim() || def?.slug || `flavor-${index}`;
    const name = row.name?.trim() || def?.name || slug;
    const image = row.image?.trim() || def?.image;
    const sizePrices =
      row.sizePrices && typeof row.sizePrices === 'object'
        ? { ...row.sizePrices }
        : def?.sizePrices;
    return { slug, name, image, hidden: row.hidden, sizePrices };
  });
}

export function normalizeTrufflePacks(
  stored: unknown,
  defaults: ProteinTreatPackConfig[]
): ProteinTreatPackConfig[] {
  if (!Array.isArray(stored) || stored.length === 0) {
    return defaults.map((entry) => ({ ...entry }));
  }
  return stored.map((entry, index) => {
    const def = defaults.find((d) => d.slug === (entry as ProteinTreatPackConfig)?.slug) ?? defaults[index];
    const row = entry as Partial<ProteinTreatPackConfig>;
    const slug = row.slug?.trim() || def?.slug || `pack-${index}`;
    return {
      slug,
      name: row.name?.trim() || def?.name || slug,
      label: row.label?.trim() || def?.label || slug,
      price: typeof row.price === 'number' && Number.isFinite(row.price) ? row.price : (def?.price ?? 0),
      count: typeof row.count === 'number' && row.count > 0 ? row.count : (def?.count ?? 1),
      hidden: row.hidden,
    };
  });
}

export function normalizeProteinTreatsCatalogData(
  merged: ProteinTreatsCatalogData,
  defaults: ProteinTreatsCatalogData
): ProteinTreatsCatalogData {
  return {
    ...merged,
    truffles: {
      ...merged.truffles,
      packs: normalizeTrufflePacks(merged.truffles.packs, defaults.truffles.packs),
    },
    pieInACup: {
      ...merged.pieInACup,
      sizes: normalizePieInACupSizes(merged.pieInACup.sizes, defaults.pieInACup.sizes),
      flavors: normalizePieInACupFlavors(merged.pieInACup.flavors, defaults.pieInACup.flavors),
    },
  };
}

export function resolvePieInACupSizePriceCents(
  catalog: ProteinTreatsCatalogData | undefined,
  sizeSlug: string,
  flavorSlug?: string
): number {
  if (flavorSlug && catalog) {
    const flavor = catalog.pieInACup.flavors.find((f) => f.slug === flavorSlug && !f.hidden);
    const override = flavor?.sizePrices?.[sizeSlug];
    if (typeof override === 'number' && Number.isFinite(override) && override >= 0) {
      return Math.round(override * 100);
    }
  }

  const catalogSize = catalog?.pieInACup.sizes.find((s) => s.slug === sizeSlug && !s.hidden);
  if (catalogSize && catalogSize.price > 0) {
    return Math.round(catalogSize.price * 100);
  }

  return pieInACupSizePriceCents(sizeSlug);
}

export function resolveTrufflePackPriceCents(
  catalog: ProteinTreatsCatalogData | undefined,
  packSlug: string
): number {
  const pack = catalog?.truffles.packs.find((p) => p.slug === packSlug && !p.hidden);
  if (pack) return Math.round(pack.price * 100);
  return proteinTrufflePackPriceCents(packSlug);
}

export function parsePieInACupVariantSku(
  variantSku: string
): { sizeSlug: string; flavorSlug?: string } | null {
  const raw = variantSku.trim();
  if (!raw) return null;

  const dot = raw.indexOf('.');
  const base = dot > 0 ? raw.slice(0, dot) : raw;
  const flavorSlug = dot > 0 ? raw.slice(dot + 1).toLowerCase() : undefined;

  const legacy = /^FFB-PIE-(.+)$/i.exec(base);
  if (legacy) {
    const part = legacy[1].toLowerCase();
    const sizeSlug = /^\d+oz$/i.test(part) ? part : `${part.replace(/oz$/i, '')}oz`;
    return { sizeSlug, flavorSlug };
  }

  const suffix = base.includes('-') ? base.slice(base.lastIndexOf('-') + 1) : base;
  const sizeMatch = /^(\d+)OZ$/i.exec(suffix);
  if (sizeMatch) {
    return { sizeSlug: `${sizeMatch[1]}oz`, flavorSlug };
  }

  if (/^\d+oz$/i.test(base.toLowerCase())) {
    return { sizeSlug: base.toLowerCase(), flavorSlug };
  }

  return null;
}
