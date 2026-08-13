import connectDB from '@/lib/mongodb';
import ProductCategory from '@/models/ProductCategory';
import NewProductClient from '@/components/admin/NewProductClient';

export default async function NewProductPage() {
  await connectDB();
  const categories = await ProductCategory.find({ status: 'published' }).sort({ order: 1 }).lean();
  return (
    <NewProductClient
      categories={categories.map((c) => ({ id: String(c._id), name: c.name }))}
    />
  );
}
