'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { adminFetch, formatCents } from '@/lib/admin/client';

interface CategoryTab {
  id: string;
  name: { en: string };
  slug: string;
}

interface ProductsByCategoryManagerProps {
  categories: CategoryTab[];
}

type ProductRow = {
  id: string;
  name: { en: string };
  sku: string;
  basePrice: number;
  status: string;
  slug: string;
};

export default function ProductsByCategoryManager({ categories }: ProductsByCategoryManagerProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? '');
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    if (!activeCategoryId) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await adminFetch<{ items: Array<Record<string, unknown>> }>(
      `/api/admin/products?categoryId=${encodeURIComponent(activeCategoryId)}&limit=200`
    );
    if (error) {
      toast.error(error);
      setProducts([]);
    } else {
      setProducts(
        (data?.items ?? []).map((item) => ({
          id: String(item.id ?? item._id),
          name: item.name as { en: string },
          sku: String(item.sku ?? ''),
          basePrice: Number(item.basePrice ?? 0),
          status: String(item.status ?? 'draft'),
          slug: String(item.slug ?? ''),
        }))
      );
    }
    setLoading(false);
  }, [activeCategoryId]);

  useEffect(() => {
    if (!activeCategoryId && categories[0]?.id) {
      setActiveCategoryId(categories[0].id);
      return;
    }
    void loadProducts();
  }, [activeCategoryId, categories, loadProducts]);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await adminFetch(`/api/admin/products/${deleteId}`, { method: 'DELETE' });
    setDeleting(false);
    setDeleteId(null);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Product deleted');
    void loadProducts();
  }

  async function toggleVisibility(product: ProductRow) {
    const nextStatus = product.status === 'published' ? 'draft' : 'published';
    setTogglingId(product.id);
    const { error } = await adminFetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus }),
    });
    setTogglingId(null);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(nextStatus === 'published' ? 'Product visible on menu' : 'Product hidden from menu');
    void loadProducts();
  }

  const activeCategory = categories.find((cat) => cat.id === activeCategoryId);

  return (
    <div>
      <AdminHeader
        title="Products by category"
        description="Edit, hide, delete, or add products. Images upload to MongoDB (works on Vercel)."
        action={{
          label: 'New product in category',
          href: activeCategoryId
            ? `/admin/products/new?categoryId=${encodeURIComponent(activeCategoryId)}`
            : '/admin/products/new',
        }}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategoryId(cat.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              cat.id === activeCategoryId
                ? 'bg-orange-500 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            {cat.name.en}
          </button>
        ))}
      </div>

      {activeCategory ? (
        <p className="mb-4 text-sm text-zinc-600">
          Category: <span className="font-medium">{activeCategory.name.en}</span> ({activeCategory.slug})
        </p>
      ) : null}

      {loading ? (
        <p className="text-zinc-500">Loading products…</p>
      ) : (
        <DataTable
          emptyMessage="No products in this category yet. Create one with the button above."
          columns={[
            {
              key: 'name',
              header: 'Product',
              render: (row) => (row as ProductRow).name.en,
            },
            { key: 'sku', header: 'SKU' },
            {
              key: 'basePrice',
              header: 'Price',
              render: (row) => formatCents((row as ProductRow).basePrice),
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <StatusBadge status={(row as ProductRow).status} />,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => {
                const product = row as ProductRow;
                const isPublished = product.status === 'published';
                return (
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/products/${product.id}`} className="text-sm text-orange-600 hover:underline">
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={togglingId === product.id}
                      className="text-sm text-zinc-700 hover:underline disabled:opacity-50"
                      onClick={() => void toggleVisibility(product)}
                    >
                      {togglingId === product.id ? '…' : isPublished ? 'Hide' : 'Show'}
                    </button>
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => setDeleteId(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                );
              },
            },
          ]}
          data={products as Array<Record<string, unknown>>}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete product?"
        message="This permanently removes the product. Orders that reference it are kept."
        destructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
