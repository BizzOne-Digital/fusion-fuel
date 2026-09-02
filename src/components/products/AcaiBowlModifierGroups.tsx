'use client';

import { ModifierChipGroup } from '@/components/products/ModifierChipGroup';
import type { Locale } from '@/types';

interface AcaiBowlModifierGroupsProps {
  locale: Locale;
  includedFruitMax: number;
  includedToppingMax: number;
  fixedIncludes: string[];
  includedFruits: string[];
  includedToppings: string[];
  extraFruits: string[];
  extraToppings: string[];
  includedFruitOptions: readonly string[];
  includedToppingOptions: readonly string[];
  extraFruitOptions: readonly string[];
  extraToppingOptions: readonly string[];
  extraFruitPriceCents: number;
  extraToppingPriceCents: number;
  onIncludedFruitsChange: (next: string[]) => void;
  onIncludedToppingsChange: (next: string[]) => void;
  onExtraFruitsChange: (next: string[]) => void;
  onExtraToppingsChange: (next: string[]) => void;
}

export function AcaiBowlModifierGroups({
  locale,
  includedFruitMax,
  includedToppingMax,
  fixedIncludes,
  includedFruits,
  includedToppings,
  extraFruits,
  extraToppings,
  includedFruitOptions,
  includedToppingOptions,
  extraFruitOptions,
  extraToppingOptions,
  extraFruitPriceCents,
  extraToppingPriceCents,
  onIncludedFruitsChange,
  onIncludedToppingsChange,
  onExtraFruitsChange,
  onExtraToppingsChange,
}: AcaiBowlModifierGroupsProps) {
  return (
    <div className="space-y-8">
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
            ? `Selecciona hasta ${includedFruitMax}`
            : `Select up to ${includedFruitMax}`
        }
        options={includedFruitOptions}
        selected={includedFruits}
        max={includedFruitMax}
        locale={locale}
        onChange={onIncludedFruitsChange}
      />

      {includedToppingMax > 0 ? (
        <ModifierChipGroup
          title={locale === 'es' ? 'Elige tus toppings' : 'Choose Your Toppings'}
          subtitle={
            locale === 'es'
              ? `Selecciona hasta ${includedToppingMax}`
              : `Select up to ${includedToppingMax}`
          }
          options={includedToppingOptions}
          selected={includedToppings}
          max={includedToppingMax}
          locale={locale}
          onChange={onIncludedToppingsChange}
        />
      ) : null}

      <ModifierChipGroup
        title={locale === 'es' ? 'Frutas extra' : 'Extra Fruits'}
        subtitle={locale === 'es' ? 'Opcional' : 'Optional'}
        options={extraFruitOptions}
        selected={extraFruits}
        priceCents={extraFruitPriceCents}
        locale={locale}
        onChange={onExtraFruitsChange}
      />

      <ModifierChipGroup
        title={locale === 'es' ? 'Toppings extra' : 'Extra Toppings'}
        subtitle={locale === 'es' ? 'Opcional' : 'Optional'}
        options={extraToppingOptions}
        selected={extraToppings}
        priceCents={extraToppingPriceCents}
        locale={locale}
        onChange={onExtraToppingsChange}
      />
    </div>
  );
}
