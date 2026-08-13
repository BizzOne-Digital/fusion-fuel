import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { faqFormSchema } from '@/lib/validators/admin';
import FAQ from '@/models/FAQ';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const faq = await FAQ.findById(toObjectId(id));
    if (!faq) return jsonError('FAQ not found', 404);
    return jsonOk({ item: serializeDoc(faq) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const data = faqFormSchema.parse(await parseJsonBody(request));
    const faq = await FAQ.findById(toObjectId(id));
    if (!faq) return jsonError('FAQ not found', 404);
    Object.assign(faq, data);
    await faq.save();
    await writeAuditLog({
      action: 'update',
      entityType: 'faq',
      entityId: faq._id,
      userId: session.user.id,
    });
    return jsonOk({ item: serializeDoc(faq) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const faq = await FAQ.findByIdAndDelete(toObjectId(id));
    if (!faq) return jsonError('FAQ not found', 404);
    await writeAuditLog({
      action: 'delete',
      entityType: 'faq',
      entityId: faq._id,
      userId: session.user.id,
    });
    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
