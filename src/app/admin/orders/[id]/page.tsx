'use client';

import { useEffect, useState, use } from 'react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import FormField, { inputClassName, selectClassName, textareaClassName } from '@/components/admin/FormField';
import { adminFetch, formatCents } from '@/lib/admin/client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data, error } = await adminFetch<{ item: Record<string, unknown> }>(`/api/admin/orders/${id}`);
    if (error) {
      toast.error(error);
      return;
    }
    setOrder(data!.item);
    setStatus(data!.item.status as string);
    setInternalNotes((data!.item.internalNotes as string) ?? '');
  }

  useEffect(() => {
    void load();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await adminFetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note, internalNotes }),
    });
    setSaving(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Order updated');
    void load();
  }

  if (!order) return <p className="text-zinc-500">Loading order…</p>;

  const totals = order.totals as { subtotal: number; discount: number; shipping: number; tax: number; total: number; currency: string };
  const items = order.items as Array<Record<string, unknown>>;

  return (
    <div>
      <AdminHeader
        title={`Order ${order.orderNumber as string}`}
        description={`Placed ${new Date(order.createdAt as string).toLocaleString()}`}
      >
        <a
          href={`/admin/orders/${id}?print=1`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50"
        >
          Print View
        </a>
      </AdminHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 font-semibold">Line Items</h2>
            <ul className="divide-y">
              {items.map((item, i) => (
                <li key={i} className="flex justify-between py-3 text-sm">
                  <span>{item.quantity as number}x {(item.productName as { en: string }).en}</span>
                  <span>{formatCents(item.lineTotal as number, totals.currency)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t pt-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCents(totals.subtotal, totals.currency)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>-{formatCents(totals.discount, totals.currency)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatCents(totals.shipping, totals.currency)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatCents(totals.tax, totals.currency)}</span></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span>{formatCents(totals.total, totals.currency)}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <p className="mb-2 text-sm text-zinc-500">Status</p>
            <StatusBadge status={order.status as string} />
            <p className="mt-4 text-sm"><strong>Payment:</strong> {order.paymentStatus as string}</p>
            <p className="text-sm"><strong>Fulfillment:</strong> {order.fulfillmentMethod as string}</p>
          </div>

          <form onSubmit={handleUpdate} className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
            <h2 className="font-semibold">Update Order</h2>
            <FormField label="Status">
              <select className={selectClassName()} value={status} onChange={(e) => setStatus(e.target.value)}>
                {['pending', 'confirmed', 'processing', 'ready', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Status Note">
              <input className={inputClassName()} value={note} onChange={(e) => setNote(e.target.value)} />
            </FormField>
            <FormField label="Internal Notes">
              <textarea className={textareaClassName()} value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} />
            </FormField>
            <button type="submit" disabled={saving} className="w-full rounded-lg bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50">
              {saving ? 'Saving…' : 'Update Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
