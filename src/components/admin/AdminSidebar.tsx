'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Package,
  FolderTree,
  Droplets,
  PlusCircle,
  ShoppingCart,
  Calendar,
  Users,
  MessageSquare,
  HelpCircle,
  DollarSign,
  Tag,
  Languages,
  Mail,
  Plug,
  Settings,
  LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { BRAND, BRAND_COLORS } from '@/lib/constants';

const navGroups = [
  {
    label: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/pages', label: 'Pages', icon: FileText },
      { href: '/admin/services', label: 'Services', icon: Briefcase },
      { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
      { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { href: '/admin/products', label: 'Products', icon: Package },
      { href: '/admin/categories', label: 'Categories', icon: FolderTree },
      { href: '/admin/flavors', label: 'Flavors', icon: Droplets },
      { href: '/admin/add-ins', label: 'Add-ins', icon: PlusCircle },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
      { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
      { href: '/admin/customers', label: 'Customers', icon: Users },
      { href: '/admin/pricing', label: 'Pricing', icon: DollarSign },
      { href: '/admin/promotions', label: 'Promotions', icon: Tag },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/translations', label: 'Translations', icon: Languages },
      { href: '/admin/contact-submissions', label: 'Contact', icon: Mail },
      { href: '/admin/integrations', label: 'Integrations', icon: Plug },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === '/admin') {
    return pathname === '/admin';
  }
  return pathname.startsWith(href);
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-950 text-zinc-100">
      <div className="border-b border-zinc-800 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Admin</p>
        <h1 className="mt-1 text-lg font-bold" style={{ color: BRAND_COLORS.primary }}>
          {BRAND.shortName}
        </h1>
        <p className="text-xs text-zinc-500">{BRAND.name}</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? 'bg-zinc-800 font-medium text-white'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-zinc-800 p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
