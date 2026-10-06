import { resolvePublicImageUrl } from '@/lib/public-image';
import { isUploadedImageUrl } from '@/lib/product-display';

export function normalizeStorefrontImageUrl(url?: string | null): string {
  return resolvePublicImageUrl(url?.trim() || null);
}

/** Next.js image optimizer can fail on dynamic `/api/uploads` routes — serve bytes directly. */
export function useUnoptimizedStorefrontImage(url: string): boolean {
  return url.startsWith('/api/uploads/');
}

export function isUsableStorefrontImage(url?: string | null): boolean {
  const normalized = normalizeStorefrontImageUrl(url);
  if (!normalized || normalized === '/images/mega-tea.png') {
    return Boolean(url?.trim() && isUploadedImageUrl(url.trim()));
  }
  return true;
}
