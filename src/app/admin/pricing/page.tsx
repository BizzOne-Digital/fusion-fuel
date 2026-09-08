'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import FormField, { inputClassName } from '@/components/admin/FormField';
import { adminFetch } from '@/lib/admin/client';

type PickupLocation = {
  name: string;
  address: string;
  instructions?: { en: string; es: string };
};

export default function AdminPricingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shippingEnabled, setShippingEnabled] = useState(true);
  const [flatRate, setFlatRate] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number | undefined>();
  const [pickupEnabled, setPickupEnabled] = useState(true);
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [taxRateBps, setTaxRateBps] = useState(0);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    void (async () => {
      const { data, error } = await adminFetch<{ item: Record<string, unknown> }>('/api/admin/pricing');
      if (error) {
        toast.error(error);
        setLoading(false);
        return;
      }
      const item = data!.item;
      const shipping = item.shipping as { enabled: boolean; flatRate?: number; freeShippingThreshold?: number };
      const pickup = item.pickup as { enabled: boolean; locations?: PickupLocation[] };
      setShippingEnabled(shipping.enabled);
      setFlatRate(shipping.flatRate ?? 0);
      setFreeShippingThreshold(shipping.freeShippingThreshold);
      setPickupEnabled(pickup.enabled);
      setPickupLocations(pickup.locations ?? []);
      setTaxRateBps(item.taxRateBps as number);
      setCurrency(item.currency as string);
      setLoading(false);
    })();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await adminFetch('/api/admin/pricing', {
      method: 'PUT',
      body: JSON.stringify({
        shipping: { enabled: shippingEnabled, flatRate, freeShippingThreshold },
        pickup: { enabled: pickupEnabled, locations: pickupLocations },
        taxRateBps,
        currency,
      }),
    });
    setSaving(false);
    if (error) toast.error(error);
    else toast.success('Pricing updated');
  }

  if (loading) return <p className="text-zinc-500">Loading pricing…</p>;

  return (
    <div>
      <AdminHeader title="Pricing" description="Configure shipping, pickup, and tax settings." />
      <form onSubmit={handleSave} className="max-w-xl space-y-6 rounded-xl border border-zinc-200 bg-white p-6">
        <section className="space-y-4">
          <h2 className="font-semibold">Shipping</h2>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={shippingEnabled} onChange={(e) => setShippingEnabled(e.target.checked)} />
            Shipping enabled
          </label>
          <FormField label="Flat Rate (cents)">
            <input type="number" className={inputClassName()} value={flatRate} onChange={(e) => setFlatRate(Number(e.target.value))} min={0} />
          </FormField>
          <FormField label="Free Shipping Threshold (cents)">
            <input type="number" className={inputClassName()} value={freeShippingThreshold ?? ''} onChange={(e) => setFreeShippingThreshold(e.target.value ? Number(e.target.value) : undefined)} min={0} />
          </FormField>
        </section>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Pickup</h2>
            <button
              type="button"
              className="text-sm text-orange-600 hover:underline"
              onClick={() => setPickupLocations([...pickupLocations, { name: '', address: '' }])}
            >
              + Add location
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={pickupEnabled} onChange={(e) => setPickupEnabled(e.target.checked)} />
            Pickup enabled
          </label>
          {pickupLocations.map((location, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-zinc-100 p-4">
              <FormField label="Location Name">
                <input className={inputClassName()} value={location.name} onChange={(e) => setPickupLocations(pickupLocations.map((loc, i) => i === index ? { ...loc, name: e.target.value } : loc))} />
              </FormField>
              <FormField label="Address">
                <input className={inputClassName()} value={location.address} onChange={(e) => setPickupLocations(pickupLocations.map((loc, i) => i === index ? { ...loc, address: e.target.value } : loc))} />
              </FormField>
              <button type="button" className="text-sm text-red-600" onClick={() => setPickupLocations(pickupLocations.filter((_, i) => i !== index))}>Remove</button>
            </div>
          ))}
        </section>
        <section className="space-y-4">
          <h2 className="font-semibold">Tax</h2>
          <FormField label="Tax Rate (basis points, e.g. 825 = 8.25%)" hint="100 basis points = 1%">
            <input type="number" className={inputClassName()} value={taxRateBps} onChange={(e) => setTaxRateBps(Number(e.target.value))} min={0} max={10000} />
          </FormField>
          <FormField label="Currency">
            <input className={inputClassName()} value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} maxLength={3} />
          </FormField>
        </section>
        <button type="submit" disabled={saving} className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Pricing'}
        </button>
      </form>
    </div>
  );
}
