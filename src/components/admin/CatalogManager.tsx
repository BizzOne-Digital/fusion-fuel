'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import SimpleCatalogForm from '@/components/admin/SimpleCatalogForm';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { adminFetch, formatCents } from '@/lib/admin/client';

interface CatalogManagerProps {
  title: string;
  description: string;
  apiBase: string;
  fields: ('description' | 'price' | 'category' | 'color')[];
  columns: Array<{ key: string; header: string; renderKey?: string }>;
}

export default function CatalogManager({
  title,
  description,
  apiBase,
  fields,
  columns,
}: CatalogManagerProps) {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await adminFetch<{ items: Array<Record<string, unknown>> }>(apiBase);
    if (error) toast.error(error);
    else setItems(data!.items);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [apiBase]);

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

  return (
    <div>
      <AdminHeader title={title} description={description}>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          Add New
        </button>
      </AdminHeader>

      {showForm && (
        <div className="mb-8">
          <SimpleCatalogForm
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
                  }
                : undefined
            }
            fields={fields}
            onSuccess={() => {
              setShowForm(false);
              setEditing(null);
              void load();
            }}
          />
        </div>
      )}

      {loading ? (
        <p className="text-zinc-500">Loading…</p>
      ) : (
        <DataTable
          columns={[
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
              render: (row) => (
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-sm text-orange-600 hover:underline"
                    onClick={() => {
                      setEditing(row);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => setDeleteId(row.id as string)}
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          data={items.map((item) => ({ ...item, id: item.id as string })) as Array<Record<string, unknown>>}
        />
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
