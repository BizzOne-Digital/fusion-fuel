import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductCategory from '@/models/ProductCategory';
import type { PublishedAdminProduct } from '@/lib/admin/category-catalog';

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

export async function listPublishedCategoriesForAdmin() {
  await connectDB();
  const categories = await ProductCategory.find({ status: 'published' }).sort({ order: 1 }).lean();
  return categories.map((category) => ({
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
