import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { normalizeLocalized } from '@/lib/admin/localized';
import { categoryFormSchema, categoryPatchSchema } from '@/lib/validators/admin';
import ProductCategory from '@/models/ProductCategory';
import { deleteStoredUploadByUrl } from '@/lib/stored-upload';
import { revalidateStorefrontCatalog } from '@/lib/revalidate-storefront';

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
    const raw = await parseJsonBody<Record<string, unknown>>(request);
    if (raw.name && typeof raw.name === 'object') {
      raw.name = normalizeLocalized(raw.name as { en: string; es: string });
    }
    if (raw.description && typeof raw.description === 'object') {
      raw.description = normalizeLocalized(raw.description as { en: string; es: string });
    }
    const data = categoryFormSchema.parse(raw);
    const category = await ProductCategory.findById(toObjectId(id));
    if (!category) return jsonError('Category not found', 404);

    const previousImageUrl = category.image?.url;

    category.name = data.name;
    category.slug = data.slug;
    category.description = data.description ?? { en: '', es: '' };
    if (data.image) {
      category.image = data.image;
    } else {
      category.set('image', undefined);
    }
    category.order = data.displayOrder;
    category.status = data.status;
    await category.save();
    revalidateStorefrontCatalog();

    if (previousImageUrl && previousImageUrl !== data.image?.url) {
      await deleteStoredUploadByUrl(previousImageUrl);
    }

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

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const data = categoryPatchSchema.parse(await parseJsonBody(request));
    const category = await ProductCategory.findById(toObjectId(id));
    if (!category) return jsonError('Category not found', 404);

    if (data.status !== undefined) {
      category.status = data.status;
    }
    if (data.displayOrder !== undefined) {
      category.order = data.displayOrder;
    }
    await category.save();
    revalidateStorefrontCatalog();

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

    if (category.image?.url) {
      await deleteStoredUploadByUrl(category.image.url);
    }

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
