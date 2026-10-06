'use client';

import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (isLogin) {
    return (
      <>
        {children}
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
