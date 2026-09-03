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
  LOADED_TEAS_MENU,
  isLoadedTeaProduct,
  loadedTeaFlavorNote,
  loadedTeaItemImage,
  loadedTeaPricingSummary,
  loadedTeaSizePriceCents,
  loadedTeaVariantSku,
} from '@/lib/loaded-teas-menu';
import type { IProduct } from '@/models/Product';
import type { IAddIn } from '@/models/AddIn';
import type { Locale } from '@/types';

interface LoadedTeaProductDetailProps {
  product: IProduct;
  addIns: IAddIn[];
  locale: Locale;
}

export function LoadedTeaProductDetail({ product, addIns, locale }: LoadedTeaProductDetailProps) {
  const { addItem } = useCart();
  const [flavorSlug, setFlavorSlug] = useState('');
  const [sizeSlug, setSizeSlug] = useState<string>(LOADED_TEAS_MENU.sizes[0].slug);
  const [selectedAddIns, setSelectedAddIns] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const name = getLocalized(product.name, locale);

  const selectedItem = LOADED_TEAS_MENU.items.find((item) => item.slug === flavorSlug);
  const displayImage = selectedItem
    ? loadedTeaItemImage(selectedItem)
    : LOADED_TEAS_MENU.heroImage;

  const variantSku = flavorSlug ? loadedTeaVariantSku(sizeSlug, flavorSlug) : '';
  const unitPrice = flavorSlug ? loadedTeaSizePriceCents(sizeSlug, flavorSlug) : 0;

  const addInTotal = useMemo(
    () =>
      Object.entries(selectedAddIns).reduce((sum, [id, qty]) => {
        const addIn = addIns.find((entry) => String(entry._id) === id);
        return sum + (addIn?.price ?? 0) * qty;
      }, 0),
    [selectedAddIns, addIns]
  );

  const linePrice = unitPrice + addInTotal;
  const canAdd = Boolean(selectedItem && hasPrice(linePrice));

  const handleAdd = async () => {
    if (!canAdd || !selectedItem) return;
    setLoading(true);
    await addItem({
      productId: String(product._id),
      quantity: 1,
      variantSku,
      notes: loadedTeaFlavorNote(selectedItem.name),
      addIns: Object.entries(selectedAddIns)
        .filter(([, quantity]) => quantity > 0)
        .map(([addInId, quantity]) => ({ addInId, quantity })),
    });
    setLoading(false);
  };

  if (!isLoadedTeaProduct(product.slug)) return null;

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
        <p className="mt-2 text-grey">{LOADED_TEAS_MENU.servingNote}</p>
        <p className="mt-2 text-sm leading-relaxed text-grey">{loadedTeaPricingSummary()}</p>
        {selectedItem && hasPrice(unitPrice) && (
          <p className="mt-4 font-display text-3xl text-pink">
            {formatPrice(unitPrice, 'USD', locale)}
          </p>
        )}
        {selectedItem && (
          <div className="mt-6 rounded-2xl border border-grey/15 bg-cream p-4 text-sm text-grey">
            <p className="font-semibold text-carbon">{selectedItem.name}</p>
            <p className="mt-2">
              <span className="font-semibold text-carbon">
                {locale === 'es' ? 'Ingredientes: ' : 'Ingredients: '}
              </span>
              {selectedItem.ingredients.join(', ')}
            </p>
            {'servingNote' in selectedItem && selectedItem.servingNote && (
              <p className="mt-2">
                <span className="font-semibold text-carbon">
                  {locale === 'es' ? 'Servido: ' : 'Served: '}
                </span>
                {selectedItem.servingNote}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 space-y-6 rounded-2xl border border-grey/15 bg-cream p-6">
          <div>
            <h3 className="font-display text-2xl">{locale === 'es' ? 'Sabor' : 'Flavor'}</h3>
            <div className="mt-4">
              <Select
                name="loaded-tea-flavor"
                value={flavorSlug}
                onChange={(event) => setFlavorSlug(event.target.value)}
                options={[
                  {
                    value: '',
                    label: locale === 'es' ? 'Selecciona un sabor' : 'Select a flavor',
                  },
                  ...LOADED_TEAS_MENU.items.map((item) => ({
                    value: item.slug,
                    label: item.name,
                  })),
                ]}
              />
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl">{locale === 'es' ? 'Tamaño' : 'Size'}</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {LOADED_TEAS_MENU.sizes.map((size) => (
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
                      {formatPrice(loadedTeaSizePriceCents(size.slug, flavorSlug), 'USD', locale)}
                    </p>
                  )}
                </button>
              ))}
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
            <p className="font-display text-2xl">
              {canAdd ? formatPrice(linePrice, 'USD', locale) : formatPrice(null, 'USD', locale)}
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
