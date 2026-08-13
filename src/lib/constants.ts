import type { BusinessHoursEntry, Locale, LocalizedString } from '@/types';

export const BRAND = {
  name: 'Fusion Fuel & Boost Co.',
  shortName: 'Fusion Fuel',
  tagline: {
    en: 'Premium fuel for body and mind',
    es: 'Combustible premium para cuerpo y mente',
  } satisfies LocalizedString,
  domain: 'fusionfuelboost.com',
} as const;

export const BRAND_COLORS = {
  primary: '#FF6B35',
  primaryDark: '#E55A2B',
  secondary: '#2EC4B6',
  secondaryDark: '#1FA99D',
  accent: '#FFD166',
  dark: '#1A1A2E',
  light: '#FAFAFA',
  muted: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;

export const BUSINESS_DEFAULTS = {
  email: 'hello@fusionfuelboost.com',
  phone: '+1 (555) 123-4567',
  address: {
    street: '123 Energy Lane',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    country: 'US',
  },
  timezone: 'America/Chicago',
} as const;

export const DEFAULT_CURRENCY = 'USD';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'es'];

export const DEFAULT_LOCALE: Locale = 'en';

export const DEFAULT_BUSINESS_HOURS: BusinessHoursEntry[] = [
  { day: 'monday', open: '07:00', close: '19:00' },
  { day: 'tuesday', open: '07:00', close: '19:00' },
  { day: 'wednesday', open: '07:00', close: '19:00' },
  { day: 'thursday', open: '07:00', close: '19:00' },
  { day: 'friday', open: '07:00', close: '20:00' },
  { day: 'saturday', open: '08:00', close: '18:00' },
  { day: 'sunday', open: '09:00', close: '17:00' },
];

export const SITE_SETTINGS_KEY = 'default';

export const ORDER_NUMBER_PREFIX = 'FFB';

export const BOOKING_REFERENCE_PREFIX = 'CAT';

export const PASSWORD_RESET_EXPIRY_HOURS = 24;

export const EMAIL_VERIFICATION_EXPIRY_HOURS = 48;

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
