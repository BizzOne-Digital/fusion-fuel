'use client';

import { useEffect, useState } from 'react';
import FormField, { inputClassName, selectClassName, textareaClassName } from '@/components/admin/FormField';
import LocalizedTabs from '@/components/admin/LocalizedTabs';
import LocalImageField from '@/components/admin/LocalImageField';
import ProductInlineFlavorsEditor, {
  type InlineFlavorForm,
} from '@/components/admin/ProductInlineFlavorsEditor';
import ProductInlineAddOnsEditor, {
  type InlineAddOnForm,
} from '@/components/admin/ProductInlineAddOnsEditor';
import { adminFetch } from '@/lib/admin/client';
import { localizedPlainText, normalizeLocalized, normalizeLocalizedPlain } from '@/lib/admin/localized';
import { toast } from 'sonner';

interface ProductFormProps {
  productId?: string;
  categories: Array<{ id: string; name: { en: string } }>;
  defaultCategoryId?: string;
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

function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

function dollarsToCents(value: string): number {
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

export default function ProductForm({ productId, categories, defaultCategoryId, onSuccess }: ProductFormProps) {
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [loading, setLoading] = useState(Boolean(productId));
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState<Localized>({ en: '', es: '' });
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [shortDescription, setShortDescription] = useState<Localized>({ en: '', es: '' });
  const [fullDescription, setFullDescription] = useState<Localized>({ en: '', es: '' });
  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? '');
  const [priceDollars, setPriceDollars] = useState('0.00');
  const [compareAtDollars, setCompareAtDollars] = useState('');
  const [trackInventory, setTrackInventory] = useState(false);
  const [inventory, setInventory] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [featured, setFeatured] = useState(false);
  const [productType, setProductType] = useState('single');
  const [status, setStatus] = useState('draft');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string | null>(null);
  const [kitSizes, setKitSizes] = useState<KitSizeForm[]>([]);
  const [variants, setVariants] = useState<VariantForm[]>([]);
  const [enableFlavors, setEnableFlavors] = useState(false);
  const [inlineFlavors, setInlineFlavors] = useState<InlineFlavorForm[]>([]);
  const [enableAddOns, setEnableAddOns] = useState(false);
  const [inlineAddOns, setInlineAddOns] = useState<InlineAddOnForm[]>([]);

  useEffect(() => {
    if (!productId) return;
    void (async () => {
      const { data, error } = await adminFetch<{
        item: Record<string, unknown>;
        flavors?: Array<Record<string, unknown>>;
        addIns?: Array<Record<string, unknown>>;
      }>(`/api/admin/products/${productId}`);
      if (error) {
        toast.error(error);
        setLoading(false);
        return;
      }
      const item = data!.item;
      setName(item.name as Localized);
      setSlug(item.slug as string);
      setSku(item.sku as string);
      setShortDescription(localizedPlainText(item.shortDescription as Localized));
      setFullDescription(localizedPlainText(item.description as Localized));
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
      const productImages = item.images as Array<{ url: string; alt: string }>;
      setPrimaryImageUrl(productImages?.[0]?.url ?? null);
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
      const flavorRows = (data?.flavors ?? []).map((flavor) => ({
        id: String(flavor.id ?? flavor._id),
        name: flavor.name as Localized,
        description: localizedPlainText((flavor.description as Localized) ?? { en: '', es: '' }),
        imageUrl: (flavor.image as { url?: string })?.url ?? null,
        imageAlt: (flavor.image as { alt?: string })?.alt ?? '',
      }));
      setEnableFlavors(flavorRows.length > 0);
      setInlineFlavors(flavorRows);

      const addOnRows = (data?.addIns ?? []).map((addOn) => ({
        id: String(addOn.id ?? addOn._id),
        name: addOn.name as Localized,
        description: localizedPlainText((addOn.description as Localized) ?? { en: '', es: '' }),
        priceDollars: centsToDollars(Number(addOn.price ?? 0)),
      }));
      setEnableAddOns(addOnRows.length > 0);
      setInlineAddOns(addOnRows);

      setLoading(false);
    })();
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!primaryImageUrl) {
      toast.error('Product image is required');
      return;
    }
    if (!categoryId) {
      toast.error('Category is required');
      return;
    }
    if (enableFlavors && inlineFlavors.length === 0) {
      toast.error('Add at least one flavor or turn off flavors for this product');
      return;
    }
    if (enableAddOns && inlineAddOns.length === 0) {
      toast.error('Add at least one add-on or turn off add-ons for this product');
      return;
    }

    const normalizedName = normalizeLocalized(name);
    const normalizedFull = normalizeLocalizedPlain(fullDescription);
    const normalizedShort = normalizeLocalizedPlain({
      en: shortDescription.en.trim() || normalizedFull.en.slice(0, 160),
      es: shortDescription.es.trim() || normalizedFull.es.slice(0, 160),
    });

    setSaving(true);
    const body = {
      name: normalizedName,
      slug: slug.trim(),
      sku,
      shortDescription: normalizedShort,
      fullDescription: normalizedFull,
      categoryId,
      images: [{ url: primaryImageUrl, alt: normalizedName.en }],
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
      enableFlavors,
      enableAddOns,
      inlineFlavors: enableFlavors
        ? inlineFlavors
            .filter((flavor) => flavor.name.en.trim())
            .map((flavor) => ({
              id: flavor.id,
              name: normalizeLocalized(flavor.name),
              description: normalizeLocalizedPlain(flavor.description),
              image: flavor.imageUrl
                ? {
                    url: flavor.imageUrl,
                    alt: flavor.imageAlt.trim() || flavor.name.en,
                  }
                : undefined,
            }))
        : [],
      inlineAddOns: enableAddOns
        ? inlineAddOns
            .filter((addOn) => addOn.name.en.trim())
            .map((addOn) => ({
              id: addOn.id,
              name: normalizeLocalized(addOn.name),
              description: normalizeLocalizedPlain(addOn.description),
              price: dollarsToCents(addOn.priceDollars),
            }))
        : [],
      variants: variants.map((variant) => ({
        sku: variant.sku,
        name: normalizeLocalized(variant.name),
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

      <ProductInlineFlavorsEditor
        locale={locale}
        enabled={enableFlavors}
        onEnabledChange={(value) => {
          setEnableFlavors(value);
          if (value && inlineFlavors.length === 0) {
            setInlineFlavors([
              { name: { en: '', es: '' }, description: { en: '', es: '' }, imageUrl: null, imageAlt: '' },
            ]);
          }
        }}
        flavors={inlineFlavors}
        onChange={setInlineFlavors}
      />

      <ProductInlineAddOnsEditor
        locale={locale}
        enabled={enableAddOns}
        onEnabledChange={(value) => {
          setEnableAddOns(value);
          if (value && inlineAddOns.length === 0) {
            setInlineAddOns([
              { name: { en: '', es: '' }, description: { en: '', es: '' }, priceDollars: '0.00' },
            ]);
          }
        }}
        addOns={inlineAddOns}
        onChange={setInlineAddOns}
      />

      <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
        <h2 className="font-semibold">Product image</h2>
        <LocalImageField
          label="Main product photo"
          folder="products"
          value={primaryImageUrl}
          onChange={setPrimaryImageUrl}
        />
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
