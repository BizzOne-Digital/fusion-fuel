'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import FormField, { inputClassName, selectClassName, textareaClassName } from '@/components/admin/FormField';
import LocalizedTabs from '@/components/admin/LocalizedTabs';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { adminFetch } from '@/lib/admin/client';

interface ServiceFormProps {
  serviceId?: string;
  onSuccess: () => void;
}

export default function ServiceForm({ serviceId, onSuccess }: ServiceFormProps) {
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [loading, setLoading] = useState(Boolean(serviceId));
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState({ en: '', es: '' });
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState({ en: '', es: '' });
  const [description, setDescription] = useState({ en: '', es: '' });
  const [detailContent, setDetailContent] = useState({ en: '', es: '' });
  const [startingPrice, setStartingPrice] = useState(0);
  const [status, setStatus] = useState('draft');
  const [order, setOrder] = useState(0);
  const [thumbnail, setThumbnail] = useState<{ url: string; alt: string } | null>(null);
  const [heroImage, setHeroImage] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    if (!serviceId) return;
    void (async () => {
      const { data, error } = await adminFetch<{ item: Record<string, unknown> }>(
        `/api/admin/services/${serviceId}`
      );
      if (error) {
        toast.error(error);
        setLoading(false);
        return;
      }
      const item = data!.item;
      setName(item.name as { en: string; es: string });
      setSlug(item.slug as string);
      setShortDescription(item.shortDescription as { en: string; es: string });
      setDescription(item.description as { en: string; es: string });
      setDetailContent(item.detailContent as { en: string; es: string });
      setStartingPrice((item.startingPrice as number) ?? 0);
      setStatus(item.status as string);
      setOrder(item.order as number);
      setThumbnail(item.thumbnail as { url: string; alt: string } | null);
      setHeroImage(item.heroImage as { url: string; alt: string } | null);
      setLoading(false);
    })();
  }, [serviceId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = {
      name,
      slug,
      shortDescription,
      description,
      detailContent,
      startingPrice,
      status,
      order,
      thumbnail: thumbnail ?? undefined,
      heroImage: heroImage ?? undefined,
      sections: [],
      faqs: [],
    };
    const { error } = await adminFetch(
      serviceId ? `/api/admin/services/${serviceId}` : '/api/admin/services',
      { method: serviceId ? 'PUT' : 'POST', body: JSON.stringify(body) }
    );
    setSaving(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Service saved');
    onSuccess();
  }

  if (loading) return <p className="text-zinc-500">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 rounded-xl border border-zinc-200 bg-white p-6">
      <LocalizedTabs activeLocale={locale} onChange={setLocale} />
      <FormField label={`Name (${locale.toUpperCase()})`} required>
        <input className={inputClassName()} value={name[locale]} onChange={(e) => setName({ ...name, [locale]: e.target.value })} />
      </FormField>
      <FormField label="Slug" required>
        <input className={inputClassName()} value={slug} onChange={(e) => setSlug(e.target.value)} />
      </FormField>
      <FormField label={`Short Description (${locale.toUpperCase()})`} required>
        <textarea className={textareaClassName()} value={shortDescription[locale]} onChange={(e) => setShortDescription({ ...shortDescription, [locale]: e.target.value })} />
      </FormField>
      <FormField label={`Description (${locale.toUpperCase()})`} required>
        <textarea className={textareaClassName()} value={description[locale]} onChange={(e) => setDescription({ ...description, [locale]: e.target.value })} />
      </FormField>
      <FormField label={`Detail Content (${locale.toUpperCase()})`} required>
        <textarea className={`${textareaClassName()} min-h-[160px]`} value={detailContent[locale]} onChange={(e) => setDetailContent({ ...detailContent, [locale]: e.target.value })} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Starting Price (cents)">
          <input type="number" className={inputClassName()} value={startingPrice} onChange={(e) => setStartingPrice(Number(e.target.value))} />
        </FormField>
        <FormField label="Order">
          <input type="number" className={inputClassName()} value={order} onChange={(e) => setOrder(Number(e.target.value))} />
        </FormField>
        <FormField label="Status">
          <select className={selectClassName()} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </FormField>
      </div>
      <ImageUploadField label="Thumbnail" directory="services" value={thumbnail} onChange={setThumbnail} />
      <ImageUploadField label="Hero Image" directory="services" value={heroImage} onChange={setHeroImage} />
      <button type="submit" disabled={saving} className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Service'}
      </button>
    </form>
  );
}
