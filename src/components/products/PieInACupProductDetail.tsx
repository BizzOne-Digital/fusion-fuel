'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice, sanitizeHtml } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import {
  PROTEIN_TREATS_MENU,
  isPieInACupProduct,
  pieInACupFlavorImage,
  pieInACupFlavorNote,
  pieInACupSizePriceCents,
  pieInACupVariantSku,
} from '@/lib/protein-treats-menu';
import type { IProduct } from '@/models/Product';
import type { Locale } from '@/types';

interface PieInACupProductDetailProps {
  product: IProduct;
  locale: Locale;
}

export function PieInACupProductDetail({ product, locale }: PieInACupProductDetailProps) {
  const { addItem } = useCart();
  const [flavorSlug, setFlavorSlug] = useState('');
  const [sizeSlug, setSizeSlug] = useState<string>(PROTEIN_TREATS_MENU.pieInACup.sizes[0].slug);
  const [loading, setLoading] = useState(false);

  const name = getLocalized(product.name, locale);
  const description = getLocalized(product.description, locale);
  const galleryImages = product.images.filter((image) => image.url?.trim());

  const selectedFlavor = PROTEIN_TREATS_MENU.pieInACup.flavors.find(
    (flavor) => flavor.slug === flavorSlug
  );
  const displayImage = selectedFlavor
    ? pieInACupFlavorImage(selectedFlavor)
    : PROTEIN_TREATS_MENU.pieInACup.image;

  const variantSku = flavorSlug ? pieInACupVariantSku(sizeSlug, product.sku) : '';
  const unitPrice = flavorSlug ? pieInACupSizePriceCents(sizeSlug) : 0;
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
              src={PROTEIN_TREATS_MENU.pieInACup.image.url}
              alt={PROTEIN_TREATS_MENU.pieInACup.image.alt}
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
        {selectedFlavor && hasPrice(unitPrice) && (
          <p className="mt-4 font-display text-3xl text-pink">
            {formatPrice(unitPrice, 'USD', locale)}
          </p>
        )}
        <div
          className="prose-brand mt-6 text-grey"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
        />

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
                  ...PROTEIN_TREATS_MENU.pieInACup.flavors.map((flavor) => ({
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
              {PROTEIN_TREATS_MENU.pieInACup.sizes.map((size) => (
                <button
                  key={size.slug}
                  type="button"
                  onClick={() => setSizeSlug(size.slug)}
                  className={`rounded-xl border-2 px-4 py-3 text-left transition ${
                    sizeSlug === size.slug ? 'border-lime bg-white' : 'border-grey/20 bg-white/50'
                  }`}
                >
                  <p className="font-semibold">{size.name}</p>
                  {flavorSlug && (
                    <p className="mt-1 text-sm text-grey">
                      {formatPrice(pieInACupSizePriceCents(size.slug), 'USD', locale)}
                    </p>
                  )}
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
