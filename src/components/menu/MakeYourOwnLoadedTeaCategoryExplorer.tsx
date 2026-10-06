'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/utils';
import {
  MAKE_YOUR_OWN_LOADED_TEA_MENU,
  MYOLT_DRINKS,
  myoltPriceCents,
  myoltProductSlug,
} from '@/lib/make-your-own-loaded-tea-menu';
import type { Locale } from '@/types';

interface MakeYourOwnLoadedTeaCategoryExplorerProps {
  locale: Locale;
}

export function MakeYourOwnLoadedTeaCategoryExplorer({
  locale,
}: MakeYourOwnLoadedTeaCategoryExplorerProps) {
  return (
    <div className="mt-6 space-y-4">
      <p className="max-w-3xl text-grey">{MAKE_YOUR_OWN_LOADED_TEA_MENU.description}</p>

      {MYOLT_DRINKS.map((drink) => (
        <Link
          key={drink.slug}
          href={`/products/${myoltProductSlug(drink.slug)}`}
          className="group block overflow-hidden rounded-2xl border border-grey/15 bg-white transition hover:border-pink/30 hover:shadow-lg"
        >
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
            <div className="relative mx-auto aspect-square w-full max-w-[11rem] shrink-0 overflow-hidden rounded-2xl bg-cream sm:mx-0 sm:w-36 lg:w-40">
              <Image
                src={MAKE_YOUR_OWN_LOADED_TEA_MENU.image.url}
                alt={MAKE_YOUR_OWN_LOADED_TEA_MENU.image.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 80vw, 160px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-display text-xl text-carbon lg:text-2xl">{drink.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-grey">
                {locale === 'es' ? 'Incluye: ' : 'Included: '}
                {drink.includedSummary}
              </p>
              <p className="mt-3 text-sm font-semibold text-pink">
                {formatPrice(myoltPriceCents(drink), 'USD', locale)}
              </p>
              <p className="mt-2 text-xs text-grey">{drink.websiteNotice}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
