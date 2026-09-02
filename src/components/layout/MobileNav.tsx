'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  '/',
  '/about',
  '/menu',
  '/cart',
  '/services',
  '/pricing',
  '/booking',
  '/testimonials',
  '/faqs',
  '/contact',
  '/account',
] as const;

const labelKeys: Record<(typeof links)[number], string> = {
  '/': 'home',
  '/about': 'about',
  '/menu': 'menu',
  '/cart': 'cart',
  '/services': 'services',
  '/pricing': 'pricing',
  '/booking': 'booking',
  '/testimonials': 'testimonials',
  '/faqs': 'faqs',
  '/contact': 'contact',
  '/account': 'account',
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const t = useTranslations('nav');

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label={t('menu')}>
      <button
        type="button"
        className="absolute inset-0 bg-ink/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close menu"
      />
      <div className="absolute left-0 top-0 flex h-full w-[min(100%,300px)] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-grey/15 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <p className="font-display text-xl font-semibold uppercase tracking-wide text-carbon">{t('menu')}</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-carbon transition hover:bg-cream"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2" aria-label="Mobile">
          {links.map((href) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="rounded-xl px-4 py-3.5 text-base font-medium text-carbon transition hover:bg-cream"
            >
              {t(labelKeys[href])}
            </Link>
          ))}
        </nav>
        <div className="border-t border-grey/15 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <LanguageSwitcher compact />
        </div>
      </div>
    </div>
  );
}
