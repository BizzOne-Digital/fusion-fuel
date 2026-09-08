import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { serializeDoc } from '@/lib/admin/serialize';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parsePagination, parseJsonBody, toObjectId } from '@/lib/admin/utils';
import { mapProductInput } from '@/lib/admin/map-product-input';
import { productFormSchema } from '@/lib/validators/product';
import Product from '@/models/Product';
import type { ContentStatus } from '@/types';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const status = searchParams.get('status');
    const q = searchParams.get('q');
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status as ContentStatus;
    if (q) {
      filter.$or = [
        { 'name.en': { $regex: q, $options: 'i' } },
        { sku: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Product.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
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
    const parsed = productFormSchema.parse(await parseJsonBody(request));
    const product = await Product.create(mapProductInput(parsed));

    await writeAuditLog({
      action: 'create',
      entityType: 'product',
      entityId: product._id,
      userId: session.user.id,
    });

    return jsonOk({ item: serializeDoc(product) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
