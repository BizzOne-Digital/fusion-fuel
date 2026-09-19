import { getLocalized } from '@/lib/utils';
import { ProductGrid } from '@/components/products/ProductGrid';
import { MegaTeaKitsCategoryExplorer } from '@/components/menu/MegaTeaKitsCategoryExplorer';
import { LoadedTeasCategoryExplorer } from '@/components/menu/LoadedTeasCategoryExplorer';
import { ProteinShakesCategoryExplorer } from '@/components/menu/ProteinShakesCategoryExplorer';
import { BULK_PRODUCTS_MENU } from '@/lib/bulk-products-menu';
import { MONTHLY_TEA_CLUB_MENU } from '@/lib/monthly-tea-club-menu';
import { BulkProductsCategoryExplorer } from '@/components/menu/BulkProductsCategoryExplorer';
import { MonthlyTeaClubCategoryExplorer } from '@/components/menu/MonthlyTeaClubCategoryExplorer';
import { BowlsMenuCategorySection } from '@/components/menu/BowlsMenuCategorySection';
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
  loadedTeaView?: string;
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

function isBowlsCategory(slug: string): slug is 'acai-bowls' | 'protein-bowls' {
  return slug === 'acai-bowls' || slug === 'protein-bowls';
}

function isMenuSpotlightCategory(slug: string): boolean {
  return (
    slug === 'mega-teas' ||
    slug === BULK_PRODUCTS_MENU.slug ||
    slug === MONTHLY_TEA_CLUB_MENU.slug
  );
}

export function MenuCategoryPanel({
  category,
  categories,
  products,
  locale,
  kitCollection,
  loadedTeaView,
}: MenuCategoryPanelProps) {
  if (category) {
    const categoryProducts = productsForCategory(products, categories, category.slug);

    return (
      <div>
        {category.slug !== MONTHLY_TEA_CLUB_MENU.slug && (
          <h2 className="font-display text-3xl md:text-4xl">{getLocalized(category.name, locale)}</h2>
        )}
        {category.slug === MONTHLY_TEA_CLUB_MENU.slug ? (
          <MonthlyTeaClubCategoryExplorer />
        ) : category.slug === 'mega-tea-kits' ? (
          <MegaTeaKitsCategoryExplorer
            products={categoryProducts}
            locale={locale}
            activeCollection={kitCollection}
          />
        ) : category.slug === 'mega-teas' ? (
          <LoadedTeasCategoryExplorer locale={locale} view={loadedTeaView} />
        ) : category.slug === 'protein-shakes' ? (
          <ProteinShakesCategoryExplorer locale={locale} />
        ) : category.slug === BULK_PRODUCTS_MENU.slug ? (
          <BulkProductsCategoryExplorer locale={locale} />
        ) : isBowlsCategory(category.slug) ? (
          <BowlsMenuCategorySection
            categorySlug={category.slug}
            products={categoryProducts}
            locale={locale}
          />
        ) : category.slug === 'protein-coffee' || category.slug === 'waffles' ? (
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
        const isBulkProducts = cat.slug === BULK_PRODUCTS_MENU.slug;
        const isMonthlyTeaClub = cat.slug === MONTHLY_TEA_CLUB_MENU.slug;
        const isSpotlight = isMenuSpotlightCategory(cat.slug);

        if (
          !isSpotlight &&
          !isKits &&
          !isLoadedTeas &&
          !isProteinShakes &&
          !isBulkProducts &&
          !isMonthlyTeaClub &&
          categoryProducts.length === 0
        )
          return null;

        return (
          <section key={cat.slug} id={cat.slug} className="scroll-mt-24">
            {!isMonthlyTeaClub && (
              <h2 className="font-display text-3xl">{getLocalized(cat.name, locale)}</h2>
            )}
            {isMonthlyTeaClub ? (
              <MonthlyTeaClubCategoryExplorer />
            ) : isKits ? (
              <MegaTeaKitsCategoryExplorer
                products={categoryProducts}
                locale={locale}
                activeCollection={kitCollection}
              />
            ) : cat.slug === 'mega-teas' ? (
              <LoadedTeasCategoryExplorer locale={locale} view={loadedTeaView} />
            ) : cat.slug === 'protein-shakes' ? (
              <ProteinShakesCategoryExplorer locale={locale} />
            ) : isBulkProducts ? (
              <BulkProductsCategoryExplorer locale={locale} />
            ) : isBowlsCategory(cat.slug) ? (
              <BowlsMenuCategorySection
                categorySlug={cat.slug}
                products={categoryProducts}
                locale={locale}
              />
            ) : cat.slug === 'protein-coffee' || cat.slug === 'waffles' ? (
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
