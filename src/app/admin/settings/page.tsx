'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import FormField, { inputClassName, textareaClassName } from '@/components/admin/FormField';
import LocalizedTabs from '@/components/admin/LocalizedTabs';
import { adminFetch } from '@/lib/admin/client';

export default function AdminSettingsPage() {
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState({ en: '', es: '' });
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [timezone, setTimezone] = useState('');
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'US' });
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState({ en: '', es: '' });

  useEffect(() => {
    void (async () => {
      const { data, error } = await adminFetch<{ item: Record<string, unknown> }>('/api/admin/settings');
      if (error) {
        toast.error(error);
        setLoading(false);
        return;
      }
      const item = data!.item;
      setBusinessName(item.businessName as string);
      setTagline(item.tagline as { en: string; es: string });
      setContactEmail(item.contactEmail as string);
      setContactPhone(item.contactPhone as string);
      setTimezone(item.timezone as string);
      setAddress(item.address as { street: string; city: string; state: string; zip: string; country: string });
      const announcement = item.announcement as { enabled: boolean; message: { en: string; es: string } };
      setAnnouncementEnabled(announcement.enabled);
      setAnnouncementMessage(announcement.message);
      setLoading(false);
    })();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await adminFetch('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({
        businessName,
        tagline,
        contactEmail,
        contactPhone,
        address,
        timezone,
        announcement: { enabled: announcementEnabled, message: announcementMessage },
        social: [],
        hours: [],
      }),
    });
    setSaving(false);
    if (error) toast.error(error);
    else toast.success('Settings saved');
  }

  if (loading) return <p className="text-zinc-500">Loading settings…</p>;

  return (
    <div>
      <AdminHeader title="Settings" description="Global site settings and business information." />
      <form onSubmit={handleSave} className="max-w-2xl space-y-6 rounded-xl border border-zinc-200 bg-white p-6">
        <FormField label="Business Name" required>
          <input className={inputClassName()} value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
        </FormField>
        <LocalizedTabs activeLocale={locale} onChange={setLocale} />
        <FormField label={`Tagline (${locale.toUpperCase()})`}>
          <input className={inputClassName()} value={tagline[locale]} onChange={(e) => setTagline({ ...tagline, [locale]: e.target.value })} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Contact Email" required>
            <input type="email" className={inputClassName()} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
          </FormField>
          <FormField label="Contact Phone">
            <input className={inputClassName()} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </FormField>
        </div>
        <FormField label="Timezone">
          <input className={inputClassName()} value={timezone} onChange={(e) => setTimezone(e.target.value)} />
        </FormField>
        <section className="space-y-4 border-t pt-4">
          <h2 className="font-semibold">Announcement Bar</h2>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={announcementEnabled} onChange={(e) => setAnnouncementEnabled(e.target.checked)} />
            Enable announcement bar
          </label>
          <FormField label={`Message (${locale.toUpperCase()})`}>
            <textarea className={textareaClassName()} value={announcementMessage[locale]} onChange={(e) => setAnnouncementMessage({ ...announcementMessage, [locale]: e.target.value })} />
          </FormField>
        </section>
        <button type="submit" disabled={saving} className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
