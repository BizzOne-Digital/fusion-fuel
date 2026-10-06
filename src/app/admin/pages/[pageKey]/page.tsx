import PageEditor from '@/components/admin/PageEditor';

interface PageProps {
  params: Promise<{ pageKey: string }>;
}

export default async function AdminPageEditPage({ params }: PageProps) {
  const { pageKey } = await params;
  return <PageEditor pageKey={pageKey} />;
}
