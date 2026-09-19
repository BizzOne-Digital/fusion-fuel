import { ProductGrid } from '@/components/products/ProductGrid';
import {
  ACAI_BOWLS_MENU,
  acaiBowlsPricingSummary,
  proteinBowlsPricingSummary,
} from '@/lib/acai-bowls-menu';
import type { IProduct } from '@/models/Product';
import type { Locale } from '@/types';

type BowlsCategorySlug = 'acai-bowls' | 'protein-bowls';

interface BowlsMenuCategorySectionProps {
  categorySlug: BowlsCategorySlug;
  products: IProduct[];
  locale: Locale;
}

function AcaiBowlsIntro() {
  const fruits = ACAI_BOWLS_MENU.includedFruits.join(', ');
  const toppings = ACAI_BOWLS_MENU.includedToppings.join(', ');

  return (
    <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-grey">
      <p>{acaiBowlsPricingSummary()}</p>
      <p>
        <strong className="text-carbon">Dubai Açaí Bowl</strong> — pick 2 fruits — includes
        pistachio sauce & Nutella, then pick 1 more topping.
      </p>
      <p>
        <strong className="text-carbon">Regular & Tropical Açaí Bowls</strong> — pick 3 fruits and
        2 toppings.
      </p>
      <p>
        <strong className="text-carbon">Fruits:</strong> {fruits}
      </p>
      <p>
        <strong className="text-carbon">Toppings:</strong> {toppings}
      </p>
      <p className="italic">{ACAI_BOWLS_MENU.footnote}</p>
    </div>
  );
}

function ProteinBowlsIntro() {
  const fruits = ACAI_BOWLS_MENU.includedFruits.join(', ');
  const toppings = ACAI_BOWLS_MENU.includedToppings.join(', ');

  return (
    <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-grey">
      <p>{proteinBowlsPricingSummary()}</p>
      <p>
        <strong className="text-carbon">Fruits:</strong> {fruits}
      </p>
      <p>
        <strong className="text-carbon">Toppings:</strong> {toppings}
      </p>
      <p className="italic">{ACAI_BOWLS_MENU.footnote}</p>
    </div>
  );
}

export function BowlsMenuCategorySection({
  categorySlug,
  products,
  locale,
}: BowlsMenuCategorySectionProps) {
  return (
    <div className="mt-6 space-y-8">
      {categorySlug === 'acai-bowls' ? <AcaiBowlsIntro /> : <ProteinBowlsIntro />}
      <ProductGrid products={products} locale={locale} categorySlug={categorySlug} />
    </div>
  );
}
