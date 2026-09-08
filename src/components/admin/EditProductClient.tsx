'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import ProductForm from '@/components/admin/ProductForm';
import { adminFetch } from '@/lib/admin/client';

interface EditProductClientProps {
  productId: string;
  categories: Array<{ id: string; name: { en: string } }>;
}

export default function EditProductClient({ productId, categories }: EditProductClientProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!window.confirm('Delete this product permanently?')) return;
    const { error } = await adminFetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Product deleted');
    router.push('/admin/products');
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <AdminHeader title="Edit Product" />
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete Product
        </button>
      </div>
      <ProductForm productId={productId} categories={categories} onSuccess={() => router.push('/admin/products')} />
    </div>
  );
}
