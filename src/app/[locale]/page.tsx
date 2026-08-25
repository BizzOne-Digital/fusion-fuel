import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BRAND } from '@/lib/constants';
import {
  getPageByKey,
  getHomeFallback,
  getPublishedProducts,
  getPublishedCategories,
  getPublishedAddIns,
  getPublishedServices,
  getPublishedTestimonials,
  getSiteSettings,
} from '@/lib/data';
import { HomePageSections } from '@/components/sections/HomePageSections';
import { SITE_IMAGES } from '@/lib/site-images';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageByKey('home');
  const fallback = getHomeFallback(locale as Locale);
  const seo = page?.seo ?? fallback.seo;

  return {
    title: seo?.title ?? BRAND.name,
    description: seo?.description,
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [page, products, categories, addIns, services, testimonials, settings] =
    await Promise.all([
      getPageByKey('home'),
      getPublishedProducts({ limit: 12 }),
      getPublishedCategories(),
      getPublishedAddIns(),
      getPublishedServices(),
      getPublishedTestimonials(4),
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
      addIns={addIns}
      services={services}
      testimonials={testimonials}
      settings={settings}
    />
  );
}
