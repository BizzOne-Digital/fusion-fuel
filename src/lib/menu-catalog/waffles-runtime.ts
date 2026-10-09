import { getMenuCatalogData } from '@/lib/menu-catalog/repository';
import type { WafflesCatalogData } from '@/types/menu-catalog';

export {
  buildWaffleToppingGroupsFromExtras,
  normalizeWafflesCatalogData,
  waffleExtraToppingPriceCents,
  waffleExtraToppingPriceMap,
} from '@/lib/menu-catalog/waffles-catalog';

export async function getWafflesCatalogData(): Promise<WafflesCatalogData> {
  return getMenuCatalogData('waffles');
}
