import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { contactSubmissionUpdateSchema } from '@/lib/validators/admin';
import ContactSubmission from '@/models/ContactSubmission';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const submission = await ContactSubmission.findById(toObjectId(id));
    if (!submission) return jsonError('Submission not found', 404);
    return jsonOk({ item: serializeDoc(submission) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const data = contactSubmissionUpdateSchema.parse(await parseJsonBody(request));
    const submission = await ContactSubmission.findById(toObjectId(id));
    if (!submission) return jsonError('Submission not found', 404);

    submission.status = data.status;
    if (data.adminNotes !== undefined) submission.adminNotes = data.adminNotes;
    if (data.status === 'replied') submission.repliedAt = new Date();
    await submission.save();

    await writeAuditLog({
      action: 'update',
      entityType: 'contact_submission',
      entityId: submission._id,
      userId: session.user.id,
    });

    return jsonOk({ item: serializeDoc(submission) });
  } catch (error) {
    return handleApiError(error);
  }
}
