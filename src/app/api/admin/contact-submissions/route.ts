import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parsePagination } from '@/lib/admin/utils';
import ContactSubmission from '@/models/ContactSubmission';
import type { ContactSubmissionStatus } from '@/types';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const status = searchParams.get('status');
    const filter: { status?: ContactSubmissionStatus } = status
      ? { status: status as ContactSubmissionStatus }
      : {};

    const [items, total] = await Promise.all([
      ContactSubmission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ContactSubmission.countDocuments(filter),
    ]);

    return jsonOk({
      items: items.map((item) => ({ ...item, id: String(item._id) })),
      pagination: { page, limit, total },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
