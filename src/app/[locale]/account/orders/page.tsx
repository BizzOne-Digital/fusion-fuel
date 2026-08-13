import { auth } from '@/lib/auth';
import { redirect, Link } from '@/i18n/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { formatPrice } from '@/lib/utils';
import type { Locale } from '@/types';

export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== 'customer') {
    redirect({ href: '/account/login', locale: locale as 'en' | 'es' });
  }

  const customer = user!;

  await connectDB();
  const orders = await Order.find({ customerId: customer.id }).sort({ createdAt: -1 }).lean();
  const t = await getTranslations({ locale, namespace: 'account' });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <h1 className="font-display text-5xl">{t('orderHistory')}</h1>
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link key={String(order._id)} href={`/account/orders/${order._id}`} className="block rounded-2xl border border-grey/15 p-4 hover:bg-cream">
            <div className="flex justify-between">
              <span className="font-semibold">{order.orderNumber}</span>
              <span>{formatPrice(order.totals.total, order.totals.currency, locale as Locale)}</span>
            </div>
            <p className="text-sm text-grey">{order.status} · {new Date(order.createdAt).toLocaleDateString()}</p>
          </Link>
        ))}
        {orders.length === 0 && <p className="text-grey">No orders yet.</p>}
      </div>
    </div>
  );
}
