'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import ServiceForm from '@/components/admin/ServiceForm';
import { adminFetch } from '@/lib/admin/client';

interface EditServiceClientProps {
  serviceId: string;
}

export default function EditServiceClient({ serviceId }: EditServiceClientProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!window.confirm('Delete this service permanently?')) return;
    const { error } = await adminFetch(`/api/admin/services/${serviceId}`, { method: 'DELETE' });
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Service deleted');
    router.push('/admin/services');
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <AdminHeader title="Edit Service / Catering" />
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete Service
        </button>
      </div>
      <ServiceForm serviceId={serviceId} onSuccess={() => router.push('/admin/services')} />
    </div>
  );
}
