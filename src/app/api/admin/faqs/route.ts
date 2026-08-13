import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parsePagination, parseJsonBody } from '@/lib/admin/utils';
import { faqFormSchema } from '@/lib/validators/admin';
import FAQ from '@/models/FAQ';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const [items, total] = await Promise.all([
      FAQ.find().sort({ order: 1 }).skip(skip).limit(limit).lean(),
      FAQ.countDocuments(),
    ]);
    return jsonOk({
      items: items.map((item) => ({ ...item, id: String(item._id) })),
      pagination: { page, limit, total },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const data = faqFormSchema.parse(await parseJsonBody(request));
    const faq = await FAQ.create(data);
    await writeAuditLog({
      action: 'create',
      entityType: 'faq',
      entityId: faq._id,
      userId: session.user.id,
    });
    return jsonOk({ item: serializeDoc(faq) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
