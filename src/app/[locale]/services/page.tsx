import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getPublishedServices } from '@/lib/data';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { getServiceImage } from '@/lib/site-images';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { Locale } from '@/types';

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const services = await getPublishedServices();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services' }]} />
      <h1 className="font-display text-5xl">Catering & Programs</h1>
      <p className="mt-4 max-w-2xl text-grey">Professional catering for offices, schools, weddings, and celebrations.</p>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Link key={String(service._id)} href={`/services/${service.slug}`} className="group overflow-hidden rounded-2xl border border-grey/15 bg-white hover:shadow-lg">
            <div className="relative aspect-video bg-cream">
              <Image
                src={service.thumbnail?.url?.includes('/placeholders/') ? getServiceImage(service.slug) : (service.thumbnail?.url ?? getServiceImage(service.slug))}
                alt={service.thumbnail?.alt ?? getLocalized(service.name, locale as Locale)}
                fill
                className="object-cover transition group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h2 className="font-display text-2xl">{getLocalized(service.name, locale as Locale)}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-grey">{getLocalized(service.shortDescription, locale as Locale)}</p>
              <p className="mt-3 font-semibold text-pink">
                {hasPrice(service.startingPrice) ? `From ${formatPrice(service.startingPrice, 'USD', locale as Locale)}` : 'Request a quote'}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {services.length === 0 && <p className="mt-8 text-grey">Services will appear here when published.</p>}
    </div>
  );
}
