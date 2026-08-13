'use client';

import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import ProductForm from '@/components/admin/ProductForm';

interface NewProductClientProps {
  categories: Array<{ id: string; name: { en: string } }>;
}

export default function NewProductClient({ categories }: NewProductClientProps) {
  const router = useRouter();
  return (
    <div>
      <AdminHeader title="New Product" description="Create a new product." />
      <ProductForm categories={categories} onSuccess={() => router.push('/admin/products')} />
    </div>
  );
}
