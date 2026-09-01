'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice, sanitizeHtml } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import {
  MEGA_TEA_KITS_MENU,
  isMegaTeaKitProduct,
  megaTeaKitCollectionFromProduct,
  megaTeaKitFlavorNote,
} from '@/lib/mega-tea-kits-menu';
import { resolveFlavorImage } from '@/lib/site-images';
import type { IFlavor } from '@/models/Flavor';
import type { IProduct } from '@/models/Product';
import type { Locale } from '@/types';

interface MegaTeaKitProductDetailProps {
  product: IProduct;
  flavors: IFlavor[];
  locale: Locale;
}

export function MegaTeaKitProductDetail({ product, flavors, locale }: MegaTeaKitProductDetailProps) {
  const { addItem } = useCart();
  const [flavorId, setFlavorId] = useState('');
  const [loading, setLoading] = useState(false);

  const name = getLocalized(product.name, locale);
  const shortDescription = getLocalized(product.shortDescription, locale);
  const description = getLocalized(product.description, locale);
  const kitSize = product.kitSizes[0];
  const unitPrice = kitSize?.price ?? product.basePrice;

  const collectionSlug = megaTeaKitCollectionFromProduct(product.slug);

  const kitFlavors = useMemo(() => {
    const list = flavors.filter((flavor) => {
      const inProduct =
        product.flavorIds?.length === 0 ||
        product.flavorIds?.some((id) => String(id) === String(flavor._id));
      const inCollection = collectionSlug ? flavor.category === collectionSlug : true;
      return inProduct && inCollection;
    });
    return [...list].sort((a, b) =>
      getLocalized(a.name, locale).localeCompare(getLocalized(b.name, locale))
    );
  }, [collectionSlug, flavors, locale, product.flavorIds]);

  const selectedFlavor = kitFlavors.find((flavor) => String(flavor._id) === flavorId);
  const selectedFlavorName = selectedFlavor ? getLocalized(selectedFlavor.name, locale) : '';
  const flavorImage = selectedFlavor
    ? resolveFlavorImage(selectedFlavor, selectedFlavorName)
    : null;
  const displayImage = flavorImage?.url
    ? { url: flavorImage.url, alt: flavorImage.alt || selectedFlavorName }
    : MEGA_TEA_KITS_MENU.heroImage;

  const canAdd = Boolean(selectedFlavor && kitSize && hasPrice(unitPrice));

  const handleAdd = async () => {
    if (!canAdd || !selectedFlavor || !kitSize) return;
    setLoading(true);
    await addItem({
      productId: String(product._id),
      quantity: 1,
      kitSizeKey: kitSize.key,
      flavorIds: [String(selectedFlavor._id)],
      notes: megaTeaKitFlavorNote(selectedFlavorName),
    });
    setLoading(false);
  };

  if (!isMegaTeaKitProduct(product.slug)) return null;

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
        <p className="mt-2 text-grey">{shortDescription}</p>
        {hasPrice(unitPrice) && (
          <p className="mt-4 font-display text-3xl text-pink">
            {formatPrice(unitPrice, 'USD', locale)}
          </p>
        )}
        <div
          className="prose-brand mt-6 text-grey"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
        />

        <div className="mt-8 space-y-6 rounded-2xl border border-grey/15 bg-cream p-6">
          <p className="text-sm text-grey">
            {locale === 'es'
              ? `Cada kit incluye ${MEGA_TEA_KITS_MENU.includes.join(', ')}.`
              : `Each kit includes ${MEGA_TEA_KITS_MENU.includes.join(', ')}.`}
          </p>

          <div>
            <h3 className="font-display text-2xl">
              {locale === 'es' ? 'Sabor del potenciador' : 'Flavor enhancer'}
            </h3>
            <div className="mt-4">
              <Select
                name="mega-tea-kit-flavor"
                value={flavorId}
                onChange={(event) => setFlavorId(event.target.value)}
                options={[
                  {
                    value: '',
                    label:
                      locale === 'es' ? 'Selecciona un sabor' : 'Select a flavor',
                  },
                  ...kitFlavors.map((flavor) => ({
                    value: String(flavor._id),
                    label: getLocalized(flavor.name, locale),
                  })),
                ]}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-grey/15 pt-6">
            <p className="font-display text-2xl">
              {hasPrice(unitPrice) ? formatPrice(unitPrice, 'USD', locale) : formatPrice(null, 'USD', locale)}
            </p>
            <Button onClick={handleAdd} loading={loading} disabled={!canAdd}>
              {locale === 'es' ? 'Agregar al carrito' : 'Add to cart'}
            </Button>
          </div>

          {!canAdd && hasPrice(unitPrice) && (
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
