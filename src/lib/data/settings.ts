import connectDB from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { SITE_SETTINGS_KEY, BRAND, BUSINESS_DEFAULTS, DEFAULT_BUSINESS_HOURS } from '@/lib/constants';
import { serializeForClient } from '@/lib/utils';
import type { ISiteSettings } from '@/models/SiteSettings';

export function getDefaultSettings(): Partial<ISiteSettings> {
  return {
    key: SITE_SETTINGS_KEY,
    businessName: BRAND.name,
    tagline: BRAND.tagline,
    contactEmail: BUSINESS_DEFAULTS.email,
    contactPhone: BUSINESS_DEFAULTS.phone,
    address: BUSINESS_DEFAULTS.address,
    timezone: BUSINESS_DEFAULTS.timezone,
    currency: 'USD',
    locales: ['en', 'es'],
    defaultLocale: 'en',
    hours: DEFAULT_BUSINESS_HOURS,
    announcement: {
      enabled: true,
      message: {
        en: 'Mega Tea Kits • 100+ Flavor Combinations',
        es: 'Kits Mega Tea • Más de 100 combinaciones',
      },
      link: '/products/mega-tea-kit-builder',
      backgroundColor: '#E8F000',
      textColor: '#07090A',
    },
    social: [],
    footer: { tagline: BRAND.tagline, columns: [] },
    legalLinks: [],
  };
}

export async function getSiteSettings(): Promise<Partial<ISiteSettings>> {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne({ key: SITE_SETTINGS_KEY }).lean<ISiteSettings>();
    return settings ? serializeForClient(settings) : getDefaultSettings();
  } catch {
    return getDefaultSettings();
  }
}
