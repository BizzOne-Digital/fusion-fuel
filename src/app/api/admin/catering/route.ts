import connectDB from '@/lib/mongodb';
import { SITE_SETTINGS_KEY } from '@/lib/constants';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parseJsonBody } from '@/lib/admin/utils';
import { revalidateSiteContent } from '@/lib/revalidate-storefront';
import { mergeCatering } from '@/lib/site-content';
import { cateringFormSchema } from '@/lib/validators/admin';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const settings = await SiteSettings.findOne({ key: SITE_SETTINGS_KEY }).lean();
    return jsonOk({ item: mergeCatering(settings?.catering) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const data = cateringFormSchema.parse(await parseJsonBody(request));

    const settings = await SiteSettings.findOneAndUpdate(
      { key: SITE_SETTINGS_KEY },
      { $set: { catering: data }, $setOnInsert: { key: SITE_SETTINGS_KEY } },
      { upsert: true, new: true }
    );

    revalidateSiteContent();

    await writeAuditLog({
      action: 'update',
      entityType: 'catering_settings',
      entityId: settings._id,
      userId: session.user.id,
    });

    return jsonOk({ item: mergeCatering(settings.catering) });
  } catch (error) {
    return handleApiError(error);
  }
}
