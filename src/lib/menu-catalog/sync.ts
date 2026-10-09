import connectDB from '@/lib/mongodb';
import { LOADED_TEA_PRODUCT_SLUG } from '@/lib/loaded-teas-menu';
import { myoltProductSlug } from '@/lib/make-your-own-loaded-tea-menu';
import { PROTEIN_COFFEE_PRODUCT_SLUG } from '@/lib/protein-coffee-menu';
import { PROTEIN_SHAKE_PRODUCT_SLUG, proteinShakeVariantSku } from '@/lib/protein-shakes-menu';
import { acaiBowlModifierSlug } from '@/lib/acai-bowls-menu';
import { waffleExtraModifierSlug } from '@/lib/waffles-menu';
import { pieSizeVariantSuffix } from '@/lib/menu-catalog/protein-treats-catalog';
import Product from '@/models/Product';
import ProductCategory from '@/models/ProductCategory';
import Flavor from '@/models/Flavor';
import AddIn from '@/models/AddIn';
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
import { revalidateStorefrontCatalog } from '@/lib/revalidate-storefront';
import { getMenuCatalogData } from '@/lib/menu-catalog/repository';
import { mergeBowlExtraToppingsForSync } from '@/lib/menu-catalog/bowl-catalog';

function loc(en: string) {
  return { en, es: en };
}

function dollarsToCents(amount: number) {
  return Math.round(amount * 100);
}

async function syncAddIns(
  items: { slug: string; name: string; description?: string; price: number; hidden?: boolean }[],
  category: string
) {
  for (const item of items) {
    await AddIn.findOneAndUpdate(
      { slug: item.slug },
      {
        $set: {
          slug: item.slug,
          name: loc(item.name),
          description: loc(item.description ?? ''),
          price: dollarsToCents(item.price),
          category,
          status: item.hidden ? 'archived' : 'published',
        },
      },
      { upsert: true }
    );
  }
}

async function syncMegaTeas(data: MegaTeasCatalogData) {
  const { loadedTeas, myoltDrinks } = data;
  const size24 = loadedTeas.sizes.find((s) => s.slug === '24oz');
  const size32 = loadedTeas.sizes.find((s) => s.slug === '32oz');

  await Product.findOneAndUpdate(
    { slug: LOADED_TEA_PRODUCT_SLUG },
    {
      $set: {
        basePrice: dollarsToCents(size32?.price ?? 8.9),
        images: loadedTeas.heroImage?.url
          ? [{ url: loadedTeas.heroImage.url, alt: loadedTeas.heroImage.alt ?? 'Loaded teas' }]
          : undefined,
        variants: [
          {
            sku: 'FFB-LTEA-24',
            name: loc(size24?.name ?? '24 oz'),
            price: dollarsToCents(size24?.price ?? 6.9),
            inventory: 0,
          },
          {
            sku: 'FFB-LTEA-32',
            name: loc(size32?.name ?? '32 oz'),
            price: dollarsToCents(size32?.price ?? 8.9),
            inventory: 0,
          },
        ],
      },
    }
  );

  await syncAddIns(loadedTeas.addOns, 'loaded-teas');

  const loadedTeaFlavorSlugs = loadedTeas.flavors.map((flavor) => flavor.slug);
  for (const flavor of loadedTeas.flavors) {
    await Flavor.findOneAndUpdate(
      { slug: flavor.slug },
      {
        $set: {
          slug: flavor.slug,
          name: loc(flavor.name),
          category: 'loaded-teas',
          color: '#FF6B35',
          description: loc(flavor.ingredients?.join(', ') ?? ''),
          image: flavor.image ? { url: flavor.image, alt: flavor.name } : undefined,
          status: flavor.hidden ? 'archived' : 'published',
        },
      },
      { upsert: true }
    );
  }
  if (loadedTeaFlavorSlugs.length > 0) {
    await Flavor.updateMany(
      { category: 'loaded-teas', slug: { $nin: loadedTeaFlavorSlugs } },
      { $set: { status: 'archived' } }
    );
  }

  for (const drink of myoltDrinks) {
    const slug = myoltProductSlug(drink.slug);
    const addInDocs = await AddIn.find({
      slug: { $in: drink.addOns.map((a) => a.slug) },
    }).select('_id');
    await Product.findOneAndUpdate(
      { slug },
      {
        $set: {
          name: loc(drink.name),
          shortDescription: loc(drink.description ?? ''),
          basePrice: dollarsToCents(drink.price),
          images: drink.image ? [{ url: drink.image, alt: drink.name }] : undefined,
          variants: [
            {
              sku: `${slug}-STD`,
              name: loc('Standard'),
              price: dollarsToCents(drink.price),
              inventory: 0,
            },
          ],
          addInOptions: addInDocs.map((doc) => ({
            addInId: doc._id,
            maxQuantity: 10,
            included: false,
          })),
          status: drink.hidden ? 'archived' : 'published',
        },
      }
    );
    await syncAddIns(drink.addOns, 'make-your-own-loaded-tea');
  }
}

async function syncBowlCategory(categorySlug: 'acai-bowls' | 'protein-bowls', data: BowlCategoryCatalogData) {
  const category = await ProductCategory.findOne({ slug: categorySlug });
  if (category) {
    category.description = loc(data.mainDescription ?? category.description?.en ?? '');
    if (data.mainImage) {
      category.image = { url: data.mainImage, alt: category.name.en };
    }
    await category.save();
  }

  const otherSlug = categorySlug === 'acai-bowls' ? 'protein-bowls' : 'acai-bowls';
  const otherData = await getMenuCatalogData(otherSlug);
  const extrasForSync = mergeBowlExtraToppingsForSync(data.extraToppings, otherData.extraToppings);

  for (const extra of extrasForSync) {
    const slug = acaiBowlModifierSlug('extra-topping', extra.name);
    await AddIn.findOneAndUpdate(
      { slug },
      {
        $set: {
          slug,
          name: loc(extra.name),
          description: loc('Extra topping'),
          price: dollarsToCents(extra.price),
          category: 'acai-extra-topping',
          status: extra.hidden ? 'archived' : 'published',
        },
      },
      { upsert: true }
    );
  }

  const extraAddInSlugs = extrasForSync
    .filter((extra) => !extra.hidden)
    .map((extra) => acaiBowlModifierSlug('extra-topping', extra.name));
  const extraAddInDocs = extraAddInSlugs.length
    ? await AddIn.find({ slug: { $in: extraAddInSlugs } }).select('_id')
    : [];
  const addInOptions = extraAddInDocs.map((doc) => ({
    addInId: doc._id,
    maxQuantity: 10,
    included: false,
  }));

  const activeProductSlugs = new Set<string>();

  for (const type of data.types) {
    const productSlug = `acai-bowl-${type.slug}`;
    activeProductSlugs.add(productSlug);
    const sku = `FFB-BOWL-${type.slug.replace(/-/g, '').toUpperCase().slice(0, 12)}`;

    await Product.findOneAndUpdate(
      { slug: productSlug },
      {
        $set: {
          slug: productSlug,
          sku,
          name: loc(type.name),
          shortDescription: loc(type.description ?? ''),
          basePrice: dollarsToCents(type.price),
          images: type.image ? [{ url: type.image, alt: type.name }] : undefined,
          productType: 'single',
          categoryId: category?._id,
          addInOptions,
          status: type.hidden ? 'archived' : 'published',
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  for (const type of otherData.types) {
    if (type.hidden) continue;
    await Product.findOneAndUpdate(
      { slug: `acai-bowl-${type.slug}` },
      { $set: { addInOptions } }
    );
  }

  if (category) {
    await Product.updateMany(
      {
        categoryId: category._id,
        slug: { $regex: /^acai-bowl-/, $nin: [...activeProductSlugs] },
      },
      { $set: { status: 'archived' } }
    );
  }
}

async function syncProteinCoffee(data: ProteinCoffeeCatalogData) {
  const main = data.mainImages[0];
  const variants = data.sizes.map((size) => ({
    sku: `FFB-PCOF-${size.slug.toUpperCase()}`,
    name: loc(size.name),
    price: dollarsToCents(size.price),
    inventory: 0,
    attributes: { size: size.slug },
  }));

  const catalogAddIns = [...data.addOns, ...data.formula1Flavors];
  const catalogSlugs = catalogAddIns.map((item) => item.slug);

  await syncAddIns(catalogAddIns, 'protein-coffee');

  if (catalogSlugs.length > 0) {
    await AddIn.updateMany(
      { category: 'protein-coffee', slug: { $nin: catalogSlugs } },
      { $set: { status: 'archived' } }
    );
  }

  const visibleSlugs = catalogAddIns.filter((item) => !item.hidden).map((item) => item.slug);
  const addInDocs = visibleSlugs.length
    ? await AddIn.find({ category: 'protein-coffee', slug: { $in: visibleSlugs } }).select('_id slug')
    : [];

  const slugOrder = new Map(visibleSlugs.map((slug, index) => [slug, index]));
  addInDocs.sort(
    (a, b) => (slugOrder.get(a.slug) ?? 0) - (slugOrder.get(b.slug) ?? 0)
  );

  await Product.findOneAndUpdate(
    { slug: PROTEIN_COFFEE_PRODUCT_SLUG },
    {
      $set: {
        images: main ? [{ url: main.url, alt: main.alt ?? 'Protein coffee' }] : undefined,
        basePrice: dollarsToCents(data.sizes[0]?.price ?? 6.99),
        variants,
        addInOptions: addInDocs.map((doc) => ({
          addInId: doc._id,
          maxQuantity: 5,
        })),
      },
    }
  );

  const coffeeFlavorSlugs = data.flavors.map((flavor) => flavor.slug);
  for (const flavor of data.flavors) {
    await Flavor.findOneAndUpdate(
      { slug: flavor.slug },
      {
        $set: {
          slug: flavor.slug,
          name: loc(flavor.name),
          category: 'protein-coffee',
          color: '#6F4E37',
          description: loc(''),
          image: flavor.image ? { url: flavor.image, alt: flavor.name } : undefined,
          status: flavor.hidden ? 'archived' : 'published',
        },
      },
      { upsert: true }
    );
  }
  if (coffeeFlavorSlugs.length > 0) {
    await Flavor.updateMany(
      { category: 'protein-coffee', slug: { $nin: coffeeFlavorSlugs } },
      { $set: { status: 'archived' } }
    );
  }
}

async function syncProteinShakes(data: ProteinShakesCatalogData) {
  const variants = data.sizes
    .filter((size) => !size.hidden)
    .map((size) => ({
      sku: proteinShakeVariantSku(size.slug),
      name: loc(size.name),
      price: dollarsToCents(size.price),
      inventory: 0,
      attributes: { size: size.slug },
    }))
    .filter((variant) => variant.sku);

  const catalogSlugs = data.addOns.map((item) => item.slug);
  await syncAddIns(data.addOns, 'protein-shakes');

  if (catalogSlugs.length > 0) {
    await AddIn.updateMany(
      { category: 'protein-shakes', slug: { $nin: catalogSlugs } },
      { $set: { status: 'archived' } }
    );
  }

  const visibleSlugs = data.addOns.filter((item) => !item.hidden).map((item) => item.slug);
  const addInDocs = visibleSlugs.length
    ? await AddIn.find({ category: 'protein-shakes', slug: { $in: visibleSlugs } }).select('_id slug')
    : [];

  const slugOrder = new Map(visibleSlugs.map((slug, index) => [slug, index]));
  addInDocs.sort((a, b) => (slugOrder.get(a.slug) ?? 0) - (slugOrder.get(b.slug) ?? 0));

  await Product.findOneAndUpdate(
    { slug: PROTEIN_SHAKE_PRODUCT_SLUG },
    {
      $set: {
        images: data.heroImage?.url
          ? [{ url: data.heroImage.url, alt: data.heroImage.alt ?? 'Protein shakes' }]
          : undefined,
        variants,
        basePrice: dollarsToCents(data.sizes[0]?.price ?? 8.9),
        addInOptions: addInDocs.map((doc) => ({
          addInId: doc._id,
          maxQuantity: 5,
        })),
      },
    }
  );

  const shakeFlavorSlugs = data.flavors.map((flavor) => flavor.slug);
  for (const flavor of data.flavors) {
    await Flavor.findOneAndUpdate(
      { slug: flavor.slug },
      {
        $set: {
          slug: flavor.slug,
          name: loc(flavor.name),
          category: 'protein-shakes',
          color: '#2EC4B6',
          description: loc(''),
          image: flavor.image ? { url: flavor.image, alt: flavor.name } : undefined,
          status: flavor.hidden ? 'archived' : 'published',
        },
      },
      { upsert: true }
    );
  }
  if (shakeFlavorSlugs.length > 0) {
    await Flavor.updateMany(
      { category: 'protein-shakes', slug: { $nin: shakeFlavorSlugs } },
      { $set: { status: 'archived' } }
    );
  }
}

async function syncWaffles(data: WafflesCatalogData) {
  const waffleCategory = await ProductCategory.findOne({ slug: 'waffles' });
  const activePresetSlugs = data.presets.map((preset) => `waffle-${preset.slug}`);

  for (const preset of data.presets) {
    const slug = `waffle-${preset.slug}`;
    const skuBase = preset.slug.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12) || 'CUSTOM';
    const productSku = `FFB-WAFL-${skuBase}`;
    const variantSku = `${productSku}-STD`;
    const priceCents = dollarsToCents(preset.price);

    await Product.findOneAndUpdate(
      { slug },
      {
        $set: {
          name: loc(preset.name),
          shortDescription: loc(preset.description ?? ''),
          basePrice: priceCents,
          images: preset.image ? [{ url: preset.image, alt: preset.name }] : undefined,
          status: preset.hidden ? 'archived' : 'published',
          variants: [
            {
              sku: variantSku,
              name: loc('Standard'),
              price: priceCents,
              inventory: 0,
            },
          ],
        },
        $setOnInsert: {
          slug,
          sku: productSku,
          productType: 'single',
          categoryId: waffleCategory?._id,
        },
      },
      { upsert: true }
    );
  }

  await Product.updateMany(
    {
      $and: [
        { slug: { $regex: /^waffle-/ } },
        { slug: { $nin: [...activePresetSlugs, 'waffle-build-your-own'] } },
      ],
    },
    { $set: { status: 'archived' } }
  );

  const cyo = data.buildYourOwn;
  const catalogSlugs = cyo.extraToppings.map((row) => waffleExtraModifierSlug(row.name));

  for (const row of cyo.extraToppings) {
    const slug = waffleExtraModifierSlug(row.name);
    const priceDollars = cyo.uniformExtraToppingPrice ? cyo.extraToppingPrice : row.price;
    await AddIn.findOneAndUpdate(
      { slug },
      {
        $set: {
          slug,
          name: loc(`Extra Waffle Topping — ${row.name}`),
          description: loc(`Extra ${row.name} for protein waffles.`),
          price: dollarsToCents(priceDollars),
          category: 'waffle-extra-topping',
          status: row.hidden ? 'archived' : 'published',
        },
      },
      { upsert: true }
    );
  }

  if (catalogSlugs.length > 0) {
    await AddIn.updateMany(
      { category: 'waffle-extra-topping', slug: { $nin: catalogSlugs } },
      { $set: { status: 'archived' } }
    );
  }

  const visibleSlugs = cyo.extraToppings
    .filter((row) => !row.hidden)
    .map((row) => waffleExtraModifierSlug(row.name));
  const addInDocs = visibleSlugs.length
    ? await AddIn.find({ category: 'waffle-extra-topping', slug: { $in: visibleSlugs } }).select(
        '_id slug'
      )
    : [];

  const slugOrder = new Map(visibleSlugs.map((slug, index) => [slug, index]));
  addInDocs.sort((a, b) => (slugOrder.get(a.slug) ?? 0) - (slugOrder.get(b.slug) ?? 0));

  await Product.findOneAndUpdate(
    { slug: 'waffle-build-your-own' },
    {
      $set: {
        name: loc(cyo.name),
        shortDescription: loc(cyo.description ?? ''),
        basePrice: dollarsToCents(cyo.price),
        images: cyo.image ? [{ url: cyo.image, alt: cyo.name }] : undefined,
        status: cyo.hidden ? 'archived' : 'published',
        addInOptions: addInDocs.map((doc) => ({
          addInId: doc._id,
          maxQuantity: 10,
          included: false,
        })),
      },
    }
  );
}

async function syncProteinTreats(data: ProteinTreatsCatalogData) {
  const truffleProduct = await Product.findOne({ slug: 'protein-truffles' }).select('sku');
  const truffleSku = truffleProduct?.sku ?? 'FFB-TRET-001';

  const truffleVariants = data.truffles.packs
    .filter((p) => !p.hidden)
    .map((pack) => ({
      sku: `${truffleSku}-${pack.slug.toUpperCase()}`,
      name: loc(pack.label),
      price: dollarsToCents(pack.price),
      inventory: 0,
    }));

  await Product.findOneAndUpdate(
    { slug: 'protein-truffles' },
    {
      $set: {
        name: loc(data.truffles.name),
        shortDescription: loc(data.truffles.description ?? ''),
        images: data.truffles.image ? [{ url: data.truffles.image, alt: data.truffles.name }] : undefined,
        variants: truffleVariants,
        basePrice: dollarsToCents(data.truffles.packs[0]?.price ?? 3),
        status: data.truffles.hidden ? 'archived' : 'published',
      },
    }
  );

  const donutProduct = await Product.findOne({ slug: 'protein-mini-donuts' }).select('sku');
  const donutSku = donutProduct?.sku ?? 'FFB-TRET-002';
  const donutPackCount = data.miniDonuts.packCount > 0 ? data.miniDonuts.packCount : 4;

  await Product.findOneAndUpdate(
    { slug: 'protein-mini-donuts' },
    {
      $set: {
        name: loc(data.miniDonuts.name),
        shortDescription: loc(data.miniDonuts.description ?? ''),
        basePrice: dollarsToCents(data.miniDonuts.packPrice),
        images: data.miniDonuts.image ? [{ url: data.miniDonuts.image, alt: data.miniDonuts.name }] : undefined,
        status: data.miniDonuts.hidden ? 'archived' : 'published',
        variants: [
          {
            sku: `${donutSku}-${donutPackCount}PK`,
            name: loc(`${donutPackCount} pack`),
            price: dollarsToCents(data.miniDonuts.packPrice),
            inventory: 0,
          },
        ],
      },
    }
  );

  const pieProduct = await Product.findOne({ slug: 'pie-in-a-cup' }).select('sku');
  const pieSku = pieProduct?.sku ?? 'FFB-TRET-003';

  const pieVariants = data.pieInACup.sizes
    .filter((size) => !size.hidden)
    .map((size) => ({
      sku: `${pieSku}-${pieSizeVariantSuffix(size.slug)}`,
      name: loc(size.name),
      price: dollarsToCents(size.price),
      inventory: 0,
    }));

  await Product.findOneAndUpdate(
    { slug: 'pie-in-a-cup' },
    {
      $set: {
        name: loc(data.pieInACup.name),
        shortDescription: loc(data.pieInACup.description ?? ''),
        images: data.pieInACup.mainImage
          ? [{ url: data.pieInACup.mainImage, alt: data.pieInACup.name }]
          : undefined,
        variants: pieVariants,
        basePrice: dollarsToCents(data.pieInACup.sizes[0]?.price ?? 4.99),
        status: data.pieInACup.hidden ? 'archived' : 'published',
      },
    }
  );

  const pieFlavorSlugs = data.pieInACup.flavors.map((flavor) => `pie-${flavor.slug}`);
  for (const flavor of data.pieInACup.flavors) {
    await Flavor.findOneAndUpdate(
      { slug: `pie-${flavor.slug}` },
      {
        $set: {
          slug: `pie-${flavor.slug}`,
          name: loc(flavor.name),
          category: 'protein-treats',
          color: '#FFD166',
          description: loc(''),
          image: flavor.image ? { url: flavor.image, alt: flavor.name } : undefined,
          status: flavor.hidden ? 'archived' : 'published',
        },
      },
      { upsert: true }
    );
  }
  if (pieFlavorSlugs.length > 0) {
    await Flavor.updateMany(
      {
        $and: [
          { category: 'protein-treats' },
          { slug: { $regex: /^pie-/ } },
          { slug: { $nin: pieFlavorSlugs } },
        ],
      },
      { $set: { status: 'archived' } }
    );
  }

  const donutFlavorSlugs = data.miniDonuts.flavors.map((f) => `donut-${f.slug}`);
  for (const flavor of data.miniDonuts.flavors) {
    await Flavor.findOneAndUpdate(
      { slug: `donut-${flavor.slug}` },
      {
        $set: {
          slug: `donut-${flavor.slug}`,
          name: loc(flavor.name),
          category: 'protein-treats',
          color: '#F4A261',
          description: loc(''),
          image: flavor.image ? { url: flavor.image, alt: flavor.name } : undefined,
          status: flavor.hidden ? 'archived' : 'published',
        },
      },
      { upsert: true }
    );
  }
  if (donutFlavorSlugs.length > 0) {
    await Flavor.updateMany(
      {
        $and: [
          { category: 'protein-treats' },
          { slug: { $regex: /^donut-/ } },
          { slug: { $nin: donutFlavorSlugs } },
        ],
      },
      { $set: { status: 'archived' } }
    );
  }
}

export async function syncMenuCatalogToDatabase<S extends MenuCatalogCategorySlug>(
  categorySlug: S,
  data: MenuCatalogDataBySlug[S]
): Promise<void> {
  await connectDB();

  switch (categorySlug) {
    case 'mega-teas':
      await syncMegaTeas(data as MegaTeasCatalogData);
      break;
    case 'acai-bowls':
    case 'protein-bowls':
      await syncBowlCategory(categorySlug, data as BowlCategoryCatalogData);
      break;
    case 'protein-coffee':
      await syncProteinCoffee(data as ProteinCoffeeCatalogData);
      break;
    case 'protein-shakes':
      await syncProteinShakes(data as ProteinShakesCatalogData);
      break;
    case 'waffles':
      await syncWaffles(data as WafflesCatalogData);
      break;
    case 'protein-treats':
      await syncProteinTreats(data as ProteinTreatsCatalogData);
      break;
    default:
      break;
  }

  await revalidateStorefrontCatalog();
}
