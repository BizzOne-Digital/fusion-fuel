import type { Locale } from '@/types';
import { getMonthlyTeaClub } from '@/lib/marketing-i18n';

/** Monthly Tea Club — subscription info (no products; content-only menu category). */
export const MONTHLY_TEA_CLUB_MENU = {
  slug: 'monthly-tea-club',
  headline: getMonthlyTeaClub('en').name,
  description: `${getMonthlyTeaClub('en').taglines.primary} ${getMonthlyTeaClub('en').surpriseNote}`,
} as const;

export function monthlyTeaClubMenuCopy(locale: Locale) {
  const club = getMonthlyTeaClub(locale);
  return {
    slug: MONTHLY_TEA_CLUB_MENU.slug,
    headline: club.name,
    description: `${club.taglines.primary} ${club.surpriseNote}`,
  };
}
