import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody } from '@/lib/admin/utils';
import { pageFormSchema } from '@/lib/validators/admin';
import Page from '@/models/Page';

interface RouteContext {
  params: Promise<{ pageKey: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { pageKey } = await context.params;
    const page = await Page.findOne({ pageKey });
    if (!page) {
      return jsonError('Page not found', 404);
    }
    return jsonOk({ item: serializeDoc(page) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { pageKey } = await context.params;
    const body = await parseJsonBody<unknown>(request);
    const data = pageFormSchema.parse(body);

    const page = await Page.findOne({ pageKey });
    if (!page) {
      return jsonError('Page not found', 404);
    }

    const before = page.toObject();
    Object.assign(page, data);
    await page.save();

    await writeAuditLog({
      action: 'update',
      entityType: 'page',
      entityId: page._id,
      userId: session.user.id,
      changes: { before: before as unknown as Record<string, unknown>, after: data as Record<string, unknown> },
    });

    return jsonOk({ item: serializeDoc(page) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { pageKey } = await context.params;
    const page = await Page.findOneAndDelete({ pageKey });
    if (!page) {
      return jsonError('Page not found', 404);
    }

    await writeAuditLog({
      action: 'delete',
      entityType: 'page',
      entityId: page._id,
      userId: session.user.id,
    });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
