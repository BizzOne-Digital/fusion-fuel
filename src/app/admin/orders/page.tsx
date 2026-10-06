'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import FormField, { inputClassName, selectClassName } from '@/components/admin/FormField';
import { adminFetch, formatCents } from '@/lib/admin/client';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (q) params.set('q', q);
    const { data } = await adminFetch<{ items: Array<Record<string, unknown>> }>(
      `/api/admin/orders?${params.toString()}`
    );
    setOrders(data?.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <AdminHeader title="Orders" description="View and manage customer orders." />
      <div className="mb-6 flex flex-wrap gap-4 rounded-xl border border-zinc-200 bg-white p-4">
        <FormField label="Status">
          <select className={selectClassName()} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </FormField>
        <FormField label="Search">
          <input className={inputClassName()} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order #, email…" />
        </FormField>
        <div className="flex items-end">
          <button type="button" onClick={() => void load()} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white">
            Filter
          </button>
        </div>
      </div>
      {loading ? (
        <p className="text-zinc-500">Loading orders…</p>
      ) : (
        <DataTable
          columns={[
            {
              key: 'orderNumber',
              header: 'Order',
              render: (row) => (
                <Link href={`/admin/orders/${row.id}`} className="font-medium text-orange-600 hover:underline">
                  {row.orderNumber as string}
                </Link>
              ),
            },
            {
              key: 'guestEmail',
              header: 'Customer',
              render: (row) => (row.guestEmail as string) ?? '—',
            },
            {
              key: 'total',
              header: 'Total',
              render: (row) => formatCents((row.totals as { total: number }).total, (row.totals as { currency: string }).currency),
            },
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
          data={orders.map((o) => ({ ...o, id: o.id as string })) as Array<Record<string, unknown>>}
          getRowHref={(row) => `/admin/orders/${row.id}`}
        />
      )}
    </div>
  );
}
