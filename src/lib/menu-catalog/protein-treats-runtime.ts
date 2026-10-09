import { getMenuCatalogData } from '@/lib/menu-catalog/repository';
import {
  parsePieInACupVariantSku,
  resolvePieInACupSizePriceCents,
} from '@/lib/menu-catalog/protein-treats-catalog';

export {
  normalizeProteinTreatsCatalogData,
  resolvePieInACupSizePriceCents,
  resolveTrufflePackPriceCents,
} from '@/lib/menu-catalog/protein-treats-catalog';

export async function getProteinTreatsCatalogData() {
  return getMenuCatalogData('protein-treats');
}

export async function resolvePieInACupVariantPriceCents(variantSku: string): Promise<number | null> {
  const parsed = parsePieInACupVariantSku(variantSku);
  if (!parsed) return null;
  const catalog = await getProteinTreatsCatalogData();
  return resolvePieInACupSizePriceCents(catalog, parsed.sizeSlug, parsed.flavorSlug);
}
