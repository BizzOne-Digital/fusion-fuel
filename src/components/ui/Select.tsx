import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const selectId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-carbon">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full rounded-xl border border-grey/30 bg-white px-4 py-3 text-carbon focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/30',
          error && 'border-coral',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-coral">{error}</p>}
    </div>
  );
}
