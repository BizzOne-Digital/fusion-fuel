import Link from 'next/link';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Calendar,
  Mail,
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import StatsCard from '@/components/admin/StatsCard';
import ServerDataTable from '@/components/admin/ServerDataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { getDashboardStats } from '@/lib/admin/dashboard';
import { formatMinorUnits } from '@/lib/pricing';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        description="Overview of your store performance and recent activity."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          title="Total Revenue"
          value={formatMinorUnits(stats.revenue.total, stats.revenue.currency)}
          subtitle={`${formatMinorUnits(stats.revenue.last30Days, stats.revenue.currency)} last 30 days`}
          icon={DollarSign}
          accent="green"
        />
        <StatsCard
          title="Orders"
          value={stats.orders.total}
          subtitle={`${stats.orders.pending} pending · ${stats.orders.last30Days} this month`}
          icon={ShoppingCart}
          accent="blue"
        />
        <StatsCard
          title="Products"
          value={stats.products.total}
          subtitle={`${stats.products.published} published · ${stats.products.lowStock} low stock`}
          icon={Package}
          accent="orange"
        />
        <StatsCard
          title="Customers"
          value={stats.customers.total}
          subtitle={`${stats.customers.last30Days} new this month`}
          icon={Users}
          accent="purple"
        />
        <StatsCard
          title="Bookings"
          value={stats.bookings.total}
          subtitle={`${stats.bookings.pending} pending · ${stats.bookings.upcoming} upcoming`}
          icon={Calendar}
          accent="teal"
        />
        <StatsCard
          title="New Contact Messages"
          value={stats.contactSubmissions.new}
          subtitle="Awaiting review"
          icon={Mail}
          accent="orange"
        />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Recent Orders</h2>
        <ServerDataTable
          columns={[
            {
              key: 'orderNumber',
              header: 'Order',
              render: (row) => (
                <Link href={`/admin/orders/${String(row.id)}`} className="font-medium text-orange-600 hover:underline">
                  {String(row.orderNumber)}
                </Link>
              ),
            },
            {
              key: 'total',
              header: 'Total',
              render: (row) => formatMinorUnits(row.total as number, row.currency as string),
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <StatusBadge status={String(row.status)} />,
            },
            {
              key: 'createdAt',
              header: 'Date',
              render: (row) => new Date(String(row.createdAt)).toLocaleDateString(),
            },
          ]}
          data={stats.recentOrders as Array<Record<string, unknown>>}
          emptyMessage="No orders yet."
          getRowHref={(row) => `/admin/orders/${row.id}`}
        />
      </section>
    </div>
  );
}
