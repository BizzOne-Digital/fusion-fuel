import { BULK_PRODUCTS_MENU } from '@/lib/bulk-products-menu';
import {
  LOADED_TEAS_MENU,
  LOADED_TEA_PRODUCT_SLUG,
  loadedTeaItemImage,
  loadedTeaItemPricingNote,
  loadedTeaShortDescription,
} from '@/lib/loaded-teas-menu';
import {
  LOADED_TEAS_MENU_VIEWS,
  MAKE_YOUR_OWN_LOADED_TEA_MENU,
  MYOLT_DRINKS,
  MYOLT_OPTIONAL_ADDONS,
  type MyoltDrink,
  type MyoltOptionalAddonKey,
} from '@/lib/make-your-own-loaded-tea-menu';
import {
  MAKE_YOUR_OWN_MEGA_TEA_KIT,
  MEGA_TEA_KIT_COLLECTIONS,
  MEGA_TEA_KIT_PRODUCT_SLUG,
  MEGA_TEA_KITS_MENU,
  megaTeaKitCollectionFlavorNames,
} from '@/lib/mega-tea-kits-menu';
import { MONTHLY_TEA_CLUB_MENU } from '@/lib/monthly-tea-club-menu';
import { PROTEIN_SHAKES_MENU } from '@/lib/protein-shakes-menu';

export type PublishedAdminProduct = {
  id: string;
  slug: string;
  name: { en: string; es?: string };
  shortDescription?: { en: string };
  basePrice: number;
  status: string;
  images?: { url: string; alt: string }[];
};

export type AdminCatalogEntry = {
  key: string;
  title: string;
  description?: string;
  imageUrl?: string;
  adminHref: string;
  dbProductId?: string;
};

export function adminProductsCategoryHref(categorySlug: string): string {
  return `/admin/products/category/${categorySlug}`;
}

function dbProductEntry(
  categorySlug: string,
  product: PublishedAdminProduct
): AdminCatalogEntry {
  return {
    key: product.slug,
    title: product.name.en,
    description: product.shortDescription?.en,
    imageUrl: product.images?.[0]?.url,
    adminHref: `/admin/products/category/${categorySlug}/db/${product.id}`,
    dbProductId: product.id,
  };
}

/** Top-level products / collections shown under a menu category (matches storefront explorers). */
export function listAdminCategoryEntries(
  categorySlug: string,
  publishedProducts: PublishedAdminProduct[],
  browseSlug?: string
): AdminCatalogEntry[] {
  const base = adminProductsCategoryHref(browseSlug ?? categorySlug);

  if (categorySlug === 'mega-teas' || categorySlug === 'loaded-teas') {
    return [
      {
        key: LOADED_TEAS_MENU_VIEWS.loadedTeas,
        title: LOADED_TEAS_MENU.headline,
        description: `${LOADED_TEAS_MENU.servingNote}. ${LOADED_TEAS_MENU.items.length} flavors.`,
        imageUrl: LOADED_TEAS_MENU.heroImage.url,
        adminHref: `${base}/${LOADED_TEAS_MENU_VIEWS.loadedTeas}`,
        dbProductId: publishedProducts.find((p) => p.slug === LOADED_TEA_PRODUCT_SLUG)?.id,
      },
      {
        key: MAKE_YOUR_OWN_LOADED_TEA_MENU.slug,
        title: MAKE_YOUR_OWN_LOADED_TEA_MENU.headline,
        description: `${MYOLT_DRINKS.length} drink styles with modifiers and add-ons.`,
        imageUrl: MAKE_YOUR_OWN_LOADED_TEA_MENU.image.url,
        adminHref: `${base}/${MAKE_YOUR_OWN_LOADED_TEA_MENU.slug}`,
      },
    ];
  }

  if (categorySlug === 'mega-tea-kits') {
    const entries: AdminCatalogEntry[] = [
      {
        key: MEGA_TEA_KIT_PRODUCT_SLUG,
        title: MAKE_YOUR_OWN_MEGA_TEA_KIT.name,
        description: MAKE_YOUR_OWN_MEGA_TEA_KIT.description,
        imageUrl: MAKE_YOUR_OWN_MEGA_TEA_KIT.image.url,
        adminHref: `${base}/${MEGA_TEA_KIT_PRODUCT_SLUG}`,
        dbProductId: publishedProducts.find((p) => p.slug === MEGA_TEA_KIT_PRODUCT_SLUG)?.id,
      },
      ...MEGA_TEA_KIT_COLLECTIONS.map((collection) => ({
        key: collection.productSlug,
        title: collection.name,
        description: collection.description,
        imageUrl: MEGA_TEA_KITS_MENU.heroImage.url,
        adminHref: `${base}/${collection.productSlug}`,
        dbProductId: publishedProducts.find((p) => p.slug === collection.productSlug)?.id,
      })),
    ];
    const listedSlugs = new Set(entries.map((e) => e.key));
    for (const product of publishedProducts) {
      if (!listedSlugs.has(product.slug)) {
        entries.push(dbProductEntry(categorySlug, product));
      }
    }
    return entries;
  }

  if (categorySlug === 'protein-shakes') {
    return [
      {
        key: 'manage',
        title: PROTEIN_SHAKES_MENU.headline,
        description: `${PROTEIN_SHAKES_MENU.items.length} flavors · sizes & add-ons`,
        imageUrl: PROTEIN_SHAKES_MENU.heroImage.url,
        adminHref: `${base}/manage`,
      },
    ];
  }

  if (categorySlug === 'acai-bowls') {
    return [
      {
        key: 'manage',
        title: 'Açaí Bowls',
        description: 'Main image, bowl types, fruits, toppings & extra pricing',
        imageUrl: publishedProducts.find((p) => p.slug.startsWith('acai-bowl-'))?.images?.[0]?.url,
        adminHref: `${base}/manage`,
      },
    ];
  }

  if (categorySlug === 'protein-bowls') {
    return [
      {
        key: 'manage',
        title: 'Protein Bowls',
        description: 'Main image, bowl types, fruits, toppings & extra pricing',
        imageUrl: publishedProducts.find((p) => p.slug.includes('protein-bowl'))?.images?.[0]?.url,
        adminHref: `${base}/manage`,
      },
    ];
  }

  if (categorySlug === 'protein-coffee') {
    return [
      {
        key: 'manage',
        title: 'Protein Coffee',
        description: 'Sizes, flavors, add-ons & gallery',
        adminHref: `${base}/manage`,
        imageUrl: publishedProducts.find((p) => p.slug === 'protein-coffee')?.images?.[0]?.url,
      },
    ];
  }

  if (categorySlug === 'waffles') {
    return [
      {
        key: 'manage',
        title: 'Protein Waffles',
        description: 'Presets & create-your-own topping groups',
        adminHref: `${base}/manage`,
        imageUrl: publishedProducts.find((p) => p.slug.startsWith('waffle-'))?.images?.[0]?.url,
      },
    ];
  }

  if (categorySlug === 'protein-treats') {
    return [
      {
        key: 'manage',
        title: 'Protein Treats',
        description: 'Truffles, mini donuts & pie in a cup',
        adminHref: `${base}/manage`,
        imageUrl: publishedProducts.find((p) => p.slug.startsWith('protein-'))?.images?.[0]?.url,
      },
    ];
  }

  if (categorySlug === BULK_PRODUCTS_MENU.slug) {
    return [
      {
        key: BULK_PRODUCTS_MENU.slug,
        title: BULK_PRODUCTS_MENU.headline,
        description: BULK_PRODUCTS_MENU.description,
        imageUrl: BULK_PRODUCTS_MENU.image.url,
        adminHref: `${base}/${BULK_PRODUCTS_MENU.slug}`,
      },
    ];
  }

  if (categorySlug === MONTHLY_TEA_CLUB_MENU.slug) {
    return [
      {
        key: MONTHLY_TEA_CLUB_MENU.slug,
        title: MONTHLY_TEA_CLUB_MENU.headline,
        description: MONTHLY_TEA_CLUB_MENU.description,
        adminHref: `${base}/${MONTHLY_TEA_CLUB_MENU.slug}`,
      },
    ];
  }

  return publishedProducts.map((product) => dbProductEntry(categorySlug, product));
}

export function loadedTeaFlavorEntries(categorySlug: string): AdminCatalogEntry[] {
  const base = adminProductsCategoryHref(categorySlug);
  const view = LOADED_TEAS_MENU_VIEWS.loadedTeas;
  return LOADED_TEAS_MENU.items.map((item) => {
    const image = loadedTeaItemImage(item);
    return {
      key: item.slug,
      title: item.name,
      description: loadedTeaShortDescription(item),
      imageUrl: image.url,
      adminHref: `${base}/${view}/${item.slug}`,
    };
  });
}

export function myoltDrinkEntries(categorySlug: string): AdminCatalogEntry[] {
  const base = adminProductsCategoryHref(categorySlug);
  const parent = MAKE_YOUR_OWN_LOADED_TEA_MENU.slug;
  return MYOLT_DRINKS.map((drink) => ({
    key: drink.slug,
    title: drink.name,
    description: `${formatUsd(drink.price)} · ${drink.includedSummary}`,
    adminHref: `${base}/${parent}/${drink.slug}`,
  }));
}

export function getMyoltDrink(slug: string): MyoltDrink | undefined {
  return MYOLT_DRINKS.find((d) => d.slug === slug);
}

export function myoltAddonRows(keys: MyoltOptionalAddonKey[]) {
  return keys.map((key) => {
    const addon = MYOLT_OPTIONAL_ADDONS[key];
    return {
      key,
      label: addon.label,
      price: addon.price,
      flavorOptions:
        'flavorOptions' in addon && addon.flavorOptions
          ? [...addon.flavorOptions]
          : undefined,
    };
  });
}

export function megaTeaKitCollectionDetail(collectionProductSlug: string) {
  return MEGA_TEA_KIT_COLLECTIONS.find((c) => c.productSlug === collectionProductSlug);
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatCents(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

export function loadedTeaFlavorBySlug(slug: string) {
  return LOADED_TEAS_MENU.items.find((item) => item.slug === slug);
}

export {
  LOADED_TEAS_MENU,
  LOADED_TEA_PRODUCT_SLUG,
  loadedTeaItemImage,
  loadedTeaItemPricingNote,
  MAKE_YOUR_OWN_LOADED_TEA_MENU,
  MYOLT_DRINKS,
  PROTEIN_SHAKES_MENU,
  MEGA_TEA_KITS_MENU,
  megaTeaKitCollectionFlavorNames,
};
