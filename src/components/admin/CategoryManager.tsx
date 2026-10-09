'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminStoredImage } from '@/components/admin/AdminStoredImage';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import SimpleCatalogForm from '@/components/admin/SimpleCatalogForm';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { adminFetch } from '@/lib/admin/client';
import { resolvePublicImageUrl } from '@/lib/public-image';

const API_BASE = '/api/admin/categories';

type CategoryRow = {
  id: string;
  name: { en: string; es: string };
  slug: string;
  description?: { en: string; es: string };
  order?: number;
  status: string;
  image?: { url: string; alt: string };
};

function mapCategoryRow(item: Record<string, unknown>): CategoryRow {
  return {
    id: String(item.id ?? item._id ?? ''),
    name: item.name as { en: string; es: string },
    slug: String(item.slug ?? ''),
    description: item.description as { en: string; es: string } | undefined,
    order: typeof item.order === 'number' ? item.order : 0,
    status: String(item.status ?? 'draft'),
    image: item.image as { url: string; alt: string } | undefined,
  };
}

export default function CategoryManager() {
  const [items, setItems] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [formKey, setFormKey] = useState('new');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [openingEditId, setOpeningEditId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await adminFetch<{ items: Array<Record<string, unknown>> }>(
      `${API_BASE}?limit=100`
    );
    if (error) {
      toast.error(error);
      setItems([]);
    } else {
      setItems((data?.items ?? []).map(mapCategoryRow).filter((row) => row.id.length > 0));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await adminFetch(`${API_BASE}/${deleteId}`, { method: 'DELETE' });
    setDeleting(false);
    setDeleteId(null);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Category deleted');
    void load();
  }

  async function toggleVisibility(row: CategoryRow) {
    const nextStatus = row.status === 'published' ? 'draft' : 'published';
    setTogglingId(row.id);
    const { error } = await adminFetch(`${API_BASE}/${row.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus }),
    });
    setTogglingId(null);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(nextStatus === 'published' ? 'Category visible on menu' : 'Category hidden from menu');
    void load();
  }

  async function openEdit(row: CategoryRow) {
    setOpeningEditId(row.id);
    const { data, error } = await adminFetch<{ item: Record<string, unknown> }>(`${API_BASE}/${row.id}`);
    setOpeningEditId(null);
    if (error) {
      toast.error(error);
      return;
    }
    const mapped = mapCategoryRow(data!.item);
    setEditing(mapped);
    setFormKey(mapped.id);
    setShowForm(true);
  }

  function openCreate() {
    setEditing(null);
    setFormKey(`new-${Date.now()}`);
    setShowForm(true);
  }

  return (
    <div>
      <AdminHeader
        title="Menu Categories"
        description="Manage menu sidebar categories (Loaded Teas, Mega Tea Kits, etc.). Hidden categories stay in admin but do not appear on the public menu."
      >
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          Add category
        </button>
      </AdminHeader>

      {showForm && (
        <div className="mb-8">
          <SimpleCatalogForm
            key={formKey}
            apiBase={API_BASE}
            itemId={editing?.id}
            initial={
              editing
                ? {
                    name: editing.name,
                    slug: editing.slug,
                    description: editing.description,
                    displayOrder: editing.order ?? 0,
                    status: editing.status,
                    image: editing.image,
                  }
                : undefined
            }
            fields={['description', 'image']}
            imageFolder="products"
            onSuccess={() => {
              setShowForm(false);
              setEditing(null);
              void load();
            }}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <p className="text-zinc-500">Loading…</p>
      ) : (
        <DataTable
          columns={[
            {
              key: 'image',
              header: 'Image',
              render: (row) => {
                const category = row as CategoryRow;
                const image = category.image;
                const src = resolvePublicImageUrl(image?.url, '/images/mega-tea.png');
                return (
                  <div className="relative h-12 w-12 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100">
                    <AdminStoredImage src={src} alt={image?.alt ?? ''} fill className="object-cover" />
                  </div>
                );
              },
            },
            {
              key: 'name',
              header: 'Name',
              render: (row) => (row as CategoryRow).name.en,
            },
            { key: 'slug', header: 'Slug' },
            {
              key: 'order',
              header: 'Order',
              render: (row) => String((row as CategoryRow).order ?? 0),
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <StatusBadge status={(row as CategoryRow).status} />,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => {
                const category = row as CategoryRow;
                const isPublished = category.status === 'published';
                const isOpening = openingEditId === category.id;
                return (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isOpening}
                      className="text-sm text-orange-600 hover:underline disabled:opacity-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        void openEdit(category);
                      }}
                    >
                      {isOpening ? 'Loading…' : 'Edit'}
                    </button>
                    <button
                      type="button"
                      disabled={togglingId === category.id}
                      className="text-sm text-zinc-700 hover:underline disabled:opacity-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        void toggleVisibility(category);
                      }}
                    >
                      {togglingId === category.id ? '…' : isPublished ? 'Hide' : 'Show'}
                    </button>
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(category.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                );
              },
            },
          ]}
          data={items as Array<Record<string, unknown>>}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete category?"
        message="Products may still reference this category slug. This cannot be undone."
        destructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
