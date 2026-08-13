'use client';

import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import ServiceForm from '@/components/admin/ServiceForm';

interface EditServiceClientProps {
  serviceId: string;
}

export default function EditServiceClient({ serviceId }: EditServiceClientProps) {
  const router = useRouter();
  return (
    <div>
      <AdminHeader title="Edit Service" />
      <ServiceForm serviceId={serviceId} onSuccess={() => router.push('/admin/services')} />
    </div>
  );
}
