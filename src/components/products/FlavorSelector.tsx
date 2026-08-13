'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { getLocalized } from '@/lib/utils';
import type { IFlavor } from '@/models/Flavor';
import type { Locale } from '@/types';

interface FlavorSelectorProps {
  flavors: IFlavor[];
  locale: Locale;
  limit: number;
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function FlavorSelector({ flavors, locale, limit, selected, onChange }: FlavorSelectorProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return flavors.filter((f) => getLocalized(f.name, locale).toLowerCase().includes(q));
  }, [flavors, locale, query]);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
      return;
    }
    if (selected.length >= limit) return;
    onChange([...selected, id]);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-2xl">{locale === 'es' ? 'Sabores' : 'Flavors'}</h3>
        <span className="text-sm text-grey">
          {selected.length}/{limit} {locale === 'es' ? 'seleccionados' : 'selected'}
        </span>
      </div>
      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey" />
        <input
          type="search"
          placeholder={locale === 'es' ? 'Buscar sabores…' : 'Search flavors…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-grey/30 bg-white py-3 pl-10 pr-4"
        />
      </div>
      <div className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-grey/15 bg-white p-2">
        <div className="flex flex-wrap gap-2">
          {filtered.map((flavor) => {
            const id = String(flavor._id);
            const isSelected = selected.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                disabled={!isSelected && selected.length >= limit}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isSelected ? 'bg-pink text-white' : 'bg-cream text-carbon hover:bg-lime/30'
                } disabled:opacity-40`}
                style={{ borderLeft: `4px solid ${flavor.color}` }}
              >
                {getLocalized(flavor.name, locale)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
