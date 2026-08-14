import { setRequestLocale } from 'next-intl/server';
import { getPublishedProducts, getPublishedCategories } from '@/lib/data';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CategoryNav } from '@/components/products/CategoryNav';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { Locale } from '@/types';

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);

  const [products, categories] = await Promise.all([
    getPublishedProducts({ categorySlug: category }),
    getPublishedCategories(),
  ]);

  return (
    <div className="page-shell mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />
      <h1 className="font-display text-5xl">Shop</h1>
      <div className="mt-8"><CategoryNav categories={categories} locale={locale as Locale} activeSlug={category} /></div>
      <div className="mt-10"><ProductGrid products={products} locale={locale as Locale} /></div>
    </div>
  );
}
