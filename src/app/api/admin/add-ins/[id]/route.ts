import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { addInFormSchema } from '@/lib/validators/admin';
import AddIn from '@/models/AddIn';

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

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const data = addInFormSchema.parse(await parseJsonBody(request));
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
