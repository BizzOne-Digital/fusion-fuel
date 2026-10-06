/** Fallback when legacy disk `/uploads/...` paths are missing (e.g. after serverless deploy). */
export const LEGACY_UPLOAD_PLACEHOLDER = '/images/mega-tea.png';

export function resolvePublicImageUrl(url?: string | null, fallback = LEGACY_UPLOAD_PLACEHOLDER): string {
  const trimmed = url?.trim();
  if (!trimmed) {
    return fallback;
  }

  if (trimmed.startsWith('/uploads/')) {
    return fallback;
  }

  return trimmed;
}

export function categoryImageUrl(
  category: { slug: string; image?: { url?: string } | null },
  staticFallback: string
): string {
  const fromDb = category.image?.url?.trim();
  if (fromDb) {
    return resolvePublicImageUrl(fromDb, staticFallback);
  }
  return staticFallback;
}
