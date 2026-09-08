import { setRequestLocale } from 'next-intl/server';
import { getPublishedServices } from '@/lib/data';
import { generatePageMetadata } from '@/lib/seo';
import { BookingPageSections } from '@/components/sections/BookingPageSections';
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
    <div className="min-w-0 overflow-x-hidden">
      <BookingPageSections locale={locale as Locale} services={services} />
    </div>
  );
}
