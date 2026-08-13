import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import AdminHeader from '@/components/admin/AdminHeader';
import ServerDataTable from '@/components/admin/ServerDataTable';
import StatusBadge from '@/components/admin/StatusBadge';

export default async function AdminServicesPage() {
  await connectDB();
  const services = await Service.find().sort({ order: 1 }).lean();

  return (
    <div>
      <AdminHeader
        title="Services"
        description="Manage catering and event services."
        action={{ label: 'New Service', href: '/admin/services/new' }}
      />
      <ServerDataTable
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (row) => (row.name as { en: string }).en,
          },
          { key: 'slug', header: 'Slug' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status as string} />,
          },
        ]}
        data={services.map((s) => ({ ...s, id: String(s._id) })) as Array<Record<string, unknown>>}
        getRowHref={(row) => `/admin/services/${row.id}`}
      />
    </div>
  );
}
