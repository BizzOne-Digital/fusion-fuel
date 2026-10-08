import connectDB from '@/lib/mongodb';
import MenuCatalog from '@/models/MenuCatalog';
import { getDefaultMenuCatalogData, isMenuCatalogCategorySlug } from '@/lib/menu-catalog/defaults';
import type { MenuCatalogCategorySlug, MenuCatalogDataBySlug } from '@/types/menu-catalog';

export async function getMenuCatalogData<S extends MenuCatalogCategorySlug>(
  categorySlug: S
): Promise<MenuCatalogDataBySlug[S]> {
  const defaults = getDefaultMenuCatalogData(categorySlug);
  try {
    await connectDB();
    const doc = await MenuCatalog.findOne({ categorySlug }).lean();
    if (!doc?.data) return defaults;
    return deepMergeDefaults(defaults, doc.data as MenuCatalogDataBySlug[S]);
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
