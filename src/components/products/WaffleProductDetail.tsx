'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice, sanitizeHtml } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import { ProductPlaceholderVisual } from '@/components/products/ProductPlaceholderVisual';
import { WaffleModifierGroups } from '@/components/products/WaffleModifierGroups';
import {
  WAFFLES_MENU,
  isWaffleProduct,
  waffleAllToppings,
  waffleExtraModifierSlug,
  waffleMenuItem,
  waffleOrderNotes,
} from '@/lib/waffles-menu';
import { productUsesPlaceholderCard } from '@/lib/product-placeholder';
import type { IProduct } from '@/models/Product';
import type { IAddIn } from '@/models/AddIn';
import type { Locale } from '@/types';

interface WaffleProductDetailProps {
  product: IProduct;
  addIns: IAddIn[];
  locale: Locale;
  categorySlug: string;
}

export function WaffleProductDetail({
  product,
  addIns,
  locale,
  categorySlug,
}: WaffleProductDetailProps) {
  const { addItem } = useCart();
  const [includedToppings, setIncludedToppings] = useState<string[]>([]);
  const [extraToppings, setExtraToppings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const menuItem = waffleMenuItem(product.slug);
  const allToppings = waffleAllToppings();

  const name = getLocalized(product.name, locale);
  const shortDescription = getLocalized(product.shortDescription, locale);
  const description = getLocalized(product.description, locale);
  const galleryImages = product.images.filter((image) => image.url?.trim());
  const usePlaceholder = productUsesPlaceholderCard(product);
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
      const addIn = addInBySlug.get(waffleExtraModifierSlug(topping));
      total += addIn?.price ?? 0;
    }
    return total;
  }, [extraToppings, addInBySlug]);

  const unitPrice = product.basePrice + extraTotal;
  const canAdd = Boolean(menuItem) && hasPrice(unitPrice) && includedToppings.length > 0;

  const handleAdd = async () => {
    if (!canAdd) return;

    const cartAddIns: { addInId: string; quantity: number }[] = [];
    for (const topping of extraToppings) {
      const addIn = addInBySlug.get(waffleExtraModifierSlug(topping));
      if (addIn) cartAddIns.push({ addInId: String(addIn._id), quantity: 1 });
    }

    setLoading(true);
    await addItem({
      productId: String(product._id),
      quantity: 1,
      variantSku: product.variants[0]?.sku,
      notes: waffleOrderNotes({ includedToppings, extraToppings }),
      addIns: cartAddIns,
    });
    setLoading(false);
  };

  if (!isWaffleProduct(product.slug) || !menuItem) return null;

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        {usePlaceholder ? (
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
        ) : menuItem.image ? (
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
            <Image src={menuItem.image} alt={name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        ) : null}
      </div>

      <div>
        <h1 className="font-display text-5xl">{name}</h1>
        <p className="mt-2 text-grey">{shortDescription}</p>
        {showListedPrice && (
          <p className="mt-4 font-display text-3xl text-pink">
            {formatPrice(product.basePrice, 'USD', locale)}
          </p>
        )}
        <div
          className="prose-brand mt-6 text-grey"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
        />

        <div className="mt-8 space-y-6 rounded-2xl border border-grey/15 bg-cream p-6">
          <WaffleModifierGroups
            locale={locale}
            toppingGroups={WAFFLES_MENU.toppingGroups}
            allToppings={allToppings}
            includedToppings={includedToppings}
            extraToppings={extraToppings}
            includedMax={WAFFLES_MENU.includedToppingMax}
            extraPriceCents={Math.round(WAFFLES_MENU.extraToppingPrice * 100)}
            onIncludedChange={setIncludedToppings}
            onExtraChange={setExtraToppings}
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
                  ? 'Elige toppings'
                  : 'Choose toppings'}
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
