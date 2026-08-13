import connectDB from '@/lib/mongodb';
import { SITE_SETTINGS_KEY } from '@/lib/constants';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parseJsonBody } from '@/lib/admin/utils';
import { settingsFormSchema } from '@/lib/validators/admin';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    let settings = await SiteSettings.findOne({ key: SITE_SETTINGS_KEY });
    if (!settings) {
      settings = await SiteSettings.create({ key: SITE_SETTINGS_KEY });
    }
    return jsonOk({ item: serializeDoc(settings) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const data = settingsFormSchema.parse(await parseJsonBody(request));
    let settings = await SiteSettings.findOne({ key: SITE_SETTINGS_KEY });
    if (!settings) {
      settings = await SiteSettings.create({ key: SITE_SETTINGS_KEY });
    }

    const before = settings.toObject();
    settings.businessName = data.businessName;
    settings.tagline = data.tagline;
    settings.contactEmail = data.contactEmail;
    settings.contactPhone = data.contactPhone;
    settings.address = data.address;
    settings.timezone = data.timezone;
    if (data.seo) settings.seo = data.seo;
    settings.announcement = data.announcement;
    settings.social = data.social;
    settings.hours = data.hours;
    await settings.save();

    await writeAuditLog({
      action: 'update',
      entityType: 'site_settings',
      entityId: settings._id,
      userId: session.user.id,
      changes: { before: before as unknown as Record<string, unknown> },
    });

    return jsonOk({ item: serializeDoc(settings) });
  } catch (error) {
    return handleApiError(error);
  }
}
