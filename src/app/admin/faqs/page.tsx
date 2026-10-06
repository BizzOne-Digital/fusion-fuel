'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import FormField, { inputClassName, selectClassName, textareaClassName } from '@/components/admin/FormField';
import LocalizedTabs from '@/components/admin/LocalizedTabs';
import { adminFetch } from '@/lib/admin/client';

export default function AdminFAQsPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [category, setCategory] = useState('general');
  const [question, setQuestion] = useState({ en: '', es: '' });
  const [answer, setAnswer] = useState({ en: '', es: '' });

  async function load() {
    const { data } = await adminFetch<{ items: Array<Record<string, unknown>> }>('/api/admin/faqs');
    setItems(data?.items ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await adminFetch('/api/admin/faqs', {
      method: 'POST',
      body: JSON.stringify({ category, question, answer, locale: ['en', 'es'], order: 0, status: 'published' }),
    });
    if (error) toast.error(error);
    else {
      toast.success('FAQ created');
      void load();
    }
  }

  return (
    <div>
      <AdminHeader title="FAQs" description="Manage frequently asked questions." />
      <form onSubmit={handleCreate} className="mb-8 max-w-xl space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <LocalizedTabs activeLocale={locale} onChange={setLocale} />
        <FormField label="Category"><input className={inputClassName()} value={category} onChange={(e) => setCategory(e.target.value)} /></FormField>
        <FormField label={`Question (${locale.toUpperCase()})`}><input className={inputClassName()} value={question[locale]} onChange={(e) => setQuestion({ ...question, [locale]: e.target.value })} /></FormField>
        <FormField label={`Answer (${locale.toUpperCase()})`}><textarea className={textareaClassName()} value={answer[locale]} onChange={(e) => setAnswer({ ...answer, [locale]: e.target.value })} /></FormField>
        <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white">Add FAQ</button>
      </form>
      <DataTable
        columns={[
          { key: 'category', header: 'Category' },
          { key: 'question', header: 'Question', render: (row) => (row.question as { en: string }).en },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status as string} /> },
        ]}
        data={items.map((i) => ({ ...i, id: i.id as string })) as Array<Record<string, unknown>>}
      />
    </div>
  );
}
