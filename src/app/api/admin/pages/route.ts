import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parsePagination, parseJsonBody } from '@/lib/admin/utils';
import { pageFormSchema } from '@/lib/validators/admin';
import Page from '@/models/Page';
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
      Page.find(filter).sort({ pageKey: 1 }).skip(skip).limit(limit).lean(),
      Page.countDocuments(filter),
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
    const body = await parseJsonBody<unknown>(request);
    const data = pageFormSchema.parse(body);

    const existing = await Page.findOne({ pageKey: data.pageKey });
    if (existing) {
      return handleApiError(new Error('Page key already exists'));
    }

    const page = await Page.create(data);

    await writeAuditLog({
      action: 'create',
      entityType: 'page',
      entityId: page._id,
      userId: session.user.id,
      changes: { after: data as Record<string, unknown> },
    });

    return jsonOk({ item: serializeDoc(page) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
