import CatalogManager from '@/components/admin/CatalogManager';

export default function AdminFlavorsPage() {
  return (
    <CatalogManager
      title="Flavors"
      description="Manage the flavor catalogue."
      apiBase="/api/admin/flavors"
      fields={['description', 'category', 'color']}
      columns={[
        { key: 'name', header: 'Name', renderKey: 'name' },
        { key: 'slug', header: 'Slug' },
        { key: 'category', header: 'Category' },
        { key: 'status', header: 'Status', renderKey: 'status' },
      ]}
    />
  );
}
