import CatalogManager from '@/components/admin/CatalogManager';

export default function AdminAddInsPage() {
  return (
    <CatalogManager
      title="Add-ins"
      description="Manage product add-ons and extras."
      apiBase="/api/admin/add-ins"
      fields={['description', 'price', 'category']}
      columns={[
        { key: 'name', header: 'Name', renderKey: 'name' },
        { key: 'slug', header: 'Slug' },
        { key: 'price', header: 'Price', renderKey: 'price' },
        { key: 'status', header: 'Status', renderKey: 'status' },
      ]}
    />
  );
}
