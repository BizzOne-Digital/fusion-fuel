import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { normalizeLocalized } from '@/lib/admin/localized';
import { catalogVisibilityPatchSchema, flavorFormSchema } from '@/lib/validators/admin';
import { deleteStoredUploadByUrl } from '@/lib/stored-upload';
import { revalidateStorefrontCatalog } from '@/lib/revalidate-storefront';
import Flavor from '@/models/Flavor';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const flavor = await Flavor.findById(toObjectId(id));
    if (!flavor) return jsonError('Flavor not found', 404);
    return jsonOk({ item: serializeDoc(flavor) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const data = catalogVisibilityPatchSchema.parse(await parseJsonBody(request));
    const flavor = await Flavor.findById(toObjectId(id));
    if (!flavor) return jsonError('Flavor not found', 404);
    flavor.status = data.status;
    await flavor.save();
    revalidateStorefrontCatalog();

    await writeAuditLog({
      action: 'update',
      entityType: 'flavor',
      entityId: flavor._id,
      userId: session.user.id,
    });

    return jsonOk({ item: serializeDoc(flavor) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const raw = await parseJsonBody<Record<string, unknown>>(request);
    if (raw.name && typeof raw.name === 'object') {
      raw.name = normalizeLocalized(raw.name as { en: string; es: string });
    }
    if (raw.description && typeof raw.description === 'object') {
      raw.description = normalizeLocalized(raw.description as { en: string; es: string });
    }
    const data = flavorFormSchema.parse(raw);
    const flavor = await Flavor.findById(toObjectId(id));
    if (!flavor) return jsonError('Flavor not found', 404);

    const previousImageUrl = flavor.image?.url;

    flavor.name = data.name;
    flavor.slug = data.slug;
    flavor.category = data.category ?? 'general';
    flavor.color = data.color ?? flavor.color;
    flavor.description = data.description ?? { en: '', es: '' };
    if (data.image) {
      flavor.image = data.image;
    } else {
      flavor.set('image', undefined);
    }
    flavor.order = data.displayOrder;
    flavor.status = data.status;
    await flavor.save();

    if (previousImageUrl && previousImageUrl !== data.image?.url) {
      await deleteStoredUploadByUrl(previousImageUrl);
    }
    revalidateStorefrontCatalog();

    await writeAuditLog({
      action: 'update',
      entityType: 'flavor',
      entityId: flavor._id,
      userId: session.user.id,
    });

    return jsonOk({ item: serializeDoc(flavor) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const flavor = await Flavor.findByIdAndDelete(toObjectId(id));
    if (!flavor) return jsonError('Flavor not found', 404);

    if (flavor.image?.url) {
      await deleteStoredUploadByUrl(flavor.image.url);
    }

    await writeAuditLog({
      action: 'delete',
      entityType: 'flavor',
      entityId: flavor._id,
      userId: session.user.id,
    });

    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
