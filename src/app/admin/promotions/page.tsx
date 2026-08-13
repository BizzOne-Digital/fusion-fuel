'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import FormField, { inputClassName, selectClassName } from '@/components/admin/FormField';
import LocalizedTabs from '@/components/admin/LocalizedTabs';
import { adminFetch } from '@/lib/admin/client';

const PROMOTION_TEMPLATES = [
  { name: '10% Off First Order', type: 'percentage', discountValue: 10, firstOrderOnly: true, code: 'WELCOME10' },
  { name: '$5 Off Orders $50+', type: 'fixed_amount', discountValue: 500, minimumOrderAmount: 5000, code: 'SAVE5' },
  { name: 'Free Shipping', type: 'free_shipping', discountValue: 0, code: 'FREESHIP' },
];

export default function AdminPromotionsPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [code, setCode] = useState('');
  const [name, setName] = useState({ en: '', es: '' });
  const [type, setType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [active, setActive] = useState(false);

  async function load() {
    const { data } = await adminFetch<{ items: Array<Record<string, unknown>> }>('/api/admin/promotions');
    setItems(data?.items ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  function applyTemplate(template: (typeof PROMOTION_TEMPLATES)[0]) {
    setCode(template.code);
    setName({ en: template.name, es: template.name });
    setType(template.type);
    setDiscountValue(template.discountValue);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await adminFetch('/api/admin/promotions', {
      method: 'POST',
      body: JSON.stringify({
        code,
        name,
        type,
        discountValue,
        automatic: false,
        firstOrderOnly: false,
        active,
      }),
    });
    if (error) toast.error(error);
    else {
      toast.success('Promotion created');
      void load();
    }
  }

  return (
    <div>
      <AdminHeader title="Promotions" description="Manage discount codes and promotional campaigns." />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {PROMOTION_TEMPLATES.map((template) => (
          <button
            key={template.code}
            type="button"
            onClick={() => applyTemplate(template)}
            className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-left text-sm hover:border-orange-400 hover:bg-orange-50/30"
          >
            <p className="font-medium text-zinc-900">{template.name}</p>
            <p className="mt-1 text-zinc-500">Template — click to pre-fill form</p>
          </button>
        ))}
      </div>

      <form onSubmit={handleCreate} className="mb-8 max-w-xl space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <LocalizedTabs activeLocale={locale} onChange={setLocale} />
        <FormField label="Code" required><input className={inputClassName()} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required /></FormField>
        <FormField label={`Name (${locale.toUpperCase()})`} required><input className={inputClassName()} value={name[locale]} onChange={(e) => setName({ ...name, [locale]: e.target.value })} required /></FormField>
        <FormField label="Type">
          <select className={selectClassName()} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="percentage">Percentage</option>
            <option value="fixed_amount">Fixed Amount</option>
            <option value="free_shipping">Free Shipping</option>
          </select>
        </FormField>
        <FormField label="Discount Value (cents or %)"><input type="number" className={inputClassName()} value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} min={0} /></FormField>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />Active</label>
        <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white">Create Promotion</button>
      </form>

      <DataTable
        columns={[
          { key: 'code', header: 'Code' },
          { key: 'name', header: 'Name' },
          { key: 'type', header: 'Type' },
          {
            key: 'active',
            header: 'Status',
            render: (row) => <StatusBadge status={row.active ? 'active' : 'inactive'} />,
          },
        ]}
        data={items.map((i) => ({ ...i, id: i.id as string })) as Array<Record<string, unknown>>}
      />
    </div>
  );
}
