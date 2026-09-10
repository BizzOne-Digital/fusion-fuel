'use client';

import { Link } from '@/i18n/navigation';
import { PenLine } from 'lucide-react';
import type { Locale } from '@/types';

interface FloatingReviewButtonProps {
  locale: Locale;
}

export function FloatingReviewButton({ locale }: FloatingReviewButtonProps) {
  const isEs = locale === 'es';
  const label = isEs ? 'Escribir reseña' : 'Write a review';

  return (
    <Link
      href="/testimonials?tab=write"
      className="fixed bottom-6 right-6 z-[90] flex max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-full bg-pink px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition hover:scale-[1.03] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 sm:px-5 sm:py-3.5 sm:text-base"
      aria-label={label}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
        <PenLine className="h-4 w-4" aria-hidden />
      </span>
      <span className="pr-1">{label}</span>
    </Link>
  );
}
