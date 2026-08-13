'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import FormField, { inputClassName, selectClassName, textareaClassName } from '@/components/admin/FormField';
import LocalizedTabs from '@/components/admin/LocalizedTabs';
import { adminFetch } from '@/lib/admin/client';

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [name, setName] = useState('');
  const [quote, setQuote] = useState({ en: '', es: '' });
  const [rating, setRating] = useState(5);

  async function load() {
    const { data } = await adminFetch<{ items: Array<Record<string, unknown>> }>('/api/admin/testimonials');
    setItems(data?.items ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await adminFetch('/api/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify({ name, quote, rating, verified: false, order: 0, status: 'published' }),
    });
    if (error) toast.error(error);
    else {
      toast.success('Testimonial created');
      setName('');
      setQuote({ en: '', es: '' });
      void load();
    }
  }

  return (
    <div>
      <AdminHeader title="Testimonials" description="Manage customer testimonials." />
      <form onSubmit={handleCreate} className="mb-8 max-w-xl space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <LocalizedTabs activeLocale={locale} onChange={setLocale} />
        <FormField label="Name"><input className={inputClassName()} value={name} onChange={(e) => setName(e.target.value)} required /></FormField>
        <FormField label={`Quote (${locale.toUpperCase()})`}><textarea className={textareaClassName()} value={quote[locale]} onChange={(e) => setQuote({ ...quote, [locale]: e.target.value })} required /></FormField>
        <FormField label="Rating"><input type="number" min={1} max={5} className={inputClassName()} value={rating} onChange={(e) => setRating(Number(e.target.value))} /></FormField>
        <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white">Add Testimonial</button>
      </form>
      <DataTable
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'quote', header: 'Quote', render: (row) => (row.quote as { en: string }).en.slice(0, 60) + '…' },
          { key: 'rating', header: 'Rating' },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status as string} /> },
        ]}
        data={items.map((i) => ({ ...i, id: i.id as string })) as Array<Record<string, unknown>>}
      />
    </div>
  );
}
