import { getMenuCatalogData } from '@/lib/menu-catalog/repository';
import {
  parseProteinCoffeeVariantSku,
  resolveProteinCoffeeSizePriceCents,
} from '@/lib/menu-catalog/protein-coffee-catalog';
import type { ProteinCoffeeCatalogData } from '@/types/menu-catalog';

export {
  parseProteinCoffeeVariantSku,
  resolveProteinCoffeeSizePriceCents,
} from '@/lib/menu-catalog/protein-coffee-catalog';

export async function getProteinCoffeeCatalogData(): Promise<ProteinCoffeeCatalogData> {
  return getMenuCatalogData('protein-coffee');
}

export async function resolveProteinCoffeeVariantPriceCents(variantSku: string): Promise<number | null> {
  const parsed = parseProteinCoffeeVariantSku(variantSku);
  if (!parsed) return null;
  const catalog = await getProteinCoffeeCatalogData();
  return resolveProteinCoffeeSizePriceCents(catalog, parsed.sizeSlug, parsed.flavorSlug);
}
