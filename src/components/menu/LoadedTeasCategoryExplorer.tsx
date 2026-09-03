'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { LOADED_TEAS_MENU, LOADED_TEA_PRODUCT_SLUG } from '@/lib/loaded-teas-menu';
import type { Locale } from '@/types';

export function LoadedTeasCategoryExplorer({ locale }: { locale: Locale }) {
  const hero = LOADED_TEAS_MENU.heroImage;

  return (
    <Link
      href={`/products/${LOADED_TEA_PRODUCT_SLUG}`}
      className="group block overflow-hidden rounded-2xl border border-grey/15 bg-white transition hover:border-pink/30 hover:shadow-lg"
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
        <div className="relative mx-auto aspect-square w-full max-w-[11rem] shrink-0 overflow-hidden rounded-2xl bg-cream sm:mx-0 sm:w-36 lg:w-40">
          <Image
            src={hero.url}
            alt={hero.alt}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 80vw, 160px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl text-carbon lg:text-2xl">{LOADED_TEAS_MENU.headline}</h3>
          <p className="mt-3 text-sm font-semibold text-pink group-hover:underline">
            {locale === 'es' ? 'Ver sabores para ordenar →' : 'See flavors to order →'}
          </p>
        </div>
      </div>
    </Link>
  );
}
