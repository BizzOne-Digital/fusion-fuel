'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { AddInSelector } from '@/components/products/AddInSelector';
import {
  MEGA_TEA_KITS_MENU,
  isMegaTeaKitProduct,
  megaTeaKitCollectionFromProduct,
  megaTeaKitFlavorNote,
  megaTeaKitPricingSummary,
} from '@/lib/mega-tea-kits-menu';
import { resolveFlavorImage } from '@/lib/site-images';
import type { IFlavor } from '@/models/Flavor';
import type { IProduct } from '@/models/Product';
import type { IAddIn } from '@/models/AddIn';
import type { Locale } from '@/types';

interface MegaTeaKitProductDetailProps {
  product: IProduct;
  flavors: IFlavor[];
  addIns: IAddIn[];
  locale: Locale;
}

export function MegaTeaKitProductDetail({ product, flavors, addIns, locale }: MegaTeaKitProductDetailProps) {
  const { addItem } = useCart();
  const [flavorId, setFlavorId] = useState('');
  const [selectedAddIns, setSelectedAddIns] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const name = getLocalized(product.name, locale);
  const kitSize = product.kitSizes[0];
  const unitPrice = kitSize?.price ?? product.basePrice;

  const addInTotal = useMemo(
    () =>
      Object.entries(selectedAddIns).reduce((sum, [id, qty]) => {
        const addIn = addIns.find((entry) => String(entry._id) === id);
        return sum + (addIn?.price ?? 0) * qty;
      }, 0),
    [selectedAddIns, addIns]
  );

  const linePrice = unitPrice + addInTotal;

  const collectionSlug = megaTeaKitCollectionFromProduct(product.slug);

  const kitFlavors = useMemo(() => {
    const collectionFlavors = flavors.filter((flavor) =>
      collectionSlug ? flavor.category === collectionSlug : true
    );

    const matchedProductFlavors = collectionFlavors.filter((flavor) =>
      product.flavorIds?.length
        ? product.flavorIds.some((id) => String(id) === String(flavor._id))
        : true
    );

    const list = matchedProductFlavors.length > 0 ? matchedProductFlavors : collectionFlavors;

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

  const canAdd = Boolean(selectedFlavor && kitSize && hasPrice(linePrice));

  const handleAdd = async () => {
    if (!canAdd || !selectedFlavor || !kitSize) return;
    setLoading(true);
    await addItem({
      productId: String(product._id),
      quantity: 1,
      kitSizeKey: kitSize.key,
      flavorIds: [String(selectedFlavor._id)],
      notes: megaTeaKitFlavorNote(selectedFlavorName),
      addIns: Object.entries(selectedAddIns)
        .filter(([, quantity]) => quantity > 0)
        .map(([addInId, quantity]) => ({ addInId, quantity })),
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
        <p className="mt-2 text-sm leading-relaxed text-grey">{megaTeaKitPricingSummary()}</p>
        <p className="mt-4 font-display text-3xl text-pink">
          {formatPrice(linePrice, 'USD', locale)}
        </p>

        <div className="mt-8 space-y-6 rounded-2xl border border-grey/15 bg-cream p-6">
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
