'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import {
  PROTEIN_TREATS_MENU,
  isProteinTreatProduct,
  isPieInACupProduct,
  proteinTreatItemImage,
  proteinTreatPackLabel,
  proteinTreatMenuItem,
  proteinMiniDonutFlavorNote,
  proteinTrufflePackPriceCents,
  proteinTruffleVariantSku,
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
  const [packSlug, setPackSlug] = useState<string>(PROTEIN_TREATS_MENU.proteinTruffles.packs[0].slug);
  const [flavorSlug, setFlavorSlug] = useState('');

  const menuItem = proteinTreatMenuItem(product.slug);
  const isTruffles = menuItem?.kind === 'protein-truffles';
  const isMiniDonuts = menuItem?.kind === 'protein-mini-donuts';
  const selectedFlavor = isMiniDonuts
    ? PROTEIN_TREATS_MENU.proteinMiniDonuts.flavors.find((flavor) => flavor.slug === flavorSlug)
    : undefined;
  const name = getLocalized(product.name, locale);
  const image = menuItem ? proteinTreatItemImage(menuItem) : null;
  const packLabel = menuItem && !isTruffles ? proteinTreatPackLabel(menuItem) : '';
  const { variant: defaultVariant, unitPrice: defaultUnitPrice } = useMemo(
    () => resolveSellableVariant(product),
    [product]
  );

  const unitPrice = isTruffles ? proteinTrufflePackPriceCents(packSlug) : defaultUnitPrice;
  const variantSku = isTruffles
    ? proteinTruffleVariantSku(packSlug, product.sku)
    : defaultVariant?.sku;
  const productId = String(product._id ?? '');
  const canAdd =
    Boolean(menuItem) &&
    Boolean(productId) &&
    hasPrice(unitPrice) &&
    (!isMiniDonuts || Boolean(selectedFlavor));

  const handleAdd = async () => {
    if (!canAdd || (isMiniDonuts && !selectedFlavor)) return;
    setLoading(true);
    await addItem({
      productId,
      quantity: 1,
      ...(variantSku ? { variantSku } : {}),
      ...(isMiniDonuts && selectedFlavor
        ? { notes: proteinMiniDonutFlavorNote(selectedFlavor.name) }
        : {}),
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
        {!isTruffles && packLabel && (!isMiniDonuts || selectedFlavor) ? (
          <p className="mt-4 font-display text-4xl text-pink md:text-5xl">{packLabel}</p>
        ) : null}
        {isTruffles && hasPrice(unitPrice) ? (
          <p className="mt-4 font-display text-3xl text-pink">
            {formatPrice(unitPrice, 'USD', locale)}
          </p>
        ) : null}

        <div className="mt-8 space-y-6 rounded-2xl border border-grey/15 bg-cream p-6">
          {isTruffles ? (
            <div>
              <h3 className="font-display text-2xl">{locale === 'es' ? 'Cantidad' : 'Quantity'}</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {PROTEIN_TREATS_MENU.proteinTruffles.packs.map((pack) => (
                  <button
                    key={pack.slug}
                    type="button"
                    onClick={() => setPackSlug(pack.slug)}
                    className={`rounded-xl border-2 px-4 py-3 text-left transition ${
                      packSlug === pack.slug ? 'border-lime bg-white' : 'border-grey/20 bg-white/50'
                    }`}
                  >
                    <p className="font-semibold">{pack.label}</p>
                    <p className="mt-1 text-sm text-grey">
                      {formatPrice(proteinTrufflePackPriceCents(pack.slug), 'USD', locale)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {isMiniDonuts ? (
            <div>
              <h3 className="font-display text-2xl">{locale === 'es' ? 'Sabor' : 'Flavor'}</h3>
              <div className="mt-4">
                <Select
                  name="protein-mini-donut-flavor"
                  value={flavorSlug}
                  onChange={(event) => setFlavorSlug(event.target.value)}
                  options={[
                    {
                      value: '',
                      label: locale === 'es' ? 'Selecciona un sabor' : 'Select a flavor',
                    },
                    ...PROTEIN_TREATS_MENU.proteinMiniDonuts.flavors.map((flavor) => ({
                      value: flavor.slug,
                      label: flavor.name,
                    })),
                  ]}
                />
              </div>
            </div>
          ) : null}

          <div
            className={`flex flex-wrap items-center justify-between gap-4 ${
              isTruffles || isMiniDonuts ? 'border-t border-grey/15 pt-6' : ''
            }`}
          >
            {isTruffles || (isMiniDonuts && selectedFlavor) ? (
              <p className="font-display text-2xl">
                {hasPrice(unitPrice) ? formatPrice(unitPrice, 'USD', locale) : formatPrice(null, 'USD', locale)}
              </p>
            ) : null}
            <Button type="button" onClick={handleAdd} loading={loading} disabled={!canAdd} size="lg">
              {isMiniDonuts && !canAdd && hasPrice(unitPrice)
                ? locale === 'es'
                  ? 'Elige un sabor'
                  : 'Choose flavor'
                : locale === 'es'
                  ? 'Agregar al carrito'
                  : 'Add to cart'}
            </Button>
          </div>

          {!canAdd && !isMiniDonuts ? (
            <p className="text-sm text-grey">
              {locale === 'es'
                ? 'Precio no disponible en este momento.'
                : 'Pricing is not available right now.'}
            </p>
          ) : null}
          {isMiniDonuts && !selectedFlavor && hasPrice(unitPrice) ? (
            <p className="text-sm text-grey">
              {locale === 'es' ? 'Elige un sabor para continuar.' : 'Select a flavor to continue.'}
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
