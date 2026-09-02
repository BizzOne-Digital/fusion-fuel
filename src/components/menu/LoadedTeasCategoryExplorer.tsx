'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import {
  LOADED_TEAS_MENU,
  LOADED_TEA_PRODUCT_SLUG,
  loadedTeaChipColor,
  loadedTeaItemImage,
  loadedTeaPricingSummary,
  type LoadedTeaMenuItem,
} from '@/lib/loaded-teas-menu';
import type { Locale } from '@/types';

function textOnColor(hex: string): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return '#07090A';
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#07090A' : '#FFFFFF';
}

function LoadedTeaFlavorChip({ item, index }: { item: LoadedTeaMenuItem; index: number }) {
  const image = 'image' in item && item.image ? item.image : null;

  if (image) {
    return (
      <span
        className="relative inline-flex min-h-[4.5rem] min-w-[4.5rem] max-w-[6.5rem] overflow-hidden rounded-2xl shadow-sm sm:min-h-[5rem] sm:min-w-[5rem]"
        title={item.name}
      >
        <Image src={image} alt={item.name} fill className="object-cover" sizes="80px" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/45 p-1 text-center text-[10px] font-bold leading-tight text-white sm:text-[11px]">
          {item.name}
        </span>
      </span>
    );
  }

  const color = loadedTeaChipColor(index);

  return (
    <span
      className="inline-flex min-h-[4.5rem] min-w-[4.5rem] max-w-[6.5rem] items-center justify-center rounded-2xl px-2 py-2 text-center text-[10px] font-bold leading-tight shadow-sm sm:min-h-[5rem] sm:min-w-[5rem] sm:text-[11px]"
      style={{ backgroundColor: color, color: textOnColor(color) }}
      title={item.name}
    >
      {item.name}
    </span>
  );
}

export function LoadedTeasCategoryExplorer({ locale }: { locale: Locale }) {
  const hero = LOADED_TEAS_MENU.heroImage;

  return (
    <Link
      href={`/products/${LOADED_TEA_PRODUCT_SLUG}`}
      className="group block overflow-hidden rounded-2xl border border-grey/15 bg-white transition hover:border-pink/30 hover:shadow-lg"
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-6 lg:gap-8">
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

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-carbon">
            {locale === 'es' ? 'Sabores' : 'Flavors'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {LOADED_TEAS_MENU.items.map((item, index) => (
              <LoadedTeaFlavorChip key={item.slug} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
