import CatalogManager from '@/components/admin/CatalogManager';

export default function AdminCategoriesPage() {
  return (
    <CatalogManager
      title="Product Categories"
      description="Organize products into categories."
      apiBase="/api/admin/categories"
      fields={['description']}
      columns={[
        { key: 'name', header: 'Name', renderKey: 'name' },
        { key: 'slug', header: 'Slug' },
        { key: 'status', header: 'Status', renderKey: 'status' },
      ]}
    />
  );
}
