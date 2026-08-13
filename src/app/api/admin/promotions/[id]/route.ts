import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { promotionFormSchema } from '@/lib/validators/admin';
import Promotion from '@/models/Promotion';

const promotionApiSchema = promotionFormSchema.extend({
  code: z.string().trim().toUpperCase().min(2).max(32),
});

function mapPromotionInput(data: z.infer<typeof promotionApiSchema>) {
  return {
    code: data.code,
    name: data.name.en,
    description: data.description?.en,
    type: data.type,
    rules: {
      discountValue: data.discountValue,
      minimumOrderAmount: data.minimumOrderAmount,
      maximumDiscountAmount: data.maximumDiscountAmount,
    },
    eligibility: {
      firstOrderOnly: data.firstOrderOnly,
    },
    startsAt: data.startDate,
    endsAt: data.endDate,
    limits: {
      maxUses: data.maxUses,
      maxUsesPerCustomer: data.maxUsesPerCustomer,
    },
    active: data.active,
  };
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const promotion = await Promotion.findById(toObjectId(id));
    if (!promotion) return jsonError('Promotion not found', 404);
    return jsonOk({ item: serializeDoc(promotion) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const data = promotionApiSchema.parse(await parseJsonBody(request));
    const promotion = await Promotion.findById(toObjectId(id));
    if (!promotion) return jsonError('Promotion not found', 404);
    Object.assign(promotion, mapPromotionInput(data));
    await promotion.save();
    await writeAuditLog({
      action: 'update',
      entityType: 'promotion',
      entityId: promotion._id,
      userId: session.user.id,
    });
    return jsonOk({ item: serializeDoc(promotion) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    await connectDB();
    const { id } = await context.params;
    const promotion = await Promotion.findByIdAndDelete(toObjectId(id));
    if (!promotion) return jsonError('Promotion not found', 404);
    await writeAuditLog({
      action: 'delete',
      entityType: 'promotion',
      entityId: promotion._id,
      userId: session.user.id,
    });
    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
