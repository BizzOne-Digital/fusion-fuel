import connectDB from '@/lib/mongodb';
import Page from '@/models/Page';
import AdminHeader from '@/components/admin/AdminHeader';
import ServerDataTable from '@/components/admin/ServerDataTable';
import StatusBadge from '@/components/admin/StatusBadge';

export default async function AdminPagesPage() {
  await connectDB();
  const pages = await Page.find().sort({ pageKey: 1 }).lean();

  return (
    <div>
      <AdminHeader title="Pages" description="Manage site pages, sections, and SEO." />
      <ServerDataTable
        columns={[
          { key: 'pageKey', header: 'Key' },
          {
            key: 'title',
            header: 'Title',
            render: (row) => (row.title as { en: string }).en,
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status as string} />,
          },
          {
            key: 'updatedAt',
            header: 'Updated',
            render: (row) => new Date(row.updatedAt as string).toLocaleDateString(),
          },
        ]}
        data={pages.map((p) => ({ ...p, id: String(p._id) })) as Array<Record<string, unknown>>}
        getRowHref={(row) => `/admin/pages/${row.pageKey}`}
      />
    </div>
  );
}
