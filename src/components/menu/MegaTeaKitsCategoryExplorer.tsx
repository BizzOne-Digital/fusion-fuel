'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized } from '@/lib/utils';
import { ProductGrid } from '@/components/products/ProductGrid';
import {
  MEGA_TEA_KIT_COLLECTIONS,
  MEGA_TEA_KITS_MENU,
  megaTeaKitCollectionFlavorList,
  megaTeaKitProductSlug,
} from '@/lib/mega-tea-kits-menu';
import { resolveFlavorImage } from '@/lib/site-images';
import type { IFlavor } from '@/models/Flavor';
import type { IProduct } from '@/models/Product';
import type { Locale } from '@/types';

interface MegaTeaKitsCategoryExplorerProps {
  products: IProduct[];
  flavors: IFlavor[];
  locale: Locale;
  activeCollection?: string;
}

function collectionPreview(
  collectionSlug: string,
  flavors: IFlavor[],
  locale: Locale
): { url: string; alt: string } {
  const collectionFlavor = flavors.find(
    (flavor) =>
      flavor.category === collectionSlug &&
      Boolean(resolveFlavorImage(flavor, getLocalized(flavor.name, locale)).url)
  );

  if (collectionFlavor) {
    const name = getLocalized(collectionFlavor.name, locale);
    const image = resolveFlavorImage(collectionFlavor, name);
    if (image.url) return { url: image.url, alt: name };
  }

  return MEGA_TEA_KITS_MENU.heroImage;
}

export function MegaTeaKitsCategoryExplorer({
  products,
  flavors,
  locale,
  activeCollection,
}: MegaTeaKitsCategoryExplorerProps) {
  const collection = MEGA_TEA_KIT_COLLECTIONS.find(
    (entry) => entry.collectionSlug === activeCollection
  );
  const product = collection
    ? products.find((entry) => entry.slug === megaTeaKitProductSlug(collection.collectionSlug))
    : undefined;

  if (!activeCollection || !collection) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MEGA_TEA_KIT_COLLECTIONS.map((entry) => {
          const preview = collectionPreview(entry.collectionSlug, flavors, locale);
          const flavorNames = megaTeaKitCollectionFlavorList(entry.collectionSlug);

          return (
            <Link
              key={entry.collectionSlug}
              href={`/menu?category=mega-tea-kits&kitCollection=${entry.collectionSlug}`}
              className="group overflow-hidden rounded-2xl border border-grey/15 bg-white transition hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                <Image
                  src={preview.url}
                  alt={preview.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display text-xl text-carbon">{entry.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-grey">{entry.description}</p>
                <p className="mt-2 text-sm">
                  <span className="font-semibold text-carbon">
                    {locale === 'es' ? 'Sabores: ' : 'Flavors: '}
                  </span>
                  <span className="text-grey">{flavorNames}</span>
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-pink">
                  {MEGA_TEA_KITS_MENU.price.toFixed(2)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/menu?category=mega-tea-kits"
        className="inline-flex text-sm font-semibold text-pink hover:underline"
      >
        {locale === 'es' ? '← Todas las colecciones' : '← All collections'}
      </Link>
      <div>
        <h3 className="font-display text-2xl text-carbon">{collection.name}</h3>
        <p className="mt-1 max-w-2xl text-sm text-grey">{collection.description}</p>
        <p className="mt-3 max-w-3xl text-sm">
          <span className="font-semibold text-carbon">
            {locale === 'es' ? 'Sabores: ' : 'Flavors: '}
          </span>
          <span className="text-grey">
            {megaTeaKitCollectionFlavorList(collection.collectionSlug)}
          </span>
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
