import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { orderStatusUpdateSchema } from '@/lib/validators/admin';
import Order from '@/models/Order';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const order = await Order.findById(toObjectId(id)).populate('customerId', 'name email');
    if (!order) return jsonError('Order not found', 404);
    return jsonOk({ item: serializeDoc(order) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const data = orderStatusUpdateSchema.parse(await parseJsonBody(request));
    const order = await Order.findById(toObjectId(id));
    if (!order) return jsonError('Order not found', 404);

    const before = order.toObject();
    if (data.status !== order.status) {
      order.status = data.status;
      order.statusHistory.push({
        status: data.status,
        note: data.note,
        changedAt: new Date(),
        changedBy: toObjectId(session.user.id),
      });
    }
    if (data.internalNotes !== undefined) {
      order.internalNotes = data.internalNotes;
    }
    await order.save();

    await writeAuditLog({
      action: 'update',
      entityType: 'order',
      entityId: order._id,
      userId: session.user.id,
      changes: { before: before as unknown as Record<string, unknown> },
      metadata: { status: data.status },
    });

    return jsonOk({ item: serializeDoc(order) });
  } catch (error) {
    return handleApiError(error);
  }
}
