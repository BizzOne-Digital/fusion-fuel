'use client';

import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  '/',
  '/about',
  '/products',
  '/services',
  '/pricing',
  '/booking',
  '/testimonials',
  '/faqs',
  '/contact',
  '/cart',
  '/account',
] as const;

const labelKeys: Record<(typeof links)[number], string> = {
  '/': 'home',
  '/about': 'about',
  '/products': 'products',
  '/services': 'services',
  '/pricing': 'pricing',
  '/booking': 'booking',
  '/testimonials': 'testimonials',
  '/faqs': 'faqs',
  '/contact': 'contact',
  '/cart': 'cart',
  '/account': 'account',
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const t = useTranslations('nav');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-ink/60" onClick={onClose} aria-label="Close menu" />
      <div className="absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-grey/15 p-4">
          <Logo className="h-10 w-auto max-w-[150px] object-contain object-left sm:max-w-[170px]" />
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-cream" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4" aria-label="Mobile">
          {links.map((href) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="rounded-xl px-4 py-3 font-medium text-carbon hover:bg-cream"
            >
              {t(labelKeys[href])}
            </Link>
          ))}
        </nav>
        <div className="border-t border-grey/15 p-4">
          <LanguageSwitcher compact />
        </div>
      </div>
    </div>
  );
}
