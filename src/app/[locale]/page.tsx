import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { HomePageSections } from '@/components/sections/HomePageSections';
import { SITE_IMAGES } from '@/lib/site-images';
import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/types';
import {
  getPageByKey,
  getHomeFallback,
  getPublishedProducts,
  getPublishedCategories,
  getPublishedServices,
  getSiteSettings,
} from '@/lib/data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata('home', locale as Locale, '');
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [page, products, categories, services, settings] =
    await Promise.all([
      getPageByKey('home'),
      getPublishedProducts({ limit: 12 }),
      getPublishedCategories(),
      getPublishedServices(),
      getSiteSettings(),
    ]);

  const fallback = getHomeFallback(locale as Locale);
  const rawHero = page?.hero ?? fallback.hero!;
  const hero = {
    ...rawHero,
    backgroundImage: {
      ...rawHero.backgroundImage,
      url:
        rawHero.backgroundImage?.url?.includes('/placeholders/') ||
        !rawHero.backgroundImage?.url ||
        rawHero.backgroundImage.url.includes('hero-tea.png')
          ? SITE_IMAGES.heroDrinks
          : rawHero.backgroundImage.url,
      alt: rawHero.backgroundImage?.alt ?? 'Fusion Fuel & Boost Co. Loaded Tea drinks',
    },
  };

  return (
    <HomePageSections
      locale={locale as Locale}
      hero={hero}
      products={products}
      categories={categories}
      services={services}
      settings={settings}
    />
  );
}
