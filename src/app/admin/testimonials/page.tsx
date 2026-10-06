'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import FormField, { inputClassName, selectClassName, textareaClassName } from '@/components/admin/FormField';
import LocalizedTabs from '@/components/admin/LocalizedTabs';
import { adminFetch } from '@/lib/admin/client';

type TestimonialRow = Record<string, unknown> & { id: string };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<TestimonialRow[]>([]);
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [name, setName] = useState('');
  const [quote, setQuote] = useState({ en: '', es: '' });
  const [rating, setRating] = useState(5);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    const { data } = await adminFetch<{ items: TestimonialRow[] }>('/api/admin/testimonials?limit=100');
    setItems(data?.items ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await adminFetch('/api/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify({
        name,
        quote,
        rating,
        verified: true,
        order: 0,
        status: 'published',
      }),
    });
    if (error) toast.error(error);
    else {
      toast.success('Testimonial created');
      setName('');
      setQuote({ en: '', es: '' });
      void load();
    }
  }

  async function updateTestimonial(id: string, patch: Record<string, unknown>) {
    const item = items.find((row) => row.id === id);
    if (!item) return;

    setUpdatingId(id);
    const { error } = await adminFetch(`/api/admin/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: item.name,
        role: item.role,
        quote: item.quote,
        image: item.image,
        rating: item.rating,
        verified: item.verified,
        order: item.order,
        status: item.status,
        ...patch,
      }),
    });
    setUpdatingId(null);

    if (error) toast.error(error);
    else {
      toast.success('Testimonial updated');
      void load();
    }
  }

  async function handleApprove(id: string) {
    await updateTestimonial(id, { status: 'published', verified: true });
  }

  async function handleArchive(id: string) {
    await updateTestimonial(id, { status: 'archived' });
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial permanently?')) return;
    setUpdatingId(id);
    const { error } = await adminFetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    setUpdatingId(null);
    if (error) toast.error(error);
    else {
      toast.success('Testimonial deleted');
      void load();
    }
  }

  const pendingCount = items.filter((item) => item.status === 'draft').length;

  return (
    <div>
      <AdminHeader
        title="Testimonials"
        description="Manage customer reviews. Approve submissions from the Write a Review tab on the site."
      />

      {pendingCount > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {pendingCount} review{pendingCount === 1 ? '' : 's'} waiting for approval.
        </div>
      )}

      <form onSubmit={handleCreate} className="mb-8 max-w-xl space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="font-semibold text-zinc-900">Add testimonial manually</h2>
        <LocalizedTabs activeLocale={locale} onChange={setLocale} />
        <FormField label="Name">
          <input className={inputClassName()} value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>
        <FormField label={`Quote (${locale.toUpperCase()})`}>
          <textarea
            className={textareaClassName()}
            value={quote[locale]}
            onChange={(e) => setQuote({ ...quote, [locale]: e.target.value })}
            required
          />
        </FormField>
        <FormField label="Rating">
          <input
            type="number"
            min={1}
            max={5}
            className={inputClassName()}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
        </FormField>
        <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white">
          Add Testimonial
        </button>
      </form>

      <DataTable
        columns={[
          { key: 'name', header: 'Name' },
          {
            key: 'quote',
            header: 'Quote',
            render: (row) => {
              const text = (row.quote as { en: string })?.en ?? '';
              return text.length > 60 ? `${text.slice(0, 60)}…` : text || '—';
            },
          },
          { key: 'rating', header: 'Rating' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status as string} />,
          },
          {
            key: 'createdAt',
            header: 'Submitted',
            render: (row) =>
              row.createdAt ? new Date(row.createdAt as string).toLocaleDateString() : '—',
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => {
              const id = row.id as string;
              const isPending = row.status === 'draft';
              const busy = updatingId === id;

              return (
                <div className="flex flex-wrap gap-2">
                  {isPending && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleApprove(id)}
                      className="rounded-md bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                  {row.status === 'published' && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleArchive(id)}
                      className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                    >
                      Archive
                    </button>
                  )}
                  {row.status === 'archived' && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleApprove(id)}
                      className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                    >
                      Republish
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void handleDelete(id)}
                    className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              );
            },
          },
        ]}
        data={items}
        emptyMessage="No testimonials yet."
      />
    </div>
  );
}
