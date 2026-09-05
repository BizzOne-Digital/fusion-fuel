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

      <div className="space-y-6 border-t border-grey/15 pt-8">
        <div>
          <h3 className="font-display text-2xl text-carbon">
            {locale === 'es' ? 'Complementos de pago' : 'Paid add-ons'}
          </h3>
          <p className="mt-1 text-sm text-grey">
            {locale === 'es'
              ? '¿Quieres más de lo incluido? Agrégalo aquí. Cada selección cuesta $1.'
              : 'Want more than your included amount? Add it here. Each selection is $1.'}
          </p>
        </div>

        <ModifierChipGroup
          title={locale === 'es' ? 'Frutas extra' : 'Extra Fruits'}
          subtitle={
            locale === 'es'
              ? 'Mismas frutas que arriba, $1 cada una'
              : 'Same fruits as above, $1 each'
          }
          options={extraFruitOptions}
          selected={extraFruits}
          priceCents={extraFruitPriceCents}
          locale={locale}
          onChange={onExtraFruitsChange}
        />

        <ModifierChipGroup
          title={locale === 'es' ? 'Toppings extra' : 'Extra Toppings'}
          subtitle={
            locale === 'es'
              ? 'Cada topping adicional cuesta $1'
              : 'Each additional topping is $1'
          }
          options={extraToppingOptions}
          selected={extraToppings}
          priceCents={extraToppingPriceCents}
          locale={locale}
          onChange={onExtraToppingsChange}
        />
      </div>
    </div>
  );
}
