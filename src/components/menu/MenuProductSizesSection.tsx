'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import {
  MENU_CUP_SIZE_OPTIONS,
  MENU_PRODUCT_SIZE_OPTIONS,
  menuCupSizeOption,
  menuProductSizeOption,
} from '@/lib/menu-product-sizes';
import type { Locale } from '@/types';

interface MenuProductSizesSectionProps {
  locale: Locale;
}

export function MenuProductSizesSection({ locale }: MenuProductSizesSectionProps) {
  const [productSlug, setProductSlug] = useState('');
  const [cupSizeSlug, setCupSizeSlug] = useState('');

  const selectedProduct = productSlug ? menuProductSizeOption(productSlug) : undefined;
  const selectedCupSize = cupSizeSlug ? menuCupSizeOption(cupSizeSlug) : undefined;

  const productOptions = [
    {
      value: '',
      label: locale === 'es' ? 'Seleccionar producto…' : 'Select a product…',
    },
    ...MENU_PRODUCT_SIZE_OPTIONS.map((option) => ({
      value: option.slug,
      label: option.name,
    })),
  ];

  const cupSizeOptions = [
    {
      value: '',
      label: locale === 'es' ? 'Seleccionar tamaño…' : 'Select a size…',
    },
    ...MENU_CUP_SIZE_OPTIONS.map((option) => ({
      value: option.slug,
      label: option.name,
    })),
  ];

  return (
    <section className="mt-16 border-t border-grey/15 pt-12">
      <h2 className="font-display text-3xl md:text-4xl">
        {locale === 'es' ? 'Tamaños y productos' : 'Sizes & Products'}
      </h2>
      <p className="mt-3 max-w-2xl text-grey">
        {locale === 'es'
          ? 'Elige un producto y un tamaño de vaso para ver tu selección.'
          : 'Choose a product and cup size to see your selection.'}
      </p>

      <div className="mt-8 grid gap-6 rounded-2xl border border-grey/15 bg-cream p-6 sm:grid-cols-2">
        <Select
          label={locale === 'es' ? 'Producto' : 'Product'}
          name="menu-product"
          value={productSlug}
          onChange={(event) => setProductSlug(event.target.value)}
          options={productOptions}
        />
        <Select
          label={locale === 'es' ? 'Tamaño' : 'Size'}
          name="menu-cup-size"
          value={cupSizeSlug}
          onChange={(event) => setCupSizeSlug(event.target.value)}
          options={cupSizeOptions}
        />
      </div>

      {selectedProduct && selectedCupSize ? (
        <div className="mt-6 rounded-2xl border border-lime/40 bg-lime/10 p-6">
          <p className="font-display text-2xl text-carbon">
            {selectedProduct.name} · {selectedCupSize.name}
          </p>
          <p className="mt-2 text-sm text-grey">
            {locale === 'es'
              ? 'Visita la categoría del menú para ordenar este producto.'
              : 'Visit the menu category below to order this product.'}
          </p>
          <Link href={selectedProduct.menuHref} className="mt-4 inline-block">
            <Button variant="outline">
              {locale === 'es' ? `Ver ${selectedProduct.name}` : `View ${selectedProduct.name}`}
            </Button>
          </Link>
        </div>
      ) : null}
    </section>
  );
}
