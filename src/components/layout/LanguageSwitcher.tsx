'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ compact = false, className }: { compact?: boolean; className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Select
      aria-label="Language"
      value={locale}
      options={routing.locales.map((l) => ({
        value: l,
        label: l === 'en' ? 'EN' : 'ES',
      }))}
      onChange={(e) => router.replace(pathname, { locale: e.target.value as 'en' | 'es' })}
      className={cn(
        'w-auto text-sm',
        compact ? 'min-w-[64px] px-3 py-2' : 'min-w-[72px] py-2',
        className
      )}
    />
  );
}
