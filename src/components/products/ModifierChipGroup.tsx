'use client';

import { cn, formatPrice } from '@/lib/utils';
import type { Locale } from '@/types';

export interface ModifierChipGroupProps {
  title: string;
  subtitle?: string;
  options: readonly string[];
  selected: string[];
  max?: number;
  priceCents?: number;
  locale: Locale;
  onChange: (next: string[]) => void;
}

export function ModifierChipGroup({
  title,
  subtitle,
  options,
  selected,
  max,
  priceCents = 0,
  locale,
  onChange,
}: ModifierChipGroupProps) {
  const atMax = max != null && selected.length >= max;

  const toggle = (option: string) => {
    if (max === 1) {
      onChange(selected.includes(option) ? [] : [option]);
      return;
    }
    if (selected.includes(option)) {
      onChange(selected.filter((entry) => entry !== option));
      return;
    }
    if (atMax) return;
    onChange([...selected, option]);
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-2xl">{title}</h3>
        {priceCents > 0 ? (
          <span className="text-sm font-semibold text-pink">
            {formatPrice(priceCents, 'USD', locale)} each
          </span>
        ) : null}
      </div>
      {subtitle ? <p className="mt-1 text-sm text-grey">{subtitle}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const disabled = !isSelected && atMax;

          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
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
      {max != null ? (
        <p className="mt-2 text-xs text-grey">
          {selected.length} / {max} selected
        </p>
      ) : null}
    </div>
  );
}
