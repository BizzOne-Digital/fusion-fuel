import { getMenuCatalogData } from '@/lib/menu-catalog/repository';
import { proteinShakeVariantSku } from '@/lib/protein-shakes-menu';
import { resolveProteinShakeSizePriceCents } from '@/lib/menu-catalog/protein-shakes-catalog';
import type { ProteinShakesCatalogData } from '@/types/menu-catalog';

export {
  resolveProteinShakeSizePriceCents,
} from '@/lib/menu-catalog/protein-shakes-catalog';

export function parseProteinShakeVariantSku(
  variantSku: string
): { sizeSlug: string; flavorSlug?: string } | null {
  const raw = variantSku.trim();
  if (!raw) return null;

  const dot = raw.indexOf('.');
  if (dot > 0) {
    const base = raw.slice(0, dot).toUpperCase();
    const flavorSlug = raw.slice(dot + 1).toLowerCase();
    const sizeSlug = sizeSlugFromShakeSku(base);
    if (!sizeSlug) return null;
    return { sizeSlug, flavorSlug };
  }

  const sizeSlug = sizeSlugFromShakeSku(raw.toUpperCase());
  return sizeSlug ? { sizeSlug } : null;
}

function sizeSlugFromShakeSku(sku: string): string | null {
  const legacy = /^FFB-SHAKE-(.+)$/i.exec(sku);
  if (legacy) {
    const part = legacy[1].toLowerCase();
    if (part === '24oz' || part === '24') return '24oz';
    if (part === '32oz' || part === '32') return '32oz';
    return part;
  }

  const modern = /^FFB-PSHK-(\d+)$/i.exec(sku);
  if (modern) {
    return `${modern[1]}oz`;
  }

  return null;
}

export async function getProteinShakesCatalogData(): Promise<ProteinShakesCatalogData> {
  return getMenuCatalogData('protein-shakes');
}

export async function resolveProteinShakeVariantPriceCents(variantSku: string): Promise<number | null> {
  const parsed = parseProteinShakeVariantSku(variantSku);
  if (!parsed) return null;
  const catalog = await getProteinShakesCatalogData();
  return resolveProteinShakeSizePriceCents(catalog, parsed.sizeSlug, parsed.flavorSlug);
}

export function proteinShakeCatalogVariantSku(sizeSlug: string, flavorSlug?: string): string {
  const base = proteinShakeVariantSku(sizeSlug);
  if (!base) return '';
  return flavorSlug ? `${base}.${flavorSlug.toLowerCase()}` : base;
}
