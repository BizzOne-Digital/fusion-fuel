import { getMenuCatalogData } from '@/lib/menu-catalog/repository';
import {
  parseLoadedTeaVariantSku,
  resolveLoadedTeaSizePriceCents,
} from '@/lib/menu-catalog/loaded-tea-catalog';
import type { LoadedTeasCatalogData } from '@/types/menu-catalog';

export {
  buildLoadedTeaMenuView,
  resolveLoadedTeaItemPricingNote,
  resolveLoadedTeaIsPremium,
  resolveLoadedTeaSizePriceCents,
  parseLoadedTeaVariantSku,
  type LoadedTeaMenuView,
  type LoadedTeaMenuViewItem,
} from '@/lib/menu-catalog/loaded-tea-catalog';

export async function getLoadedTeasCatalogData(): Promise<LoadedTeasCatalogData> {
  const mega = await getMenuCatalogData('mega-teas');
  return mega.loadedTeas;
}

export async function resolveLoadedTeaVariantPriceCents(variantSku: string): Promise<number | null> {
  const parsed = parseLoadedTeaVariantSku(variantSku);
  if (!parsed) return null;
  const catalog = await getLoadedTeasCatalogData();
  return resolveLoadedTeaSizePriceCents(catalog, parsed.sizeSlug, parsed.flavorSlug);
}
