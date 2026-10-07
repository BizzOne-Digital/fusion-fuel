'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminClickableRowProps {
  href: string;
  children: ReactNode;
}

export default function AdminClickableRow({ href, children }: AdminClickableRowProps) {
  const router = useRouter();

  function navigate() {
    router.push(href);
  }

  return (
    <tr
      className="cursor-pointer transition-colors hover:bg-orange-50/40"
      onClick={navigate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate();
        }
      }}
      tabIndex={0}
      role="link"
      aria-label="View details"
    >
      {children}
    </tr>
  );
}
