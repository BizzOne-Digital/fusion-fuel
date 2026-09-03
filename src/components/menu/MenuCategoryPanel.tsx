import Image from 'next/image';
import { getLocalized } from '@/lib/utils';
import { ProductGrid } from '@/components/products/ProductGrid';
import { MegaTeaKitsCategoryExplorer } from '@/components/menu/MegaTeaKitsCategoryExplorer';
import { LoadedTeasCategoryExplorer } from '@/components/menu/LoadedTeasCategoryExplorer';
import { ProteinShakesCategoryExplorer } from '@/components/menu/ProteinShakesCategoryExplorer';
import { PROTEIN_COFFEE, proteinCoffeeFlavorList, proteinCoffeeOptionalAddOnsSummary, proteinCoffeePricingSummary } from '@/lib/protein-coffee-menu';
import { ACAI_BOWLS_MENU, acaiBowlPricingSummary } from '@/lib/acai-bowls-menu';
import { WAFFLES_MENU, wafflePricingSummary } from '@/lib/waffles-menu';
import { PROTEIN_TREATS_MENU } from '@/lib/protein-treats-menu';
import { DONUT_OF_THE_DAY_MENU, donutOfTheDayPricingSummary } from '@/lib/donut-of-the-day-menu';
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

function categoryUsesExplorer(slug: string): boolean {
  return slug === 'mega-teas' || slug === 'protein-shakes' || slug === 'mega-tea-kits';
}

function CategoryIntro({ category, locale }: { category: IProductCategory; locale: Locale }) {
  if (categoryUsesExplorer(category.slug)) {
    return null;
  }
  if (category.slug === 'protein-coffee') {
    return (
      <div className="mb-6 max-w-3xl space-y-3 text-grey">
        <p>{PROTEIN_COFFEE.servingNote}</p>
        <p className="text-sm">{proteinCoffeePricingSummary()}</p>
        <p>
          <span className="font-semibold text-carbon">Flavors: </span>
          {proteinCoffeeFlavorList()}
        </p>
        <p>
          <span className="font-semibold text-carbon">Optional add-ons: </span>
          {proteinCoffeeOptionalAddOnsSummary()}
        </p>
      </div>
    );
  }
  if (category.slug === 'acai-bowls') {
    return (
      <div className="mb-6 max-w-3xl space-y-3 text-grey">
        <p className="font-semibold text-carbon">{ACAI_BOWLS_MENU.headline}</p>
        <p className="text-sm">{acaiBowlPricingSummary()}</p>
        <p>
          <span className="font-semibold text-carbon">Regular &amp; Tropical Açaí Bowls: </span>
          choose up to 3 fruits and 2 toppings (included).
        </p>
        <p>
          <span className="font-semibold text-carbon">Dubai Açaí Bowl: </span>
          pick 2 fruits — includes pistachio sauce &amp; Nutella, then pick 1 more topping.
        </p>
        <p>
          <span className="font-semibold text-carbon">Included fruits: </span>
          {ACAI_BOWLS_MENU.includedFruits.join(', ')}.
        </p>
        <p>
          <span className="font-semibold text-carbon">Included toppings: </span>
          {ACAI_BOWLS_MENU.includedToppings.join(', ')}.
        </p>
        <p>
          <span className="font-semibold text-carbon">Extra fruits &amp; toppings: </span>
          ${ACAI_BOWLS_MENU.extraFruitPrice.toFixed(2)} each.
        </p>
        <p className="text-sm italic">{ACAI_BOWLS_MENU.footnote}</p>
      </div>
    );
  }
  if (category.slug === 'waffles') {
    return (
      <div className="mb-6 max-w-3xl space-y-3 text-grey">
        <p className="font-semibold text-carbon">{WAFFLES_MENU.headline}</p>
        <p>{WAFFLES_MENU.websiteDescription}</p>
        <p className="text-sm">{wafflePricingSummary()}</p>
        <p>
          <span className="font-semibold text-carbon">Customize Your Waffle: </span>
          choose up to {WAFFLES_MENU.includedToppingMax} toppings included from fruits, spreads, nuts, and sweet extras.
        </p>
        {WAFFLES_MENU.toppingGroups.map((group) => (
          <p key={group.label}>
            <span className="font-semibold text-carbon">{group.label}: </span>
            {group.items.join(', ')}.
          </p>
        ))}
        <p>
          <span className="font-semibold text-carbon">Extra toppings: </span>
          ${WAFFLES_MENU.extraToppingPrice.toFixed(2)} each (optional).
        </p>
      </div>
    );
  }
  if (category.slug === 'protein-treats') {
    const { proteinTruffles, proteinMiniDonuts } = PROTEIN_TREATS_MENU;

    return (
      <div className="mb-6 max-w-3xl space-y-3 text-grey">
        <p className="font-semibold text-carbon">{PROTEIN_TREATS_MENU.headline}</p>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>
            <span className="font-semibold text-carbon">{proteinTruffles.name}</span> —{' '}
            {proteinTruffles.pack.count} for ${proteinTruffles.pack.price.toFixed(2)}
          </li>
          <li>
            <span className="font-semibold text-carbon">{proteinMiniDonuts.name}</span> —{' '}
            {proteinMiniDonuts.pack.count} for ${proteinMiniDonuts.pack.price.toFixed(2)}
          </li>
        </ul>
      </div>
    );
  }
  if (category.slug === 'donut-of-the-day') {
    return (
      <div className="mb-6 max-w-3xl space-y-3 text-grey">
        <p className="font-semibold text-carbon">{DONUT_OF_THE_DAY_MENU.headline}</p>
        <p className="text-sm font-semibold text-carbon">{donutOfTheDayPricingSummary()}</p>
        <p>{DONUT_OF_THE_DAY_MENU.description}</p>
        <p className="text-sm italic">{DONUT_OF_THE_DAY_MENU.footnote}</p>
      </div>
    );
  }
  return null;
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
        <CategoryIntro category={category} locale={locale} />
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
        ) : category.slug === 'protein-coffee' ? (
          <ProductGrid products={categoryProducts} locale={locale} categorySlug={category.slug} />
        ) : category.slug === 'waffles' ? (
          <ProductGrid products={categoryProducts} locale={locale} categorySlug={category.slug} />
        ) : (
          <ProductGrid products={categoryProducts} locale={locale} categorySlug={category.slug} />
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
            <CategoryIntro category={cat} locale={locale} />
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
            ) : cat.slug === 'protein-coffee' ? (
              <ProductGrid products={categoryProducts} locale={locale} categorySlug={cat.slug} />
            ) : cat.slug === 'waffles' ? (
              <ProductGrid products={categoryProducts} locale={locale} categorySlug={cat.slug} />
            ) : (
              <ProductGrid products={categoryProducts} locale={locale} categorySlug={cat.slug} />
            )}
          </section>
        );
      })}
    </div>
  );
}
