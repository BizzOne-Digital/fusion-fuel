import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import AdminHeader from '@/components/admin/AdminHeader';
import ServerDataTable from '@/components/admin/ServerDataTable';
import StatusBadge from '@/components/admin/StatusBadge';

export default async function AdminBookingsPage() {
  await connectDB();
  const bookings = await Booking.find().sort({ eventDate: 1 }).lean();

  return (
    <div>
      <AdminHeader title="Bookings" description="Manage catering and event bookings." />
      <ServerDataTable
        columns={[
          { key: 'referenceNumber', header: 'Reference' },
          { key: 'contactName', header: 'Contact' },
          {
            key: 'eventDate',
            header: 'Event Date',
            render: (row) => new Date(row.eventDate as string).toLocaleDateString(),
          },
          { key: 'guestCount', header: 'Guests' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status as string} />,
          },
        ]}
        data={bookings.map((b) => ({ ...b, id: String(b._id) })) as Array<Record<string, unknown>>}
        getRowHref={(row) => `/admin/bookings/${row.id}`}
      />
    </div>
  );
}
