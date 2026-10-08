import connectDB from '@/lib/mongodb';
import ProductCategory from '@/models/ProductCategory';

/** Legacy / duplicate category slugs → canonical slug used by seed & catalog UI. */
export const ADMIN_CATEGORY_SLUG_ALIASES: Record<string, string> = {
  'loaded-teas': 'mega-teas',
};

export function getCanonicalAdminCategorySlug(slug: string): string {
  return ADMIN_CATEGORY_SLUG_ALIASES[slug] ?? slug;
}

/** Slug used for menu catalog UI (loaded teas = mega-teas layout). */
export function normalizeAdminCatalogCategorySlug(slug: string): string {
  return slug === 'loaded-teas' ? 'mega-teas' : slug;
}

export const LOADED_TEAS_CATEGORY_SLUGS = ['mega-teas', 'loaded-teas'] as const;

export function isLoadedTeasCategorySlug(slug: string): boolean {
  return LOADED_TEAS_CATEGORY_SLUGS.includes(slug as (typeof LOADED_TEAS_CATEGORY_SLUGS)[number]);
}

/** Use canonical slug when that category exists in DB (published). */
export async function resolveAdminCategorySlug(slug: string): Promise<string> {
  const canonical = getCanonicalAdminCategorySlug(slug);
  if (canonical === slug) return slug;

  await connectDB();
  const exists = await ProductCategory.exists({ slug: canonical, status: 'published' });
  return exists ? canonical : slug;
}
