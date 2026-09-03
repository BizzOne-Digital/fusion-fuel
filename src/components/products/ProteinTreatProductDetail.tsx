'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import {
  PROTEIN_TREATS_MENU,
  isProteinTreatProduct,
  isPieInACupProduct,
  proteinTreatItemImage,
  proteinTreatPackLabel,
  proteinTreatMenuItem,
} from '@/lib/protein-treats-menu';
import type { IProduct } from '@/models/Product';
import type { Locale } from '@/types';

interface ProteinTreatProductDetailProps {
  product: IProduct;
  locale: Locale;
}

function resolveSellableVariant(product: IProduct) {
  const pricedVariants = product.variants.filter((variant) => hasPrice(variant.price));
  const variant = pricedVariants[0] ?? null;
  const unitPrice = variant?.price ?? product.basePrice;

  return { variant, unitPrice };
}

export function ProteinTreatProductDetail({ product, locale }: ProteinTreatProductDetailProps) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  const menuItem = proteinTreatMenuItem(product.slug);
  const name = getLocalized(product.name, locale);
  const image = menuItem ? proteinTreatItemImage(menuItem) : null;
  const packLabel = menuItem ? proteinTreatPackLabel(menuItem) : '';
  const { variant, unitPrice } = useMemo(() => resolveSellableVariant(product), [product]);
  const productId = String(product._id ?? '');
  const canAdd = Boolean(menuItem) && Boolean(productId) && hasPrice(unitPrice);

  const handleAdd = async () => {
    if (!canAdd) return;
    setLoading(true);
    await addItem({
      productId,
      quantity: 1,
      ...(variant?.sku ? { variantSku: variant.sku } : {}),
    });
    setLoading(false);
  };

  if (!isProteinTreatProduct(product.slug) || isPieInACupProduct(product.slug) || !menuItem) {
    return null;
  }

  const tagline =
    menuItem.kind === 'protein-truffles'
      ? PROTEIN_TREATS_MENU.proteinTruffles.description
      : PROTEIN_TREATS_MENU.proteinMiniDonuts.description;

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        {image ? (
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
            <Image
              src={image.url}
              alt={image.alt || name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        ) : null}
      </div>

      <div>
        <h1 className="font-display text-5xl">{name}</h1>
        <p className="mt-4 text-lg text-grey">{tagline}</p>
        <p className="mt-4 font-display text-4xl text-pink md:text-5xl">{packLabel}</p>

        <div className="mt-8 rounded-2xl border border-grey/15 bg-cream p-6">
          <Button type="button" onClick={handleAdd} loading={loading} disabled={!canAdd} size="lg">
            {locale === 'es' ? 'Agregar al carrito' : 'Add to cart'}
          </Button>
          {!canAdd ? (
            <p className="mt-3 text-sm text-grey">
              {locale === 'es'
                ? 'Precio no disponible en este momento.'
                : 'Pricing is not available right now.'}
            </p>
          ) : null}
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
