import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { testimonialFormSchema } from '@/lib/validators/admin';
import Testimonial from '@/models/Testimonial';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const testimonial = await Testimonial.findById(toObjectId(id));
    if (!testimonial) return jsonError('Testimonial not found', 404);
    return jsonOk({ item: serializeDoc(testimonial) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const data = testimonialFormSchema.parse(await parseJsonBody(request));
    const testimonial = await Testimonial.findById(toObjectId(id));
    if (!testimonial) return jsonError('Testimonial not found', 404);
    Object.assign(testimonial, data);
    await testimonial.save();
    await writeAuditLog({
      action: 'update',
      entityType: 'testimonial',
      entityId: testimonial._id,
      userId: session.user.id,
    });
    return jsonOk({ item: serializeDoc(testimonial) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const testimonial = await Testimonial.findByIdAndDelete(toObjectId(id));
    if (!testimonial) return jsonError('Testimonial not found', 404);
    await writeAuditLog({
      action: 'delete',
      entityType: 'testimonial',
      entityId: testimonial._id,
      userId: session.user.id,
    });
    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
