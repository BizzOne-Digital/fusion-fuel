import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductCategory from '@/models/ProductCategory';
import Flavor from '@/models/Flavor';
import AddIn from '@/models/AddIn';
import { serializeForClient } from '@/lib/utils';
import type { IProduct } from '@/models/Product';
import type { IProductCategory } from '@/models/ProductCategory';
import type { IFlavor } from '@/models/Flavor';
import type { IAddIn } from '@/models/AddIn';

export async function getPublishedProducts(options?: {
  featured?: boolean;
  categorySlug?: string;
  productType?: string;
  limit?: number;
}): Promise<IProduct[]> {
  try {
    await connectDB();
    const query: Record<string, unknown> = { status: 'published' };

    if (options?.featured) query.featured = true;
    if (options?.productType) query.productType = options.productType;

    if (options?.categorySlug) {
      const category = await ProductCategory.findOne({
        slug: options.categorySlug,
        status: 'published',
      }).lean();
      if (category) {
        query.categoryId = category._id;
      }
    }

    let q = Product.find(query).sort({ order: 1, createdAt: -1 });
    if (options?.limit) q = q.limit(options.limit);
    return serializeForClient(await q.lean<IProduct[]>());
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<IProduct | null> {
  try {
    await connectDB();
    const product = await Product.findOne({ slug, status: 'published' }).lean<IProduct>();
    return product ? serializeForClient(product) : null;
  } catch {
    return null;
  }
}

export async function getPublishedCategories(): Promise<IProductCategory[]> {
  try {
    await connectDB();
    return serializeForClient(
      await ProductCategory.find({ status: 'published' }).sort({ order: 1 }).lean<IProductCategory[]>()
    );
  } catch {
    return [];
  }
}

export async function getPublishedFlavors(limit = 250): Promise<IFlavor[]> {
  try {
    await connectDB();
    return serializeForClient(
      await Flavor.find({ status: 'published' }).sort({ order: 1 }).limit(limit).lean<IFlavor[]>()
    );
  } catch {
    return [];
  }
}

export async function getPublishedAddIns(): Promise<IAddIn[]> {
  try {
    await connectDB();
    return serializeForClient(await AddIn.find({ status: 'published' }).sort({ order: 1 }).lean<IAddIn[]>());
  } catch {
    return [];
  }
}

export async function getKitProducts(): Promise<IProduct[]> {
  return getPublishedProducts({ productType: 'kit' });
}
