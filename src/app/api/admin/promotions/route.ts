import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parsePagination, parseJsonBody } from '@/lib/admin/utils';
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
      currentUses: 0,
    },
    active: data.active,
  };
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const [items, total] = await Promise.all([
      Promotion.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Promotion.countDocuments(),
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
    const data = promotionApiSchema.parse(await parseJsonBody(request));
    const promotion = await Promotion.create(mapPromotionInput(data));
    await writeAuditLog({
      action: 'create',
      entityType: 'promotion',
      entityId: promotion._id,
      userId: session.user.id,
    });
    return jsonOk({ item: serializeDoc(promotion) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
