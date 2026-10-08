import connectDB from '@/lib/mongodb';
import { LOADED_TEA_PRODUCT_SLUG } from '@/lib/loaded-teas-menu';
import { myoltProductSlug } from '@/lib/make-your-own-loaded-tea-menu';
import { PROTEIN_COFFEE_PRODUCT_SLUG } from '@/lib/protein-coffee-menu';
import { PROTEIN_SHAKE_PRODUCT_SLUG } from '@/lib/protein-shakes-menu';
import { acaiBowlModifierSlug } from '@/lib/acai-bowls-menu';
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

  for (const extra of data.extraToppings) {
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

  for (const type of data.types) {
    const productSlug = `acai-bowl-${type.slug}`;
    await Product.findOneAndUpdate(
      { slug: productSlug },
      {
        $set: {
          name: loc(type.name),
          shortDescription: loc(type.description ?? ''),
          basePrice: dollarsToCents(type.price),
          images: type.image ? [{ url: type.image, alt: type.name }] : undefined,
          status: type.hidden ? 'archived' : 'published',
        },
      }
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

  await Product.findOneAndUpdate(
    { slug: PROTEIN_COFFEE_PRODUCT_SLUG },
    {
      $set: {
        images: main ? [{ url: main.url, alt: main.alt ?? 'Protein coffee' }] : undefined,
        basePrice: dollarsToCents(data.sizes[0]?.price ?? 6.99),
        variants,
      },
    }
  );

  await syncAddIns([...data.addOns, ...data.formula1Flavors], 'protein-coffee');

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
}

async function syncProteinShakes(data: ProteinShakesCatalogData) {
  const variants = data.sizes.map((size) => ({
    sku: `FFB-SHAKE-${size.slug}`,
    name: loc(size.name),
    price: dollarsToCents(size.price),
    inventory: 0,
  }));

  await Product.findOneAndUpdate(
    { slug: PROTEIN_SHAKE_PRODUCT_SLUG },
    {
      $set: {
        images: data.heroImage?.url
          ? [{ url: data.heroImage.url, alt: data.heroImage.alt ?? 'Protein shakes' }]
          : undefined,
        variants,
        basePrice: dollarsToCents(data.sizes[0]?.price ?? 8.9),
      },
    }
  );

  await syncAddIns(data.addOns, 'protein-shakes');

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
}

async function syncWaffles(data: WafflesCatalogData) {
  for (const preset of data.presets) {
    await Product.findOneAndUpdate(
      { slug: `waffle-${preset.slug}` },
      {
        $set: {
          name: loc(preset.name),
          shortDescription: loc(preset.description ?? ''),
          basePrice: dollarsToCents(preset.price),
          images: preset.image ? [{ url: preset.image, alt: preset.name }] : undefined,
          status: preset.hidden ? 'archived' : 'published',
        },
      }
    );
  }

  const cyo = data.buildYourOwn;
  const extraAddIns = await AddIn.find({ category: 'waffle-extra-topping' }).select('_id');
  await Product.findOneAndUpdate(
    { slug: 'waffle-build-your-own' },
    {
      $set: {
        name: loc(cyo.name),
        shortDescription: loc(cyo.description ?? ''),
        basePrice: dollarsToCents(cyo.price),
        images: cyo.image ? [{ url: cyo.image, alt: cyo.name }] : undefined,
        status: cyo.hidden ? 'archived' : 'published',
        addInOptions: extraAddIns.map((doc) => ({
          addInId: doc._id,
          maxQuantity: 10,
          included: false,
        })),
      },
    }
  );
}

async function syncProteinTreats(data: ProteinTreatsCatalogData) {
  const truffleVariants = data.truffles.packs
    .filter((p) => !p.hidden)
    .map((pack) => ({
      sku: `FFB-TRUFF-${pack.slug.toUpperCase()}`,
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

  await Product.findOneAndUpdate(
    { slug: 'protein-mini-donuts' },
    {
      $set: {
        name: loc(data.miniDonuts.name),
        shortDescription: loc(data.miniDonuts.description ?? ''),
        basePrice: dollarsToCents(data.miniDonuts.packPrice),
        images: data.miniDonuts.image ? [{ url: data.miniDonuts.image, alt: data.miniDonuts.name }] : undefined,
        status: data.miniDonuts.hidden ? 'archived' : 'published',
      },
    }
  );

  const pieVariants = data.pieInACup.sizes.map((size) => ({
    sku: `FFB-PIE-${size.slug.toUpperCase()}`,
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
