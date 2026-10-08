import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductCategory from '@/models/ProductCategory';
import type { PublishedAdminProduct } from '@/lib/admin/category-catalog';
import { ADMIN_CATEGORY_SLUG_ALIASES, isLoadedTeasCategorySlug } from '@/lib/admin/category-slug';

export async function getPublishedCategoryBySlug(slug: string) {
  await connectDB();
  const category = await ProductCategory.findOne({ slug, status: 'published' }).lean();
  if (!category) return null;
  return {
    id: String(category._id),
    slug: category.slug,
    name: category.name as { en: string; es: string },
  };
}

/** Loaded teas may be stored as `mega-teas` or legacy `loaded-teas`. */
export async function getPublishedCategoryForAdminBrowse(slug: string) {
  const direct = await getPublishedCategoryBySlug(slug);
  if (direct) return direct;

  if (!isLoadedTeasCategorySlug(slug)) return null;

  const alternate = slug === 'mega-teas' ? 'loaded-teas' : 'mega-teas';
  return getPublishedCategoryBySlug(alternate);
}

export async function listPublishedCategoriesForAdmin() {
  await connectDB();
  const categories = await ProductCategory.find({ status: 'published' }).sort({ order: 1 }).lean();
  const slugSet = new Set(categories.map((c) => c.slug));

  return categories
    .filter((category) => {
      const canonical = ADMIN_CATEGORY_SLUG_ALIASES[category.slug];
      if (canonical && slugSet.has(canonical)) {
        return false;
      }
      return true;
    })
    .map((category) => ({
        id: String(category._id),
        name: category.name as { en: string },
        slug: category.slug,
        description: category.description as { en: string },
        image: category.image as { url: string; alt: string } | undefined,
      }));
}

export async function listPublishedProductsForCategory(categoryId: string): Promise<PublishedAdminProduct[]> {
  await connectDB();
  const items = await Product.find({ categoryId, status: 'published' })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return mapPublishedAdminProducts(items);
}

export async function listPublishedProductsForCategorySlugs(
  slugs: string[]
): Promise<PublishedAdminProduct[]> {
  await connectDB();
  const categories = await ProductCategory.find({ slug: { $in: slugs }, status: 'published' })
    .select('_id')
    .lean();
  if (categories.length === 0) return [];

  const categoryIds = categories.map((c) => c._id);
  const items = await Product.find({ categoryId: { $in: categoryIds }, status: 'published' })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return mapPublishedAdminProducts(items);
}

function mapPublishedAdminProducts(
  items: Array<{
    _id: unknown;
    slug: string;
    name: unknown;
    shortDescription?: unknown;
    basePrice: number;
    status: string;
    images?: unknown;
  }>
): PublishedAdminProduct[] {
  return items.map((item) => ({
    id: String(item._id),
    slug: item.slug,
    name: item.name as { en: string; es: string },
    shortDescription: item.shortDescription as { en: string },
    basePrice: item.basePrice,
    status: item.status,
    images: item.images as { url: string; alt: string }[],
  }));
}
