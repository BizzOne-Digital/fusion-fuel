'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import {
  PROTEIN_SHAKES_MENU,
  PROTEIN_SHAKE_PRODUCT_SLUG,
  proteinShakePricingSummary,
} from '@/lib/protein-shakes-menu';
import type { Locale } from '@/types';

export function ProteinShakesCategoryExplorer({ locale }: { locale: Locale }) {
  const orderHref = `/products/${PROTEIN_SHAKE_PRODUCT_SLUG}`;

  return (
    <div className="mt-6 space-y-4">
      <p className="max-w-3xl text-grey">{proteinShakePricingSummary()}</p>

      {PROTEIN_SHAKES_MENU.items.map((item) => (
        <Link
          key={item.slug}
          href={orderHref}
          className="group block overflow-hidden rounded-2xl border border-grey/15 bg-white transition hover:border-pink/30 hover:shadow-lg"
        >
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
            <div className="relative mx-auto aspect-square w-full max-w-[11rem] shrink-0 overflow-hidden rounded-2xl bg-cream sm:mx-0 sm:w-36 lg:w-40">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 80vw, 160px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-display text-xl text-carbon lg:text-2xl">{item.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-grey">{proteinShakePricingSummary()}</p>
              <p className="mt-3 text-sm font-semibold text-pink group-hover:underline">
                {locale === 'es' ? 'Ordenar este sabor →' : 'Order this flavor →'}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
