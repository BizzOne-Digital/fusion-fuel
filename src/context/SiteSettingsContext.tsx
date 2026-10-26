'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { resolveCatering, resolveContact, type ResolvedCatering, type SiteContact } from '@/lib/site-content';
import type { Locale } from '@/types';

interface SiteSettingsValue {
  contact: SiteContact;
  /** Catering content for both languages, so locale switches don't need a refetch. */
  catering: Record<Locale, ResolvedCatering>;
}

const SiteSettingsContext = createContext<SiteSettingsValue | null>(null);

export function SiteSettingsProvider({ value, children }: { value: SiteSettingsValue; children: ReactNode }) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

function useSiteSettingsValue(): SiteSettingsValue {
  const value = useContext(SiteSettingsContext);
  if (value) return value;
  // Outside the provider (e.g. isolated render): built-in defaults.
  return {
    contact: resolveContact(null),
    catering: { en: resolveCatering(null, 'en'), es: resolveCatering(null, 'es') },
  };
}

export function useSiteContact(): SiteContact {
  return useSiteSettingsValue().contact;
}

export function useCatering(locale: Locale): ResolvedCatering {
  return useSiteSettingsValue().catering[locale];
}
