'use client';

import { useLocale, useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/context/CartContext';
import { CartItemRow } from './CartItem';
import { CartSummary } from './CartSummary';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const t = useTranslations('cart');
  const locale = useLocale() as 'en' | 'es';
  const { drawerOpen, closeDrawer, items, loading } = useCart();

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label={t('title')}>
      <button type="button" className="absolute inset-0 bg-ink/60" onClick={closeDrawer} aria-label="Close cart" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-grey/15 p-4">
          <h2 className="font-display text-2xl">{t('title')}</h2>
          <button type="button" onClick={closeDrawer} className="rounded-full p-2 hover:bg-cream" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-grey">{t('title')}…</p>
          ) : items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-semibold">{t('empty')}</p>
              <p className="mt-2 text-sm text-grey">{t('emptyDescription')}</p>
              <Link href="/menu" onClick={closeDrawer} className="mt-6 inline-block text-pink hover:underline">
                {t('continueShopping')}
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <CartItemRow key={String(item.productId)} item={item} locale={locale} />
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-grey/15 p-4">
            <CartSummary />
            <Link href="/cart" onClick={closeDrawer} className="mt-4 block text-center text-sm text-pink hover:underline">
              {t('title')}
            </Link>
            <Link href="/checkout" onClick={closeDrawer} className="mt-4 block">
              <Button className="w-full">{t('checkout')}</Button>
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
