import { setRequestLocale } from 'next-intl/server';
import { getPageByKey, getPublishedProducts } from '@/lib/data';
import { generatePageMetadata } from '@/lib/seo';
import { PricingPageSections } from '@/components/sections/PricingPageSections';
import type { Metadata } from 'next';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata('pricing', locale as Locale, '/pricing');
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [page, products] = await Promise.all([getPageByKey('pricing'), getPublishedProducts()]);

  return (
    <div className="min-w-0 overflow-x-hidden">
      <PricingPageSections locale={locale as Locale} page={page} products={products} />
    </div>
  );
}
