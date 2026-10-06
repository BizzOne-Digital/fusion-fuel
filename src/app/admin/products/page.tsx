import connectDB from '@/lib/mongodb';
import ProductCategory from '@/models/ProductCategory';
import ProductsByCategoryManager from '@/components/admin/ProductsByCategoryManager';

export default async function AdminProductsPage() {
  await connectDB();
  const categories = await ProductCategory.find().sort({ order: 1 }).lean();

  return (
    <ProductsByCategoryManager
      categories={categories.map((category) => ({
        id: String(category._id),
        name: category.name,
        slug: category.slug,
      }))}
    />
  );
}
