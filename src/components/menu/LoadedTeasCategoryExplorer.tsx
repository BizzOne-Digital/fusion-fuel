'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { LOADED_TEAS_MENU, LOADED_TEA_PRODUCT_SLUG } from '@/lib/loaded-teas-menu';
import {
  LOADED_TEAS_MENU_VIEWS,
  MAKE_YOUR_OWN_LOADED_TEA_MENU,
  loadedTeasMenuHref,
} from '@/lib/make-your-own-loaded-tea-menu';
import { MakeYourOwnLoadedTeaCategoryExplorer } from '@/components/menu/MakeYourOwnLoadedTeaCategoryExplorer';
import type { Locale } from '@/types';

interface LoadedTeasCategoryExplorerProps {
  locale: Locale;
  view?: string;
}

function MenuBackLink({ href, locale }: { href: string; locale: Locale }) {
  return (
    <Link href={href} className="inline-flex text-sm font-semibold text-pink hover:underline">
      {locale === 'es' ? '← Volver' : '← Back'}
    </Link>
  );
}

function MenuHubCard({
  title,
  description,
  imageUrl,
  imageAlt,
  href,
  cta,
}: {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-grey/15 bg-white transition hover:border-pink/30 hover:shadow-lg"
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
        <div className="relative mx-auto aspect-square w-full max-w-[11rem] shrink-0 overflow-hidden rounded-2xl bg-cream sm:mx-0 sm:w-36 lg:w-40">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 80vw, 160px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl text-carbon lg:text-2xl">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-grey">{description}</p>
          <p className="mt-3 text-sm font-semibold text-pink group-hover:underline">{cta}</p>
        </div>
      </div>
    </Link>
  );
}

export function LoadedTeasCategoryExplorer({ locale, view }: LoadedTeasCategoryExplorerProps) {
  if (view === LOADED_TEAS_MENU_VIEWS.makeYourOwn) {
    return (
      <div className="mt-6 space-y-6">
        <MenuBackLink href={loadedTeasMenuHref()} locale={locale} />
        <MakeYourOwnLoadedTeaCategoryExplorer locale={locale} />
      </div>
    );
  }

  if (view === LOADED_TEAS_MENU_VIEWS.loadedTeas) {
    const hero = LOADED_TEAS_MENU.heroImage;

    return (
      <div className="mt-6 space-y-6">
        <MenuBackLink href={loadedTeasMenuHref()} locale={locale} />
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
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <MenuHubCard
        title={LOADED_TEAS_MENU.headline}
        description={
          locale === 'es'
            ? 'Loaded teas listos para ordenar con sabores y tamaños.'
            : 'Ready-to-order loaded teas with flavors and sizes.'
        }
        imageUrl={LOADED_TEAS_MENU.heroImage.url}
        imageAlt={LOADED_TEAS_MENU.heroImage.alt}
        href={loadedTeasMenuHref(LOADED_TEAS_MENU_VIEWS.loadedTeas)}
        cta={locale === 'es' ? 'Ver loaded teas →' : 'Browse loaded teas →'}
      />
      <MenuHubCard
        title={MAKE_YOUR_OWN_LOADED_TEA_MENU.headline}
        description={MAKE_YOUR_OWN_LOADED_TEA_MENU.description}
        imageUrl={MAKE_YOUR_OWN_LOADED_TEA_MENU.image.url}
        imageAlt={MAKE_YOUR_OWN_LOADED_TEA_MENU.image.alt}
        href={loadedTeasMenuHref(LOADED_TEAS_MENU_VIEWS.makeYourOwn)}
        cta={locale === 'es' ? 'Arma tu loaded tea →' : 'Build your loaded tea →'}
      />
    </div>
  );
}
