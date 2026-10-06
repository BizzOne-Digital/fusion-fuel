import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { bookingStatusUpdateSchema } from '@/lib/validators/admin';
import Booking from '@/models/Booking';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const booking = await Booking.findById(toObjectId(id));
    if (!booking) return jsonError('Booking not found', 404);
    return jsonOk({ item: serializeDoc(booking) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const data = bookingStatusUpdateSchema.parse(await parseJsonBody(request));
    const booking = await Booking.findById(toObjectId(id));
    if (!booking) return jsonError('Booking not found', 404);

    booking.status = data.status;
    if (data.internalNotes !== undefined) booking.internalNotes = data.internalNotes;
    if (data.depositPaid !== undefined) booking.depositPaid = data.depositPaid;
    if (data.status === 'confirmed' && !booking.confirmedAt) booking.confirmedAt = new Date();
    if (data.status === 'cancelled' && !booking.cancelledAt) booking.cancelledAt = new Date();
    await booking.save();

    await writeAuditLog({
      action: 'update',
      entityType: 'booking',
      entityId: booking._id,
      userId: session.user.id,
      metadata: { status: data.status },
    });

    return jsonOk({ item: serializeDoc(booking) });
  } catch (error) {
    return handleApiError(error);
  }
}
