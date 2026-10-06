import { auth } from '@/lib/auth';
import { redirect } from '@/i18n/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== 'customer') {
    redirect({ href: '/account/login', locale: locale as 'en' | 'es' });
  }

  const customer = user!;

  const t = await getTranslations({ locale, namespace: 'account' });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <h1 className="font-display text-5xl">{t('title')}</h1>
      <p className="mt-2 text-grey">Welcome, {customer.name ?? customer.email}</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link href="/account/orders" className="rounded-2xl border border-grey/15 p-6 hover:bg-cream">{t('orders')}</Link>
        <Link href="/account/bookings" className="rounded-2xl border border-grey/15 p-6 hover:bg-cream">{t('bookings')}</Link>
        <Link href="/account/profile" className="rounded-2xl border border-grey/15 p-6 hover:bg-cream">{t('profile')}</Link>
      </div>
    </div>
  );
}
