import ProductsCategoryBrowse from '@/components/admin/ProductsCategoryBrowse';
import { listPublishedCategoriesForAdmin } from '@/lib/admin/load-published-products';

export default async function AdminProductsPage() {
  const categories = await listPublishedCategoriesForAdmin();
  return <ProductsCategoryBrowse categories={categories} />;
}
