import {
  LOADED_TEAS_MENU,
  loadedTeaIsPremium,
  loadedTeaSizePriceCents,
} from '@/lib/loaded-teas-menu';
import type { LoadedTeasCatalogData } from '@/types/menu-catalog';

export type LoadedTeaMenuViewItem = {
  slug: string;
  name: string;
  ingredients: string[];
  image?: string;
  servingNote?: string;
  boosted?: boolean;
};

export type LoadedTeaMenuView = {
  heroImage: { url: string; alt: string };
  sizes: { slug: string; name: string; price: number }[];
  items: LoadedTeaMenuViewItem[];
};

export function resolveLoadedTeaIsPremium(
  catalog: LoadedTeasCatalogData | undefined,
  flavorSlug: string
): boolean {
  const flavor = catalog?.flavors.find((f) => f.slug === flavorSlug);
  if (flavor?.isPremium != null) return flavor.isPremium;
  return loadedTeaIsPremium(flavorSlug);
}

/** Price in cents from admin catalog (sizes + per-flavor overrides), then static menu fallback. */
export function resolveLoadedTeaSizePriceCents(
  catalog: LoadedTeasCatalogData | undefined,
  sizeSlug: string,
  flavorSlug?: string
): number {
  if (flavorSlug && catalog) {
    const flavor = catalog.flavors.find((f) => f.slug === flavorSlug && !f.hidden);
    if (flavor) {
      const override = sizeSlug === '24oz' ? flavor.price24 : flavor.price32;
      if (typeof override === 'number' && Number.isFinite(override)) {
        return Math.round(override * 100);
      }
    }
  }

  const catalogSize = catalog?.sizes.find((s) => s.slug === sizeSlug && !s.hidden);
  if (catalogSize && catalogSize.price > 0) {
    return Math.round(catalogSize.price * 100);
  }

  return loadedTeaSizePriceCents(sizeSlug, flavorSlug);
}

export function parseLoadedTeaVariantSku(
  variantSku: string
): { sizeSlug: '24oz' | '32oz'; flavorSlug?: string } | null {
  const raw = variantSku.trim();
  const upper = raw.toUpperCase();

  const withFlavor = /^FFB-LTEA-P?(24|32)\.(.+)$/i.exec(upper);
  if (withFlavor) {
    const flavorSlug = raw.slice(raw.indexOf('.') + 1).toLowerCase();
    return { sizeSlug: `${withFlavor[1]}oz` as '24oz' | '32oz', flavorSlug };
  }

  if (upper === 'FFB-LTEA-24') return { sizeSlug: '24oz' };
  if (upper === 'FFB-LTEA-32') return { sizeSlug: '32oz' };
  if (upper === 'FFB-LTEA-P24') return { sizeSlug: '24oz', flavorSlug: 'mango-breeze' };
  if (upper === 'FFB-LTEA-P32') return { sizeSlug: '32oz', flavorSlug: 'mango-breeze' };

  return null;
}

export function buildLoadedTeaMenuView(catalog: LoadedTeasCatalogData): LoadedTeaMenuView {
  const staticBySlug = new Map(LOADED_TEAS_MENU.items.map((item) => [item.slug, item]));

  const hero = catalog.heroImage?.url
    ? {
        url: catalog.heroImage.url,
        alt: catalog.heroImage.alt ?? LOADED_TEAS_MENU.heroImage.alt,
      }
    : LOADED_TEAS_MENU.heroImage;

  const sizes =
    catalog.sizes.filter((s) => !s.hidden).length > 0
      ? catalog.sizes
          .filter((s) => !s.hidden)
          .map((s) => ({ slug: s.slug, name: s.name, price: s.price }))
      : LOADED_TEAS_MENU.sizes.map((s) => ({ slug: s.slug, name: s.name, price: s.price }));

  const items = catalog.flavors
    .filter((f) => !f.hidden)
    .map((f) => {
      const staticItem = staticBySlug.get(f.slug as (typeof LOADED_TEAS_MENU.items)[number]['slug']);
      const ingredients =
        f.ingredients && f.ingredients.length > 0
          ? f.ingredients
          : staticItem
            ? [...staticItem.ingredients]
            : [];
      const image =
        f.image ?? (staticItem && 'image' in staticItem ? staticItem.image : undefined);
      const servingNote =
        staticItem && 'servingNote' in staticItem ? staticItem.servingNote : undefined;
      const boosted =
        f.isPremium ??
        (staticItem && 'boosted' in staticItem ? Boolean(staticItem.boosted) : undefined);

      return {
        slug: f.slug,
        name: f.name,
        ingredients,
        image,
        servingNote,
        boosted,
      };
    });

  return { heroImage: hero, sizes, items };
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function resolveLoadedTeaItemPricingNote(
  catalog: LoadedTeasCatalogData | undefined,
  itemSlug: string
): string {
  const parts = (['24oz', '32oz'] as const).map((sizeSlug) => {
    const cents = resolveLoadedTeaSizePriceCents(catalog, sizeSlug, itemSlug);
    const label = sizeSlug === '24oz' ? '24 oz' : '32 oz';
    return `${label} ${formatUsd(cents / 100)}`;
  });
  return parts.join(' · ');
}
