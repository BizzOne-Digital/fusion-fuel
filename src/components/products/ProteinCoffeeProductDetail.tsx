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
import { resolveProteinCoffeeSizePriceCents } from '@/lib/menu-catalog/protein-coffee-catalog';
import {
  PROTEIN_COFFEE,
  isProteinCoffeeProduct,
  proteinCoffeeFlavorImage,
  proteinCoffeeFlavorNote,
  proteinCoffeePricingSummary,
  proteinCoffeeVariantSku,
} from '@/lib/protein-coffee-menu';
import type { IProduct } from '@/models/Product';
import type { IAddIn } from '@/models/AddIn';
import type { Locale } from '@/types';
import type { ProteinCoffeeCatalogData } from '@/types/menu-catalog';

interface ProteinCoffeeProductDetailProps {
  product: IProduct;
  addIns: IAddIn[];
  locale: Locale;
  catalog?: ProteinCoffeeCatalogData;
}

export function ProteinCoffeeProductDetail({
  product,
  addIns,
  locale,
  catalog,
}: ProteinCoffeeProductDetailProps) {
  const { addItem } = useCart();
  const [flavorSlug, setFlavorSlug] = useState('');

  const icedSizes = useMemo(() => {
    const fromCatalog = catalog?.sizes.filter((s) => !s.hidden) ?? [];
    if (fromCatalog.length > 0) {
      return fromCatalog.map((s) => ({ slug: s.slug, name: s.name, price: s.price }));
    }
    return PROTEIN_COFFEE.icedSizes.map((s) => ({ slug: s.slug, name: s.name, price: s.price }));
  }, [catalog]);

  const flavors = useMemo(() => {
    const fromCatalog = catalog?.flavors.filter((f) => !f.hidden) ?? [];
    if (fromCatalog.length > 0) {
      return fromCatalog.map((f) => ({ slug: f.slug, name: f.name, image: f.image }));
    }
    return PROTEIN_COFFEE.flavors.map((f) => ({ slug: f.slug, name: f.name }));
  }, [catalog]);

  const [sizeSlug, setSizeSlug] = useState<string>(icedSizes[0]?.slug ?? '24oz');
  const [selectedAddIns, setSelectedAddIns] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const name = getLocalized(product.name, locale);

  const selectedFlavor = flavors.find((flavor) => flavor.slug === flavorSlug);
  const catalogFlavor = catalog?.flavors.find((f) => f.slug === flavorSlug);

  const displayImage = useMemo(() => {
    if (catalogFlavor?.image) {
      return { url: catalogFlavor.image, alt: catalogFlavor.name };
    }
    if (selectedFlavor && 'image' in selectedFlavor && selectedFlavor.image) {
      return { url: selectedFlavor.image, alt: selectedFlavor.name };
    }
    if (selectedFlavor) {
      return proteinCoffeeFlavorImage(flavorSlug);
    }
    const main = catalog?.mainImages[0];
    if (main?.url) {
      return { url: main.url, alt: main.alt ?? name };
    }
    return getPrimaryProductImage(product) ?? PROTEIN_COFFEE.galleryImages[0];
  }, [catalog, catalogFlavor, selectedFlavor, flavorSlug, product, name]);

  const sizePriceCents = (size: string, flavor?: string) =>
    resolveProteinCoffeeSizePriceCents(catalog, size, flavor);

  const variantSku = flavorSlug ? proteinCoffeeVariantSku(sizeSlug, flavorSlug) : '';
  const unitPrice = flavorSlug
    ? sizePriceCents(sizeSlug, flavorSlug)
    : (getVariantPriceCents(product, proteinCoffeeVariantSku(sizeSlug)) ?? sizePriceCents(sizeSlug));

  const pricingSummary = useMemo(() => {
    if (icedSizes.length === 0) return proteinCoffeePricingSummary();
    return icedSizes
      .map((size) => {
        const cents = resolveProteinCoffeeSizePriceCents(catalog, size.slug);
        return `${size.name} ${formatPrice(cents, 'USD', locale)}`;
      })
      .join(' · ');
  }, [catalog, icedSizes, locale]);

  const formula1SlugSet = useMemo(() => {
    const fromCatalog = catalog?.formula1Flavors.filter((f) => !f.hidden).map((f) => f.slug) ?? [];
    if (fromCatalog.length > 0) {
      return new Set<string>(fromCatalog);
    }
    return new Set<string>(PROTEIN_COFFEE.formula1Flavors.map((flavor) => flavor.slug));
  }, [catalog]);
  const optionalAddIns = useMemo(
    () => addIns.filter((addIn) => !formula1SlugSet.has(addIn.slug)),
    [addIns, formula1SlugSet]
  );
  const formula1AddIns = useMemo(
    () => addIns.filter((addIn) => formula1SlugSet.has(addIn.slug)),
    [addIns, formula1SlugSet]
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
  const canAdd = Boolean(selectedFlavor && hasPrice(linePrice));

  const handleAdd = async () => {
    if (!canAdd || !selectedFlavor) return;
    setLoading(true);
    await addItem({
      productId: String(product._id),
      quantity: 1,
      variantSku,
      notes: proteinCoffeeFlavorNote(selectedFlavor.name),
      addIns: Object.entries(selectedAddIns)
        .filter(([, quantity]) => quantity > 0)
        .map(([addInId, quantity]) => ({ addInId, quantity })),
    });
    setLoading(false);
  };

  if (!isProteinCoffeeProduct(product.slug)) return null;

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
                name="protein-coffee-flavor"
                value={flavorSlug}
                onChange={(event) => setFlavorSlug(event.target.value)}
                options={[
                  {
                    value: '',
                    label: locale === 'es' ? 'Selecciona un sabor' : 'Select a flavor',
                  },
                  ...flavors.map((flavor) => ({
                    value: flavor.slug,
                    label: flavor.name,
                  })),
                ]}
              />
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl">{locale === 'es' ? 'Tamaño' : 'Size'}</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {icedSizes.map((size) => (
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
            addIns={optionalAddIns}
            locale={locale}
            selected={selectedAddIns}
            onChange={setSelectedAddIns}
            title={locale === 'es' ? 'Complementos opcionales' : 'Optional Add-Ons'}
          />

          <AddInSelector
            product={product}
            addIns={formula1AddIns}
            locale={locale}
            selected={selectedAddIns}
            onChange={setSelectedAddIns}
            title={locale === 'es' ? 'Sabores Formula 1' : 'Formula 1 Flavors'}
          />

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-grey/15 pt-6">
            <p className="font-display text-2xl">{formatPrice(linePrice, 'USD', locale)}</p>
            <Button onClick={handleAdd} loading={loading} disabled={!canAdd}>
              {locale === 'es' ? 'Agregar al carrito' : 'Add to cart'}
            </Button>
          </div>

          {!selectedFlavor && hasPrice(linePrice) && (
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
