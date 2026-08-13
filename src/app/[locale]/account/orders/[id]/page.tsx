import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { redirect } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { getLocalized, formatPrice } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { Locale } from '@/types';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== 'customer') {
    redirect({ href: '/account/login', locale: locale as 'en' | 'es' });
  }

  const customer = user!;

  await connectDB();
  const order = await Order.findOne({ _id: id, customerId: customer.id }).lean();
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <Breadcrumbs items={[{ label: 'Account', href: '/account' }, { label: 'Orders', href: '/account/orders' }, { label: order.orderNumber }]} />
      <h1 className="font-display text-4xl">{order.orderNumber}</h1>
      <p className="mt-2 text-grey">Status: {order.status} · Payment: {order.paymentStatus}</p>
      <ul className="mt-8 space-y-3">
        {order.items.map((item, i) => (
          <li key={i} className="flex justify-between rounded-xl bg-cream p-4">
            <span>{item.quantity}x {getLocalized(item.productName, locale as Locale)}</span>
            <span>{formatPrice(item.lineTotal, order.totals.currency, locale as Locale)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-right font-display text-2xl">Total: {formatPrice(order.totals.total, order.totals.currency, locale as Locale)}</p>
    </div>
  );
}
