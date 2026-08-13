import connectDB from '@/lib/mongodb';
import { requireAdmin } from '@/lib/admin/require-admin';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parsePagination } from '@/lib/admin/utils';
import Booking from '@/models/Booking';
import type { BookingStatus } from '@/types';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const status = searchParams.get('status');
    const filter: { status?: BookingStatus } = status
      ? { status: status as BookingStatus }
      : {};

    const [items, total] = await Promise.all([
      Booking.find(filter).sort({ eventDate: 1 }).skip(skip).limit(limit).lean(),
      Booking.countDocuments(filter),
    ]);

    return jsonOk({
      items: items.map((item) => ({ ...item, id: String(item._id) })),
      pagination: { page, limit, total },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
