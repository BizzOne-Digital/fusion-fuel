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

type Localized = { en: string; es: string };

type KitSizeForm = {
  key: string;
  name: Localized;
  servings: number;
  price: number;
};

type VariantForm = {
  sku: string;
  name: Localized;
  priceDollars: string;
};

type AddInOptionForm = {
  addInId: string;
  maxQuantity: number;
  included: boolean;
};

function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

function dollarsToCents(value: string): number {
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

export default function ProductForm({ productId, categories, onSuccess }: ProductFormProps) {
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [loading, setLoading] = useState(Boolean(productId));
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState<Localized>({ en: '', es: '' });
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [shortDescription, setShortDescription] = useState<Localized>({ en: '', es: '' });
  const [fullDescription, setFullDescription] = useState<Localized>({ en: '', es: '' });
  const [categoryId, setCategoryId] = useState('');
  const [priceDollars, setPriceDollars] = useState('0.00');
  const [compareAtDollars, setCompareAtDollars] = useState('');
  const [trackInventory, setTrackInventory] = useState(false);
  const [inventory, setInventory] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [featured, setFeatured] = useState(false);
  const [productType, setProductType] = useState('single');
  const [status, setStatus] = useState('draft');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [images, setImages] = useState<Array<{ url: string; alt: string }>>([]);
  const [kitSizes, setKitSizes] = useState<KitSizeForm[]>([]);
  const [variants, setVariants] = useState<VariantForm[]>([]);
  const [flavorIds, setFlavorIds] = useState<string[]>([]);
  const [addInOptions, setAddInOptions] = useState<AddInOptionForm[]>([]);
  const [allFlavors, setAllFlavors] = useState<Array<{ id: string; name: { en: string }; slug: string }>>([]);
  const [allAddIns, setAllAddIns] = useState<Array<{ id: string; name: { en: string } }>>([]);

  useEffect(() => {
    void (async () => {
      const [flavorsRes, addInsRes] = await Promise.all([
        adminFetch<{ items: Array<Record<string, unknown>> }>('/api/admin/flavors?limit=300'),
        adminFetch<{ items: Array<Record<string, unknown>> }>('/api/admin/add-ins?limit=300'),
      ]);
      if (flavorsRes.data?.items) {
        setAllFlavors(
          flavorsRes.data.items.map((item) => ({
            id: String(item.id ?? item._id),
            name: item.name as { en: string },
            slug: item.slug as string,
          }))
        );
      }
      if (addInsRes.data?.items) {
        setAllAddIns(
          addInsRes.data.items.map((item) => ({
            id: String(item.id ?? item._id),
            name: item.name as { en: string },
          }))
        );
      }
    })();
  }, []);

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
      setName(item.name as Localized);
      setSlug(item.slug as string);
      setSku(item.sku as string);
      setShortDescription(item.shortDescription as Localized);
      setFullDescription(item.description as Localized);
      setCategoryId(String((item.categoryId as { _id?: string })?._id ?? item.categoryId ?? ''));
      setPriceDollars(centsToDollars(item.basePrice as number));
      setCompareAtDollars(
        item.compareAtPrice ? centsToDollars(item.compareAtPrice as number) : ''
      );
      const inv = item.inventory as { trackInventory: boolean; quantity: number; lowStockThreshold: number };
      setTrackInventory(inv.trackInventory);
      setInventory(inv.quantity);
      setLowStockThreshold(inv.lowStockThreshold);
      setFeatured(item.featured as boolean);
      setProductType(item.productType as string);
      setStatus(item.status as string);
      setDisplayOrder(item.order as number);
      setImages(item.images as Array<{ url: string; alt: string }>);
      setKitSizes((item.kitSizes as KitSizeForm[]) ?? []);
      setVariants(
        ((item.variants as Array<{ sku: string; name: Localized; price: number }>) ?? []).map(
          (variant) => ({
            sku: variant.sku,
            name: variant.name,
            priceDollars: centsToDollars(variant.price),
          })
        )
      );
      setFlavorIds(
        ((item.flavorIds as Array<string | { _id?: string }>) ?? []).map((id) =>
          String((id as { _id?: string })._id ?? id)
        )
      );
      setAddInOptions(
        ((item.addInOptions as Array<Record<string, unknown>>) ?? []).map((option) => ({
          addInId: String((option.addInId as { _id?: string })?._id ?? option.addInId),
          maxQuantity: (option.maxQuantity as number) ?? 1,
          included: Boolean(option.included),
        }))
      );
      setLoading(false);
    })();
  }, [productId]);

  function toggleFlavor(flavorId: string) {
    setFlavorIds((prev) =>
      prev.includes(flavorId) ? prev.filter((id) => id !== flavorId) : [...prev, flavorId]
    );
  }

  function toggleAddIn(addInId: string) {
    setAddInOptions((prev) => {
      const exists = prev.find((option) => option.addInId === addInId);
      if (exists) return prev.filter((option) => option.addInId !== addInId);
      return [...prev, { addInId, maxQuantity: 1, included: false }];
    });
  }

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
      price: dollarsToCents(priceDollars),
      compareAtPrice: compareAtDollars ? dollarsToCents(compareAtDollars) : undefined,
      trackInventory,
      inventory,
      lowStockThreshold,
      featured,
      productType,
      status,
      displayOrder,
      kitSizes,
      flavorIds,
      addInOptions,
      variants: variants.map((variant) => ({
        sku: variant.sku,
        name: variant.name,
        price: dollarsToCents(variant.priceDollars),
      })),
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
          <FormField label="Price (USD)" required>
            <input type="number" step="0.01" min={0} className={inputClassName()} value={priceDollars} onChange={(e) => setPriceDollars(e.target.value)} />
          </FormField>
          <FormField label="Compare At (USD)">
            <input type="number" step="0.01" min={0} className={inputClassName()} value={compareAtDollars} onChange={(e) => setCompareAtDollars(e.target.value)} />
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
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Size / Variants ({variants.length})</h2>
          <button
            type="button"
            className="text-sm text-orange-600 hover:underline"
            onClick={() =>
              setVariants([
                ...variants,
                {
                  sku: `${sku || 'VAR'}-${variants.length + 1}`,
                  name: { en: '', es: '' },
                  priceDollars: priceDollars || '0.00',
                },
              ])
            }
          >
            + Add variant
          </button>
        </div>
        <p className="text-xs text-zinc-500">
          Used for size options (24oz, 32oz, etc.). Prices set here appear on the product page and in cart.
        </p>
        {variants.map((variant, index) => (
          <div key={index} className="grid gap-3 rounded-lg border border-zinc-100 p-4 sm:grid-cols-2">
            <FormField label="Variant SKU">
              <input
                className={inputClassName()}
                value={variant.sku}
                onChange={(e) =>
                  setVariants(
                    variants.map((entry, i) =>
                      i === index ? { ...entry, sku: e.target.value.toUpperCase() } : entry
                    )
                  )
                }
              />
            </FormField>
            <FormField label={`Name (${locale.toUpperCase()})`}>
              <input
                className={inputClassName()}
                value={variant.name[locale]}
                onChange={(e) =>
                  setVariants(
                    variants.map((entry, i) =>
                      i === index
                        ? { ...entry, name: { ...entry.name, [locale]: e.target.value } }
                        : entry
                    )
                  )
                }
              />
            </FormField>
            <FormField label="Price (USD)">
              <input
                type="number"
                step="0.01"
                min={0}
                className={inputClassName()}
                value={variant.priceDollars}
                onChange={(e) =>
                  setVariants(
                    variants.map((entry, i) =>
                      i === index ? { ...entry, priceDollars: e.target.value } : entry
                    )
                  )
                }
              />
            </FormField>
            <button
              type="button"
              className="text-sm text-red-600 sm:col-span-2"
              onClick={() => setVariants(variants.filter((_, i) => i !== index))}
            >
              Remove variant
            </button>
          </div>
        ))}
      </div>

      {(productType === 'kit' || kitSizes.length > 0) && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Kit Sizes</h2>
            <button
              type="button"
              className="text-sm text-orange-600 hover:underline"
              onClick={() =>
                setKitSizes([
                  ...kitSizes,
                  { key: `size-${kitSizes.length + 1}`, name: { en: '', es: '' }, servings: 1, price: dollarsToCents(priceDollars) },
                ])
              }
            >
              + Add size
            </button>
          </div>
          {kitSizes.map((kitSize, index) => (
            <div key={index} className="grid gap-3 rounded-lg border border-zinc-100 p-4 sm:grid-cols-2">
              <FormField label="Key">
                <input className={inputClassName()} value={kitSize.key} onChange={(e) => setKitSizes(kitSizes.map((ks, i) => i === index ? { ...ks, key: e.target.value } : ks))} />
              </FormField>
              <FormField label={`Name (${locale.toUpperCase()})`}>
                <input className={inputClassName()} value={kitSize.name[locale]} onChange={(e) => setKitSizes(kitSizes.map((ks, i) => i === index ? { ...ks, name: { ...ks.name, [locale]: e.target.value } } : ks))} />
              </FormField>
              <FormField label="Servings">
                <input type="number" className={inputClassName()} value={kitSize.servings} onChange={(e) => setKitSizes(kitSizes.map((ks, i) => i === index ? { ...ks, servings: Number(e.target.value) } : ks))} min={1} />
              </FormField>
              <FormField label="Price (USD)">
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className={inputClassName()}
                  value={centsToDollars(kitSize.price)}
                  onChange={(e) =>
                    setKitSizes(
                      kitSizes.map((ks, i) =>
                        i === index ? { ...ks, price: dollarsToCents(e.target.value) } : ks
                      )
                    )
                  }
                />
              </FormField>
              <button type="button" className="text-sm text-red-600 sm:col-span-2" onClick={() => setKitSizes(kitSizes.filter((_, i) => i !== index))}>Remove size</button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
        <h2 className="font-semibold">Flavors ({flavorIds.length} selected)</h2>
        <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-zinc-100 p-3">
          {allFlavors.map((flavor) => (
            <label key={flavor.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={flavorIds.includes(flavor.id)} onChange={() => toggleFlavor(flavor.id)} />
              {flavor.name.en} <span className="text-zinc-400">({flavor.slug})</span>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
        <h2 className="font-semibold">Add-ins</h2>
        <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-zinc-100 p-3">
          {allAddIns.map((addIn) => {
            const selected = addInOptions.find((option) => option.addInId === addIn.id);
            return (
              <div key={addIn.id} className="flex flex-wrap items-center gap-3 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={Boolean(selected)} onChange={() => toggleAddIn(addIn.id)} />
                  {addIn.name.en}
                </label>
                {selected ? (
                  <>
                    <label className="flex items-center gap-1">
                      Max
                      <input
                        type="number"
                        min={1}
                        className="w-16 rounded border px-2 py-1"
                        value={selected.maxQuantity}
                        onChange={(e) =>
                          setAddInOptions((prev) =>
                            prev.map((option) =>
                              option.addInId === addIn.id
                                ? { ...option, maxQuantity: Number(e.target.value) }
                                : option
                            )
                          )
                        }
                      />
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={selected.included}
                        onChange={(e) =>
                          setAddInOptions((prev) =>
                            prev.map((option) =>
                              option.addInId === addIn.id
                                ? { ...option, included: e.target.checked }
                                : option
                            )
                          )
                        }
                      />
                      Included
                    </label>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
        <h2 className="font-semibold">Images</h2>
        <ImageUploadField label="Add Product Image" directory="products" value={null} onChange={(img) => img && setImages([...images, img])} />
        {images.length > 0 && (
          <ul className="space-y-2">
            {images.map((img) => (
              <li key={img.url} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                <span>{img.alt} — {img.url}</span>
                <button type="button" className="text-red-600" onClick={() => setImages(images.filter((entry) => entry.url !== img.url))}>Remove</button>
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
