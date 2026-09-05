import { setRequestLocale } from 'next-intl/server';
import { getPublishedServices } from '@/lib/data';
import { generatePageMetadata } from '@/lib/seo';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ACAI_BOWL_EVENT, CONTACT } from '@/lib/brand-content';
import type { Metadata } from 'next';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata('booking', locale as Locale, '/booking');
}

export default async function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const services = await getPublishedServices();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Book Catering' }]} />
      <h1 className="font-display text-5xl">Book Catering</h1>
      <p className="mt-4 text-grey">
        Request an event — including our {ACAI_BOWL_EVENT.name}. Confirmation follows after review.
      </p>
      <div className="mt-6 rounded-2xl border border-grey/15 bg-cream p-5 text-sm text-carbon">
        <p className="font-semibold">{ACAI_BOWL_EVENT.deposit}</p>
        <p className="mt-2">{ACAI_BOWL_EVENT.balance}</p>
        <p className="mt-3 text-grey">{ACAI_BOWL_EVENT.serviceArea}</p>
        <p className="mt-1 text-grey">Call {CONTACT.phone} with questions.</p>
      </div>
      <div className="mt-10"><BookingWizard services={services} /></div>
    </div>
  );
}
