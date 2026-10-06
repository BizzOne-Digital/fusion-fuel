'use client';

import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import type { IAddIn } from '@/models/AddIn';
import type { IProduct } from '@/models/Product';
import type { Locale } from '@/types';
import { getAddInMaxQuantity, getAddInUnitPrice, isAddInIncluded } from '@/lib/product-add-ins';
import { isLoadedTeaProduct, loadedTeaAddOnDisplayName } from '@/lib/loaded-teas-menu';

interface AddInSelectorProps {
  product: IProduct;
  addIns: IAddIn[];
  locale: Locale;
  selected: Record<string, number>;
  onChange: (next: Record<string, number>) => void;
  title?: string;
}

export function AddInSelector({ product, addIns, locale, selected, onChange, title }: AddInSelectorProps) {
  if (addIns.length === 0) return null;

  const heading =
    title ?? (locale === 'es' ? 'Complementos' : 'Add-ons');

  return (
    <div>
      <h3 className="font-display text-2xl">{heading}</h3>
      <div className="mt-4 space-y-3">
        {addIns.map((addIn) => {
          const id = String(addIn._id);
          const max = getAddInMaxQuantity(product, id);
          const included = isAddInIncluded(product, id);
          const unitPrice = getAddInUnitPrice(product, addIn);
          const label = isLoadedTeaProduct(product.slug)
            ? (loadedTeaAddOnDisplayName(addIn.slug) ?? getLocalized(addIn.name, locale))
            : getLocalized(addIn.name, locale);

          return (
            <label key={id} className="flex items-center justify-between rounded-xl bg-white p-3">
              <span>
                {label}
                <span className="ml-2 text-sm text-grey">
                  {included
                    ? locale === 'es'
                      ? 'Incluido'
                      : 'Included'
                    : hasPrice(unitPrice)
                      ? formatPrice(unitPrice, 'USD', locale)
                      : formatPrice(null, 'USD', locale)}
                </span>
              </span>
              <input
                type="number"
                min={0}
                max={max}
                value={selected[id] ?? 0}
                onChange={(event) =>
                  onChange({
                    ...selected,
                    [id]: Number(event.target.value),
                  })
                }
                className="w-16 rounded-lg border border-grey/30 px-2 py-1"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
