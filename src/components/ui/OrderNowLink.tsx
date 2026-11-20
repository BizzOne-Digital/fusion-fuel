import type { ReactNode } from 'react';
import { ORDER_MENU_URL } from '@/lib/brand-content';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types';

export function orderNowLabel(locale: Locale): string {
  return locale === 'es' ? 'Ordenar ahora' : 'Order Now';
}

interface OrderNowLinkProps {
  locale: Locale;
  className?: string;
  children?: ReactNode;
}

/** Primary "Order Now" call to action; opens the online menu (same URL everywhere on the site). */
export function OrderNowLink({ locale, className, children }: OrderNowLinkProps) {
  return (
    <a
      href={ORDER_MENU_URL}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-lime px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-ink transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carbon',
        className
      )}
    >
      {children ?? orderNowLabel(locale)}
    </a>
  );
}
