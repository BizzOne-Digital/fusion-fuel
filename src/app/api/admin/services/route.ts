import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parsePagination, parseJsonBody } from '@/lib/admin/utils';
import { serviceFormSchema } from '@/lib/validators/admin';
import Service from '@/models/Service';
import type { ContentStatus } from '@/types';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const status = searchParams.get('status');
    const filter: { status?: ContentStatus } = status
      ? { status: status as ContentStatus }
      : {};

    const [items, total] = await Promise.all([
      Service.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Service.countDocuments(filter),
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
    const data = serviceFormSchema.parse(await parseJsonBody(request));
    const service = await Service.create(data);

    await writeAuditLog({
      action: 'create',
      entityType: 'service',
      entityId: service._id,
      userId: session.user.id,
      changes: { after: data as Record<string, unknown> },
    });

    return jsonOk({ item: serializeDoc(service) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
