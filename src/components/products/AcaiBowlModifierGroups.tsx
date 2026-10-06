'use client';

import { useMemo } from 'react';
import { ModifierChipGroup } from '@/components/products/ModifierChipGroup';
import { ACAI_BOWL_EXTRA_TOPPINGS } from '@/lib/acai-bowls-menu';
import type { Locale } from '@/types';

interface AcaiBowlModifierGroupsProps {
  locale: Locale;
  includedFruitMax: number;
  includedToppingMax: number;
  fixedIncludes: string[];
  includedFruits: string[];
  includedToppings: string[];
  extraToppings: string[];
  includedFruitOptions: readonly string[];
  includedToppingOptions: readonly string[];
  extraToppingOptions: readonly string[];
  onIncludedFruitsChange: (next: string[]) => void;
  onIncludedToppingsChange: (next: string[]) => void;
  onExtraToppingsChange: (next: string[]) => void;
}

export function AcaiBowlModifierGroups({
  locale,
  includedFruitMax,
  includedToppingMax,
  fixedIncludes,
  includedFruits,
  includedToppings,
  extraToppings,
  includedFruitOptions,
  includedToppingOptions,
  extraToppingOptions,
  onIncludedFruitsChange,
  onIncludedToppingsChange,
  onExtraToppingsChange,
}: AcaiBowlModifierGroupsProps) {
  const extraToppingPriceCents = useMemo(() => {
    const prices: Record<string, number> = {};
    for (const topping of ACAI_BOWL_EXTRA_TOPPINGS) {
      prices[topping.name] = Math.round(topping.price * 100);
    }
    return prices;
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="font-display text-2xl text-carbon">
            {locale === 'es' ? 'Opciones incluidas' : 'Included choices'}
          </h3>
          <p className="mt-1 text-sm text-grey">
            {locale === 'es'
              ? `Incluido en el precio: hasta ${includedFruitMax} frutas y ${includedToppingMax} toppings.`
              : `Included in your bowl price: up to ${includedFruitMax} fruits and ${includedToppingMax} toppings.`}
          </p>
        </div>

        {fixedIncludes.length > 0 ? (
          <div className="rounded-xl border border-lime/30 bg-lime/10 px-4 py-3 text-sm text-carbon">
            <span className="font-semibold">Included: </span>
            {fixedIncludes.join(' & ')}
          </div>
        ) : null}

        <ModifierChipGroup
          title={locale === 'es' ? 'Elige tus frutas' : 'Choose Your Fruits'}
          subtitle={
            locale === 'es'
              ? `Selecciona hasta ${includedFruitMax} (incluido)`
              : `Select up to ${includedFruitMax} (included)`
          }
          options={includedFruitOptions}
          selected={includedFruits}
          max={includedFruitMax}
          showSelectionCount
          locale={locale}
          onChange={onIncludedFruitsChange}
        />

        {includedToppingMax > 0 ? (
          <ModifierChipGroup
            title={locale === 'es' ? 'Elige tus toppings' : 'Choose Your Toppings'}
            subtitle={
              locale === 'es'
                ? `Selecciona hasta ${includedToppingMax} (incluido)`
                : `Select up to ${includedToppingMax} (included)`
            }
            options={includedToppingOptions}
            selected={includedToppings}
            max={includedToppingMax}
            showSelectionCount
            locale={locale}
            onChange={onIncludedToppingsChange}
          />
        ) : null}
      </div>

      <div className="border-t border-grey/15 pt-8">
        <ModifierChipGroup
          title={locale === 'es' ? 'Toppings extra' : 'Extra Toppings'}
          subtitle={
            locale === 'es'
              ? 'La mayoría cuesta $1; granola sin gluten y proteína cuestan $3'
              : 'Most toppings are $1; gluten free granola and protein are $3'
          }
          options={extraToppingOptions}
          selected={extraToppings}
          optionPriceCents={extraToppingPriceCents}
          locale={locale}
          onChange={onExtraToppingsChange}
        />
      </div>
    </div>
  );
}
