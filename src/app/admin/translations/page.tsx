'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import FormField, { inputClassName, textareaClassName } from '@/components/admin/FormField';
import { adminFetch } from '@/lib/admin/client';

export default function AdminTranslationsPage() {
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const { data, error } = await adminFetch<{ translations: Record<string, string> }>(
        `/api/admin/translations?locale=${locale}`
      );
      if (error) toast.error(error);
      else setTranslations(data!.translations);
      setLoading(false);
    })();
  }, [locale]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await adminFetch('/api/admin/translations', {
      method: 'PUT',
      body: JSON.stringify({ locale, translations }),
    });
    setSaving(false);
    if (error) toast.error(error);
    else toast.success('Translations saved');
  }

  const keys = Object.keys(translations).sort();

  return (
    <div>
      <AdminHeader title="Translations" description="Manage UI strings for English and Spanish." />
      <div className="mb-4 flex gap-2">
        {(['en', 'es'] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={`rounded-lg px-4 py-2 text-sm ${locale === l ? 'bg-orange-500 text-white' : 'bg-zinc-200 text-zinc-700'}`}
          >
            {l === 'en' ? 'English' : 'Español'}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-zinc-500">Loading translations…</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="max-h-[600px] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
            {keys.map((key) => (
              <FormField key={key} label={key}>
                <textarea
                  className={`${textareaClassName()} min-h-[60px] text-sm`}
                  value={translations[key]}
                  onChange={(e) => setTranslations({ ...translations, [key]: e.target.value })}
                />
              </FormField>
            ))}
          </div>
          <button type="submit" disabled={saving} className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Translations'}
          </button>
        </form>
      )}
    </div>
  );
}
