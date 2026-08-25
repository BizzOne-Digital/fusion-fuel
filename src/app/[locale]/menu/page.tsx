import { setRequestLocale } from 'next-intl/server';
import {
  getPublishedCategories,
  getPublishedFlavors,
  getPublishedProducts,
  getKitProducts,
} from '@/lib/data';
import { MenuCategorySidebar } from '@/components/products/MenuCategorySidebar';
import { MenuCategoryPanel } from '@/components/menu/MenuCategoryPanel';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { Locale } from '@/types';

export default async function MenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const [flavors, categories, products, kitProducts] = await Promise.all([
    getPublishedFlavors(250),
    getPublishedCategories(),
    getPublishedProducts(),
    getKitProducts(),
  ]);

  const kitProduct =
    kitProducts.find((product) => product.slug === 'mega-tea-kit-builder') ?? kitProducts[0];
  const kitHref = kitProduct ? `/products/${kitProduct.slug}` : '/products/mega-tea-kit-builder';
  const kitProductId = kitProduct ? String(kitProduct._id) : undefined;

  const activeCategory = category
    ? categories.find((cat) => cat.slug === category)
    : undefined;

  const title = typedLocale === 'es' ? 'Menú' : 'Menu';

  return (
    <div className="min-w-0 w-full max-w-full overflow-x-hidden">
      <div className="page-shell mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: title }]} />
        <h1 className="font-display text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-grey">
          {typedLocale === 'es'
            ? 'Filtra por categoría o explora el menú completo.'
            : 'Filter by category or browse the full menu.'}
        </p>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="w-full shrink-0 lg:w-56 xl:w-64">
            <MenuCategorySidebar
              categories={categories}
              locale={typedLocale}
              activeSlug={category}
            />
          </div>

          <div className="min-w-0 flex-1">
            <MenuCategoryPanel
              category={activeCategory}
              categories={categories}
              products={products}
              flavors={flavors}
              locale={typedLocale}
              kitProductId={kitProductId}
              kitHref={kitHref}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
