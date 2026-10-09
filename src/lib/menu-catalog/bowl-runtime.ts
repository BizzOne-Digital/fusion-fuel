import { getMenuCatalogData } from '@/lib/menu-catalog/repository';
import type { BowlCategoryCatalogData } from '@/types/menu-catalog';

export {
  bowlCatalogTypeForProduct,
  bowlExtraToppingNames,
  bowlExtraToppingPriceCents,
  bowlExtraToppingPriceMap,
  bowlExtraToppingsSubtitle,
  bowlFootnote,
  bowlIncludedFruitOptions,
  bowlIncludedToppingOptions,
  resolveBowlExtraToppingsForStorefront,
  resolveBowlModifierConfig,
} from '@/lib/menu-catalog/bowl-catalog';

export async function getBowlCatalogData(
  categorySlug: 'acai-bowls' | 'protein-bowls'
): Promise<BowlCategoryCatalogData> {
  return getMenuCatalogData(categorySlug);
}
