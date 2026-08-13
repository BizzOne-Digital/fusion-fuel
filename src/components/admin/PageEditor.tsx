'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import FormField, { inputClassName, selectClassName, textareaClassName } from '@/components/admin/FormField';
import LocalizedTabs from '@/components/admin/LocalizedTabs';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { adminFetch } from '@/lib/admin/client';

interface PageEditorProps {
  pageKey: string;
}

export default function PageEditor({ pageKey }: PageEditorProps) {
  const router = useRouter();
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState({ en: '', es: '' });
  const [status, setStatus] = useState('draft');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [heroTitle, setHeroTitle] = useState({ en: '', es: '' });
  const [heroSubtitle, setHeroSubtitle] = useState({ en: '', es: '' });
  const [heroImage, setHeroImage] = useState<{ url: string; alt: string } | null>(null);
  const [sectionsJson, setSectionsJson] = useState('[]');

  useEffect(() => {
    void (async () => {
      const { data, error } = await adminFetch<{ item: Record<string, unknown> }>(
        `/api/admin/pages/${pageKey}`
      );
      if (error) {
        toast.error(error);
        setLoading(false);
        return;
      }
      const item = data!.item;
      setTitle(item.title as { en: string; es: string });
      setStatus(item.status as string);
      const seo = item.seo as { title?: string; description?: string } | undefined;
      setSeoTitle(seo?.title ?? '');
      setSeoDescription(seo?.description ?? '');
      const hero = item.hero as {
        title?: { en: string; es: string };
        subtitle?: { en: string; es: string };
        backgroundImage?: { url: string; alt: string };
      } | undefined;
      if (hero) {
        setHeroTitle(hero.title ?? { en: '', es: '' });
        setHeroSubtitle(hero.subtitle ?? { en: '', es: '' });
        setHeroImage(hero.backgroundImage ?? null);
      }
      setSectionsJson(JSON.stringify(item.sections ?? [], null, 2));
      setLoading(false);
    })();
  }, [pageKey]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let sections = [];
    try {
      sections = JSON.parse(sectionsJson) as unknown[];
    } catch {
      toast.error('Invalid sections JSON');
      setSaving(false);
      return;
    }

    const { error } = await adminFetch(`/api/admin/pages/${pageKey}`, {
      method: 'PUT',
      body: JSON.stringify({
        pageKey,
        title,
        status,
        seo: { title: seoTitle, description: seoDescription },
        hero: {
          title: heroTitle,
          subtitle: heroSubtitle,
          backgroundImage: heroImage ?? undefined,
        },
        sections,
      }),
    });

    setSaving(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Page saved');
    router.refresh();
  }

  if (loading) {
    return <p className="text-zinc-500">Loading page…</p>;
  }

  return (
    <div>
      <AdminHeader title={`Edit Page: ${pageKey}`} description="Update page content, hero, sections, and SEO." />
      <form onSubmit={handleSave} className="space-y-6">
        <LocalizedTabs activeLocale={locale} onChange={setLocale} />

        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-zinc-900">Content</h2>
          <FormField label={`Title (${locale.toUpperCase()})`} required>
            <input
              className={inputClassName()}
              value={title[locale]}
              onChange={(e) => setTitle({ ...title, [locale]: e.target.value })}
            />
          </FormField>
          <FormField label="Status">
            <select className={selectClassName()} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </FormField>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-zinc-900">Hero</h2>
          <FormField label={`Hero Title (${locale.toUpperCase()})`}>
            <input
              className={inputClassName()}
              value={heroTitle[locale]}
              onChange={(e) => setHeroTitle({ ...heroTitle, [locale]: e.target.value })}
            />
          </FormField>
          <FormField label={`Hero Subtitle (${locale.toUpperCase()})`}>
            <input
              className={inputClassName()}
              value={heroSubtitle[locale]}
              onChange={(e) => setHeroSubtitle({ ...heroSubtitle, [locale]: e.target.value })}
            />
          </FormField>
          <ImageUploadField
            label="Hero Background"
            directory="pages"
            value={heroImage}
            onChange={setHeroImage}
            altValue={heroImage?.alt ?? ''}
            onAltChange={(alt) => setHeroImage(heroImage ? { ...heroImage, alt } : null)}
          />
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-zinc-900">SEO</h2>
          <FormField label="SEO Title">
            <input className={inputClassName()} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </FormField>
          <FormField label="SEO Description">
            <textarea
              className={textareaClassName()}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />
          </FormField>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-zinc-900">Sections (JSON)</h2>
          <textarea
            className={`${textareaClassName()} min-h-[240px] font-mono text-xs`}
            value={sectionsJson}
            onChange={(e) => setSectionsJson(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Page'}
        </button>
      </form>
    </div>
  );
}
