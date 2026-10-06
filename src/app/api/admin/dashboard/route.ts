import { requireAdmin } from '@/lib/admin/require-admin';
import { getDashboardStats } from '@/lib/admin/dashboard';
import { jsonOk, handleApiError } from '@/lib/admin/response';

export async function GET() {
  try {
    await requireAdmin();
    const stats = await getDashboardStats();
    return jsonOk({ stats });
  } catch (error) {
    return handleApiError(error);
  }
}
