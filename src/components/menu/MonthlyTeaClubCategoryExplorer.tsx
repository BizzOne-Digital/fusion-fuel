'use client';

import { MonthlyTeaClubSection } from '@/components/sections/MonthlyTeaClubSection';
import { MONTHLY_TEA_CLUB_MENU } from '@/lib/monthly-tea-club-menu';

export function MonthlyTeaClubCategoryExplorer() {
  return (
    <div className="-mx-4 mt-2 sm:mx-0">
      <MonthlyTeaClubSection kitHref={MONTHLY_TEA_CLUB_MENU.kitHref} embedded />
    </div>
  );
}
