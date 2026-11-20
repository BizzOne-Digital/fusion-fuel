'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import FormField, { inputClassName, textareaClassName } from '@/components/admin/FormField';
import LocalizedTabs from '@/components/admin/LocalizedTabs';
import { adminFetch } from '@/lib/admin/client';
import type { CateringContent } from '@/lib/site-content';

type Lang = 'en' | 'es';
type TextKey = 'tagline' | 'eventName' | 'headline' | 'serviceArea' | 'deliveryNote' | 'serviceDuration' | 'deposit' | 'balance';
type ListKey = 'bowlSizes' | 'venueTypes' | 'perfectFor' | 'freshFruits' | 'premiumToppings' | 'packageIncludes' | 'howItWorks';

const TEXT_FIELDS: Array<{ key: TextKey; label: string; hint?: string; long?: boolean }> = [
  { key: 'eventName', label: 'Catering experience name', hint: 'Shown as the section title on the home and booking pages.' },
  { key: 'tagline', label: 'Catering tagline', hint: 'Short line shown on the home page and Monthly Tea Club section.', long: true },
  { key: 'headline', label: 'Headline / intro', long: true },
  { key: 'serviceArea', label: 'Service area' },
  { key: 'deliveryNote', label: 'Delivery note', hint: 'e.g. Event delivery and setup are included within 20 miles.' },
  { key: 'serviceDuration', label: 'Service duration', hint: 'e.g. Up to 2 hours of on-site service' },
  { key: 'deposit', label: 'Deposit policy', long: true },
  { key: 'balance', label: 'Balance / payment policy', long: true },
];

const LIST_FIELDS: Array<{ key: ListKey; label: string }> = [
  { key: 'packageIncludes', label: 'Package includes' },
  { key: 'bowlSizes', label: 'Bowl sizes' },
  { key: 'venueTypes', label: 'Venue types' },
  { key: 'freshFruits', label: 'Fresh fruit selection' },
  { key: 'premiumToppings', label: 'Premium toppings' },
  { key: 'howItWorks', label: 'How it works (steps)' },
  { key: 'perfectFor', label: 'Perfect for (event types)' },
];

export default function AdminCateringPage() {
  const [locale, setLocale] = useState<Lang>('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<CateringContent | null>(null);
  // Lists are edited as raw text (one item per line) so Enter works naturally.
  const [listText, setListText] = useState<Record<string, string>>({});
  const [packagesText, setPackagesText] = useState('');

  useEffect(() => {
    void (async () => {
      const { data, error } = await adminFetch<{ item: CateringContent }>('/api/admin/catering');
      if (error || !data) {
        toast.error(error ?? 'Failed to load catering settings');
        setLoading(false);
        return;
      }
      const item = data.item;
      setContent(item);
      const text: Record<string, string> = {};
      for (const { key } of LIST_FIELDS) {
        for (const lang of ['en', 'es'] as const) text[`${key}.${lang}`] = item[key][lang].join('\n');
      }
      setListText(text);
      setPackagesText(item.guestPackages.join(', '));
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-zinc-500">Loading catering settings…</p>;
  if (!content) return <p className="text-red-600">Could not load catering settings.</p>;

  const update = (patch: Partial<CateringContent>) => setContent({ ...content, ...patch });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!content) return;

    const packages = packagesText
      .split(/[,\s]+/)
      .filter(Boolean)
      .map(Number);
    if (packages.some((n) => !Number.isInteger(n) || n < 1)) {
      toast.error('Guest packages must be whole numbers separated by commas, e.g. 50, 75, 100');
      return;
    }

    const payload: CateringContent = { ...content, guestPackages: packages };
    for (const { key } of LIST_FIELDS) {
      payload[key] = {
        en: (listText[`${key}.en`] ?? '').split('\n').map((s) => s.trim()).filter(Boolean),
        es: (listText[`${key}.es`] ?? '').split('\n').map((s) => s.trim()).filter(Boolean),
      };
    }

    setSaving(true);
    const { error } = await adminFetch('/api/admin/catering', { method: 'PUT', body: JSON.stringify(payload) });
    setSaving(false);
    if (error) toast.error(error);
    else toast.success('Catering updated — the website now shows the new content');
  }

  return (
    <div>
      <AdminHeader
        title="Catering"
        description="Everything customers see about catering: packages, policies, guest limits, and where booking requests are sent. Catering services and their prices are managed under Services."
      />
      <form onSubmit={handleSave} className="max-w-3xl space-y-8">
        <LocalizedTabs activeLocale={locale} onChange={setLocale} />

        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold">Text ({locale.toUpperCase()})</h2>
          {TEXT_FIELDS.map(({ key, label, hint, long }) => (
            <FormField key={key} label={`${label} (${locale.toUpperCase()})`} hint={hint}>
              {long ? (
                <textarea
                  className={textareaClassName()}
                  rows={3}
                  value={content[key][locale]}
                  onChange={(e) => update({ [key]: { ...content[key], [locale]: e.target.value } })}
                />
              ) : (
                <input
                  className={inputClassName()}
                  value={content[key][locale]}
                  onChange={(e) => update({ [key]: { ...content[key], [locale]: e.target.value } })}
                />
              )}
            </FormField>
          ))}
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold">Lists ({locale.toUpperCase()})</h2>
          <p className="text-sm text-zinc-500">One item per line.</p>
          {LIST_FIELDS.map(({ key, label }) => (
            <FormField key={key} label={`${label} (${locale.toUpperCase()})`}>
              <textarea
                className={textareaClassName()}
                rows={5}
                value={listText[`${key}.${locale}`] ?? ''}
                onChange={(e) => setListText({ ...listText, [`${key}.${locale}`]: e.target.value })}
              />
            </FormField>
          ))}
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold">Guests &amp; bookings</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Minimum guests" hint="Booking form rejects anything lower.">
              <input
                type="number"
                min={1}
                className={inputClassName()}
                value={content.guestMin}
                onChange={(e) => update({ guestMin: Number(e.target.value) })}
              />
            </FormField>
            <FormField label="Maximum guests" hint="Booking form rejects anything higher.">
              <input
                type="number"
                min={1}
                className={inputClassName()}
                value={content.guestMax}
                onChange={(e) => update({ guestMax: Number(e.target.value) })}
              />
            </FormField>
          </div>
          <FormField label="Guest packages" hint="Comma-separated, shown as badges. e.g. 50, 75, 100, 150">
            <input className={inputClassName()} value={packagesText} onChange={(e) => setPackagesText(e.target.value)} />
          </FormField>
          <FormField
            label="Booking notification email"
            hint="New catering requests are emailed here. Leave empty to use the main contact email from Settings."
          >
            <input
              type="email"
              className={inputClassName()}
              value={content.notificationEmail}
              onChange={(e) => update({ notificationEmail: e.target.value })}
            />
          </FormField>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Catering'}
        </button>
      </form>
    </div>
  );
}
