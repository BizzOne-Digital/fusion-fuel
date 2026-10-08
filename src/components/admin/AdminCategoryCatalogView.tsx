import Link from 'next/link';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  type AdminCatalogEntry,
  type PublishedAdminProduct,
  adminProductsCategoryHref,
  formatUsd,
  listAdminCategoryEntries,
  MAKE_YOUR_OWN_LOADED_TEA_MENU,
  megaTeaKitCollectionDetail,
  megaTeaKitCollectionFlavorNames,
  MEGA_TEA_KITS_MENU,
  formatCents,
} from '@/lib/admin/category-catalog';
import { LOADED_TEAS_MENU_VIEWS } from '@/lib/make-your-own-loaded-tea-menu';
import { BULK_PRODUCTS_MENU } from '@/lib/bulk-products-menu';
import { MONTHLY_TEA_CLUB_MENU } from '@/lib/monthly-tea-club-menu';
import { richTextToPlainText } from '@/lib/utils';
import CategoryMenuAdmin from '@/components/admin/menu-catalog/CategoryMenuAdmin';
import { isMenuCatalogCategorySlug } from '@/lib/menu-catalog/defaults';

type CategoryInfo = {
  slug: string;
  name: { en: string };
};

interface AdminCategoryCatalogViewProps {
  category: CategoryInfo;
  /** URL slug for back links (may differ from catalog slug, e.g. loaded-teas vs mega-teas). */
  browseSlug?: string;
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
  browseSlug,
  path,
  publishedProducts,
}: AdminCategoryCatalogViewProps) {
  const urlSlug = browseSlug ?? category.slug;
  const entries = listAdminCategoryEntries(category.slug, publishedProducts, urlSlug);
  const base = adminProductsCategoryHref(urlSlug);

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

  if (isMenuCatalogCategorySlug(category.slug)) {
    if (category.slug === 'mega-teas') {
      if (
        path[0] === LOADED_TEAS_MENU_VIEWS.loadedTeas ||
        path[0] === MAKE_YOUR_OWN_LOADED_TEA_MENU.slug
      ) {
        return (
          <CategoryMenuAdmin
            categorySlug={category.slug}
            browseSlug={urlSlug}
            path={path}
            categoryName={category.name.en}
          />
        );
      }
    } else if (path[0] === 'manage') {
      return (
        <CategoryMenuAdmin
          categorySlug={category.slug}
          browseSlug={urlSlug}
          path={path}
          categoryName={category.name.en}
        />
      );
    }
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
