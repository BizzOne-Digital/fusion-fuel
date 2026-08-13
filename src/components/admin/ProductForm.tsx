'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import FormField, { inputClassName, selectClassName, textareaClassName } from '@/components/admin/FormField';
import LocalizedTabs from '@/components/admin/LocalizedTabs';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { adminFetch } from '@/lib/admin/client';
import { toast } from 'sonner';

interface ProductFormProps {
  productId?: string;
  categories: Array<{ id: string; name: { en: string } }>;
  onSuccess: () => void;
}

export default function ProductForm({ productId, categories, onSuccess }: ProductFormProps) {
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [loading, setLoading] = useState(Boolean(productId));
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState({ en: '', es: '' });
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [shortDescription, setShortDescription] = useState({ en: '', es: '' });
  const [fullDescription, setFullDescription] = useState({ en: '', es: '' });
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>();
  const [trackInventory, setTrackInventory] = useState(true);
  const [inventory, setInventory] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [featured, setFeatured] = useState(false);
  const [productType, setProductType] = useState('single');
  const [status, setStatus] = useState('draft');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [images, setImages] = useState<Array<{ url: string; alt: string }>>([]);

  useEffect(() => {
    if (!productId) return;
    void (async () => {
      const { data, error } = await adminFetch<{ item: Record<string, unknown> }>(
        `/api/admin/products/${productId}`
      );
      if (error) {
        toast.error(error);
        setLoading(false);
        return;
      }
      const item = data!.item;
      setName(item.name as { en: string; es: string });
      setSlug(item.slug as string);
      setSku(item.sku as string);
      setShortDescription(item.shortDescription as { en: string; es: string });
      setFullDescription(item.description as { en: string; es: string });
      setCategoryId(String((item.categoryId as { _id?: string })?._id ?? item.categoryId ?? ''));
      setPrice(item.basePrice as number);
      setCompareAtPrice(item.compareAtPrice as number | undefined);
      const inv = item.inventory as { trackInventory: boolean; quantity: number; lowStockThreshold: number };
      setTrackInventory(inv.trackInventory);
      setInventory(inv.quantity);
      setLowStockThreshold(inv.lowStockThreshold);
      setFeatured(item.featured as boolean);
      setProductType(item.productType as string);
      setStatus(item.status as string);
      setDisplayOrder(item.order as number);
      setImages(item.images as Array<{ url: string; alt: string }>);
      setLoading(false);
    })();
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('At least one image is required');
      return;
    }
    setSaving(true);
    const body = {
      name,
      slug,
      sku,
      shortDescription,
      fullDescription,
      categoryId,
      images,
      price,
      compareAtPrice,
      trackInventory,
      inventory,
      lowStockThreshold,
      featured,
      productType,
      status,
      displayOrder,
    };
    const { error } = await adminFetch(
      productId ? `/api/admin/products/${productId}` : '/api/admin/products',
      { method: productId ? 'PUT' : 'POST', body: JSON.stringify(body) }
    );
    setSaving(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Product saved');
    onSuccess();
  }

  if (loading) return <p className="text-zinc-500">Loading product…</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <LocalizedTabs activeLocale={locale} onChange={setLocale} />

      <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
        <h2 className="font-semibold">Basic Info</h2>
        <FormField label={`Name (${locale.toUpperCase()})`} required>
          <input className={inputClassName()} value={name[locale]} onChange={(e) => setName({ ...name, [locale]: e.target.value })} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Slug" required>
            <input className={inputClassName()} value={slug} onChange={(e) => setSlug(e.target.value)} />
          </FormField>
          <FormField label="SKU" required>
            <input className={inputClassName()} value={sku} onChange={(e) => setSku(e.target.value.toUpperCase())} />
          </FormField>
        </div>
        <FormField label={`Short Description (${locale.toUpperCase()})`} required>
          <textarea className={textareaClassName()} value={shortDescription[locale]} onChange={(e) => setShortDescription({ ...shortDescription, [locale]: e.target.value })} />
        </FormField>
        <FormField label={`Full Description (${locale.toUpperCase()})`} required>
          <textarea className={`${textareaClassName()} min-h-[160px]`} value={fullDescription[locale]} onChange={(e) => setFullDescription({ ...fullDescription, [locale]: e.target.value })} />
        </FormField>
        <FormField label="Category" required>
          <select className={selectClassName()} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name.en}</option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
        <h2 className="font-semibold">Pricing & Inventory</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Price (cents)" required>
            <input type="number" className={inputClassName()} value={price} onChange={(e) => setPrice(Number(e.target.value))} min={0} />
          </FormField>
          <FormField label="Compare At (cents)">
            <input type="number" className={inputClassName()} value={compareAtPrice ?? ''} onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)} min={0} />
          </FormField>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={trackInventory} onChange={(e) => setTrackInventory(e.target.checked)} />
          Track inventory
        </label>
        {trackInventory && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Quantity">
              <input type="number" className={inputClassName()} value={inventory} onChange={(e) => setInventory(Number(e.target.value))} min={0} />
            </FormField>
            <FormField label="Low Stock Threshold">
              <input type="number" className={inputClassName()} value={lowStockThreshold} onChange={(e) => setLowStockThreshold(Number(e.target.value))} min={0} />
            </FormField>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
        <h2 className="font-semibold">Images</h2>
        <ImageUploadField
          label="Add Product Image"
          directory="products"
          value={null}
          onChange={(img) => img && setImages([...images, img])}
        />
        {images.length > 0 && (
          <ul className="space-y-2">
            {images.map((img, i) => (
              <li key={img.url} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                <span>{img.alt} — {img.url}</span>
                <button type="button" className="text-red-600" onClick={() => setImages(images.filter((_, idx) => idx !== i))}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
        <h2 className="font-semibold">Settings</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Product Type">
            <select className={selectClassName()} value={productType} onChange={(e) => setProductType(e.target.value)}>
              <option value="single">Single</option>
              <option value="kit">Kit</option>
              <option value="bundle">Bundle</option>
              <option value="subscription">Subscription</option>
            </select>
          </FormField>
          <FormField label="Status">
            <select className={selectClassName()} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </FormField>
          <FormField label="Display Order">
            <input type="number" className={inputClassName()} value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
          </FormField>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured product
        </label>
      </div>

      <button type="submit" disabled={saving} className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Product'}
      </button>
    </form>
  );
}
