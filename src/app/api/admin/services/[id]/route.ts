import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { serviceFormSchema } from '@/lib/validators/admin';
import Service from '@/models/Service';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const service = await Service.findById(toObjectId(id));
    if (!service) return jsonError('Service not found', 404);
    return jsonOk({ item: serializeDoc(service) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const data = serviceFormSchema.parse(await parseJsonBody(request));
    const service = await Service.findById(toObjectId(id));
    if (!service) return jsonError('Service not found', 404);

    const before = service.toObject();
    Object.assign(service, data);
    await service.save();

    await writeAuditLog({
      action: 'update',
      entityType: 'service',
      entityId: service._id,
      userId: session.user.id,
      changes: { before: before as unknown as Record<string, unknown>, after: data as Record<string, unknown> },
    });

    return jsonOk({ item: serializeDoc(service) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const service = await Service.findByIdAndDelete(toObjectId(id));
    if (!service) return jsonError('Service not found', 404);

    await writeAuditLog({
      action: 'delete',
      entityType: 'service',
      entityId: service._id,
      userId: session.user.id,
    });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
