import type { IProduct } from '@/models/Product';
import { acaiBowlMenuItem } from '@/lib/acai-bowls-menu';
import { waffleMenuItem } from '@/lib/waffles-menu';
import { normalizeStorefrontImageUrl } from '@/lib/storefront-image';

/** Admin-managed images (Mongo-backed or legacy disk uploads). */
export function isUploadedImageUrl(url: string): boolean {
  return url.startsWith('/api/uploads/') || url.startsWith('/uploads/');
}

export function getProductGalleryImages(product: IProduct): Array<{ url: string; alt: string }> {
  return (product.images ?? [])
    .filter((image) => image.url?.trim())
    .map((image) => ({
      url: normalizeStorefrontImageUrl(image.url),
      alt: image.alt || '',
    }));
}

/** Static menu image when the product record has no gallery yet (e.g. after a menu-only deploy). */
export function getMenuCatalogImageUrl(productSlug: string): string | null {
  const acaiItem = acaiBowlMenuItem(productSlug);
  if (acaiItem && 'image' in acaiItem && acaiItem.image) {
    return acaiItem.image;
  }
  const waffleItem = waffleMenuItem(productSlug);
  if (waffleItem?.image) {
    return waffleItem.image;
  }
  return null;
}

export function getPrimaryProductImage(
  product: IProduct,
  fallback?: { url: string; alt: string }
): { url: string; alt: string } | null {
  const gallery = getProductGalleryImages(product);
  const uploaded = gallery.find((image) => isUploadedImageUrl(image.url));
  if (uploaded) return uploaded;
  if (gallery.length > 0 && !gallery[0].url.startsWith('/placeholders/')) {
    return gallery[0];
  }
  if (fallback?.url) {
    return {
      url: normalizeStorefrontImageUrl(fallback.url),
      alt: fallback.alt,
    };
  }
  return null;
}

export function getVariantPriceCents(product: IProduct, variantSku: string): number | null {
  const sku = variantSku.trim().toUpperCase();
  if (!sku) return null;
  const variant = product.variants.find((entry) => entry.sku === sku);
  return variant && variant.price > 0 ? variant.price : null;
}

export function getVariantBySku(product: IProduct, variantSku: string) {
  const sku = variantSku.trim().toUpperCase();
  return product.variants.find((entry) => entry.sku === sku);
}

export function formatKitPriceSummary(product: IProduct, locale: 'en' | 'es' = 'en'): string {
  const kitSize = product.kitSizes[0];
  const cents = kitSize?.price ?? product.basePrice;
  if (!cents || cents <= 0) return '';
  const formatted = new Intl.NumberFormat(locale === 'es' ? 'es-US' : 'en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
  return `${formatted} each`;
}

export function filterProductFlavors<T extends { _id: unknown }>(
  flavors: T[],
  flavorIds?: unknown[]
): T[] {
  if (flavorIds === undefined || flavorIds === null) {
    return flavors;
  }
  if (flavorIds.length === 0) {
    return [];
  }
  const allowed = new Set(flavorIds.map((id) => String(id)));
  return flavors.filter((flavor) => allowed.has(String(flavor._id)));
}
