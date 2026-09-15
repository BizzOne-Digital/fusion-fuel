'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import { ProductPlaceholderVisual } from '@/components/products/ProductPlaceholderVisual';
import { AcaiBowlModifierGroups } from '@/components/products/AcaiBowlModifierGroups';
import {
  ACAI_BOWLS_MENU,
  acaiBowlExtraToppingNames,
  acaiBowlExtraToppingPriceCents,
  acaiBowlMenuItem,
  acaiBowlModifierConfig,
  acaiBowlModifierSlug,
  acaiBowlOrderNotes,
  acaiBowlValidateSelections,
  isAcaiBowlProduct,
} from '@/lib/acai-bowls-menu';
import { productUsesPlaceholderCard } from '@/lib/product-placeholder';
import { getAddInUnitPrice } from '@/lib/product-add-ins';
import type { IProduct } from '@/models/Product';
import type { IAddIn } from '@/models/AddIn';
import type { Locale } from '@/types';

interface AcaiBowlProductDetailProps {
  product: IProduct;
  addIns: IAddIn[];
  locale: Locale;
  categorySlug: string;
}

export function AcaiBowlProductDetail({
  product,
  addIns,
  locale,
  categorySlug,
}: AcaiBowlProductDetailProps) {
  const { addItem } = useCart();
  const [includedFruits, setIncludedFruits] = useState<string[]>([]);
  const [includedToppings, setIncludedToppings] = useState<string[]>([]);
  const [extraToppings, setExtraToppings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const menuItem = acaiBowlMenuItem(product.slug);
  const modifierConfig = menuItem ? acaiBowlModifierConfig(menuItem) : null;

  const name = getLocalized(product.name, locale);
  const shortDescription =
    getLocalized(product.shortDescription, locale) ||
    (menuItem?.description?.trim() ?? '');
  const galleryImages = product.images.filter((image) => image.url?.trim());
  const menuImage =
    menuItem && 'image' in menuItem && menuItem.image ? menuItem.image : null;
  const usePlaceholder = !menuImage && productUsesPlaceholderCard(product);
  const showListedPrice = hasPrice(product.basePrice);

  const addInBySlug = useMemo(() => {
    const map = new Map<string, IAddIn>();
    for (const addIn of addIns) {
      map.set(addIn.slug, addIn);
    }
    return map;
  }, [addIns]);

  const extraTotal = useMemo(() => {
    let total = 0;
    for (const topping of extraToppings) {
      const addIn = addInBySlug.get(acaiBowlModifierSlug('extra-topping', topping));
      total += addIn
        ? getAddInUnitPrice(product, addIn)
        : acaiBowlExtraToppingPriceCents(topping);
    }
    return total;
  }, [extraToppings, addInBySlug, product]);

  const unitPrice = product.basePrice + extraTotal;

  const canAdd =
    Boolean(modifierConfig) &&
    hasPrice(unitPrice) &&
    acaiBowlValidateSelections(modifierConfig!, includedFruits, includedToppings);

  const handleAdd = async () => {
    if (!canAdd || !modifierConfig) return;

    const cartAddIns: { addInId: string; quantity: number }[] = [];

    for (const topping of extraToppings) {
      const addIn = addInBySlug.get(acaiBowlModifierSlug('extra-topping', topping));
      if (addIn) cartAddIns.push({ addInId: String(addIn._id), quantity: 1 });
    }

    setLoading(true);
    await addItem({
      productId: String(product._id),
      quantity: 1,
      variantSku: product.variants[0]?.sku,
      notes: acaiBowlOrderNotes({
        includedFruits,
        includedToppings,
        extraToppings,
        fixedIncludes: modifierConfig.fixedIncludes,
      }),
      addIns: cartAddIns,
    });
    setLoading(false);
  };

  if (!isAcaiBowlProduct(product.slug) || !menuItem || !modifierConfig) return null;

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        {menuImage ? (
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
            <Image
              src={menuImage}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        ) : usePlaceholder ? (
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
            <ProductPlaceholderVisual
              name={name}
              subtitle={shortDescription}
              categorySlug={categorySlug}
              locale={locale}
            />
          </div>
        ) : galleryImages.length > 0 ? (
          <ProductImageGallery images={galleryImages} name={name} />
        ) : null}
      </div>

      <div>
        <h1 className="font-display text-5xl">{name}</h1>
        {shortDescription ? <p className="mt-2 text-grey">{shortDescription}</p> : null}
        {showListedPrice && (
          <p className="mt-4 font-display text-3xl text-pink">
            {formatPrice(product.basePrice, 'USD', locale)}
          </p>
        )}
        <p className="mt-4 text-sm italic text-grey">{ACAI_BOWLS_MENU.footnote}</p>

        <div className="mt-8 space-y-6 rounded-2xl border border-grey/15 bg-cream p-6">
          <AcaiBowlModifierGroups
            locale={locale}
            includedFruitMax={modifierConfig.includedFruitMax}
            includedToppingMax={modifierConfig.includedToppingMax}
            fixedIncludes={modifierConfig.fixedIncludes}
            includedFruits={includedFruits}
            includedToppings={includedToppings}
            extraToppings={extraToppings}
            includedFruitOptions={ACAI_BOWLS_MENU.includedFruits}
            includedToppingOptions={ACAI_BOWLS_MENU.includedToppings}
            extraToppingOptions={acaiBowlExtraToppingNames()}
            onIncludedFruitsChange={setIncludedFruits}
            onIncludedToppingsChange={setIncludedToppings}
            onExtraToppingsChange={setExtraToppings}
          />

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-grey/15 pt-6">
            <p className="font-display text-2xl">
              {hasPrice(unitPrice) ? formatPrice(unitPrice, 'USD', locale) : formatPrice(null, 'USD', locale)}
            </p>
            <Button onClick={handleAdd} loading={loading} disabled={!canAdd}>
              {canAdd
                ? locale === 'es'
                  ? 'Agregar al carrito'
                  : 'Add to cart'
                : locale === 'es'
                  ? 'Elige frutas y toppings'
                  : 'Choose fruits & toppings'}
            </Button>
          </div>
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
