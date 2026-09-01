'use client';

import { useMemo, type ReactNode } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized, sanitizeHtml } from '@/lib/utils';
import { resolveFlavorImage } from '@/lib/site-images';
import { FLAVOR_COLLECTIONS } from '@/lib/menu-flavors';
import { FlavorCollectionNav } from '@/components/products/FlavorCollectionNav';
import type { IFlavor } from '@/models/Flavor';
import type { Locale } from '@/types';

function FlavorScrollCard({
  flavor,
  locale,
  textOnly,
}: {
  flavor: IFlavor;
  locale: Locale;
  textOnly?: boolean;
}) {
  const name = getLocalized(flavor.name, locale);
  const isNew = name.toLowerCase().includes('new');
  const image = resolveFlavorImage(flavor, name);

  return (
    <article
      className={`flex w-[min(72vw,260px)] shrink-0 snap-start flex-col rounded-2xl border border-white/10 bg-white/95 p-4 sm:w-[280px] sm:p-5 ${
        textOnly ? 'sm:w-[min(72vw,320px)]' : ''
      }`}
    >
      {!textOnly && (
        <div
          className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl bg-cream"
          style={{ boxShadow: `inset 0 0 0 4px ${flavor.color}` }}
        >
          {image.url ? (
            <Image src={image.url} alt={image.alt} fill className="object-cover" sizes="200px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-carbon/35">
              Photo soon
            </div>
          )}
        </div>
      )}
      <div className={textOnly ? 'flex min-w-0 flex-1 flex-col' : 'mt-4 flex min-w-0 flex-1 flex-col'}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-lg leading-tight text-carbon sm:text-xl">
            {name.replace(/\s*—\s*NEW!$/i, '')}
          </span>
          {isNew && (
            <span className="rounded-full bg-pink px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              New
            </span>
          )}
        </div>
        <div
          className="prose-brand mt-3 max-h-28 max-w-none flex-1 overflow-hidden text-xs leading-relaxed text-grey [&_li]:my-0.5 [&_ul]:my-1 [&_ul]:pl-4"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(getLocalized(flavor.description, locale)),
          }}
        />
      </div>
    </article>
  );
}

function CollectionRow({
  id,
  title,
  description,
  flavorCount,
  locale,
  children,
}: {
  id: string;
  title: string;
  description: string;
  flavorCount: number;
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-28 border-t border-white/10 py-10 first:border-t-0 first:pt-0 sm:py-12">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="shrink-0 lg:w-52 xl:w-60 lg:self-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-lime">
            {locale === 'es' ? 'Colección' : 'Collection'}
          </p>
          <h3 className="font-display mt-2 text-2xl leading-tight text-white sm:text-3xl">{title}</h3>
          <p className="mt-2 text-sm text-white/60">{description}</p>
          <p className="mt-3 text-xs uppercase tracking-widest text-white/40">
            {flavorCount} {locale === 'es' ? 'sabores' : 'flavors'}
          </p>
          <p className="mt-2 text-xs uppercase tracking-widest text-white/35 lg:hidden">
            {locale === 'es' ? 'Desliza →' : 'Swipe →'}
          </p>
        </div>

        <div className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain scrollbar-hide [-webkit-overflow-scrolling:touch]">
          <div className="flex w-max max-w-none gap-4 pb-1 pr-4 snap-x snap-mandatory sm:gap-5 sm:pr-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FlavorCollectionsExplorerProps {
  flavors: IFlavor[];
  locale: Locale;
  kitProductId?: string;
  kitHref?: string;
  title?: string;
  subtitle?: string;
  showCollectionNav?: boolean;
  textOnly?: boolean;
}

export function FlavorCollectionsExplorer({
  flavors,
  locale,
  kitHref = '/menu?category=mega-tea-kits',
  title,
  subtitle,
  showCollectionNav = true,
  textOnly = false,
}: FlavorCollectionsExplorerProps) {
  const collectionGroups = useMemo(
    () =>
      FLAVOR_COLLECTIONS.map((collection) => ({
        collection,
        flavors: flavors.filter((flavor) => flavor.category === collection.slug),
      })).filter((group) => group.flavors.length > 0),
    [flavors]
  );

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl bg-ink text-white">
      <div className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="min-w-0 flex-1">
          {title && (
            <h2 className="font-display text-2xl text-lime sm:text-3xl md:text-4xl">{title}</h2>
          )}
          {subtitle && <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">{subtitle}</p>}
        </div>

        {showCollectionNav && <FlavorCollectionNav locale={locale} variant="dark" className="mt-6" />}

        <div className="mt-8">
          {collectionGroups.map(({ collection, flavors: groupFlavors }) => (
            <CollectionRow
              key={collection.slug}
              id={collection.slug}
              title={collection.name}
              description={collection.description}
              flavorCount={groupFlavors.length}
              locale={locale}
            >
              {groupFlavors.map((flavor) => (
                <FlavorScrollCard
                  key={String(flavor._id)}
                  flavor={flavor}
                  locale={locale}
                  textOnly={textOnly}
                />
              ))}
            </CollectionRow>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4 border-t border-white/10 pt-8">
          <Link
            href={kitHref}
            className="inline-block rounded-full bg-lime px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition hover:bg-white"
          >
            {locale === 'es' ? 'Ver kits Mega Tea' : 'View Mega Tea kits'}
          </Link>
          <Link
            href="/contact"
            className="inline-block rounded-full border border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-ink"
          >
            {locale === 'es' ? 'Contáctanos' : 'Contact us'}
          </Link>
          <Link
            href="/booking"
            className="inline-block rounded-full border border-lime/50 px-6 py-3 text-sm font-bold uppercase tracking-wide text-lime transition hover:bg-lime hover:text-ink"
          >
            {locale === 'es' ? 'Reservar catering' : 'Book catering'}
          </Link>
        </div>
      </div>
    </div>
  );
}
