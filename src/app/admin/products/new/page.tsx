import connectDB from '@/lib/mongodb';
import ProductCategory from '@/models/ProductCategory';
import NewProductClient from '@/components/admin/NewProductClient';

interface PageProps {
  searchParams: Promise<{ categoryId?: string }>;
}

export default async function NewProductPage({ searchParams }: PageProps) {
  const { categoryId } = await searchParams;
  await connectDB();
  const categories = await ProductCategory.find().sort({ order: 1 }).lean();
  return (
    <NewProductClient
      categories={categories.map((c) => ({ id: String(c._id), name: c.name }))}
      defaultCategoryId={categoryId}
    />
  );
}
