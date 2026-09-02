'use client';

import { cn } from '@/lib/utils';
import { ModifierChipGroup } from '@/components/products/ModifierChipGroup';
import type { Locale } from '@/types';

interface ToppingGroup {
  label: string;
  items: readonly string[];
}

interface WaffleModifierGroupsProps {
  locale: Locale;
  toppingGroups: readonly ToppingGroup[];
  allToppings: readonly string[];
  includedToppings: string[];
  extraToppings: string[];
  includedMax: number;
  extraPriceCents: number;
  onIncludedChange: (next: string[]) => void;
  onExtraChange: (next: string[]) => void;
}

export function WaffleModifierGroups({
  locale,
  toppingGroups,
  allToppings,
  includedToppings,
  extraToppings,
  includedMax,
  extraPriceCents,
  onIncludedChange,
  onExtraChange,
}: WaffleModifierGroupsProps) {
  const atMax = includedToppings.length >= includedMax;

  const toggleIncluded = (option: string) => {
    if (includedToppings.includes(option)) {
      onIncludedChange(includedToppings.filter((entry) => entry !== option));
      return;
    }
    if (atMax) return;
    onIncludedChange([...includedToppings, option]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display text-2xl">
          {locale === 'es'
            ? 'Personaliza tu waffle'
            : 'Customize Your Waffle — Choose up to 5 toppings included'}
        </h3>
        <p className="mt-1 text-sm text-grey">
          {locale === 'es'
            ? `Selecciona hasta ${includedMax} toppings en total`
            : `Select up to ${includedMax} toppings total`}
        </p>
        <p className="mt-2 text-xs text-grey">
          {includedToppings.length} / {includedMax} selected
        </p>

        <div className="mt-5 space-y-5">
          {toppingGroups.map((group) => (
            <div key={group.label}>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-carbon">
                {group.label}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((option) => {
                  const isSelected = includedToppings.includes(option);
                  const disabled = !isSelected && atMax;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleIncluded(option)}
                      disabled={disabled}
                      aria-pressed={isSelected}
                      className={cn(
                        'rounded-full border px-4 py-2 text-sm font-medium transition',
                        isSelected
                          ? 'border-lime bg-lime/20 text-carbon'
                          : 'border-grey/25 bg-white text-carbon hover:border-pink/40',
                        disabled && 'cursor-not-allowed opacity-45'
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModifierChipGroup
        title={locale === 'es' ? 'Toppings extra' : 'Extra Toppings'}
        subtitle={locale === 'es' ? 'Opcional' : 'Optional — same choices, $1 each'}
        options={allToppings}
        selected={extraToppings}
        priceCents={extraPriceCents}
        locale={locale}
        onChange={onExtraChange}
      />
    </div>
  );
}
