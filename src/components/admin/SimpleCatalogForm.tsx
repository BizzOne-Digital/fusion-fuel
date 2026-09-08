'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import FormField, { inputClassName, selectClassName, textareaClassName } from '@/components/admin/FormField';
import LocalizedTabs from '@/components/admin/LocalizedTabs';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { adminFetch } from '@/lib/admin/client';
import type { UploadDirectory } from '@/lib/upload';

interface Localized {
  en: string;
  es: string;
}

interface SimpleCatalogFormProps {
  apiBase: string;
  itemId?: string;
  initial?: {
    name: Localized;
    slug: string;
    description?: Localized;
    displayOrder: number;
    status: string;
    price?: number;
    category?: string;
    color?: string;
    image?: { url: string; alt: string };
  };
  fields: ('description' | 'price' | 'category' | 'color' | 'image')[];
  imageDirectory?: UploadDirectory;
  onSuccess: () => void;
}

function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

function dollarsToCents(value: string): number {
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

export default function SimpleCatalogForm({
  apiBase,
  itemId,
  initial,
  fields,
  imageDirectory = 'products',
  onSuccess,
}: SimpleCatalogFormProps) {
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<Localized>(initial?.name ?? { en: '', es: '' });
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [description, setDescription] = useState<Localized>(initial?.description ?? { en: '', es: '' });
  const [displayOrder, setDisplayOrder] = useState(initial?.displayOrder ?? 0);
  const [status, setStatus] = useState(initial?.status ?? 'draft');
  const [priceDollars, setPriceDollars] = useState(
    initial?.price !== undefined ? centsToDollars(initial.price) : '0.00'
  );
  const [category, setCategory] = useState(initial?.category ?? 'general');
  const [color, setColor] = useState(initial?.color ?? '#FF6B35');
  const [image, setImage] = useState<{ url: string; alt: string } | null>(initial?.image ?? null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body: Record<string, unknown> = {
      name,
      slug,
      displayOrder,
      status,
    };
    if (fields.includes('description')) body.description = description;
    if (fields.includes('price')) body.price = dollarsToCents(priceDollars);
    if (fields.includes('category')) body.category = category;
    if (fields.includes('color')) body.color = color;
    if (fields.includes('image') && image) body.image = image;

    const { error } = await adminFetch(itemId ? `${apiBase}/${itemId}` : apiBase, {
      method: itemId ? 'PUT' : 'POST',
      body: JSON.stringify(body),
    });

    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(itemId ? 'Updated successfully' : 'Created successfully');
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 rounded-xl border border-zinc-200 bg-white p-6">
      <LocalizedTabs activeLocale={locale} onChange={setLocale} />

      <FormField label={`Name (${locale.toUpperCase()})`} required>
        <input
          className={inputClassName()}
          value={name[locale]}
          onChange={(e) => setName({ ...name, [locale]: e.target.value })}
          required
        />
      </FormField>

      <FormField label="Slug" required>
        <input className={inputClassName()} value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </FormField>

      {fields.includes('description') && (
        <FormField label={`Description (${locale.toUpperCase()})`}>
          <textarea
            className={textareaClassName()}
            value={description[locale]}
            onChange={(e) => setDescription({ ...description, [locale]: e.target.value })}
          />
        </FormField>
      )}

      {fields.includes('price') && (
        <FormField label="Price (USD)" required>
          <input
            type="number"
            step="0.01"
            min={0}
            className={inputClassName()}
            value={priceDollars}
            onChange={(e) => setPriceDollars(e.target.value)}
          />
        </FormField>
      )}

      {fields.includes('category') && (
        <FormField label="Category">
          <input className={inputClassName()} value={category} onChange={(e) => setCategory(e.target.value)} />
        </FormField>
      )}

      {fields.includes('color') && (
        <FormField label="Color">
          <input type="color" className="h-10 w-20" value={color} onChange={(e) => setColor(e.target.value)} />
        </FormField>
      )}

      {fields.includes('image') && (
        <div className="space-y-2">
          <ImageUploadField
            label="Image"
            directory={imageDirectory}
            value={image}
            onChange={setImage}
          />
          {image && (
            <p className="text-xs text-zinc-500">{image.url}</p>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Display Order">
          <input
            type="number"
            className={inputClassName()}
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            min={0}
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

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? 'Saving…' : itemId ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
