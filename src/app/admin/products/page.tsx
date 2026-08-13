import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import AdminHeader from '@/components/admin/AdminHeader';
import ServerDataTable from '@/components/admin/ServerDataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatMinorUnits } from '@/lib/pricing';

export default async function AdminProductsPage() {
  await connectDB();
  const products = await Product.find().sort({ order: 1 }).lean();

  return (
    <div>
      <AdminHeader
        title="Products"
        description="Manage product catalog, pricing, and inventory."
        action={{ label: 'New Product', href: '/admin/products/new' }}
      />
      <ServerDataTable
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (row) => (row.name as { en: string }).en,
          },
          { key: 'sku', header: 'SKU' },
          {
            key: 'basePrice',
            header: 'Price',
            render: (row) => formatMinorUnits(row.basePrice as number),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status as string} />,
          },
        ]}
        data={products.map((p) => ({ ...p, id: String(p._id) })) as Array<Record<string, unknown>>}
        getRowHref={(row) => `/admin/products/${row.id}`}
      />
    </div>
  );
}
