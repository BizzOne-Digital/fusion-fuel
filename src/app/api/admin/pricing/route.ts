import connectDB from '@/lib/mongodb';
import { SITE_SETTINGS_KEY } from '@/lib/constants';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parseJsonBody } from '@/lib/admin/utils';
import { pricingFormSchema } from '@/lib/validators/admin';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    let settings = await SiteSettings.findOne({ key: SITE_SETTINGS_KEY });
    if (!settings) {
      settings = await SiteSettings.create({ key: SITE_SETTINGS_KEY });
    }
    return jsonOk({
      item: {
        shipping: settings.shipping,
        pickup: settings.pickup,
        taxRateBps: settings.taxRateBps ?? 0,
        currency: settings.currency,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const data = pricingFormSchema.parse(await parseJsonBody(request));
    let settings = await SiteSettings.findOne({ key: SITE_SETTINGS_KEY });
    if (!settings) {
      settings = await SiteSettings.create({ key: SITE_SETTINGS_KEY });
    }

    settings.shipping = data.shipping;
    settings.pickup = data.pickup;
    settings.taxRateBps = data.taxRateBps;
    settings.currency = data.currency;
    await settings.save();

    await writeAuditLog({
      action: 'update',
      entityType: 'pricing',
      entityId: settings._id,
      userId: session.user.id,
    });

    return jsonOk({ item: serializeDoc(settings) });
  } catch (error) {
    return handleApiError(error);
  }
}
