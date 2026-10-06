'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import FormField, { inputClassName, textareaClassName } from '@/components/admin/FormField';
import LocalizedTabs from '@/components/admin/LocalizedTabs';
import { adminFetch } from '@/lib/admin/client';

type Localized = { en: string; es: string };

type SocialLink = {
  platform: 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'youtube' | 'linkedin';
  url: string;
  label?: string;
};

type HourEntry = {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string;
  close: string;
  closed?: boolean;
};

type FooterColumn = {
  title: Localized;
  links: Array<{ label: Localized; href: string }>;
};

const DAY_LABELS: Record<HourEntry['day'], string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const SOCIAL_PLATFORMS: SocialLink['platform'][] = [
  'instagram',
  'facebook',
  'tiktok',
  'twitter',
  'youtube',
  'linkedin',
];

function emptyLocalized(): Localized {
  return { en: '', es: '' };
}

export default function AdminSettingsPage() {
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState<Localized>(emptyLocalized());
  const [footerTagline, setFooterTagline] = useState<Localized>(emptyLocalized());
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState<Localized>(emptyLocalized());
  const [announcementLink, setAnnouncementLink] = useState('');
  const [announcementBg, setAnnouncementBg] = useState('#E8F000');
  const [announcementText, setAnnouncementText] = useState('#07090A');
  const [social, setSocial] = useState<SocialLink[]>([]);
  const [hours, setHours] = useState<HourEntry[]>([]);
  const [footerColumns, setFooterColumns] = useState<FooterColumn[]>([]);
  const [legalLinks, setLegalLinks] = useState<Array<{ label: Localized; href: string }>>([]);

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
      setTagline(item.tagline as Localized);
      setContactEmail(item.contactEmail as string);
      setContactPhone(item.contactPhone as string);
      setTimezone((item.timezone as string) || 'America/New_York');
      setAddress(
        (item.address as typeof address) ?? {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: 'US',
        }
      );

      const announcement = item.announcement as {
        enabled: boolean;
        message: Localized;
        link?: string;
        backgroundColor?: string;
        textColor?: string;
      };
      setAnnouncementEnabled(announcement.enabled);
      setAnnouncementMessage(announcement.message ?? emptyLocalized());
      setAnnouncementLink(announcement.link ?? '');
      setAnnouncementBg(announcement.backgroundColor ?? '#E8F000');
      setAnnouncementText(announcement.textColor ?? '#07090A');

      setSocial((item.social as SocialLink[]) ?? []);
      setHours((item.hours as HourEntry[]) ?? []);

      const footer = item.footer as { tagline?: Localized; columns?: FooterColumn[] } | undefined;
      setFooterTagline(footer?.tagline ?? emptyLocalized());
      setFooterColumns(footer?.columns ?? []);
      setLegalLinks(
        (item.legalLinks as Array<{ label: Localized; href: string }>) ?? []
      );

      setLoading(false);
    })();
  }, []);

  function updateHour(day: HourEntry['day'], patch: Partial<HourEntry>) {
    setHours((prev) => prev.map((entry) => (entry.day === day ? { ...entry, ...patch } : entry)));
  }

  function addSocialLink() {
    setSocial((prev) => [...prev, { platform: 'instagram', url: '', label: '' }]);
  }

  function addFooterLink(columnIndex: number) {
    setFooterColumns((prev) =>
      prev.map((column, index) =>
        index === columnIndex
          ? {
              ...column,
              links: [...column.links, { label: emptyLocalized(), href: '/menu' }],
            }
          : column
      )
    );
  }

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
        announcement: {
          enabled: announcementEnabled,
          message: announcementMessage,
          link: announcementLink || undefined,
          backgroundColor: announcementBg,
          textColor: announcementText,
        },
        social: social.filter((link) => link.url.trim()),
        hours,
        footer: {
          tagline: footerTagline,
          columns: footerColumns,
        },
        legalLinks,
      }),
    });
    setSaving(false);
    if (error) toast.error(error);
    else toast.success('Settings saved');
  }

  if (loading) return <p className="text-zinc-500">Loading settings…</p>;

  return (
    <div>
      <AdminHeader
        title="Settings"
        description="Business contact info, social links, hours, announcement bar, and footer."
      />
      <form onSubmit={handleSave} className="max-w-3xl space-y-8">
        <LocalizedTabs activeLocale={locale} onChange={setLocale} />

        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold">Business</h2>
          <FormField label="Business Name" required>
            <input
              className={inputClassName()}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </FormField>
          <FormField label={`Site Tagline (${locale.toUpperCase()})`}>
            <input
              className={inputClassName()}
              value={tagline[locale]}
              onChange={(e) => setTagline({ ...tagline, [locale]: e.target.value })}
            />
          </FormField>
          <FormField label={`Footer Tagline (${locale.toUpperCase()})`}>
            <input
              className={inputClassName()}
              value={footerTagline[locale]}
              onChange={(e) => setFooterTagline({ ...footerTagline, [locale]: e.target.value })}
            />
          </FormField>
          <FormField label="Timezone">
            <input
              className={inputClassName()}
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            />
          </FormField>
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Email" required>
              <input
                type="email"
                className={inputClassName()}
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Phone">
              <input
                className={inputClassName()}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </FormField>
          </div>
          <FormField label="Street">
            <input
              className={inputClassName()}
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="City">
              <input
                className={inputClassName()}
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
            </FormField>
            <FormField label="State">
              <input
                className={inputClassName()}
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
            </FormField>
            <FormField label="ZIP">
              <input
                className={inputClassName()}
                value={address.zip}
                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
              />
            </FormField>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Social Links</h2>
            <button
              type="button"
              onClick={addSocialLink}
              className="text-sm font-medium text-orange-600 hover:underline"
            >
              + Add link
            </button>
          </div>
          {social.length === 0 ? (
            <p className="text-sm text-zinc-500">No social links yet.</p>
          ) : (
            social.map((link, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-zinc-100 p-4 sm:grid-cols-[140px_1fr_auto]">
                <select
                  className={inputClassName()}
                  value={link.platform}
                  onChange={(e) =>
                    setSocial((prev) =>
                      prev.map((entry, i) =>
                        i === index ? { ...entry, platform: e.target.value as SocialLink['platform'] } : entry
                      )
                    )
                  }
                >
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
                <input
                  className={inputClassName()}
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) =>
                    setSocial((prev) =>
                      prev.map((entry, i) => (i === index ? { ...entry, url: e.target.value } : entry))
                    )
                  }
                />
                <button
                  type="button"
                  className="text-sm text-red-600"
                  onClick={() => setSocial((prev) => prev.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
                <input
                  className={`${inputClassName()} sm:col-span-3`}
                  placeholder="Display label (optional)"
                  value={link.label ?? ''}
                  onChange={(e) =>
                    setSocial((prev) =>
                      prev.map((entry, i) => (i === index ? { ...entry, label: e.target.value } : entry))
                    )
                  }
                />
              </div>
            ))
          )}
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold">Business Hours</h2>
          {hours.map((entry) => (
            <div key={entry.day} className="grid gap-3 rounded-lg border border-zinc-100 p-4 sm:grid-cols-[120px_1fr_1fr_auto]">
              <p className="font-medium capitalize">{DAY_LABELS[entry.day]}</p>
              <input
                className={inputClassName()}
                value={entry.open}
                disabled={entry.closed}
                onChange={(e) => updateHour(entry.day, { open: e.target.value })}
              />
              <input
                className={inputClassName()}
                value={entry.close}
                disabled={entry.closed}
                onChange={(e) => updateHour(entry.day, { close: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(entry.closed)}
                  onChange={(e) => updateHour(entry.day, { closed: e.target.checked })}
                />
                Closed
              </label>
            </div>
          ))}
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold">Announcement Bar</h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={announcementEnabled}
              onChange={(e) => setAnnouncementEnabled(e.target.checked)}
            />
            Enable announcement bar
          </label>
          <FormField label={`Message (${locale.toUpperCase()})`}>
            <textarea
              className={textareaClassName()}
              value={announcementMessage[locale]}
              onChange={(e) =>
                setAnnouncementMessage({ ...announcementMessage, [locale]: e.target.value })
              }
            />
          </FormField>
          <FormField label="Link (optional, e.g. /menu?category=mega-tea-kits)">
            <input
              className={inputClassName()}
              value={announcementLink}
              onChange={(e) => setAnnouncementLink(e.target.value)}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Background Color">
              <input
                className={inputClassName()}
                value={announcementBg}
                onChange={(e) => setAnnouncementBg(e.target.value)}
              />
            </FormField>
            <FormField label="Text Color">
              <input
                className={inputClassName()}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
              />
            </FormField>
          </div>
        </section>

        {footerColumns.length > 0 ? (
          <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-semibold">Footer Links</h2>
            {footerColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-3 rounded-lg border border-zinc-100 p-4">
                <p className="font-medium">{column.title[locale] || column.title.en}</p>
                {column.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="grid gap-2 sm:grid-cols-2">
                    <input
                      className={inputClassName()}
                      placeholder="Label"
                      value={link.label[locale]}
                      onChange={(e) =>
                        setFooterColumns((prev) =>
                          prev.map((col, ci) =>
                            ci === columnIndex
                              ? {
                                  ...col,
                                  links: col.links.map((l, li) =>
                                    li === linkIndex
                                      ? { ...l, label: { ...l.label, [locale]: e.target.value } }
                                      : l
                                  ),
                                }
                              : col
                          )
                        )
                      }
                    />
                    <input
                      className={inputClassName()}
                      placeholder="/path"
                      value={link.href}
                      onChange={(e) =>
                        setFooterColumns((prev) =>
                          prev.map((col, ci) =>
                            ci === columnIndex
                              ? {
                                  ...col,
                                  links: col.links.map((l, li) =>
                                    li === linkIndex ? { ...l, href: e.target.value } : l
                                  ),
                                }
                              : col
                          )
                        )
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFooterLink(columnIndex)}
                  className="text-sm text-orange-600 hover:underline"
                >
                  + Add link to column
                </button>
              </div>
            ))}
          </section>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
