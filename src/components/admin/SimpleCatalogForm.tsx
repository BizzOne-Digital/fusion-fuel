'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import FormField, { inputClassName, selectClassName, textareaClassName } from '@/components/admin/FormField';
import LocalizedTabs from '@/components/admin/LocalizedTabs';
import LocalImageField from '@/components/admin/LocalImageField';
import { adminFetch } from '@/lib/admin/client';
import { normalizeLocalized } from '@/lib/admin/localized';
import type { StoredUploadFolder } from '@/lib/stored-upload-shared';

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
  imageFolder?: StoredUploadFolder;
  onSuccess: () => void;
  onCancel?: () => void;
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
  imageFolder = 'products',
  onSuccess,
  onCancel,
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
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.image?.url ?? null);
  const [imageAlt, setImageAlt] = useState(initial?.image?.alt ?? '');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const normalizedName = normalizeLocalized(name);
    const normalizedDescription = normalizeLocalized(description);

    const body: Record<string, unknown> = {
      name: normalizedName,
      slug: slug.trim(),
      displayOrder,
      status,
    };
    if (fields.includes('description')) body.description = normalizedDescription;
    if (fields.includes('price')) body.price = dollarsToCents(priceDollars);
    if (fields.includes('category')) body.category = category;
    if (fields.includes('color')) body.color = color;
    if (fields.includes('image')) {
      body.image = imageUrl
        ? {
            url: imageUrl,
            alt: imageAlt.trim() || normalizedName.en || slug.trim(),
          }
        : null;
    }

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
        <FormField label={`Description (${locale.toUpperCase()}) — optional`}>
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
        <div className="space-y-3">
          <LocalImageField
            label="Category image"
            folder={imageFolder}
            value={imageUrl}
            onChange={setImageUrl}
          />
          <FormField label="Image alt text">
            <input
              className={inputClassName()}
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Describe the image for accessibility"
            />
          </FormField>
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
            <option value="draft">Hidden (draft)</option>
            <option value="published">Visible (published)</option>
            <option value="archived">Archived</option>
          </select>
        </FormField>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? 'Saving…' : itemId ? 'Update' : 'Create'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
