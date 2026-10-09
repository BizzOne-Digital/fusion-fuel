import connectDB from '@/lib/mongodb';
import MenuCatalog from '@/models/MenuCatalog';
import { getDefaultMenuCatalogData, isMenuCatalogCategorySlug } from '@/lib/menu-catalog/defaults';
import { normalizeBowlCategoryData } from '@/lib/menu-catalog/bowl-catalog';
import { normalizeProteinCoffeeCatalogData } from '@/lib/menu-catalog/protein-coffee-catalog';
import { normalizeProteinShakesCatalogData } from '@/lib/menu-catalog/protein-shakes-catalog';
import { normalizeWafflesCatalogData } from '@/lib/menu-catalog/waffles-catalog';
import { normalizeProteinTreatsCatalogData } from '@/lib/menu-catalog/protein-treats-catalog';
import type {
  BowlCategoryCatalogData,
  MenuCatalogCategorySlug,
  MenuCatalogDataBySlug,
  ProteinCoffeeCatalogData,
  ProteinShakesCatalogData,
  WafflesCatalogData,
  ProteinTreatsCatalogData,
} from '@/types/menu-catalog';

function finalizeCatalogData<S extends MenuCatalogCategorySlug>(
  categorySlug: S,
  defaults: MenuCatalogDataBySlug[S],
  merged: MenuCatalogDataBySlug[S]
): MenuCatalogDataBySlug[S] {
  if (categorySlug === 'acai-bowls' || categorySlug === 'protein-bowls') {
    return normalizeBowlCategoryData(
      merged as BowlCategoryCatalogData,
      defaults as BowlCategoryCatalogData
    ) as MenuCatalogDataBySlug[S];
  }
  if (categorySlug === 'protein-coffee') {
    return normalizeProteinCoffeeCatalogData(
      merged as ProteinCoffeeCatalogData,
      defaults as ProteinCoffeeCatalogData
    ) as MenuCatalogDataBySlug[S];
  }
  if (categorySlug === 'protein-shakes') {
    return normalizeProteinShakesCatalogData(
      merged as ProteinShakesCatalogData,
      defaults as ProteinShakesCatalogData
    ) as MenuCatalogDataBySlug[S];
  }
  if (categorySlug === 'waffles') {
    return normalizeWafflesCatalogData(
      merged as WafflesCatalogData,
      defaults as WafflesCatalogData
    ) as MenuCatalogDataBySlug[S];
  }
  if (categorySlug === 'protein-treats') {
    return normalizeProteinTreatsCatalogData(
      merged as ProteinTreatsCatalogData,
      defaults as ProteinTreatsCatalogData
    ) as MenuCatalogDataBySlug[S];
  }
  return merged;
}

export async function getMenuCatalogData<S extends MenuCatalogCategorySlug>(
  categorySlug: S
): Promise<MenuCatalogDataBySlug[S]> {
  const defaults = getDefaultMenuCatalogData(categorySlug);
  try {
    await connectDB();
    const doc = await MenuCatalog.findOne({ categorySlug }).lean();
    if (!doc?.data) return defaults;
    const merged = deepMergeDefaults(defaults, doc.data as MenuCatalogDataBySlug[S]);
    return finalizeCatalogData(categorySlug, defaults, merged);
  } catch {
    return defaults;
  }
}

export async function saveMenuCatalogData<S extends MenuCatalogCategorySlug>(
  categorySlug: S,
  data: MenuCatalogDataBySlug[S]
): Promise<void> {
  if (!isMenuCatalogCategorySlug(categorySlug)) {
    throw new Error('Invalid category slug');
  }
  await connectDB();
  await MenuCatalog.findOneAndUpdate(
    { categorySlug },
    { $set: { categorySlug, data } },
    { upsert: true, new: true }
  );
}

function deepMergeDefaults<T>(defaults: T, stored: T): T {
  if (stored == null) return defaults;
  if (Array.isArray(defaults) && Array.isArray(stored)) {
    return stored.length > 0 ? (stored as T) : defaults;
  }
  if (typeof defaults === 'object' && typeof stored === 'object') {
    const result = { ...defaults } as Record<string, unknown>;
    for (const key of Object.keys(stored as object)) {
      const defVal = (defaults as Record<string, unknown>)[key];
      const storedVal = (stored as Record<string, unknown>)[key];
      result[key] = deepMergeDefaults(defVal, storedVal);
    }
    return result as T;
  }
  return stored;
}
