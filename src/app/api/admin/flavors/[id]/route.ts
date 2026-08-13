import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { flavorFormSchema } from '@/lib/validators/admin';
import Flavor from '@/models/Flavor';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const flavor = await Flavor.findById(toObjectId(id));
    if (!flavor) return jsonError('Flavor not found', 404);
    return jsonOk({ item: serializeDoc(flavor) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const data = flavorFormSchema.parse(await parseJsonBody(request));
    const flavor = await Flavor.findById(toObjectId(id));
    if (!flavor) return jsonError('Flavor not found', 404);
    flavor.name = data.name;
    flavor.slug = data.slug;
    flavor.category = data.category ?? 'general';
    flavor.color = data.color ?? flavor.color;
    flavor.description = data.description ?? { en: '', es: '' };
    flavor.order = data.displayOrder;
    flavor.status = data.status;
    await flavor.save();

    await writeAuditLog({
      action: 'update',
      entityType: 'flavor',
      entityId: flavor._id,
      userId: session.user.id,
    });

    return jsonOk({ item: serializeDoc(flavor) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const flavor = await Flavor.findByIdAndDelete(toObjectId(id));
    if (!flavor) return jsonError('Flavor not found', 404);

    await writeAuditLog({
      action: 'delete',
      entityType: 'flavor',
      entityId: flavor._id,
      userId: session.user.id,
    });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
