'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export function CartSummary() {
  const t = useTranslations('cart');
  const locale = useLocale() as 'en' | 'es';
  const { totals } = useCart();

  if (!totals) return null;

  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt>{t('subtotal')}</dt>
        <dd>{formatPrice(totals.subtotal, totals.currency, locale)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between text-pink">
          <dt>{t('discount')}</dt>
          <dd>-{formatPrice(totals.discount, totals.currency, locale)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt>{t('shipping')}</dt>
        <dd>{formatPrice(totals.shipping, totals.currency, locale)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>{t('tax')}</dt>
        <dd>{formatPrice(totals.tax, totals.currency, locale)}</dd>
      </div>
      <div className="flex justify-between border-t border-grey/15 pt-2 text-base font-bold">
        <dt>{t('total')}</dt>
        <dd>{formatPrice(totals.total, totals.currency, locale)}</dd>
      </div>
    </dl>
  );
}
