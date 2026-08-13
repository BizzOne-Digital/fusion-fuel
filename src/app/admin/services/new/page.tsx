'use client';

import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import ServiceForm from '@/components/admin/ServiceForm';

export default function NewServicePage() {
  const router = useRouter();
  return (
    <div>
      <AdminHeader title="New Service" description="Create a new service listing." />
      <ServiceForm onSuccess={() => router.push('/admin/services')} />
    </div>
  );
}
