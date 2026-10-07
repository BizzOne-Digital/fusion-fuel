import { notFound } from 'next/navigation';
import AdminCategoryCatalogView from '@/components/admin/AdminCategoryCatalogView';
import {
  getPublishedCategoryBySlug,
  listPublishedProductsForCategory,
} from '@/lib/admin/load-published-products';

interface PageProps {
  params: Promise<{ categorySlug: string; path?: string[] }>;
}

export default async function AdminCategoryCatalogPage({ params }: PageProps) {
  const { categorySlug, path = [] } = await params;
  const category = await getPublishedCategoryBySlug(categorySlug);
  if (!category) notFound();

  const publishedProducts = await listPublishedProductsForCategory(category.id);

  return (
    <AdminCategoryCatalogView
      category={{ slug: category.slug, name: category.name }}
      path={path}
      publishedProducts={publishedProducts}
    />
  );
}
