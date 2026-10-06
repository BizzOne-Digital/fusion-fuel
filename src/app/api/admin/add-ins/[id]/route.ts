import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { normalizeLocalized } from '@/lib/admin/localized';
import { addInFormSchema, catalogVisibilityPatchSchema } from '@/lib/validators/admin';
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
    const addIn = await AddIn.findById(toObjectId(id));
    if (!addIn) return jsonError('Add-in not found', 404);
    return jsonOk({ item: serializeDoc(addIn) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const data = catalogVisibilityPatchSchema.parse(await parseJsonBody(request));
    const addIn = await AddIn.findById(toObjectId(id));
    if (!addIn) return jsonError('Add-in not found', 404);
    addIn.status = data.status;
    await addIn.save();
    revalidateStorefrontCatalog();

    await writeAuditLog({
      action: 'update',
      entityType: 'add_in',
      entityId: addIn._id,
      userId: session.user.id,
    });

    return jsonOk({ item: serializeDoc(addIn) });
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
    const data = addInFormSchema.parse(raw);
    const addIn = await AddIn.findById(toObjectId(id));
    if (!addIn) return jsonError('Add-in not found', 404);
    addIn.name = data.name;
    addIn.slug = data.slug;
    addIn.description = data.description ?? { en: '', es: '' };
    addIn.price = data.price;
    addIn.category = data.category ?? 'general';
    addIn.order = data.displayOrder;
    addIn.status = data.status;
    await addIn.save();
    revalidateStorefrontCatalog();

    await writeAuditLog({
      action: 'update',
      entityType: 'add_in',
      entityId: addIn._id,
      userId: session.user.id,
    });

    return jsonOk({ item: serializeDoc(addIn) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const addIn = await AddIn.findByIdAndDelete(toObjectId(id));
    if (!addIn) return jsonError('Add-in not found', 404);

    await writeAuditLog({
      action: 'delete',
      entityType: 'add_in',
      entityId: addIn._id,
      userId: session.user.id,
    });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
