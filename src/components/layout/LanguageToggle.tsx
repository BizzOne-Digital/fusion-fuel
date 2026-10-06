'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export function LanguageToggle({
  className,
  activeClassName = 'font-bold text-carbon',
  inactiveClassName = 'text-carbon/60 hover:text-carbon',
}: LanguageToggleProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={cn('flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide', className)}>
      {routing.locales.map((l, index) => (
        <span key={l} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-carbon/50">/</span>}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: l })}
            className={cn('transition', locale === l ? activeClassName : inactiveClassName)}
            aria-current={locale === l ? 'true' : undefined}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
