'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { getPrimaryProductImage, getVariantPriceCents } from '@/lib/product-display';
import { getAddInUnitPrice } from '@/lib/product-add-ins';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { AddInSelector } from '@/components/products/AddInSelector';
import { resolveProteinShakeSizePriceCents } from '@/lib/menu-catalog/protein-shakes-catalog';
import {
  PROTEIN_SHAKES_MENU,
  isProteinShakeProduct,
  proteinShakeFlavorNote,
  proteinShakeItemImage,
  proteinShakeVariantSku,
} from '@/lib/protein-shakes-menu';
import type { IProduct } from '@/models/Product';
import type { IAddIn } from '@/models/AddIn';
import type { Locale } from '@/types';
import type { ProteinShakesCatalogData } from '@/types/menu-catalog';

interface ProteinShakeProductDetailProps {
  product: IProduct;
  addIns: IAddIn[];
  locale: Locale;
  catalog?: ProteinShakesCatalogData;
}

export function ProteinShakeProductDetail({
  product,
  addIns,
  locale,
  catalog,
}: ProteinShakeProductDetailProps) {
  const { addItem } = useCart();

  const shakeSizes = useMemo(() => {
    const fromCatalog = catalog?.sizes.filter((s) => !s.hidden) ?? [];
    if (fromCatalog.length > 0) {
      return fromCatalog.map((s) => ({ slug: s.slug, name: s.name, price: s.price }));
    }
    return PROTEIN_SHAKES_MENU.sizes.map((s) => ({ slug: s.slug, name: s.name, price: s.price }));
  }, [catalog]);

  const shakeFlavors = useMemo(() => {
    const fromCatalog = catalog?.flavors.filter((f) => !f.hidden) ?? [];
    if (fromCatalog.length > 0) {
      return fromCatalog.map((f) => ({
        slug: f.slug,
        name: f.name,
        image: f.image,
      }));
    }
    return PROTEIN_SHAKES_MENU.items.map((item) => ({
      slug: item.slug,
      name: item.name,
      image: item.image,
    }));
  }, [catalog]);

  const [flavorSlug, setFlavorSlug] = useState('');
  const [sizeSlug, setSizeSlug] = useState<string>(shakeSizes[0]?.slug ?? '24oz');
  const [selectedAddIns, setSelectedAddIns] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const name = getLocalized(product.name, locale);

  const selectedItem = shakeFlavors.find((item) => item.slug === flavorSlug);

  const displayImage = useMemo(() => {
    if (selectedItem?.image) {
      return { url: selectedItem.image, alt: selectedItem.name };
    }
    if (selectedItem) {
      const staticItem = PROTEIN_SHAKES_MENU.items.find((i) => i.slug === selectedItem.slug);
      if (staticItem) return proteinShakeItemImage(staticItem);
    }
    const hero = catalog?.heroImage?.url;
    if (hero) {
      return { url: hero, alt: catalog?.heroImage?.alt ?? name };
    }
    return getPrimaryProductImage(product) ?? PROTEIN_SHAKES_MENU.heroImage;
  }, [selectedItem, catalog, product, name]);

  const sizePriceCents = (size: string, flavor?: string) => {
    const sku = proteinShakeVariantSku(size);
    const fromVariant = sku ? getVariantPriceCents(product, sku) : null;
    if (fromVariant != null && fromVariant > 0) {
      return fromVariant;
    }
    return resolveProteinShakeSizePriceCents(catalog, size, flavor);
  };

  const variantSku = flavorSlug ? proteinShakeVariantSku(sizeSlug) : '';
  const unitPrice = flavorSlug
    ? sizePriceCents(sizeSlug, flavorSlug)
    : sizePriceCents(sizeSlug);

  const pricingSummary = useMemo(
    () =>
      shakeSizes
        .map((size) => {
          const sku = proteinShakeVariantSku(size.slug);
          const fromVariant = sku ? getVariantPriceCents(product, sku) : null;
          const cents =
            fromVariant != null && fromVariant > 0
              ? fromVariant
              : resolveProteinShakeSizePriceCents(catalog, size.slug);
          return `${size.name} ${formatPrice(cents, 'USD', locale)}`;
        })
        .join(' · '),
    [shakeSizes, catalog, product, locale]
  );

  const addInTotal = useMemo(
    () =>
      Object.entries(selectedAddIns).reduce((sum, [id, qty]) => {
        const addIn = addIns.find((entry) => String(entry._id) === id);
        return sum + (addIn ? getAddInUnitPrice(product, addIn) : 0) * qty;
      }, 0),
    [selectedAddIns, addIns, product]
  );

  const linePrice = unitPrice + addInTotal;
  const canAdd = Boolean(selectedItem && hasPrice(linePrice));

  const handleAdd = async () => {
    if (!canAdd || !selectedItem) return;
    setLoading(true);
    await addItem({
      productId: String(product._id),
      quantity: 1,
      variantSku,
      notes: proteinShakeFlavorNote(selectedItem.name),
      addIns: Object.entries(selectedAddIns)
        .filter(([, quantity]) => quantity > 0)
        .map(([addInId, quantity]) => ({ addInId, quantity })),
    });
    setLoading(false);
  };

  if (!isProteinShakeProduct(product.slug)) return null;

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
          <Image
            key={displayImage.url}
            src={displayImage.url}
            alt={displayImage.alt || name}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
      <div>
        <h1 className="font-display text-5xl">{name}</h1>
        <p className="mt-2 text-sm leading-relaxed text-grey">{pricingSummary}</p>
        <p className="mt-4 font-display text-3xl text-pink">
          {formatPrice(linePrice, 'USD', locale)}
        </p>

        <div className="mt-8 space-y-6 rounded-2xl border border-grey/15 bg-cream p-6">
          <div>
            <h3 className="font-display text-2xl">{locale === 'es' ? 'Sabor' : 'Flavor'}</h3>
            <div className="mt-4">
              <Select
                name="protein-shake-flavor"
                value={flavorSlug}
                onChange={(event) => setFlavorSlug(event.target.value)}
                options={[
                  {
                    value: '',
                    label: locale === 'es' ? 'Selecciona un sabor' : 'Select a flavor',
                  },
                  ...shakeFlavors.map((item) => ({
                    value: item.slug,
                    label: item.name,
                  })),
                ]}
              />
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl">{locale === 'es' ? 'Tamaño' : 'Size'}</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {shakeSizes.map((size) => (
                <button
                  key={size.slug}
                  type="button"
                  onClick={() => setSizeSlug(size.slug)}
                  className={`rounded-xl border-2 px-4 py-3 text-left transition ${
                    sizeSlug === size.slug ? 'border-lime bg-white' : 'border-grey/20 bg-white/50'
                  }`}
                >
                  <p className="font-semibold">{size.name}</p>
                  <p className="mt-1 text-sm text-grey">
                    {formatPrice(
                      sizePriceCents(size.slug, flavorSlug || undefined),
                      'USD',
                      locale
                    )}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <AddInSelector
            product={product}
            addIns={addIns}
            locale={locale}
            selected={selectedAddIns}
            onChange={setSelectedAddIns}
            title={locale === 'es' ? 'Complementos opcionales' : 'Optional Add-Ons'}
          />

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-grey/15 pt-6">
            <p className="font-display text-2xl">{formatPrice(linePrice, 'USD', locale)}</p>
            <Button onClick={handleAdd} loading={loading} disabled={!canAdd}>
              {locale === 'es' ? 'Agregar al carrito' : 'Add to cart'}
            </Button>
          </div>

          {!canAdd && (
            <p className="text-sm text-grey">
              {locale === 'es' ? 'Elige un sabor para continuar.' : 'Select a flavor to continue.'}
            </p>
          )}
        </div>

        <Link href="/booking" className="mt-4 inline-block">
          <Button variant="outline" size="lg">
            {locale === 'es' ? 'Reservar catering' : 'Book catering'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
