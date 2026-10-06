import EditServiceClient from '@/components/admin/EditServiceClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  return <EditServiceClient serviceId={id} />;
}
