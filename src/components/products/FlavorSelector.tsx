'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { getLocalized, sanitizeHtml } from '@/lib/utils';
import { resolveFlavorImage } from '@/lib/site-images';
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
          className="w-full rounded-xl border border-grey/30 bg-white py-3 pl-10 pr-4 text-carbon"
        />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((flavor) => {
          const id = String(flavor._id);
          const isSelected = selected.includes(id);
          const name = getLocalized(flavor.name, locale);
          const isNew = name.toLowerCase().includes('new');
          const image = resolveFlavorImage(flavor, name);

          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              disabled={!isSelected && selected.length >= limit}
              className={`rounded-2xl border p-4 text-left transition disabled:opacity-40 ${
                isSelected
                  ? 'border-pink bg-pink/10 shadow-sm'
                  : 'border-grey/15 bg-white hover:border-lime hover:bg-cream/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream"
                  style={{ boxShadow: `inset 0 0 0 3px ${flavor.color}` }}
                >
                  {image.url ? (
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-xs font-bold text-carbon/40"
                      aria-hidden
                    >
                      Photo soon
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg leading-tight text-carbon">{name.replace(/\s*—\s*NEW!$/i, '')}</span>
                    {isNew && (
                      <span className="rounded-full bg-pink px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        New
                      </span>
                    )}
                  </div>
                  <div
                    className="prose-brand mt-2 max-w-none text-xs text-grey [&_li]:my-0.5 [&_ul]:my-1 [&_ul]:pl-4"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(getLocalized(flavor.description, locale)),
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
