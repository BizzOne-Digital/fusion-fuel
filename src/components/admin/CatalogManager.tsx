'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminStoredImage } from '@/components/admin/AdminStoredImage';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import SimpleCatalogForm from '@/components/admin/SimpleCatalogForm';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { adminFetch, formatCents } from '@/lib/admin/client';
import { resolvePublicImageUrl } from '@/lib/public-image';
import type { StoredUploadFolder } from '@/lib/stored-upload-shared';

interface CatalogManagerProps {
  title: string;
  description: string;
  apiBase: string;
  fields: ('description' | 'price' | 'category' | 'color' | 'image')[];
  imageFolder?: StoredUploadFolder;
  showImageColumn?: boolean;
  columns: Array<{ key: string; header: string; renderKey?: string }>;
}

function mapRow(item: Record<string, unknown>) {
  return {
    ...item,
    id: String(item.id ?? item._id ?? ''),
  };
}

export default function CatalogManager({
  title,
  description,
  apiBase,
  fields,
  columns,
  imageFolder,
  showImageColumn = false,
}: CatalogManagerProps) {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [formKey, setFormKey] = useState('new');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [openingEditId, setOpeningEditId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await adminFetch<{ items: Array<Record<string, unknown>> }>(
      `${apiBase}?limit=300`
    );
    if (error) {
      toast.error(error);
      setItems([]);
    } else {
      setItems((data?.items ?? []).map(mapRow).filter((row) => row.id.length > 0));
    }
    setLoading(false);
  }, [apiBase]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await adminFetch(`${apiBase}/${deleteId}`, { method: 'DELETE' });
    setDeleting(false);
    setDeleteId(null);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Deleted');
    void load();
  }

  async function toggleVisibility(row: Record<string, unknown>) {
    const id = String(row.id);
    const currentStatus = String(row.status ?? 'draft');
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    setTogglingId(id);
    const { error } = await adminFetch(`${apiBase}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus }),
    });
    setTogglingId(null);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(nextStatus === 'published' ? 'Visible on site' : 'Hidden from site');
    void load();
  }

  async function openEdit(row: Record<string, unknown>) {
    const id = String(row.id);
    setOpeningEditId(id);
    const { data, error } = await adminFetch<{ item: Record<string, unknown> }>(`${apiBase}/${id}`);
    setOpeningEditId(null);
    if (error) {
      toast.error(error);
      return;
    }
    const mapped = mapRow(data!.item);
    setEditing(mapped);
    setFormKey(id);
    setShowForm(true);
  }

  function openCreate() {
    setEditing(null);
    setFormKey(`new-${Date.now()}`);
    setShowForm(true);
  }

  const tableColumns = [
    ...(showImageColumn
      ? [
          {
            key: 'image',
            header: 'Image',
            render: (row: Record<string, unknown>) => {
              const image = row.image as { url?: string; alt?: string } | undefined;
              const src = resolvePublicImageUrl(image?.url, '/images/mega-tea.png');
              return (
                <div className="relative h-10 w-10 overflow-hidden rounded border border-zinc-200 bg-zinc-100">
                  <AdminStoredImage src={src} alt={image?.alt ?? ''} fill className="object-cover" />
                </div>
              );
            },
          },
        ]
      : []),
    ...columns.map((col) => ({
      key: col.key,
      header: col.header,
      render: col.renderKey
        ? (row: Record<string, unknown>): React.ReactNode => {
            if (col.renderKey === 'name') return (row.name as { en: string }).en;
            if (col.renderKey === 'price') return formatCents(row.price as number);
            if (col.renderKey === 'status') return <StatusBadge status={row.status as string} />;
            return String(row[col.key] ?? '—');
          }
        : undefined,
    })),
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Record<string, unknown>) => {
        const id = String(row.id);
        const isPublished = String(row.status) === 'published';
        return (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={openingEditId === id}
              className="text-sm text-orange-600 hover:underline disabled:opacity-50"
              onClick={(e) => {
                e.stopPropagation();
                void openEdit(row);
              }}
            >
              {openingEditId === id ? 'Loading…' : 'Edit'}
            </button>
            <button
              type="button"
              disabled={togglingId === id}
              className="text-sm text-zinc-700 hover:underline disabled:opacity-50"
              onClick={(e) => {
                e.stopPropagation();
                void toggleVisibility(row);
              }}
            >
              {togglingId === id ? '…' : isPublished ? 'Hide' : 'Show'}
            </button>
            <button
              type="button"
              className="text-sm text-red-600 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(id);
              }}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <AdminHeader title={title} description={description}>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          Add new
        </button>
      </AdminHeader>

      {showForm && (
        <div className="mb-8">
          <SimpleCatalogForm
            key={formKey}
            apiBase={apiBase}
            itemId={editing?.id as string | undefined}
            initial={
              editing
                ? {
                    name: editing.name as { en: string; es: string },
                    slug: editing.slug as string,
                    description: editing.description as { en: string; es: string } | undefined,
                    displayOrder: (editing.order as number) ?? (editing.displayOrder as number) ?? 0,
                    status: editing.status as string,
                    price: editing.price as number | undefined,
                    category: editing.category as string | undefined,
                    color: editing.color as string | undefined,
                    image: editing.image as { url: string; alt: string } | undefined,
                  }
                : undefined
            }
            fields={fields}
            imageFolder={imageFolder}
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
        <DataTable columns={tableColumns} data={items} />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete item?"
        message="This action cannot be undone."
        destructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
