import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parseJsonBody } from '@/lib/admin/utils';
import { integrationTestSchema } from '@/lib/validators/admin';
import { dispatchCRMEvent, getCRMProvider } from '@/lib/crm';
import AuditLog from '@/models/AuditLog';

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const provider = getCRMProvider();
    const logs = await AuditLog.find({ entityType: 'crm_webhook' })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return jsonOk({
      config: {
        provider: process.env.CRM_PROVIDER ?? 'none',
        webhookUrl: process.env.CRM_WEBHOOK_URL ? '••••••••' : '',
        enabled: provider.isEnabled(),
      },
      logs: logs.map((log) => ({
        id: String(log._id),
        action: log.action,
        metadata: log.metadata,
        createdAt: log.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const body = await parseJsonBody(request);
    const { eventType } = integrationTestSchema.parse(body);

    const result = await dispatchCRMEvent(eventType, {
      test: true,
      message: 'CRM webhook test from admin portal',
      triggeredBy: session.user.email,
    });

    await writeAuditLog({
      action: 'update',
      entityType: 'crm_webhook',
      userId: session.user.id,
      metadata: {
        eventType,
        success: result.success,
        provider: result.provider,
        error: result.error,
      },
    });

    return jsonOk({ result });
  } catch (error) {
    return handleApiError(error);
  }
}
