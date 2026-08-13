import connectDB from '@/lib/mongodb';
import ProductCategory from '@/models/ProductCategory';
import EditProductClient from '@/components/admin/EditProductClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  await connectDB();
  const categories = await ProductCategory.find().sort({ order: 1 }).lean();
  return (
    <EditProductClient
      productId={id}
      categories={categories.map((c) => ({ id: String(c._id), name: c.name }))}
    />
  );
}
