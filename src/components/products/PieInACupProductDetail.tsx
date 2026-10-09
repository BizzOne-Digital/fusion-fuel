'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { getVariantPriceCents } from '@/lib/product-display';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import { resolvePieInACupSizePriceCents } from '@/lib/menu-catalog/protein-treats-catalog';
import {
  PROTEIN_TREATS_MENU,
  isPieInACupProduct,
  pieInACupFlavorNote,
  pieInACupVariantSku,
} from '@/lib/protein-treats-menu';
import type { IProduct } from '@/models/Product';
import type { Locale } from '@/types';
import type { ProteinTreatsCatalogData } from '@/types/menu-catalog';

interface PieInACupProductDetailProps {
  product: IProduct;
  locale: Locale;
  catalog?: ProteinTreatsCatalogData;
}

export function PieInACupProductDetail({ product, locale, catalog }: PieInACupProductDetailProps) {
  const { addItem } = useCart();

  const pieSizes = useMemo(() => {
    const fromCatalog = catalog?.pieInACup.sizes.filter((s) => !s.hidden) ?? [];
    if (fromCatalog.length > 0) {
      return fromCatalog.map((s) => ({ slug: s.slug, name: s.name, price: s.price }));
    }
    return PROTEIN_TREATS_MENU.pieInACup.sizes.map((s) => ({
      slug: s.slug,
      name: s.name,
      price: s.price,
    }));
  }, [catalog]);

  const pieFlavors = useMemo(() => {
    const fromCatalog = catalog?.pieInACup.flavors.filter((f) => !f.hidden) ?? [];
    if (fromCatalog.length > 0) {
      return fromCatalog.map((f) => ({ slug: f.slug, name: f.name, image: f.image }));
    }
    return PROTEIN_TREATS_MENU.pieInACup.flavors.map((f) => ({
      slug: f.slug,
      name: f.name,
      image: 'image' in f ? f.image : undefined,
    }));
  }, [catalog]);

  const [flavorSlug, setFlavorSlug] = useState('');
  const [sizeSlug, setSizeSlug] = useState<string>(pieSizes[0]?.slug ?? '9oz');
  const [loading, setLoading] = useState(false);

  const name = getLocalized(product.name, locale);
  const galleryImages = product.images.filter((image) => image.url?.trim());

  const selectedFlavor = pieFlavors.find((flavor) => flavor.slug === flavorSlug);

  const displayImage = useMemo(() => {
    if (selectedFlavor?.image) {
      return { url: selectedFlavor.image, alt: selectedFlavor.name };
    }
    const main = catalog?.pieInACup.mainImage;
    if (main) {
      return { url: main, alt: catalog?.pieInACup.name ?? name };
    }
    return PROTEIN_TREATS_MENU.pieInACup.image;
  }, [selectedFlavor, catalog, name]);

  const sizePriceCents = (size: string, flavor?: string) => {
    const baseSku = pieInACupVariantSku(size, product.sku);
    const fromVariant = baseSku ? getVariantPriceCents(product, baseSku) : null;
    if (fromVariant != null && fromVariant > 0 && !flavor) {
      return fromVariant;
    }
    return resolvePieInACupSizePriceCents(catalog, size, flavor);
  };

  const variantSku = flavorSlug ? pieInACupVariantSku(sizeSlug, product.sku, flavorSlug) : '';
  const unitPrice = flavorSlug ? sizePriceCents(sizeSlug, flavorSlug) : 0;
  const canAdd = Boolean(selectedFlavor && hasPrice(unitPrice));

  const handleAdd = async () => {
    if (!canAdd || !selectedFlavor) return;
    setLoading(true);
    await addItem({
      productId: String(product._id),
      quantity: 1,
      variantSku,
      notes: pieInACupFlavorNote(selectedFlavor.name),
    });
    setLoading(false);
  };

  if (!isPieInACupProduct(product.slug)) return null;

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        {selectedFlavor ? (
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
        ) : galleryImages.length > 0 ? (
          <ProductImageGallery images={galleryImages} name={name} />
        ) : (
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
            <Image
              src={displayImage.url}
              alt={displayImage.alt || name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        )}
      </div>

      <div>
        <h1 className="font-display text-5xl">{name}</h1>
        <p className="mt-2 text-grey">{getLocalized(product.shortDescription, locale)}</p>
        {hasPrice(unitPrice) && selectedFlavor && (
          <p className="mt-4 font-display text-3xl text-pink">
            {formatPrice(unitPrice, 'USD', locale)}
          </p>
        )}

        <div className="mt-8 space-y-6 rounded-2xl border border-grey/15 bg-cream p-6">
          <div>
            <h3 className="font-display text-2xl">{locale === 'es' ? 'Sabor' : 'Flavor'}</h3>
            <div className="mt-4">
              <Select
                name="pie-in-a-cup-flavor"
                value={flavorSlug}
                onChange={(event) => setFlavorSlug(event.target.value)}
                options={[
                  {
                    value: '',
                    label: locale === 'es' ? 'Selecciona un sabor' : 'Select a flavor',
                  },
                  ...pieFlavors.map((flavor) => ({
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
              {pieSizes.map((size) => (
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

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-grey/15 pt-6">
            <p className="font-display text-2xl">
              {canAdd ? formatPrice(unitPrice, 'USD', locale) : formatPrice(null, 'USD', locale)}
            </p>
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
