import { setRequestLocale } from 'next-intl/server';
import { getPageByKey } from '@/lib/data';
import { generatePageMetadata } from '@/lib/seo';
import { getLocalized } from '@/lib/utils';
import { PageSectionRenderer } from '@/components/sections/PageSectionRenderer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { Metadata } from 'next';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata('about', locale as Locale, '/about');
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await getPageByKey('about');

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
      <h1 className="font-display text-5xl">{page ? getLocalized(page.title, locale as Locale) : 'About Us'}</h1>
      {page?.hero?.subtitle && <p className="mt-4 max-w-3xl text-lg text-grey">{getLocalized(page.hero.subtitle, locale as Locale)}</p>}
      <div className="mt-12 space-y-0">
        {(page?.sections ?? []).map((section) => (
          <PageSectionRenderer key={section.key} section={section} locale={locale as Locale} />
        ))}
      </div>
      {!page && (
        <p className="mt-8 text-grey">
          Fusion Fuel & Boost Co. provides energizing, flavorful products designed to complement an active lifestyle.
          Catering is available for corporate, medical, school, wedding, and private events.
        </p>
      )}
    </div>
  );
}
