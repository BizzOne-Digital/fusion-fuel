import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { mapProductInput } from '@/lib/admin/map-product-input';
import { prepareProductPayload } from '@/lib/admin/prepare-product-payload';
import { serializeDocs } from '@/lib/admin/serialize';
import { productFormSchema, productVisibilityPatchSchema } from '@/lib/validators/product';
import Product from '@/models/Product';
import Flavor from '@/models/Flavor';
import AddIn from '@/models/AddIn';
import { revalidateStorefrontCatalog } from '@/lib/revalidate-storefront';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const product = await Product.findById(toObjectId(id)).populate('categoryId', 'name slug');
    if (!product) return jsonError('Product not found', 404);

    const flavorDocs = product.flavorIds?.length
      ? await Flavor.find({ _id: { $in: product.flavorIds } }).sort({ order: 1 }).lean()
      : [];
    const addInIds = (product.addInOptions ?? []).map((option) => option.addInId);
    const addInDocs = addInIds.length
      ? await AddIn.find({ _id: { $in: addInIds } }).sort({ order: 1 }).lean()
      : [];

    return jsonOk({
      item: serializeDoc(product),
      flavors: serializeDocs(flavorDocs as never[]),
      addIns: serializeDocs(addInDocs as never[]),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const data = productVisibilityPatchSchema.parse(await parseJsonBody(request));
    const product = await Product.findById(toObjectId(id));
    if (!product) return jsonError('Product not found', 404);

    product.status = data.status;
    await product.save();
    revalidateStorefrontCatalog({ productSlug: product.slug });

    await writeAuditLog({
      action: 'update',
      entityType: 'product',
      entityId: product._id,
      userId: session.user.id,
    });

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
    const prepared = await prepareProductPayload(parsed);
    const product = await Product.findById(toObjectId(id));
    if (!product) return jsonError('Product not found', 404);

    const before = product.toObject();
    Object.assign(product, mapProductInput(prepared));
    await product.save();
    revalidateStorefrontCatalog({ productSlug: product.slug });

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
