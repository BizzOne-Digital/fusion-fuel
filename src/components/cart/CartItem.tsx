'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { getLocalized, formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/types';
import type { Locale } from '@/types';

interface CartItemRowProps {
  item: CartItem & { _id?: string };
  locale: Locale;
}

export function CartItemRow({ item, locale }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const itemId = (item as CartItem & { _id?: string })._id ?? String(item.productId);

  return (
    <li className="flex gap-4 rounded-xl border border-grey/15 p-3">
      <div className="flex-1">
        <p className="font-semibold text-carbon">{getLocalized(item.productName, locale)}</p>
        {item.variantName && (
          <p className="text-sm text-grey">{getLocalized(item.variantName, locale)}</p>
        )}
        {item.kitConfig && (
          <p className="text-sm text-grey">
            {getLocalized(item.kitConfig.kitSizeName, locale)} · {item.kitConfig.servings} servings
          </p>
        )}
        <p className="mt-1 font-medium">{formatPrice(item.lineTotal, 'USD', locale)}</p>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-grey/30 p-1"
            onClick={() => updateQuantity(itemId, Math.max(1, item.quantity - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[2ch] text-center">{item.quantity}</span>
          <button
            type="button"
            className="rounded-full border border-grey/30 p-1"
            onClick={() => updateQuantity(itemId, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="ml-auto text-coral"
            onClick={() => removeItem(itemId)}
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
