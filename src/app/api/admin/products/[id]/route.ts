import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { productFormSchema } from '@/lib/validators/product';
import Product from '@/models/Product';
import type { DietaryTag } from '@/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

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

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const product = await Product.findById(toObjectId(id)).populate('categoryId', 'name slug');
    if (!product) return jsonError('Product not found', 404);
    return jsonOk({ item: serializeDoc(product) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const parsed = productFormSchema.parse(await parseJsonBody(request));
    const product = await Product.findById(toObjectId(id));
    if (!product) return jsonError('Product not found', 404);

    const before = product.toObject();
    Object.assign(product, mapProductInput(parsed));
    await product.save();

    await writeAuditLog({
      action: 'update',
      entityType: 'product',
      entityId: product._id,
      userId: session.user.id,
      changes: { before: before as unknown as Record<string, unknown> },
    });

    return jsonOk({ item: serializeDoc(product) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const product = await Product.findByIdAndDelete(toObjectId(id));
    if (!product) return jsonError('Product not found', 404);

    await writeAuditLog({
      action: 'delete',
      entityType: 'product',
      entityId: product._id,
      userId: session.user.id,
    });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
