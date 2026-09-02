'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Select } from '@/components/ui/Select';
import {
  LOADED_TEAS_MENU,
  LOADED_TEA_PRODUCT_SLUG,
  loadedTeaPricingSummary,
} from '@/lib/loaded-teas-menu';
import type { Locale } from '@/types';

function isolateDropdownClicks(event: React.MouseEvent) {
  event.stopPropagation();
}

export function LoadedTeasCategoryExplorer({ locale }: { locale: Locale }) {
  const hero = LOADED_TEAS_MENU.heroImage;
  const flavorCount = LOADED_TEAS_MENU.items.length;

  return (
    <div className="group overflow-hidden rounded-2xl border border-grey/15 bg-white transition hover:border-pink/30 hover:shadow-lg">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-6 lg:gap-8">
        <Link
          href={`/products/${LOADED_TEA_PRODUCT_SLUG}`}
          className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:gap-6 lg:gap-8"
        >
          <div className="relative mx-auto aspect-square w-full max-w-[11rem] shrink-0 overflow-hidden rounded-2xl bg-cream sm:mx-0 sm:w-36 lg:w-40">
            <Image
              src={hero.url}
              alt={hero.alt}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 80vw, 160px"
            />
          </div>

          <div className="min-w-0 shrink-0 sm:w-44 lg:w-52">
            <h3 className="font-display text-xl text-carbon lg:text-2xl">{LOADED_TEAS_MENU.headline}</h3>
            <p className="mt-2 text-sm leading-relaxed text-grey">{LOADED_TEAS_MENU.servingNote}</p>
            <p className="mt-2 text-sm leading-relaxed text-grey">{loadedTeaPricingSummary()}</p>
          </div>
        </Link>

        <div
          className="min-w-0 flex-1 sm:max-w-xs lg:max-w-sm"
          onClick={isolateDropdownClicks}
        >
          <Select
            name="loaded-tea-flavors-preview"
            defaultValue=""
            aria-label={locale === 'es' ? 'Sabores' : 'Flavors'}
            options={[
              {
                value: '',
                label:
                  locale === 'es'
                    ? `${flavorCount} sabores disponibles`
                    : `${flavorCount} flavors available`,
              },
              ...LOADED_TEAS_MENU.items.map((item) => ({
                value: item.slug,
                label: item.name,
              })),
            ]}
          />
        </div>
      </div>
    </div>
  );
}
