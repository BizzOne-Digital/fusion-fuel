import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { categoryFormSchema } from '@/lib/validators/admin';
import ProductCategory from '@/models/ProductCategory';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const category = await ProductCategory.findById(toObjectId(id));
    if (!category) return jsonError('Category not found', 404);
    return jsonOk({ item: serializeDoc(category) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const data = categoryFormSchema.parse(await parseJsonBody(request));
    const category = await ProductCategory.findById(toObjectId(id));
    if (!category) return jsonError('Category not found', 404);

    category.name = data.name;
    category.slug = data.slug;
    category.description = data.description ?? { en: '', es: '' };
    category.image = data.image;
    category.order = data.displayOrder;
    category.status = data.status;
    await category.save();

    await writeAuditLog({
      action: 'update',
      entityType: 'product_category',
      entityId: category._id,
      userId: session.user.id,
    });

    return jsonOk({ item: serializeDoc(category) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const category = await ProductCategory.findByIdAndDelete(toObjectId(id));
    if (!category) return jsonError('Category not found', 404);

    await writeAuditLog({
      action: 'delete',
      entityType: 'product_category',
      entityId: category._id,
      userId: session.user.id,
    });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
