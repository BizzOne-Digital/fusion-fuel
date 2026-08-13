'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/context/CartContext';
import { CartItemRow } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function CartPage() {
  const t = useTranslations('cart');
  const locale = useLocale() as 'en' | 'es';
  const { items, loading } = useCart();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: t('title') }]} />
      <h1 className="font-display text-5xl">{t('title')}</h1>
      {loading ? (
        <p className="mt-8 text-grey">Loading…</p>
      ) : items.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg font-semibold">{t('empty')}</p>
          <p className="mt-2 text-grey">{t('emptyDescription')}</p>
          <Link href="/products" className="mt-6 inline-block"><Button>{t('continueShopping')}</Button></Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {items.map((item) => (
              <CartItemRow key={String((item as { _id?: string })._id ?? item.productId)} item={item} locale={locale} />
            ))}
          </ul>
          <aside className="rounded-2xl border border-grey/15 bg-cream p-6">
            <CartSummary />
            <Link href="/checkout" className="mt-6 block"><Button className="w-full">{t('checkout')}</Button></Link>
          </aside>
        </div>
      )}
    </div>
  );
}
