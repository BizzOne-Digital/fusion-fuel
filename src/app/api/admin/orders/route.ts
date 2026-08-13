import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parsePagination } from '@/lib/admin/utils';
import Order from '@/models/Order';
import type { OrderStatus, PaymentStatus } from '@/types';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const q = searchParams.get('q');

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status as OrderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus as PaymentStatus;
    if (q) {
      filter.$or = [
        { orderNumber: { $regex: q, $options: 'i' } },
        { guestEmail: { $regex: q, $options: 'i' } },
        { guestName: { $regex: q, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    return jsonOk({
      items: items.map((item) => ({ ...item, id: String(item._id) })),
      pagination: { page, limit, total },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
