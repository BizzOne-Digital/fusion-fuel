import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import {
  getPublishedCategories,
  getPublishedFlavors,
  getPublishedProducts,
} from '@/lib/data';
import { generatePageMetadata } from '@/lib/seo';
import { MenuCategorySidebar } from '@/components/products/MenuCategorySidebar';
import { MenuCategoryPanel } from '@/components/menu/MenuCategoryPanel';
import { MenuPageIntro } from '@/components/sections/MenuPageIntro';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { LOADED_TEAS_MENU_VIEWS, loadedTeasMenuHref } from '@/lib/make-your-own-loaded-tea-menu';
import type { Metadata } from 'next';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata('menu', locale as Locale, '/menu');
}

export default async function MenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; kitCollection?: string; view?: string }>;
}) {
  const { locale } = await params;
  const { category, kitCollection, view } = await searchParams;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  if (category === 'make-your-own-loaded-tea') {
    redirect(loadedTeasMenuHref(LOADED_TEAS_MENU_VIEWS.makeYourOwn));
  }

  const [flavors, categories, products] = await Promise.all([
    getPublishedFlavors(250),
    getPublishedCategories(),
    getPublishedProducts(),
  ]);

  const kitHref = '/menu?category=mega-tea-kits';
  const activeCategory = category ? categories.find((cat) => cat.slug === category) : undefined;

  if (category && !activeCategory) {
    redirect(`/${locale}/menu`);
  }

  return (
    <div className="min-w-0 w-full max-w-full overflow-x-hidden">
      <MenuPageIntro locale={typedLocale} />

      <SectionReveal>
        <div className="page-shell mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
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
                kitHref={kitHref}
                kitCollection={kitCollection}
                loadedTeaView={view}
              />
            </div>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
