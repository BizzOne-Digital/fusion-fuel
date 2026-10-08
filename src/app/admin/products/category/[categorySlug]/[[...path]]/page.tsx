import { notFound, redirect } from 'next/navigation';
import AdminCategoryCatalogView from '@/components/admin/AdminCategoryCatalogView';
import {
  isLoadedTeasCategorySlug,
  LOADED_TEAS_CATEGORY_SLUGS,
  normalizeAdminCatalogCategorySlug,
  resolveAdminCategorySlug,
} from '@/lib/admin/category-slug';
import {
  getPublishedCategoryForAdminBrowse,
  listPublishedProductsForCategory,
  listPublishedProductsForCategorySlugs,
} from '@/lib/admin/load-published-products';

interface PageProps {
  params: Promise<{ categorySlug: string; path?: string[] }>;
}

export default async function AdminCategoryCatalogPage({ params }: PageProps) {
  const { categorySlug, path = [] } = await params;
  const catalogSlug = await resolveAdminCategorySlug(categorySlug);

  if (catalogSlug !== categorySlug) {
    const suffix = path.length > 0 ? `/${path.join('/')}` : '';
    redirect(`/admin/products/category/${catalogSlug}${suffix}`);
  }

  const category =
    (await getPublishedCategoryForAdminBrowse(categorySlug)) ??
    (catalogSlug !== categorySlug ? await getPublishedCategoryForAdminBrowse(catalogSlug) : null);
  if (!category) notFound();

  const catalogCategorySlug = normalizeAdminCatalogCategorySlug(category.slug);

  const publishedProducts = isLoadedTeasCategorySlug(category.slug)
    ? await listPublishedProductsForCategorySlugs([...LOADED_TEAS_CATEGORY_SLUGS])
    : await listPublishedProductsForCategory(category.id);

  return (
    <AdminCategoryCatalogView
      category={{ slug: catalogCategorySlug, name: category.name }}
      path={path}
      publishedProducts={publishedProducts}
      browseSlug={category.slug}
    />
  );
}
