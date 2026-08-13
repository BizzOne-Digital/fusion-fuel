import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parsePagination, parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { productFormSchema } from '@/lib/validators/product';
import Product from '@/models/Product';
import type { ContentStatus, DietaryTag } from '@/types';

function mapProductInput(data: ReturnType<typeof productFormSchema.parse>) {
  return {
    name: data.name,
    slug: data.slug,
    sku: data.sku.toUpperCase(),
    shortDescription: data.shortDescription,
    description: data.fullDescription,
    productType: data.productType,
    categoryId: data.categoryId ? toObjectId(data.categoryId) : undefined,
    images: data.images,
    basePrice: data.price ?? 0,
    compareAtPrice: data.compareAtPrice,
    variants: data.variants ?? [],
    kitSizes: data.kitSizes ?? [],
    inventory: {
      trackInventory: data.trackInventory,
      quantity: data.inventory ?? 0,
      lowStockThreshold: data.lowStockThreshold ?? 5,
      allowBackorder: false,
    },
    dietaryTags: (data.dietaryTags ?? []) as DietaryTag[],
    status: data.status,
    featured: data.featured,
    order: data.displayOrder,
  };
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const status = searchParams.get('status');
    const q = searchParams.get('q');
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status as ContentStatus;
    if (q) {
      filter.$or = [
        { 'name.en': { $regex: q, $options: 'i' } },
        { sku: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Product.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return jsonOk({
      items: items.map((item) => ({ ...item, id: String(item._id) })),
      pagination: { page, limit, total },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const parsed = productFormSchema.parse(await parseJsonBody(request));
    const product = await Product.create(mapProductInput(parsed));

    await writeAuditLog({
      action: 'create',
      entityType: 'product',
      entityId: product._id,
      userId: session.user.id,
    });

    return jsonOk({ item: serializeDoc(product) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
