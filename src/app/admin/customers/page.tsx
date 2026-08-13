'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import FormField, { inputClassName } from '@/components/admin/FormField';
import { adminFetch } from '@/lib/admin/client';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Array<Record<string, unknown>>>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    const { data } = await adminFetch<{ items: Array<Record<string, unknown>> }>(
      `/api/admin/customers?${params.toString()}`
    );
    setCustomers(data?.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <AdminHeader title="Customers" description="View registered customers." />
      <div className="mb-6 flex gap-4 rounded-xl border border-zinc-200 bg-white p-4">
        <FormField label="Search" className="flex-1">
          <input className={inputClassName()} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name or email…" />
        </FormField>
        <div className="flex items-end">
          <button type="button" onClick={() => void load()} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white">Search</button>
        </div>
      </div>
      {loading ? (
        <p className="text-zinc-500">Loading…</p>
      ) : (
        <DataTable
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            {
              key: 'emailVerified',
              header: 'Verified',
              render: (row) => (row.emailVerified ? 'Yes' : 'No'),
            },
            {
              key: 'createdAt',
              header: 'Joined',
              render: (row) => new Date(row.createdAt as string).toLocaleDateString(),
            },
          ]}
          data={customers.map((c) => ({ ...c, id: c.id as string })) as Array<Record<string, unknown>>}
        />
      )}
    </div>
  );
}
