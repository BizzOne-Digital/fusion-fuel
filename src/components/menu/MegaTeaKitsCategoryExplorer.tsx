'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ProductGrid } from '@/components/products/ProductGrid';
import {
  MEGA_TEA_KIT_COLLECTIONS,
  MEGA_TEA_KITS_MENU,
  MEGA_TEA_KIT_PRODUCT_SLUG,
  MAKE_YOUR_OWN_MEGA_TEA_KIT,
  megaTeaKitCollectionMenuFlavors,
  megaTeaKitPricingSummary,
  megaTeaKitProductSlug,
} from '@/lib/mega-tea-kits-menu';
import type { IProduct } from '@/models/Product';
import type { Locale } from '@/types';

interface MegaTeaKitsCategoryExplorerProps {
  products: IProduct[];
  locale: Locale;
  activeCollection?: string;
}

export function MegaTeaKitsCategoryExplorer({
  products,
  locale,
  activeCollection,
}: MegaTeaKitsCategoryExplorerProps) {
  const collection = MEGA_TEA_KIT_COLLECTIONS.find(
    (entry) => entry.collectionSlug === activeCollection
  );
  const product = collection
    ? products.find((entry) => entry.slug === megaTeaKitProductSlug(collection.collectionSlug))
    : undefined;
  const collectionImage = MEGA_TEA_KITS_MENU.heroImage;

  if (!activeCollection || !collection) {
    return (
      <div className="space-y-4">
        <Link
          href={`/products/${MEGA_TEA_KIT_PRODUCT_SLUG}`}
          className="group block overflow-hidden rounded-2xl border border-lime/40 bg-lime/10 transition hover:border-pink/30 hover:shadow-lg"
        >
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
            <div className="relative mx-auto aspect-square w-full max-w-[11rem] shrink-0 overflow-hidden rounded-2xl bg-cream sm:mx-0 sm:w-36 lg:w-40">
              <Image
                src={MAKE_YOUR_OWN_MEGA_TEA_KIT.image.url}
                alt={MAKE_YOUR_OWN_MEGA_TEA_KIT.image.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 80vw, 160px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-display text-xl text-carbon lg:text-2xl">{MAKE_YOUR_OWN_MEGA_TEA_KIT.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-grey">{MAKE_YOUR_OWN_MEGA_TEA_KIT.description}</p>
              <p className="mt-3 text-sm font-semibold text-pink">{megaTeaKitPricingSummary()}</p>
              <p className="mt-2 text-sm font-semibold text-carbon group-hover:text-pink">
                {locale === 'es' ? 'Arma tu kit →' : 'Build your kit →'}
              </p>
            </div>
          </div>
        </Link>

        {MEGA_TEA_KIT_COLLECTIONS.map((entry) => {
          const flavorCount = megaTeaKitCollectionMenuFlavors(entry.collectionSlug).length;

          return (
            <Link
              key={entry.collectionSlug}
              href={`/menu?category=mega-tea-kits&kitCollection=${entry.collectionSlug}`}
              className="group block overflow-hidden rounded-2xl border border-grey/15 bg-white transition hover:border-pink/30 hover:shadow-lg"
            >
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
                <div className="relative mx-auto aspect-square w-full max-w-[11rem] shrink-0 overflow-hidden rounded-2xl bg-cream sm:mx-0 sm:w-36 lg:w-40">
                  <Image
                    src={collectionImage.url}
                    alt={collectionImage.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 80vw, 160px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl text-carbon lg:text-2xl">{entry.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-grey">{entry.description}</p>
                  <p className="mt-3 text-sm font-semibold text-pink">{megaTeaKitPricingSummary()}</p>
                  <p className="mt-2 text-sm font-semibold text-carbon">
                    {locale === 'es'
                      ? `${flavorCount} sabores disponibles`
                      : `${flavorCount} flavors available`}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  const flavorCount = megaTeaKitCollectionMenuFlavors(collection.collectionSlug).length;

  return (
    <div className="space-y-6">
      <Link
        href="/menu?category=mega-tea-kits"
        className="inline-flex text-sm font-semibold text-pink hover:underline"
      >
        {locale === 'es' ? '← Todas las colecciones' : '← All collections'}
      </Link>

      <div className="overflow-hidden rounded-2xl border border-grey/15 bg-white p-4 sm:p-6">
        <h3 className="font-display text-2xl text-carbon">{collection.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-grey">{collection.description}</p>
        <p className="mt-3 text-sm font-semibold text-pink">{megaTeaKitPricingSummary()}</p>
        <p className="mt-2 text-sm font-semibold text-carbon">
          {locale === 'es'
            ? `${flavorCount} sabores disponibles`
            : `${flavorCount} flavors available`}
        </p>
      </div>

      {product ? (
        <ProductGrid products={[product]} locale={locale} categorySlug="mega-tea-kits" />
      ) : (
        <p className="text-sm text-grey">
          {locale === 'es' ? 'Kit no disponible.' : 'Kit not available.'}
        </p>
      )}
    </div>
  );
}
