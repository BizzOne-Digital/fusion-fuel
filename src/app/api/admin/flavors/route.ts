import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parsePagination, parseJsonBody } from '@/lib/admin/utils';
import { flavorFormSchema } from '@/lib/validators/admin';
import Flavor from '@/models/Flavor';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const [items, total] = await Promise.all([
      Flavor.find().sort({ order: 1 }).skip(skip).limit(limit).lean(),
      Flavor.countDocuments(),
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
    const data = flavorFormSchema.parse(await parseJsonBody(request));
    const flavor = await Flavor.create({
      name: data.name,
      slug: data.slug,
      category: data.category ?? 'general',
      color: data.color ?? '#FF6B35',
      description: data.description ?? { en: '', es: '' },
      order: data.displayOrder,
      status: data.status,
    });

    await writeAuditLog({
      action: 'create',
      entityType: 'flavor',
      entityId: flavor._id,
      userId: session.user.id,
    });

    return jsonOk({ item: serializeDoc(flavor) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
