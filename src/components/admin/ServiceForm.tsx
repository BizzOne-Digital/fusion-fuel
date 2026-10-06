'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import FormField, { inputClassName, selectClassName, textareaClassName } from '@/components/admin/FormField';
import LocalizedTabs from '@/components/admin/LocalizedTabs';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { adminFetch } from '@/lib/admin/client';

type Localized = { en: string; es: string };

type ServiceSection = {
  title: Localized;
  body: Localized;
  order: number;
  image?: { url: string; alt: string };
};

type ServiceFaq = {
  question: Localized;
  answer: Localized;
  order: number;
};

interface ServiceFormProps {
  serviceId?: string;
  onSuccess: () => void;
}

function emptyLocalized(): Localized {
  return { en: '', es: '' };
}

export default function ServiceForm({ serviceId, onSuccess }: ServiceFormProps) {
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [loading, setLoading] = useState(Boolean(serviceId));
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState<Localized>(emptyLocalized());
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState<Localized>(emptyLocalized());
  const [description, setDescription] = useState<Localized>(emptyLocalized());
  const [detailContent, setDetailContent] = useState<Localized>(emptyLocalized());
  const [startingPriceDollars, setStartingPriceDollars] = useState('0.00');
  const [status, setStatus] = useState('draft');
  const [order, setOrder] = useState(0);
  const [thumbnail, setThumbnail] = useState<{ url: string; alt: string } | null>(null);
  const [heroImage, setHeroImage] = useState<{ url: string; alt: string } | null>(null);
  const [sections, setSections] = useState<ServiceSection[]>([]);
  const [faqs, setFaqs] = useState<ServiceFaq[]>([]);

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
      setName(item.name as Localized);
      setSlug(item.slug as string);
      setShortDescription(item.shortDescription as Localized);
      setDescription(item.description as Localized);
      setDetailContent(item.detailContent as Localized);
      setStartingPriceDollars(((item.startingPrice as number) ?? 0) / 100 + '');
      setStatus(item.status as string);
      setOrder(item.order as number);
      setThumbnail(item.thumbnail as { url: string; alt: string } | null);
      setHeroImage(item.heroImage as { url: string; alt: string } | null);
      setSections((item.sections as ServiceSection[]) ?? []);
      setFaqs((item.faqs as ServiceFaq[]) ?? []);
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
      startingPrice: Math.round(Number.parseFloat(startingPriceDollars || '0') * 100),
      status,
      order,
      thumbnail: thumbnail ?? undefined,
      heroImage: heroImage ?? undefined,
      sections,
      faqs,
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
        <FormField label="Starting Price (USD)">
          <input type="number" step="0.01" min={0} className={inputClassName()} value={startingPriceDollars} onChange={(e) => setStartingPriceDollars(e.target.value)} />
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

      <section className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Content Sections</h2>
          <button
            type="button"
            className="text-sm text-orange-600 hover:underline"
            onClick={() =>
              setSections([
                ...sections,
                { title: emptyLocalized(), body: emptyLocalized(), order: sections.length },
              ])
            }
          >
            + Add section
          </button>
        </div>
        {sections.map((section, index) => (
          <div key={index} className="space-y-3 rounded-lg border border-zinc-100 p-4">
            <FormField label={`Section Title (${locale.toUpperCase()})`}>
              <input className={inputClassName()} value={section.title[locale]} onChange={(e) => setSections(sections.map((s, i) => i === index ? { ...s, title: { ...s.title, [locale]: e.target.value } } : s))} />
            </FormField>
            <FormField label={`Section Body (${locale.toUpperCase()})`}>
              <textarea className={textareaClassName()} value={section.body[locale]} onChange={(e) => setSections(sections.map((s, i) => i === index ? { ...s, body: { ...s.body, [locale]: e.target.value } } : s))} />
            </FormField>
            <button type="button" className="text-sm text-red-600" onClick={() => setSections(sections.filter((_, i) => i !== index))}>Remove section</button>
          </div>
        ))}
      </section>

      <section className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Service FAQs</h2>
          <button
            type="button"
            className="text-sm text-orange-600 hover:underline"
            onClick={() =>
              setFaqs([
                ...faqs,
                { question: emptyLocalized(), answer: emptyLocalized(), order: faqs.length },
              ])
            }
          >
            + Add FAQ
          </button>
        </div>
        {faqs.map((faq, index) => (
          <div key={index} className="space-y-3 rounded-lg border border-zinc-100 p-4">
            <FormField label={`Question (${locale.toUpperCase()})`}>
              <input className={inputClassName()} value={faq.question[locale]} onChange={(e) => setFaqs(faqs.map((f, i) => i === index ? { ...f, question: { ...f.question, [locale]: e.target.value } } : f))} />
            </FormField>
            <FormField label={`Answer (${locale.toUpperCase()})`}>
              <textarea className={textareaClassName()} value={faq.answer[locale]} onChange={(e) => setFaqs(faqs.map((f, i) => i === index ? { ...f, answer: { ...f.answer, [locale]: e.target.value } } : f))} />
            </FormField>
            <button type="button" className="text-sm text-red-600" onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}>Remove FAQ</button>
          </div>
        ))}
      </section>

      <button type="submit" disabled={saving} className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Service'}
      </button>
    </form>
  );
}
