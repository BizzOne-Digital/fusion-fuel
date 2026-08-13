import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';

export default async function CheckoutSuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'checkout' });

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center lg:px-6">
      <h1 className="font-display text-5xl text-lime">{t('successTitle')}</h1>
      <p className="mt-4 text-grey">{t('successDescription')}</p>
      <Link href="/account/orders" className="mt-8 inline-block"><Button>View Orders</Button></Link>
    </div>
  );
}
