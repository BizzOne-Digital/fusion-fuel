import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parsePagination, parseJsonBody } from '@/lib/admin/utils';
import { addInFormSchema } from '@/lib/validators/admin';
import AddIn from '@/models/AddIn';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const [items, total] = await Promise.all([
      AddIn.find().sort({ order: 1 }).skip(skip).limit(limit).lean(),
      AddIn.countDocuments(),
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
    const data = addInFormSchema.parse(await parseJsonBody(request));
    const addIn = await AddIn.create({
      name: data.name,
      slug: data.slug,
      description: data.description ?? { en: '', es: '' },
      price: data.price,
      category: data.category ?? 'general',
      order: data.displayOrder,
      status: data.status,
    });

    await writeAuditLog({
      action: 'create',
      entityType: 'add_in',
      entityId: addIn._id,
      userId: session.user.id,
    });

    return jsonOk({ item: serializeDoc(addIn) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
