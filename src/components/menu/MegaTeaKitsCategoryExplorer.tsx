'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized } from '@/lib/utils';
import { ProductGrid } from '@/components/products/ProductGrid';
import {
  MEGA_TEA_KIT_COLLECTIONS,
  MEGA_TEA_KITS_MENU,
  megaTeaKitCollectionMenuFlavors,
  megaTeaKitPricingSummary,
  megaTeaKitProductSlug,
  type MegaTeaKitMenuFlavor,
} from '@/lib/mega-tea-kits-menu';
import type { FlavorCollectionSlug } from '@/lib/menu-flavors';
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

function textOnColor(hex: string): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return '#07090A';
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#07090A' : '#FFFFFF';
}

function FlavorColorChip({ flavor }: { flavor: MegaTeaKitMenuFlavor }) {
  const label = flavor.isNew ? `${flavor.name} — NEW!` : flavor.name;

  return (
    <span
      className="inline-flex min-h-[4.5rem] min-w-[4.5rem] max-w-[6.5rem] items-center justify-center rounded-2xl px-2 py-2 text-center text-[10px] font-bold leading-tight shadow-sm sm:min-h-[5rem] sm:min-w-[5rem] sm:text-[11px]"
      style={{ backgroundColor: flavor.color, color: textOnColor(flavor.color) }}
      title={label}
    >
      {label}
    </span>
  );
}

function CollectionFlavorChips({
  collectionSlug,
  locale,
}: {
  collectionSlug: FlavorCollectionSlug;
  locale: Locale;
}) {
  const menuFlavors = megaTeaKitCollectionMenuFlavors(collectionSlug);

  return (
    <div className="min-w-0 flex-1">
      <p className="text-xs font-bold uppercase tracking-wide text-carbon">
        {locale === 'es' ? 'Sabores' : 'Flavors'}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {menuFlavors.map((flavor) => (
          <FlavorColorChip key={flavor.slug} flavor={flavor} />
        ))}
      </div>
    </div>
  );
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
      <div className="space-y-4">
        {MEGA_TEA_KIT_COLLECTIONS.map((entry) => {
          const preview = collectionPreview(entry.collectionSlug, flavors, locale);

          return (
            <Link
              key={entry.collectionSlug}
              href={`/menu?category=mega-tea-kits&kitCollection=${entry.collectionSlug}`}
              className="group block overflow-hidden rounded-2xl border border-grey/15 bg-white transition hover:border-pink/30 hover:shadow-lg"
            >
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-6 lg:gap-8">
                <div className="relative mx-auto aspect-square w-full max-w-[11rem] shrink-0 overflow-hidden rounded-2xl bg-cream sm:mx-0 sm:w-36 lg:w-40">
                  <Image
                    src={preview.url}
                    alt={preview.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 80vw, 160px"
                  />
                </div>

                <div className="min-w-0 shrink-0 sm:w-44 lg:w-52">
                  <h3 className="font-display text-xl text-carbon lg:text-2xl">{entry.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-grey">{entry.description}</p>
                  <p className="mt-3 text-sm font-semibold text-pink">{megaTeaKitPricingSummary()}</p>
                </div>

                <CollectionFlavorChips
                  collectionSlug={entry.collectionSlug}
                  locale={locale}
                />
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

      <div className="overflow-hidden rounded-2xl border border-grey/15 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6 lg:gap-8">
          <div className="min-w-0 shrink-0 sm:w-44 lg:w-52">
            <h3 className="font-display text-2xl text-carbon">{collection.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-grey">{collection.description}</p>
            <p className="mt-3 text-sm font-semibold text-pink">{megaTeaKitPricingSummary()}</p>
          </div>
          <CollectionFlavorChips collectionSlug={collection.collectionSlug} locale={locale} />
        </div>
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
