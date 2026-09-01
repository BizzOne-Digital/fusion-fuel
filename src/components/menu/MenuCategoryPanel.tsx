import Image from 'next/image';
import { getLocalized } from '@/lib/utils';
import { ProductGrid } from '@/components/products/ProductGrid';
import { FlavorCollectionsExplorer } from '@/components/products/FlavorCollectionsExplorer';
import { PROTEIN_COFFEE, proteinCoffeeFlavorList, proteinCoffeePricingSummary } from '@/lib/protein-coffee-menu';
import { LOADED_TEAS_MENU, loadedTeaPricingSummary } from '@/lib/loaded-teas-menu';
import {
  MEGA_TEA_KITS_MENU,
  megaTeaKitIncludesSummary,
  megaTeaKitPricingSummary,
} from '@/lib/mega-tea-kits-menu';
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

function CategoryIntro({ category, locale }: { category: IProductCategory; locale: Locale }) {
  if (category.slug === 'protein-coffee') {
    const { icedAddOn } = PROTEIN_COFFEE;
    return (
      <div className="mb-6 max-w-3xl space-y-3 text-grey">
        <p>{PROTEIN_COFFEE.servingNote}</p>
        <p className="text-sm">{proteinCoffeePricingSummary()}</p>
        <p>
          <span className="font-semibold text-carbon">Flavors: </span>
          {proteinCoffeeFlavorList()}
        </p>
        <p className="text-sm">
          <span className="font-semibold text-carbon">Add-on: </span>
          {icedAddOn.name} — ${icedAddOn.price.toFixed(2)} ({icedAddOn.note})
        </p>
      </div>
    );
  }
  if (category.slug === 'mega-teas') {
    return (
      <div className="mb-6 max-w-2xl space-y-2 text-grey">
        <p>{LOADED_TEAS_MENU.headline}</p>
        <p className="text-sm">{loadedTeaPricingSummary()}</p>
      </div>
    );
  }
  if (category.slug === 'mega-tea-kits') {
    return (
      <div className="mb-6 max-w-2xl space-y-2 text-grey">
        <p className="font-semibold text-carbon">{MEGA_TEA_KITS_MENU.headline}</p>
        <p className="text-sm">
          {megaTeaKitPricingSummary()} · Includes {megaTeaKitIncludesSummary()}
        </p>
        <p className="text-sm">
          {locale === 'es'
            ? 'Explora nuestras 5 colecciones de sabores — nombre e ingredientes de cada té.'
            : 'Browse our 5 flavor collections — each tea listed with its ingredients.'}
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
          <span className="font-semibold text-carbon">Dubai Açaí Bowl: </span>
          pick 2 fruits — includes pistachio sauce &amp; Nutella, then pick 1 more topping.
        </p>
        <p>
          <span className="font-semibold text-carbon">Regular &amp; Tropical Açaí Bowls: </span>
          pick 3 fruits and 2 toppings.
        </p>
        <p>
          <span className="font-semibold text-carbon">Fruits: </span>
          {ACAI_BOWLS_MENU.fruits.join(', ')}.
        </p>
        <p>
          <span className="font-semibold text-carbon">Toppings: </span>
          {ACAI_BOWLS_MENU.toppings.join(', ')}. Additional toppings $
          {ACAI_BOWLS_MENU.additionalToppingPrice.toFixed(2)} each.
        </p>
        <p className="text-sm italic">{ACAI_BOWLS_MENU.footnote}</p>
      </div>
    );
  }
  if (category.slug === 'waffles') {
    return (
      <div className="mb-6 max-w-3xl space-y-3 text-grey">
        <p className="font-semibold text-carbon">{WAFFLES_MENU.headline}</p>
        <p className="text-sm">{wafflePricingSummary()}</p>
        <p>
          <span className="font-semibold text-carbon">Create your own — up to {WAFFLES_MENU.buildYourOwnMax} toppings</span>
        </p>
        {WAFFLES_MENU.toppingGroups.map((group) => (
          <p key={group.label}>
            <span className="font-semibold text-carbon">{group.label}: </span>
            {group.items.join(', ')}
          </p>
        ))}
        <p className="text-sm">
          Additional toppings ${WAFFLES_MENU.additionalToppingPrice.toFixed(2)} each.
        </p>
      </div>
    );
  }
  if (category.slug === 'protein-treats') {
    const { pieInACup, proteinTruffles, addOnPricing, standardAddOns, wellnessAddOns } = PROTEIN_TREATS_MENU;
    const pieSizes = pieInACup.sizes
      .map((size) => `${size.name} $${size.price.toFixed(2)}`)
      .join(' · ');

    return (
      <div className="mb-6 max-w-3xl space-y-3 text-grey">
        <p className="font-semibold text-carbon">{PROTEIN_TREATS_MENU.headline}</p>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>
            <span className="font-semibold text-carbon">{pieInACup.name}</span> — {pieSizes} · Flavors:{' '}
            {pieInACup.flavors.join(', ')}
          </li>
          <li>
            <span className="font-semibold text-carbon">{proteinTruffles.name}</span> —{' '}
            {proteinTruffles.pack.count} for ${proteinTruffles.pack.price.toFixed(2)}
          </li>
        </ul>
        <p className="text-sm">
          Add-ons ${addOnPricing.standard.toFixed(2)} each — flavor add-ons
          {standardAddOns.length > 0 ? `, ${standardAddOns.join(', ')}` : ''} · {wellnessAddOns.join(' & ')} $
          {addOnPricing.wellness.toFixed(2)} each
        </p>
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
  return slug === 'mega-tea-kits' || slug === 'donut-of-the-day';
}

function MegaTeaKitsExplorer({
  flavors,
  locale,
  kitProductId,
  kitHref,
  compact,
}: {
  flavors: IFlavor[];
  locale: Locale;
  kitProductId?: string;
  kitHref: string;
  compact?: boolean;
}) {
  return (
    <FlavorCollectionsExplorer
      flavors={flavors}
      locale={locale}
      kitProductId={kitProductId}
      kitHref={kitHref}
      title={compact ? undefined : locale === 'es' ? 'Colecciones Mega Tea' : 'Mega Tea Collections'}
      subtitle={
        compact
          ? undefined
          : locale === 'es'
            ? '100+ combinaciones — elige tus sabores favoritos.'
            : '100+ combinations — pick your favorite flavors.'
      }
      showCollectionNav={!compact}
      textOnly
    />
  );
}

export function MenuCategoryPanel({
  category,
  categories,
  products,
  flavors,
  locale,
  kitProductId,
  kitHref,
}: MenuCategoryPanelProps) {
  if (category) {
    const categoryProducts = productsForCategory(products, categories, category.slug);

    return (
      <div>
        <h2 className="font-display text-3xl md:text-4xl">{getLocalized(category.name, locale)}</h2>
        <CategoryIntro category={category} locale={locale} />
        {category.slug === 'mega-tea-kits' ? (
          <MegaTeaKitsExplorer
            flavors={flavors}
            locale={locale}
            kitProductId={kitProductId}
            kitHref={kitHref}
          />
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
        const isSpotlight = isMenuSpotlightCategory(cat.slug);

        if (!isSpotlight && categoryProducts.length === 0) return null;

        return (
          <section key={cat.slug} id={cat.slug} className="scroll-mt-24">
            <h2 className="font-display text-3xl">{getLocalized(cat.name, locale)}</h2>
            <CategoryIntro category={cat} locale={locale} />
            {isKits ? (
              <MegaTeaKitsExplorer
                flavors={flavors}
                locale={locale}
                kitProductId={kitProductId}
                kitHref={kitHref}
                compact
              />
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
