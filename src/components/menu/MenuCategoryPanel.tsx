import Image from 'next/image';
import { getLocalized } from '@/lib/utils';
import { ProductGrid } from '@/components/products/ProductGrid';
import { MegaTeaKitsCategoryExplorer } from '@/components/menu/MegaTeaKitsCategoryExplorer';
import { LoadedTeasCategoryExplorer } from '@/components/menu/LoadedTeasCategoryExplorer';
import { ProteinShakesCategoryExplorer } from '@/components/menu/ProteinShakesCategoryExplorer';
import { ACAI_BOWLS_MENU, acaiBowlPricingSummary } from '@/lib/acai-bowls-menu';
import { PROTEIN_COFFEE, proteinCoffeePricingSummary } from '@/lib/protein-coffee-menu';
import { PROTEIN_SHAKES_MENU, proteinShakePricingSummary } from '@/lib/protein-shakes-menu';
import { DONUT_OF_THE_DAY_MENU } from '@/lib/donut-of-the-day-menu';
import type { IFlavor } from '@/models/Flavor';
import type { IProduct } from '@/models/Product';
import type { IProductCategory } from '@/models/ProductCategory';
import type { Locale } from '@/types';

interface MenuCategoryPanelProps {
  category?: IProductCategory;
  categories: IProductCategory[];
  products: IProduct[];
  flavors: IFlavor[];
  locale: Locale;
  kitProductId?: string;
  kitHref: string;
  kitCollection?: string;
}

function productsForCategory(
  allProducts: IProduct[],
  categories: IProductCategory[],
  slug: string
): IProduct[] {
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return [];
  return allProducts.filter((p) => String(p.categoryId) === String(cat._id));
}

function DonutOfTheDaySpotlight({ locale }: { locale: Locale }) {
  return (
    <div className="relative mt-6 aspect-[16/10] max-w-[45.6rem] overflow-hidden rounded-2xl bg-cream shadow-sm">
      <Image
        src={DONUT_OF_THE_DAY_MENU.image}
        alt={
          locale === 'es'
            ? 'Mini donas del día con glaseado y toppings variados'
            : 'Donut of the Day mini donuts with assorted glazes and toppings'
        }
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 730px"
      />
    </div>
  );
}

function isMenuSpotlightCategory(slug: string): boolean {
  return slug === 'donut-of-the-day';
}

function CategoryPricingNote({ slug }: { slug: string }) {
  if (slug === 'acai-bowls') {
    return (
      <div className="mt-2 mb-6 max-w-3xl space-y-1 text-grey">
        <p className="font-semibold text-carbon">{ACAI_BOWLS_MENU.headline}</p>
        <p className="text-sm leading-relaxed">{acaiBowlPricingSummary()}</p>
      </div>
    );
  }

  if (slug === 'protein-coffee') {
    return (
      <div className="mt-2 mb-6 max-w-3xl space-y-1 text-grey">
        <p className="font-semibold text-carbon">{PROTEIN_COFFEE.headline}</p>
        <p>{PROTEIN_COFFEE.servingNote}</p>
        <p className="text-sm leading-relaxed">{proteinCoffeePricingSummary()}</p>
      </div>
    );
  }

  if (slug === 'protein-shakes') {
    return (
      <div className="mt-2 mb-6 max-w-3xl space-y-1 text-grey">
        <p className="font-semibold text-carbon">{PROTEIN_SHAKES_MENU.headline}</p>
        <p>{PROTEIN_SHAKES_MENU.servingNote}</p>
        <p className="text-sm leading-relaxed">{proteinShakePricingSummary()}</p>
      </div>
    );
  }

  return null;
}

export function MenuCategoryPanel({
  category,
  categories,
  products,
  flavors,
  locale,
  kitCollection,
}: MenuCategoryPanelProps) {
  if (category) {
    const categoryProducts = productsForCategory(products, categories, category.slug);

    return (
      <div>
        <h2 className="font-display text-3xl md:text-4xl">{getLocalized(category.name, locale)}</h2>
        <CategoryPricingNote slug={category.slug} />
        {category.slug === 'mega-tea-kits' ? (
          <MegaTeaKitsCategoryExplorer
            products={categoryProducts}
            flavors={flavors}
            locale={locale}
            activeCollection={kitCollection}
          />
        ) : category.slug === 'mega-teas' ? (
          <LoadedTeasCategoryExplorer locale={locale} />
        ) : category.slug === 'protein-shakes' ? (
          <ProteinShakesCategoryExplorer locale={locale} />
        ) : category.slug === 'donut-of-the-day' ? (
          <DonutOfTheDaySpotlight locale={locale} />
        ) : category.slug === 'protein-coffee' || category.slug === 'acai-bowls' || category.slug === 'waffles' ? (
          <ProductGrid products={categoryProducts} locale={locale} categorySlug={category.slug} />
        ) : (
          <div className="mt-6">
            <ProductGrid products={categoryProducts} locale={locale} categorySlug={category.slug} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {categories.map((cat) => {
        const categoryProducts = productsForCategory(products, categories, cat.slug);
        const isKits = cat.slug === 'mega-tea-kits';
        const isLoadedTeas = cat.slug === 'mega-teas';
        const isProteinShakes = cat.slug === 'protein-shakes';
        const isSpotlight = isMenuSpotlightCategory(cat.slug);

        if (!isSpotlight && !isKits && !isLoadedTeas && !isProteinShakes && categoryProducts.length === 0) return null;

        return (
          <section key={cat.slug} id={cat.slug} className="scroll-mt-24">
            <h2 className="font-display text-3xl">{getLocalized(cat.name, locale)}</h2>
            <CategoryPricingNote slug={cat.slug} />
            {isKits ? (
              <MegaTeaKitsCategoryExplorer
                products={categoryProducts}
                flavors={flavors}
                locale={locale}
                activeCollection={kitCollection}
              />
            ) : cat.slug === 'mega-teas' ? (
              <LoadedTeasCategoryExplorer locale={locale} />
            ) : cat.slug === 'protein-shakes' ? (
              <ProteinShakesCategoryExplorer locale={locale} />
            ) : cat.slug === 'donut-of-the-day' ? (
              <DonutOfTheDaySpotlight locale={locale} />
            ) : cat.slug === 'protein-coffee' || cat.slug === 'acai-bowls' || cat.slug === 'waffles' ? (
              <ProductGrid products={categoryProducts} locale={locale} categorySlug={cat.slug} />
            ) : (
              <div className="mt-6">
                <ProductGrid products={categoryProducts} locale={locale} categorySlug={cat.slug} />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
