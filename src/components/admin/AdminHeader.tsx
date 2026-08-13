'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  children?: React.ReactNode;
}

export default function AdminHeader({ title, description, action, children }: AdminHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/en"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
        >
          <ExternalLink className="h-4 w-4" />
          View site
        </Link>
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            {action.label}
          </Link>
        )}
        {children}
      </div>
    </div>
  );
}
