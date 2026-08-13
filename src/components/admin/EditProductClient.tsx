'use client';

import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import ProductForm from '@/components/admin/ProductForm';

interface EditProductClientProps {
  productId: string;
  categories: Array<{ id: string; name: { en: string } }>;
}

export default function EditProductClient({ productId, categories }: EditProductClientProps) {
  const router = useRouter();
  return (
    <div>
      <AdminHeader title="Edit Product" />
      <ProductForm productId={productId} categories={categories} onSuccess={() => router.push('/admin/products')} />
    </div>
  );
}
