import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Customer from '@/models/Customer';
import Booking from '@/models/Booking';
import ContactSubmission from '@/models/ContactSubmission';

export interface DashboardStats {
  revenue: {
    total: number;
    last30Days: number;
    currency: string;
  };
  orders: {
    total: number;
    pending: number;
    last30Days: number;
  };
  products: {
    total: number;
    published: number;
    lowStock: number;
  };
  customers: {
    total: number;
    last30Days: number;
  };
  bookings: {
    total: number;
    pending: number;
    upcoming: number;
  };
  contactSubmissions: {
    new: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    currency: string;
    status: string;
    createdAt: string;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await connectDB();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    revenueAgg,
    revenue30Agg,
    orderCounts,
    orders30,
    productCounts,
    lowStockCount,
    customerCount,
    customers30,
    bookingCounts,
    upcomingBookings,
    newContacts,
    recentOrders,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { paymentStatus: { $in: ['paid', 'partially_refunded'] } } },
      { $group: { _id: null, total: { $sum: '$totals.total' }, currency: { $first: '$totals.currency' } } },
    ]),
    Order.aggregate([
      {
        $match: {
          paymentStatus: { $in: ['paid', 'partially_refunded'] },
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      { $group: { _id: null, total: { $sum: '$totals.total' } } },
    ]),
    Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $in: ['$status', ['pending', 'confirmed', 'processing']] }, 1, 0] },
          },
        },
      },
    ]),
    Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Product.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          published: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
        },
      },
    ]),
    Product.countDocuments({
      'inventory.trackInventory': true,
      $expr: { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] },
    }),
    Customer.countDocuments(),
    Customer.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Booking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        },
      },
    ]),
    Booking.countDocuments({
      eventDate: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed', 'in_progress'] },
    }),
    ContactSubmission.countDocuments({ status: 'new' }),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select('orderNumber totals status createdAt')
      .lean(),
  ]);

  const revenue = revenueAgg[0];
  const revenue30 = revenue30Agg[0];
  const orders = orderCounts[0];
  const products = productCounts[0];
  const bookings = bookingCounts[0];

  return {
    revenue: {
      total: revenue?.total ?? 0,
      last30Days: revenue30?.total ?? 0,
      currency: revenue?.currency ?? 'USD',
    },
    orders: {
      total: orders?.total ?? 0,
      pending: orders?.pending ?? 0,
      last30Days: orders30,
    },
    products: {
      total: products?.total ?? 0,
      published: products?.published ?? 0,
      lowStock: lowStockCount,
    },
    customers: {
      total: customerCount,
      last30Days: customers30,
    },
    bookings: {
      total: bookings?.total ?? 0,
      pending: bookings?.pending ?? 0,
      upcoming: upcomingBookings,
    },
    contactSubmissions: {
      new: newContacts,
    },
    recentOrders: recentOrders.map((order) => ({
      id: String(order._id),
      orderNumber: order.orderNumber,
      total: order.totals.total,
      currency: order.totals.currency,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    })),
  };
}
