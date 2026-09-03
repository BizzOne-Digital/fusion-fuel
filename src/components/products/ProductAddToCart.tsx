'use client';

import { useMemo, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { PROTEIN_COFFEE, isProteinCoffeeProduct, proteinCoffeeFlavorNote } from '@/lib/protein-coffee-menu';
import { isProteinTreatProduct } from '@/lib/protein-treats-menu';
import { Select } from '@/components/ui/Select';
import { AddInSelector } from '@/components/products/AddInSelector';
import type { IProduct } from '@/models/Product';
import type { IAddIn } from '@/models/AddIn';
import type { Locale } from '@/types';

interface ProductAddToCartProps {
  product: IProduct;
  addIns: IAddIn[];
  locale: Locale;
}

export function ProductAddToCart({ product, addIns, locale }: ProductAddToCartProps) {
  const { addItem } = useCart();
  const pricedVariants = product.variants.filter((variant) => variant.price > 0);
  const [variantSku, setVariantSku] = useState(pricedVariants[0]?.sku ?? product.variants[0]?.sku ?? '');
  const [flavorSlug, setFlavorSlug] = useState('');
  const [selectedAddIns, setSelectedAddIns] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const selectedVariant = product.variants.find((variant) => variant.sku === variantSku);
  const basePrice = selectedVariant?.price ?? product.basePrice;

  const addInTotal = useMemo(
    () =>
      Object.entries(selectedAddIns).reduce((sum, [id, qty]) => {
        const addIn = addIns.find((entry) => String(entry._id) === id);
        return sum + (addIn?.price ?? 0) * qty;
      }, 0),
    [selectedAddIns, addIns]
  );

  const requiresFlavor = isProteinCoffeeProduct(product.slug);
  const showAddOns = !isProteinTreatProduct(product.slug);
  const selectedFlavor = PROTEIN_COFFEE.flavors.find((flavor) => flavor.slug === flavorSlug);

  const unitPrice = basePrice + addInTotal;
  const canAdd = hasPrice(unitPrice) && (!requiresFlavor || Boolean(selectedFlavor));

  const handleAdd = async () => {
    if (!canAdd) return;
    if (requiresFlavor && !selectedFlavor) return;
    setLoading(true);
    await addItem({
      productId: String(product._id),
      quantity: 1,
      ...(variantSku ? { variantSku } : {}),
      ...(requiresFlavor && selectedFlavor
        ? { notes: proteinCoffeeFlavorNote(selectedFlavor.name) }
        : {}),
      addIns: Object.entries(selectedAddIns)
        .filter(([, quantity]) => quantity > 0)
        .map(([addInId, quantity]) => ({ addInId, quantity })),
    });
    setLoading(false);
  };

  return (
    <div className="space-y-6 rounded-2xl border border-grey/15 bg-cream p-6">
      {requiresFlavor && (
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
                ...PROTEIN_COFFEE.flavors.map((flavor) => ({
                  value: flavor.slug,
                  label: flavor.name,
                })),
              ]}
            />
          </div>
        </div>
      )}

      {product.variants.filter((variant) => variant.price > 0).length > 1 && (
        <div>
          <h3 className="font-display text-2xl">{locale === 'es' ? 'Tamaño' : 'Size'}</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {product.variants
              .filter((variant) => variant.price > 0)
              .map((variant) => (
              <button
                key={variant.sku}
                type="button"
                onClick={() => setVariantSku(variant.sku)}
                className={`rounded-xl border-2 px-4 py-3 text-left transition ${
                  variantSku === variant.sku ? 'border-lime bg-white' : 'border-grey/20 bg-white/50'
                }`}
              >
                <p className="font-semibold">{getLocalized(variant.name, locale)}</p>
                <p className="mt-1 text-sm text-grey">
                  {hasPrice(variant.price) ? formatPrice(variant.price, 'USD', locale) : formatPrice(null, 'USD', locale)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {showAddOns ? (
        <AddInSelector
          product={product}
          addIns={addIns}
          locale={locale}
          selected={selectedAddIns}
          onChange={setSelectedAddIns}
          title={
            requiresFlavor
              ? locale === 'es'
                ? 'Complementos opcionales'
                : 'Optional Add-Ons'
              : undefined
          }
        />
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-grey/15 pt-6">
        <p className="font-display text-2xl">
          {hasPrice(unitPrice) ? formatPrice(unitPrice, 'USD', locale) : formatPrice(null, 'USD', locale)}
        </p>
        {hasPrice(unitPrice) ? (
          canAdd ? (
            <Button onClick={handleAdd} loading={loading}>
              {locale === 'es' ? 'Agregar al carrito' : 'Add to cart'}
            </Button>
          ) : (
            <Button disabled>
              {locale === 'es' ? 'Selecciona un sabor' : 'Select a flavor'}
            </Button>
          )
        ) : (
          <Link href="/contact">
            <Button variant="outline">{locale === 'es' ? 'Consultar precio' : 'Contact for pricing'}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
