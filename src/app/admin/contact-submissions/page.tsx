'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import FormField, { selectClassName, textareaClassName } from '@/components/admin/FormField';
import { adminFetch } from '@/lib/admin/client';

export default function AdminContactSubmissionsPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState('read');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await adminFetch<{ items: Array<Record<string, unknown>> }>('/api/admin/contact-submissions');
    setItems(data?.items ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    const { error } = await adminFetch(`/api/admin/contact-submissions/${selected.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes }),
    });
    setSaving(false);
    if (error) toast.error(error);
    else {
      toast.success('Submission updated');
      setSelected(null);
      void load();
    }
  }

  return (
    <div>
      <AdminHeader title="Contact Submissions" description="View and respond to contact form messages." />
      <DataTable
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          { key: 'subject', header: 'Subject', render: (row) => (row.subject as string) ?? '—' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status as string} />,
          },
          {
            key: 'createdAt',
            header: 'Date',
            render: (row) => new Date(row.createdAt as string).toLocaleDateString(),
          },
        ]}
        data={items.map((i) => ({ ...i, id: i.id as string })) as Array<Record<string, unknown>>}
        onRowClick={(row) => {
          setSelected(row);
          setStatus(row.status as string);
          setAdminNotes((row.adminNotes as string) ?? '');
        }}
      />

      {selected && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 font-semibold">Submission Details</h2>
          <p className="text-sm"><strong>From:</strong> {selected.name as string} ({selected.email as string})</p>
          <p className="mt-4 whitespace-pre-wrap text-sm">{selected.message as string}</p>
          <form onSubmit={handleUpdate} className="mt-6 space-y-4">
            <FormField label="Status">
              <select className={selectClassName()} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
            </FormField>
            <FormField label="Admin Notes">
              <textarea className={textareaClassName()} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
            </FormField>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white disabled:opacity-50">Save</button>
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg border px-4 py-2 text-sm">Close</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
