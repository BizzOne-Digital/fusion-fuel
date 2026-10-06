import { MONTHLY_TEA_CLUB } from '@/lib/brand-content';

/** Monthly Tea Club — subscription info (no products; content-only menu category). */
export const MONTHLY_TEA_CLUB_MENU = {
  slug: 'monthly-tea-club',
  headline: MONTHLY_TEA_CLUB.name,
  description: `${MONTHLY_TEA_CLUB.taglines.primary} ${MONTHLY_TEA_CLUB.surpriseNote}`,
} as const;
