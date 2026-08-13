import { setRequestLocale } from 'next-intl/server';
import { getPublishedServices } from '@/lib/data';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const services = await getPublishedServices();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Book Catering' }]} />
      <h1 className="font-display text-5xl">Book Catering</h1>
      <p className="mt-4 text-grey">Submit a catering request. Confirmation will follow after review.</p>
      <div className="mt-10"><BookingWizard services={services} /></div>
    </div>
  );
}
