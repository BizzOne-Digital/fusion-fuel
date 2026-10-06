'use client';

import { useEffect, useState, use } from 'react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import FormField, { selectClassName, textareaClassName } from '@/components/admin/FormField';
import { adminFetch } from '@/lib/admin/client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [booking, setBooking] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [depositPaid, setDepositPaid] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data, error } = await adminFetch<{ item: Record<string, unknown> }>(`/api/admin/bookings/${id}`);
    if (error) {
      toast.error(error);
      return;
    }
    setBooking(data!.item);
    setStatus(data!.item.status as string);
    setInternalNotes((data!.item.internalNotes as string) ?? '');
    setDepositPaid(data!.item.depositPaid as boolean);
  }

  useEffect(() => {
    void load();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await adminFetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, internalNotes, depositPaid }),
    });
    setSaving(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Booking updated');
    void load();
  }

  if (!booking) return <p className="text-zinc-500">Loading booking…</p>;

  return (
    <div>
      <AdminHeader title={`Booking ${booking.referenceNumber as string}`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 text-sm">
          <p><strong>Contact:</strong> {booking.contactName as string} ({booking.contactEmail as string})</p>
          <p><strong>Phone:</strong> {booking.contactPhone as string}</p>
          <p><strong>Event:</strong> {booking.eventType as string} — {new Date(booking.eventDate as string).toLocaleDateString()}</p>
          <p><strong>Guests:</strong> {booking.guestCount as number}</p>
          <p><strong>Venue:</strong> {booking.venueName as string}, {booking.venueCity as string}</p>
          <p><strong>Service:</strong> {booking.serviceType as string}</p>
          <StatusBadge status={booking.status as string} />
        </div>
        <form onSubmit={handleUpdate} className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
          <h2 className="font-semibold">Update Booking</h2>
          <FormField label="Status">
            <select className={selectClassName()} value={status} onChange={(e) => setStatus(e.target.value)}>
              {['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={depositPaid} onChange={(e) => setDepositPaid(e.target.checked)} />
            Deposit paid
          </label>
          <FormField label="Internal Notes">
            <textarea className={textareaClassName()} value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} />
          </FormField>
          <button type="submit" disabled={saving} className="w-full rounded-lg bg-orange-500 py-2 text-sm font-medium text-white disabled:opacity-50">
            {saving ? 'Saving…' : 'Update Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
