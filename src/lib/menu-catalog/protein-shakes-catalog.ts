import { proteinShakeSizePriceCents } from '@/lib/protein-shakes-menu';
import type {
  LoadedTeaAddOnConfig,
  LoadedTeaSizeConfig,
  ProteinShakesCatalogData,
} from '@/types/menu-catalog';

export function normalizeProteinShakeSizes(
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

export function normalizeProteinShakeAddOns(
  stored: unknown,
  defaults: LoadedTeaAddOnConfig[]
): LoadedTeaAddOnConfig[] {
  if (!Array.isArray(stored) || stored.length === 0) {
    return defaults.map((entry) => ({ ...entry }));
  }

  return stored.map((entry, index) => {
    const def = defaults.find((d) => d.slug === (entry as LoadedTeaAddOnConfig)?.slug) ?? defaults[index];
    const row = entry as Partial<LoadedTeaAddOnConfig>;
    const slug = row.slug?.trim() || def?.slug || `pshk-addon-${index}`;
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

export function normalizeProteinShakesCatalogData(
  merged: ProteinShakesCatalogData,
  defaults: ProteinShakesCatalogData
): ProteinShakesCatalogData {
  return {
    ...merged,
    sizes: normalizeProteinShakeSizes(merged.sizes, defaults.sizes),
    addOns: normalizeProteinShakeAddOns(merged.addOns, defaults.addOns),
  };
}

/** Price in cents from admin catalog sizes, then static menu fallback. */
export function resolveProteinShakeSizePriceCents(
  catalog: ProteinShakesCatalogData | undefined,
  sizeSlug: string,
  flavorSlug?: string
): number {
  if (flavorSlug && catalog) {
    const flavor = catalog.flavors.find((f) => f.slug === flavorSlug && !f.hidden);
    if (flavor) {
      const override = sizeSlug === '24oz' ? flavor.price24 : flavor.price32;
      if (typeof override === 'number' && Number.isFinite(override) && override >= 0) {
        return Math.round(override * 100);
      }
    }
  }

  const catalogSize = catalog?.sizes.find((s) => s.slug === sizeSlug && !s.hidden);
  if (catalogSize && catalogSize.price > 0) {
    return Math.round(catalogSize.price * 100);
  }

  return proteinShakeSizePriceCents(sizeSlug);
}
