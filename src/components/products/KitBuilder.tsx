'use client';

import { useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { MEGA_TEA_KITS_MENU } from '@/lib/mega-tea-kits-menu';
import { Button } from '@/components/ui/Button';
import { FlavorSelector } from './FlavorSelector';
import type { IProduct } from '@/models/Product';
import type { IFlavor } from '@/models/Flavor';
import type { IAddIn } from '@/models/AddIn';

interface KitBuilderProps {
  product: IProduct;
  flavors: IFlavor[];
  addIns: IAddIn[];
}

const FLAVOR_LIMITS: Record<string, number> = {
  standard: MEGA_TEA_KITS_MENU.flavorPickerLimit,
  '6': 3,
  '12': 6,
  '20': 10,
  '30': 15,
};

export function KitBuilder({ product, flavors, addIns }: KitBuilderProps) {
  const locale = useLocale() as 'en' | 'es';
  const { addItem } = useCart();
  const [kitSizeKey, setKitSizeKey] = useState(product.kitSizes[0]?.key ?? 'standard');
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedAddIns, setSelectedAddIns] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const kitSize = product.kitSizes.find((k) => k.key === kitSizeKey);
  const flavorLimit = FLAVOR_LIMITS[kitSizeKey] ?? MEGA_TEA_KITS_MENU.flavorPickerLimit;

  const addInTotal = useMemo(
    () =>
      Object.entries(selectedAddIns).reduce((sum, [id, qty]) => {
        const addIn = addIns.find((a) => String(a._id) === id);
        return sum + (addIn?.price ?? 0) * qty;
      }, 0),
    [selectedAddIns, addIns]
  );

  const unitPrice = (kitSize?.price ?? 0) + addInTotal;
  const canAdd = kitSize && selectedFlavors.length > 0 && hasPrice(unitPrice);

  const handleAdd = async () => {
    if (!kitSize || !canAdd) return;
    setLoading(true);
    await addItem({
      productId: String(product._id),
      quantity: 1,
      kitSizeKey: kitSize.key,
      flavorIds: selectedFlavors,
      addIns: Object.entries(selectedAddIns)
        .filter(([, quantity]) => quantity > 0)
        .map(([addInId, quantity]) => ({ addInId, quantity })),
    });
    setLoading(false);
  };

  return (
    <div className="space-y-8 rounded-2xl border border-grey/15 bg-cream p-6">
      <p className="text-sm text-grey">
        {locale === 'es'
          ? `Cada kit incluye ${MEGA_TEA_KITS_MENU.includes.join(', ')}.`
          : `Each kit includes ${MEGA_TEA_KITS_MENU.includes.join(', ')}.`}
      </p>

      <div>
        <h3 className="font-display text-2xl">{locale === 'es' ? 'Tamaño del kit' : 'Kit size'}</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {product.kitSizes.map((size) => (
            <button
              key={size.key}
              type="button"
              onClick={() => {
                setKitSizeKey(size.key);
                setSelectedFlavors([]);
              }}
              className={`rounded-xl border-2 p-4 text-left transition ${
                kitSizeKey === size.key ? 'border-lime bg-white' : 'border-grey/20 bg-white/50'
              }`}
            >
              <p className="font-display text-xl">{getLocalized(size.name, locale)}</p>
              {size.servings > 1 && <p className="text-sm text-grey">{size.servings} servings</p>}
              <p className="mt-2 font-semibold">
                {hasPrice(size.price) ? formatPrice(size.price, 'USD', locale) : formatPrice(null, 'USD', locale)}
              </p>
            </button>
          ))}
        </div>
      </div>

      <FlavorSelector
        flavors={flavors}
        locale={locale}
        limit={flavorLimit}
        selected={selectedFlavors}
        onChange={setSelectedFlavors}
      />

      {addIns.length > 0 && (
        <div>
          <h3 className="font-display text-2xl">{locale === 'es' ? 'Complementos' : 'Add-ins'}</h3>
          <div className="mt-4 space-y-3">
            {addIns.map((addIn) => (
              <label key={String(addIn._id)} className="flex items-center justify-between rounded-xl bg-white p-3">
                <span>
                  {getLocalized(addIn.name, locale)}
                  <span className="ml-2 text-sm text-grey">
                    {hasPrice(addIn.price) ? formatPrice(addIn.price, 'USD', locale) : formatPrice(null, 'USD', locale)}
                  </span>
                </span>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={selectedAddIns[String(addIn._id)] ?? 0}
                  onChange={(e) =>
                    setSelectedAddIns((prev) => ({
                      ...prev,
                      [String(addIn._id)]: Number(e.target.value),
                    }))
                  }
                  className="w-16 rounded-lg border border-grey/30 px-2 py-1"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-grey/15 pt-6">
        <p className="font-display text-2xl">
          {hasPrice(unitPrice) ? formatPrice(unitPrice, 'USD', locale) : formatPrice(null, 'USD', locale)}
        </p>
        {hasPrice(unitPrice) ? (
          <Button onClick={handleAdd} loading={loading} disabled={!canAdd}>
            {locale === 'es' ? 'Agregar al carrito' : 'Add to cart'}
          </Button>
        ) : (
          <Link href="/contact">
            <Button variant="outline">{locale === 'es' ? 'Consultar precio' : 'Contact for pricing'}</Button>
          </Link>
        )}
      </div>

      {!canAdd && hasPrice(unitPrice) && (
        <p className="text-sm text-grey">
          {locale === 'es' ? 'Elige al menos un sabor para continuar.' : 'Select at least one flavor to continue.'}
        </p>
      )}
    </div>
  );
}
