'use client';

import { MonthlyTeaClubSection } from '@/components/sections/MonthlyTeaClubSection';
import type { Locale } from '@/types';

export function MonthlyTeaClubCategoryExplorer({ locale }: { locale: Locale }) {
  return (
    <div className="-mx-4 mt-2 sm:mx-0">
      <MonthlyTeaClubSection locale={locale} embedded />
    </div>
  );
}
