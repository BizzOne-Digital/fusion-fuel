/** Shared admin menu catalog shapes (persisted in MenuCatalog + synced to products). */

export type CatalogVisibility = {
  hidden?: boolean;
};

export type LoadedTeaSizeConfig = {
  slug: string;
  name: string;
  price: number;
  hidden?: boolean;
};

export type LoadedTeaFlavorConfig = {
  slug: string;
  name: string;
  ingredients?: string[];
  image?: string;
  price24?: number;
  price32?: number;
  isPremium?: boolean;
  hidden?: boolean;
};

export type LoadedTeaAddOnConfig = {
  slug: string;
  name: string;
  description?: string;
  price: number;
  hidden?: boolean;
};

export type LoadedTeasCatalogData = {
  heroImage?: { url: string; alt?: string };
  sizes: LoadedTeaSizeConfig[];
  flavors: LoadedTeaFlavorConfig[];
  addOns: LoadedTeaAddOnConfig[];
};

export type MyoltDrinkCatalogData = {
  slug: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  hidden?: boolean;
  addOns: LoadedTeaAddOnConfig[];
};

export type MegaTeasCatalogData = {
  loadedTeas: LoadedTeasCatalogData;
  myoltDrinks: MyoltDrinkCatalogData[];
};

export type BowlTypeConfig = {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  picksFruits: number;
  picksToppings: number;
  includes?: string[];
  hidden?: boolean;
};

export type BowlCategoryCatalogData = {
  mainImage?: string;
  mainDescription?: string;
  footnote?: string;
  fruits: string[];
  toppings: string[];
  extraToppingDefaultPrice: number;
  extraToppings: { name: string; price: number; hidden?: boolean }[];
  types: BowlTypeConfig[];
};

export type ProteinCoffeeCatalogData = {
  mainImages: { url: string; alt?: string }[];
  sizes: LoadedTeaSizeConfig[];
  flavors: { slug: string; name: string; image?: string; hidden?: boolean }[];
  addOns: LoadedTeaAddOnConfig[];
  formula1Flavors: LoadedTeaAddOnConfig[];
};

export type ProteinShakeFlavorConfig = {
  slug: string;
  name: string;
  image?: string;
  price24?: number;
  price32?: number;
  hidden?: boolean;
};

export type ProteinShakesCatalogData = {
  heroImage?: { url: string; alt?: string };
  sizes: LoadedTeaSizeConfig[];
  flavors: ProteinShakeFlavorConfig[];
  addOns: LoadedTeaAddOnConfig[];
};

export type WafflePresetConfig = {
  slug: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  hidden?: boolean;
};

export type WaffleToppingGroupConfig = {
  label: string;
  items: string[];
};

export type WafflesCatalogData = {
  presets: WafflePresetConfig[];
  buildYourOwn: {
    name: string;
    description?: string;
    price: number;
    image?: string;
    extraToppingPrice: number;
    includedToppingMax: number;
    toppingGroups: WaffleToppingGroupConfig[];
    hidden?: boolean;
  };
};

export type ProteinTreatPackConfig = {
  slug: string;
  name: string;
  label: string;
  price: number;
  count: number;
  hidden?: boolean;
};

export type ProteinTreatsCatalogData = {
  truffles: {
    name: string;
    description?: string;
    image?: string;
    packs: ProteinTreatPackConfig[];
    hidden?: boolean;
  };
  miniDonuts: {
    name: string;
    description?: string;
    image?: string;
    packPrice: number;
    packCount: number;
    flavors: { slug: string; name: string; image?: string; hidden?: boolean }[];
    hidden?: boolean;
  };
  pieInACup: {
    name: string;
    description?: string;
    mainImage?: string;
    sizes: LoadedTeaSizeConfig[];
    flavors: { slug: string; name: string; image?: string; hidden?: boolean }[];
    hidden?: boolean;
  };
};

export type MenuCatalogDataBySlug = {
  'mega-teas': MegaTeasCatalogData;
  'acai-bowls': BowlCategoryCatalogData;
  'protein-bowls': BowlCategoryCatalogData;
  'protein-coffee': ProteinCoffeeCatalogData;
  'protein-shakes': ProteinShakesCatalogData;
  waffles: WafflesCatalogData;
  'protein-treats': ProteinTreatsCatalogData;
};

export type MenuCatalogCategorySlug = keyof MenuCatalogDataBySlug;

export const MENU_CATALOG_CATEGORY_SLUGS: MenuCatalogCategorySlug[] = [
  'mega-teas',
  'acai-bowls',
  'protein-bowls',
  'protein-coffee',
  'protein-shakes',
  'waffles',
  'protein-treats',
];
