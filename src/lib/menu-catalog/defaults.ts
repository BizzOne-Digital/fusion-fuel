import { ACAI_BOWL_EXTRA_TOPPINGS, ACAI_BOWLS_MENU, acaiBowlMenuItems, proteinBowlMenuItems } from '@/lib/acai-bowls-menu';
import { LOADED_TEAS_MENU, LOADED_TEA_PREMIUM_SLUGS } from '@/lib/loaded-teas-menu';
import {
  MYOLT_DRINKS,
  MYOLT_OPTIONAL_ADDONS,
  type MyoltOptionalAddonKey,
} from '@/lib/make-your-own-loaded-tea-menu';
import { PROTEIN_COFFEE } from '@/lib/protein-coffee-menu';
import { PROTEIN_SHAKES_MENU } from '@/lib/protein-shakes-menu';
import { PROTEIN_TREATS_MENU } from '@/lib/protein-treats-menu';
import { WAFFLES_MENU } from '@/lib/waffles-menu';
import type {
  BowlCategoryCatalogData,
  MegaTeasCatalogData,
  MenuCatalogCategorySlug,
  MenuCatalogDataBySlug,
  ProteinCoffeeCatalogData,
  ProteinShakesCatalogData,
  ProteinTreatsCatalogData,
  WafflesCatalogData,
} from '@/types/menu-catalog';

const premiumSet = new Set<string>(LOADED_TEA_PREMIUM_SLUGS);

function myoltAddonCatalog(key: MyoltOptionalAddonKey) {
  const addon = MYOLT_OPTIONAL_ADDONS[key];
  return {
    slug: addon.addInSlug,
    name: addon.label,
    description:
      'flavorOptions' in addon && addon.flavorOptions?.length
        ? `Flavors: ${addon.flavorOptions.join(', ')}`
        : undefined,
    price: addon.price,
  };
}

function buildLoadedTeasDefaults(): MegaTeasCatalogData['loadedTeas'] {
  return {
    heroImage: { url: LOADED_TEAS_MENU.heroImage.url, alt: LOADED_TEAS_MENU.heroImage.alt },
    sizes: LOADED_TEAS_MENU.sizes.map((s) => ({
      slug: s.slug,
      name: s.name,
      price: s.price,
    })),
    flavors: LOADED_TEAS_MENU.items.map((item) => ({
      slug: item.slug,
      name: item.name,
      ingredients: [...item.ingredients],
      image: 'image' in item ? item.image : undefined,
      isPremium: premiumSet.has(item.slug),
    })),
    addOns: LOADED_TEAS_MENU.optionalAddOns.map((a) => ({
      slug: a.slug,
      name: a.name,
      description: a.description,
      price: a.price,
    })),
  };
}

function buildMegaTeasDefaults(): MegaTeasCatalogData {
  return {
    loadedTeas: buildLoadedTeasDefaults(),
    myoltDrinks: MYOLT_DRINKS.map((drink) => ({
      slug: drink.slug,
      name: drink.name,
      description: drink.websiteNotice,
      price: drink.price,
      addOns: drink.optionalAddons
        .map((key) => myoltAddonCatalog(key))
        .filter((a): a is NonNullable<typeof a> => Boolean(a)),
    })),
  };
}

function buildBowlDefaults(kind: 'acai' | 'protein'): BowlCategoryCatalogData {
  const items = kind === 'acai' ? acaiBowlMenuItems() : proteinBowlMenuItems();
  const heroItem = items[0];
  return {
    mainImage: heroItem?.image,
    mainDescription: kind === 'acai' ? ACAI_BOWLS_MENU.headline : undefined,
    footnote: ACAI_BOWLS_MENU.footnote,
    fruits: [...ACAI_BOWLS_MENU.includedFruits],
    toppings: [...ACAI_BOWLS_MENU.includedToppings],
    extraToppingDefaultPrice: 1,
    extraToppings: ACAI_BOWL_EXTRA_TOPPINGS.map((t) => ({ name: t.name, price: t.price })),
    types: items.map((item) => ({
      slug: item.slug,
      name: item.name,
      description: item.description,
      image: item.image,
      price: item.price ?? 11.99,
      picksFruits: item.picks.fruits,
      picksToppings: item.picks.toppings ?? 0,
      includes: 'includes' in item && item.includes ? [...item.includes] : undefined,
    })),
  };
}

function buildProteinCoffeeDefaults(): ProteinCoffeeCatalogData {
  return {
    mainImages: PROTEIN_COFFEE.galleryImages.map((img) => ({ url: img.url, alt: img.alt })),
    sizes: PROTEIN_COFFEE.icedSizes.map((s) => ({
      slug: s.slug,
      name: s.name,
      price: s.price,
    })),
    flavors: PROTEIN_COFFEE.flavors.map((f) => ({ slug: f.slug, name: f.name })),
    addOns: PROTEIN_COFFEE.optionalAddOns.map((a) => ({
      slug: a.slug,
      name: a.name,
      price: a.price,
    })),
    formula1Flavors: PROTEIN_COFFEE.formula1Flavors.map((a) => ({
      slug: a.slug,
      name: a.name,
      price: a.price,
    })),
  };
}

function buildProteinShakesDefaults(): ProteinShakesCatalogData {
  return {
    heroImage: {
      url: PROTEIN_SHAKES_MENU.heroImage.url,
      alt: PROTEIN_SHAKES_MENU.heroImage.alt,
    },
    sizes: PROTEIN_SHAKES_MENU.sizes.map((s) => ({
      slug: s.slug,
      name: s.name,
      price: s.price,
    })),
    flavors: PROTEIN_SHAKES_MENU.items.map((item) => ({
      slug: item.slug,
      name: item.name,
      image: item.image,
    })),
    addOns: PROTEIN_SHAKES_MENU.optionalAddOns.map((a) => ({
      slug: a.slug,
      name: a.name,
      price: a.price,
    })),
  };
}

function buildWafflesDefaults(): WafflesCatalogData {
  const [birthday, crunchy, cyo] = WAFFLES_MENU.items;
  return {
    presets: [
      {
        slug: birthday.slug,
        name: birthday.name,
        description: birthday.description,
        price: WAFFLES_MENU.price,
        image: birthday.image,
      },
      {
        slug: crunchy.slug,
        name: crunchy.name,
        description: crunchy.description,
        price: WAFFLES_MENU.price,
        image: crunchy.image,
      },
    ],
    buildYourOwn: {
      name: cyo.name,
      description: cyo.description,
      price: WAFFLES_MENU.price,
      image: cyo.image,
      extraToppingPrice: WAFFLES_MENU.extraToppingPrice,
      includedToppingMax: WAFFLES_MENU.includedToppingMax,
      toppingGroups: WAFFLES_MENU.toppingGroups.map((g) => ({
        label: g.label,
        items: [...g.items],
      })),
    },
  };
}

function buildProteinTreatsDefaults(): ProteinTreatsCatalogData {
  const { proteinTruffles, proteinMiniDonuts, pieInACup } = PROTEIN_TREATS_MENU;
  return {
    truffles: {
      name: proteinTruffles.name,
      description: proteinTruffles.description,
      image: proteinTruffles.image.url,
      packs: proteinTruffles.packs.map((p) => ({
        slug: p.slug,
        name: p.name,
        label: p.label,
        price: p.price,
        count: p.count,
      })),
    },
    miniDonuts: {
      name: proteinMiniDonuts.name,
      description: proteinMiniDonuts.description,
      image: proteinMiniDonuts.image.url,
      packPrice: proteinMiniDonuts.pack.price,
      packCount: proteinMiniDonuts.pack.count,
      flavors: proteinMiniDonuts.flavors.map((f) => ({ slug: f.slug, name: f.name })),
    },
    pieInACup: {
      name: pieInACup.name,
      description: pieInACup.description,
      mainImage: pieInACup.image.url,
      sizes: pieInACup.sizes.map((s) => ({
        slug: s.slug,
        name: s.name,
        price: s.price,
      })),
      flavors: pieInACup.flavors.map((f) => ({
        slug: f.slug,
        name: f.name,
        image: 'image' in f ? f.image : undefined,
      })),
    },
  };
}

export function getDefaultMenuCatalogData<S extends MenuCatalogCategorySlug>(
  categorySlug: S
): MenuCatalogDataBySlug[S] {
  switch (categorySlug) {
    case 'mega-teas':
      return buildMegaTeasDefaults() as MenuCatalogDataBySlug[S];
    case 'acai-bowls':
      return buildBowlDefaults('acai') as MenuCatalogDataBySlug[S];
    case 'protein-bowls':
      return buildBowlDefaults('protein') as MenuCatalogDataBySlug[S];
    case 'protein-coffee':
      return buildProteinCoffeeDefaults() as MenuCatalogDataBySlug[S];
    case 'protein-shakes':
      return buildProteinShakesDefaults() as MenuCatalogDataBySlug[S];
    case 'waffles':
      return buildWafflesDefaults() as MenuCatalogDataBySlug[S];
    case 'protein-treats':
      return buildProteinTreatsDefaults() as MenuCatalogDataBySlug[S];
    default:
      throw new Error(`Unknown menu catalog slug: ${categorySlug}`);
  }
}

export function isMenuCatalogCategorySlug(slug: string): slug is MenuCatalogCategorySlug {
  const normalized = slug === 'loaded-teas' ? 'mega-teas' : slug;
  return (
    ['mega-teas', 'acai-bowls', 'protein-bowls', 'protein-coffee', 'protein-shakes', 'waffles', 'protein-treats'] as string[]
  ).includes(normalized);
}
