import Link from 'next/link';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  type AdminCatalogEntry,
  type PublishedAdminProduct,
  adminProductsCategoryHref,
  formatUsd,
  getMyoltDrink,
  loadedTeaFlavorBySlug,
  loadedTeaFlavorEntries,
  loadedTeaItemImage,
  loadedTeaItemPricingNote,
  listAdminCategoryEntries,
  LOADED_TEAS_MENU,
  LOADED_TEA_PRODUCT_SLUG,
  MAKE_YOUR_OWN_LOADED_TEA_MENU,
  megaTeaKitCollectionDetail,
  megaTeaKitCollectionFlavorNames,
  MEGA_TEA_KITS_MENU,
  myoltAddonRows,
  myoltDrinkEntries,
  PROTEIN_SHAKES_MENU,
  formatCents,
} from '@/lib/admin/category-catalog';
import { LOADED_TEAS_MENU_VIEWS } from '@/lib/make-your-own-loaded-tea-menu';
import { BULK_PRODUCTS_MENU } from '@/lib/bulk-products-menu';
import { MONTHLY_TEA_CLUB_MENU } from '@/lib/monthly-tea-club-menu';
import { richTextToPlainText } from '@/lib/utils';

type CategoryInfo = {
  slug: string;
  name: { en: string };
};

interface AdminCategoryCatalogViewProps {
  category: CategoryInfo;
  path: string[];
  publishedProducts: PublishedAdminProduct[];
}

function CatalogLineList({
  title,
  description,
  backHref,
  entries,
  emptyMessage,
}: {
  title: string;
  description?: string;
  backHref: string;
  entries: AdminCatalogEntry[];
  emptyMessage?: string;
}) {
  return (
    <div>
      <AdminHeader title={title} description={description} />
      <Link href={backHref} className="mb-6 inline-block text-sm font-medium text-orange-600 hover:underline">
        ← Back
      </Link>
      {entries.length === 0 ? (
        <p className="text-zinc-500">{emptyMessage ?? 'No active products in this collection.'}</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
          {entries.map((entry) => (
            <li key={entry.key}>
              <Link
                href={entry.adminHref}
                className="flex items-center gap-4 p-4 transition hover:bg-zinc-50"
              >
                {entry.imageUrl ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                    <Image src={entry.imageUrl} alt="" fill className="object-cover" sizes="56px" />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs text-zinc-500">
                    •••
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900">{entry.title}</p>
                  {entry.description ? (
                    <p className="mt-0.5 line-clamp-2 text-sm text-zinc-600">{entry.description}</p>
                  ) : null}
                </div>
                <span className="shrink-0 text-sm font-semibold text-orange-600">Open →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EditDbProductLink({ productId }: { productId?: string }) {
  if (!productId) return null;
  return (
    <Link
      href={`/admin/products/${productId}`}
      className="inline-flex rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
    >
      Edit product in admin
    </Link>
  );
}

function DbProductDetail({
  category,
  product,
}: {
  category: CategoryInfo;
  product: PublishedAdminProduct;
}) {
  const image = product.images?.[0];
  return (
    <div>
      <AdminHeader title={product.name.en} description={`SKU · ${product.slug}`} />
      <Link
        href={adminProductsCategoryHref(category.slug)}
        className="mb-4 inline-block text-sm font-medium text-orange-600 hover:underline"
      >
        ← Back to {category.name.en}
      </Link>
      <div className="mb-6 flex flex-wrap gap-3">
        <EditDbProductLink productId={product.id} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {image?.url ? (
          <div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
            <Image src={image.url} alt={image.alt || product.name.en} fill className="object-cover" sizes="240px" />
          </div>
        ) : null}
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
          <p>
            <span className="text-sm text-zinc-500">Price</span>
            <br />
            <span className="text-lg font-semibold">{formatCents(product.basePrice)}</span>
          </p>
          {product.shortDescription?.en ? (
            <p>
              <span className="text-sm text-zinc-500">Description</span>
              <br />
              <span className="text-zinc-800">{richTextToPlainText(product.shortDescription.en)}</span>
            </p>
          ) : null}
          <p className="text-sm text-zinc-500">Status: published (active)</p>
        </div>
      </div>
    </div>
  );
}

function LoadedTeasCollectionDetail({
  category,
  dbProductId,
}: {
  category: CategoryInfo;
  dbProductId?: string;
}) {
  const flavors = loadedTeaFlavorEntries(category.slug);
  return (
    <div>
      <AdminHeader
        title={LOADED_TEAS_MENU.headline}
        description="All menu flavors with sizes and pricing. Only active (published) items are listed."
      />
      <Link
        href={adminProductsCategoryHref(category.slug)}
        className="mb-4 inline-block text-sm font-medium text-orange-600 hover:underline"
      >
        ← Back to {category.name.en}
      </Link>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <EditDbProductLink productId={dbProductId} />
      </div>
      <div className="mb-8 grid gap-4 rounded-xl border border-zinc-200 bg-white p-6 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-zinc-500">Sizes</p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-800">
            {LOADED_TEAS_MENU.sizes.map((size) => (
              <li key={size.slug}>
                {size.name}: {formatUsd(size.price)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-500">Optional add-ons</p>
          <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-sm text-zinc-800">
            {LOADED_TEAS_MENU.optionalAddOns.map((addon) => (
              <li key={addon.slug}>
                {addon.name} — {formatUsd(addon.price)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mb-3 text-sm font-semibold text-zinc-700">Flavors ({flavors.length})</p>
      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
        {flavors.map((entry) => (
          <li key={entry.key}>
            <Link
              href={entry.adminHref}
              className="flex items-center gap-4 p-4 transition hover:bg-zinc-50"
            >
              {entry.imageUrl ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  <Image src={entry.imageUrl} alt="" fill className="object-cover" sizes="48px" />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-900">{entry.title}</p>
                <p className="line-clamp-1 text-sm text-zinc-600">{entry.description}</p>
              </div>
              <span className="text-sm text-orange-600">Details →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LoadedTeaFlavorDetail({
  category,
  flavorSlug,
}: {
  category: CategoryInfo;
  flavorSlug: string;
}) {
  const item = loadedTeaFlavorBySlug(flavorSlug);
  if (!item) {
    return (
      <p className="text-zinc-500">
        Flavor not found.{' '}
        <Link href={adminProductsCategoryHref(category.slug)} className="text-orange-600 hover:underline">
          Back
        </Link>
      </p>
    );
  }
  const image = loadedTeaItemImage(item);
  const backHref = `${adminProductsCategoryHref(category.slug)}/${LOADED_TEAS_MENU_VIEWS.loadedTeas}`;

  return (
    <div>
      <AdminHeader title={item.name} description={loadedTeaItemPricingNote(item.slug)} />
      <Link href={backHref} className="mb-6 inline-block text-sm font-medium text-orange-600 hover:underline">
        ← Back to loaded teas
      </Link>
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        {image ? (
          <div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-200">
            <Image src={image.url} alt={image.alt} fill className="object-cover" sizes="200px" />
          </div>
        ) : null}
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-800">
          <p>
            <span className="font-medium text-zinc-500">Ingredients</span>
            <br />
            {item.ingredients.join(', ')}
          </p>
          <p>
            <span className="font-medium text-zinc-500">Sizes &amp; price</span>
            <ul className="mt-1 list-disc pl-5">
              {LOADED_TEAS_MENU.sizes.map((size) => (
                <li key={size.slug}>
                  {size.name}: {formatUsd(size.price)} ({loadedTeaItemPricingNote(item.slug)})
                </li>
              ))}
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
}

function MyoltCollectionDetail({ category }: { category: CategoryInfo }) {
  const drinks = myoltDrinkEntries(category.slug);
  return (
    <CatalogLineList
      title={MAKE_YOUR_OWN_LOADED_TEA_MENU.headline}
      description={MAKE_YOUR_OWN_LOADED_TEA_MENU.description}
      backHref={adminProductsCategoryHref(category.slug)}
      entries={drinks}
      emptyMessage="No drink styles configured."
    />
  );
}

function MyoltDrinkDetail({ category, drinkSlug }: { category: CategoryInfo; drinkSlug: string }) {
  const drink = getMyoltDrink(drinkSlug);
  const backHref = `${adminProductsCategoryHref(category.slug)}/${MAKE_YOUR_OWN_LOADED_TEA_MENU.slug}`;

  if (!drink) {
    return (
      <p className="text-zinc-500">
        Drink not found.{' '}
        <Link href={backHref} className="text-orange-600 hover:underline">Back</Link>
      </p>
    );
  }

  const addons = myoltAddonRows(drink.optionalAddons);

  return (
    <div>
      <AdminHeader
        title={drink.name}
        description={`${formatUsd(drink.price)} · ${drink.includedSummary}`}
      />
      <Link href={backHref} className="mb-6 inline-block text-sm font-medium text-orange-600 hover:underline">
        ← Back to drink styles
      </Link>
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        {drink.websiteNotice}
      </div>
      <div className="mb-8 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-800">Required choices</h3>
        {drink.requiredGroups.map((group) => (
          <div key={group.id} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="font-medium text-zinc-900">{group.title}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {group.multiSelect ? 'Multi-select' : 'Single select'}
              {group.includedCount != null ? ` · ${group.includedCount} included` : ''}
              {group.extraSelectionPrice != null
                ? ` · +${formatUsd(group.extraSelectionPrice)} per extra`
                : ''}
            </p>
            <p className="mt-2 text-sm text-zinc-700">{group.options.join(' · ')}</p>
          </div>
        ))}
      </div>
      <h3 className="mb-3 text-sm font-semibold text-zinc-800">Optional add-ons</h3>
      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
        {addons.map((addon) => (
          <li key={addon.key} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-zinc-900">{addon.label}</p>
              {addon.flavorOptions?.length ? (
                <p className="text-sm text-zinc-600">Flavors: {addon.flavorOptions.join(', ')}</p>
              ) : null}
            </div>
            <p className="font-semibold text-zinc-800">{formatUsd(addon.price)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProteinShakesDetail({
  category,
  dbProductId,
}: {
  category: CategoryInfo;
  dbProductId?: string;
}) {
  return (
    <div>
      <AdminHeader title={PROTEIN_SHAKES_MENU.headline} description={PROTEIN_SHAKES_MENU.servingNote} />
      <Link
        href={adminProductsCategoryHref(category.slug)}
        className="mb-4 inline-block text-sm font-medium text-orange-600 hover:underline"
      >
        ← Back to {category.name.en}
      </Link>
      <EditDbProductLink productId={dbProductId} />
      <div className="mt-6 mb-4 grid gap-4 sm:grid-cols-2">
        {PROTEIN_SHAKES_MENU.sizes.map((size) => (
          <div key={size.slug} className="rounded-lg border border-zinc-200 bg-white p-4 text-sm">
            <span className="font-semibold">{size.name}</span> — {formatUsd(size.price)}
          </div>
        ))}
      </div>
      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
        {PROTEIN_SHAKES_MENU.items.map((item) => (
          <li key={item.slug} className="flex items-center gap-4 p-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
            </div>
            <p className="font-medium text-zinc-900">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MegaTeaKitBuilderDetail({
  category,
  dbProductId,
}: {
  category: CategoryInfo;
  dbProductId?: string;
}) {
  return (
    <div>
      <AdminHeader title="Make Your Own Mega Tea Kit" description={MEGA_TEA_KITS_MENU.description} />
      <Link
        href={adminProductsCategoryHref(category.slug)}
        className="mb-4 inline-block text-sm font-medium text-orange-600 hover:underline"
      >
        ← Back
      </Link>
      <EditDbProductLink productId={dbProductId} />
      <p className="mt-4 text-lg font-semibold">{formatUsd(MEGA_TEA_KITS_MENU.price)} base kit</p>
      <ul className="mt-4 list-disc pl-5 text-sm text-zinc-700">
        {MEGA_TEA_KITS_MENU.optionalAddOns.map((a) => (
          <li key={a.slug}>{a.name} — {formatUsd(a.price)}</li>
        ))}
      </ul>
    </div>
  );
}

function MegaTeaKitCollectionAdminDetail({
  category,
  productSlug,
  dbProductId,
}: {
  category: CategoryInfo;
  productSlug: string;
  dbProductId?: string;
}) {
  const collection = megaTeaKitCollectionDetail(productSlug);
  if (!collection) {
    return <p className="text-zinc-500">Collection not found.</p>;
  }
  const flavorNames = megaTeaKitCollectionFlavorNames(collection.collectionSlug);

  return (
    <div>
      <AdminHeader title={collection.name} description={collection.description} />
      <Link
        href={adminProductsCategoryHref(category.slug)}
        className="mb-4 inline-block text-sm font-medium text-orange-600 hover:underline"
      >
        ← Back
      </Link>
      <EditDbProductLink productId={dbProductId} />
      <p className="mt-6 text-sm font-semibold text-zinc-700">Flavor enhancers ({flavorNames.length})</p>
      <p className="mt-2 rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-800">
        {flavorNames.join(' · ')}
      </p>
    </div>
  );
}

function StaticInfoDetail({
  title,
  description,
  category,
  imageUrl,
}: {
  title: string;
  description: string;
  category: CategoryInfo;
  imageUrl?: string;
}) {
  return (
    <div>
      <AdminHeader title={title} description={description} />
      <Link
        href={adminProductsCategoryHref(category.slug)}
        className="mb-6 inline-block text-sm font-medium text-orange-600 hover:underline"
      >
        ← Back
      </Link>
      {imageUrl ? (
        <div className="relative mb-6 aspect-[16/10] max-w-xl overflow-hidden rounded-xl border border-zinc-200">
          <Image src={imageUrl} alt="" fill className="object-cover" sizes="640px" />
        </div>
      ) : null}
      <p className="text-sm text-zinc-700">{description}</p>
    </div>
  );
}

export default function AdminCategoryCatalogView({
  category,
  path,
  publishedProducts,
}: AdminCategoryCatalogViewProps) {
  const entries = listAdminCategoryEntries(category.slug, publishedProducts);
  const base = adminProductsCategoryHref(category.slug);

  if (path.length === 0) {
    return (
      <CatalogLineList
        title={category.name.en}
        description="Active products in this collection (archived and draft items are hidden)."
        backHref="/admin/products"
        entries={entries}
      />
    );
  }

  if (path[0] === 'db' && path[1]) {
    const product = publishedProducts.find((p) => p.id === path[1]);
    if (!product) {
      return (
        <p className="text-zinc-500">
          Product not found or not active.{' '}
          <Link href={base} className="text-orange-600 hover:underline">Back</Link>
        </p>
      );
    }
    return <DbProductDetail category={category} product={product} />;
  }

  if (category.slug === 'mega-teas') {
    if (path[0] === LOADED_TEAS_MENU_VIEWS.loadedTeas) {
      if (path.length === 1) {
        const dbId = publishedProducts.find((p) => p.slug === LOADED_TEA_PRODUCT_SLUG)?.id;
        return <LoadedTeasCollectionDetail category={category} dbProductId={dbId} />;
      }
      return <LoadedTeaFlavorDetail category={category} flavorSlug={path[1]} />;
    }
    if (path[0] === MAKE_YOUR_OWN_LOADED_TEA_MENU.slug) {
      if (path.length === 1) return <MyoltCollectionDetail category={category} />;
      return <MyoltDrinkDetail category={category} drinkSlug={path[1]} />;
    }
  }

  if (category.slug === 'protein-shakes' && path[0]) {
    const dbId = publishedProducts.find((p) => p.slug === path[0])?.id;
    return <ProteinShakesDetail category={category} dbProductId={dbId} />;
  }

  if (category.slug === 'mega-tea-kits') {
    if (path[0] === 'mega-tea-kit-builder') {
      const dbId = publishedProducts.find((p) => p.slug === path[0])?.id;
      return <MegaTeaKitBuilderDetail category={category} dbProductId={dbId} />;
    }
    const collectionEntry = entries.find((e) => e.key === path[0]);
    if (collectionEntry) {
      return (
        <MegaTeaKitCollectionAdminDetail
          category={category}
          productSlug={path[0]}
          dbProductId={collectionEntry.dbProductId}
        />
      );
    }
  }

  if (category.slug === BULK_PRODUCTS_MENU.slug && path[0] === BULK_PRODUCTS_MENU.slug) {
    return (
      <StaticInfoDetail
        title={BULK_PRODUCTS_MENU.headline}
        description={BULK_PRODUCTS_MENU.description}
        category={category}
        imageUrl={BULK_PRODUCTS_MENU.image.url}
      />
    );
  }

  if (category.slug === MONTHLY_TEA_CLUB_MENU.slug && path[0] === MONTHLY_TEA_CLUB_MENU.slug) {
    return (
      <StaticInfoDetail
        title={MONTHLY_TEA_CLUB_MENU.headline}
        description={MONTHLY_TEA_CLUB_MENU.description}
        category={category}
      />
    );
  }

  const bySlug = publishedProducts.find((p) => p.slug === path[0] || p.id === path[0]);
  if (bySlug) {
    return <DbProductDetail category={category} product={bySlug} />;
  }

  return (
    <p className="text-zinc-500">
      Page not found.{' '}
      <Link href={base} className="text-orange-600 hover:underline">Back to collection</Link>
    </p>
  );
}
