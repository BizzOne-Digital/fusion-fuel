/**
 * Admin-editable catering + contact content.
 * Stored on SiteSettings (`catering`, contact fields); every field falls back to the
 * built-in defaults so the site renders even before the admin saves anything.
 * Pure module (no DB / React) so it can be used from server and client code.
 */

import {
  ACAI_BOWL_EVENT,
  CATERING_TAGLINE,
  CONTACT,
} from '@/lib/brand-content';
import { getAcaiBowlEvent, getCateringTagline } from '@/lib/marketing-i18n';
import { BUSINESS_DEFAULTS } from '@/lib/constants';
import type { BusinessHoursEntry, Locale } from '@/types';

type L<T> = { en: T; es: T };

export const CATERING_DEFAULT_GUEST_MIN = 50;
export const CATERING_DEFAULT_GUEST_MAX = 150;

/** Shape stored in the database (all text is per-language). */
export interface CateringContent {
  tagline: L<string>;
  eventName: L<string>;
  headline: L<string>;
  serviceArea: L<string>;
  deliveryNote: L<string>;
  serviceDuration: L<string>;
  deposit: L<string>;
  balance: L<string>;
  bowlSizes: L<string[]>;
  venueTypes: L<string[]>;
  perfectFor: L<string[]>;
  freshFruits: L<string[]>;
  premiumToppings: L<string[]>;
  packageIncludes: L<string[]>;
  howItWorks: L<string[]>;
  guestPackages: number[];
  guestMin: number;
  guestMax: number;
  /** Booking requests are emailed here. Empty = use the main contact email. */
  notificationEmail: string;
}

/** Catering content resolved for one language — what components render. */
export interface ResolvedCatering {
  tagline: string;
  name: string;
  headline: string;
  serviceArea: string;
  deliveryNote: string;
  serviceDuration: string;
  deposit: string;
  balance: string;
  bowlSizes: string[];
  venueTypes: string[];
  perfectFor: string[];
  freshFruits: string[];
  premiumToppings: string[];
  packageIncludes: string[];
  howItWorks: string[];
  guestPackages: number[];
  guestMin: number;
  guestMax: number;
}

function both<T>(en: T, es: T): L<T> {
  return { en, es };
}

export function getDefaultCatering(): CateringContent {
  const en = ACAI_BOWL_EVENT;
  const es = getAcaiBowlEvent('es');
  const list = (key: 'bowlSizes' | 'venueTypes' | 'perfectFor' | 'freshFruits' | 'premiumToppings' | 'packageIncludes' | 'howItWorks') =>
    both([...en[key]], [...es[key]]);

  return {
    tagline: both(CATERING_TAGLINE, getCateringTagline('es')),
    eventName: both(en.name, es.name),
    headline: both(en.headline, es.headline),
    serviceArea: both(en.serviceArea, es.serviceArea),
    deliveryNote: both(en.deliveryNote, es.deliveryNote),
    serviceDuration: both(en.serviceDuration, es.serviceDuration),
    deposit: both(en.deposit, es.deposit),
    balance: both(en.balance, es.balance),
    bowlSizes: list('bowlSizes'),
    venueTypes: list('venueTypes'),
    perfectFor: list('perfectFor'),
    freshFruits: list('freshFruits'),
    premiumToppings: list('premiumToppings'),
    packageIncludes: list('packageIncludes'),
    howItWorks: list('howItWorks'),
    guestPackages: [...en.guestPackages],
    guestMin: CATERING_DEFAULT_GUEST_MIN,
    guestMax: CATERING_DEFAULT_GUEST_MAX,
    notificationEmail: '',
  };
}

function pickText(stored: L<string> | undefined, fallback: L<string>): L<string> {
  return {
    en: stored?.en?.trim() ? stored.en : fallback.en,
    es: stored?.es?.trim() ? stored.es : fallback.es,
  };
}

function pickList(stored: L<string[]> | undefined, fallback: L<string[]>): L<string[]> {
  const clean = (items?: string[]) => (items ?? []).map((s) => s.trim()).filter(Boolean);
  const en = clean(stored?.en);
  const es = clean(stored?.es);
  return { en: en.length ? en : fallback.en, es: es.length ? es : fallback.es };
}

/** Stored (possibly partial / missing) catering content merged over the defaults. */
export function mergeCatering(stored?: Partial<CateringContent> | null): CateringContent {
  const d = getDefaultCatering();
  if (!stored) return d;

  const guestMin = Number.isFinite(stored.guestMin) && (stored.guestMin as number) > 0 ? (stored.guestMin as number) : d.guestMin;
  const guestMax =
    Number.isFinite(stored.guestMax) && (stored.guestMax as number) >= guestMin ? (stored.guestMax as number) : Math.max(d.guestMax, guestMin);

  return {
    tagline: pickText(stored.tagline, d.tagline),
    eventName: pickText(stored.eventName, d.eventName),
    headline: pickText(stored.headline, d.headline),
    serviceArea: pickText(stored.serviceArea, d.serviceArea),
    deliveryNote: pickText(stored.deliveryNote, d.deliveryNote),
    serviceDuration: pickText(stored.serviceDuration, d.serviceDuration),
    deposit: pickText(stored.deposit, d.deposit),
    balance: pickText(stored.balance, d.balance),
    bowlSizes: pickList(stored.bowlSizes, d.bowlSizes),
    venueTypes: pickList(stored.venueTypes, d.venueTypes),
    perfectFor: pickList(stored.perfectFor, d.perfectFor),
    freshFruits: pickList(stored.freshFruits, d.freshFruits),
    premiumToppings: pickList(stored.premiumToppings, d.premiumToppings),
    packageIncludes: pickList(stored.packageIncludes, d.packageIncludes),
    howItWorks: pickList(stored.howItWorks, d.howItWorks),
    guestPackages:
      Array.isArray(stored.guestPackages) && stored.guestPackages.length ? [...stored.guestPackages] : d.guestPackages,
    guestMin,
    guestMax,
    notificationEmail: stored.notificationEmail?.trim() ?? '',
  };
}

export function resolveCatering(stored: Partial<CateringContent> | null | undefined, locale: Locale): ResolvedCatering {
  const c = mergeCatering(stored);
  return {
    tagline: c.tagline[locale],
    name: c.eventName[locale],
    headline: c.headline[locale],
    serviceArea: c.serviceArea[locale],
    deliveryNote: c.deliveryNote[locale],
    serviceDuration: c.serviceDuration[locale],
    deposit: c.deposit[locale],
    balance: c.balance[locale],
    bowlSizes: c.bowlSizes[locale],
    venueTypes: c.venueTypes[locale],
    perfectFor: c.perfectFor[locale],
    freshFruits: c.freshFruits[locale],
    premiumToppings: c.premiumToppings[locale],
    packageIncludes: c.packageIncludes[locale],
    howItWorks: c.howItWorks[locale],
    guestPackages: c.guestPackages,
    guestMin: c.guestMin,
    guestMax: c.guestMax,
  };
}

// ─── Contact info ───────────────────────────────────────────────────────────

export interface SiteContact {
  email: string;
  phone: string;
  /** `tel:` href (digits and leading +). */
  phoneHref: string;
  address: { street: string; city: string; state: string; zip: string; country: string };
  /** Address as display lines, empty when nothing is filled in. */
  addressLines: string[];
  hours: BusinessHoursEntry[];
  instagram: { url: string; label: string };
  facebook: { url: string; label: string };
  tiktok: { url: string; label: string };
}

interface ContactSource {
  contactEmail?: string;
  contactPhone?: string;
  address?: Partial<SiteContact['address']>;
  hours?: BusinessHoursEntry[];
  social?: Array<{ platform: string; url: string; label?: string }>;
}

export function toTelHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}

/** Contact details as set in admin Settings, falling back to the built-in defaults. */
export function resolveContact(settings?: ContactSource | null): SiteContact {
  const phone = settings?.contactPhone?.trim() || CONTACT.phoneDisplay;
  const a = settings?.address ?? {};
  const address = {
    street: a.street?.trim() ?? '',
    city: a.city?.trim() || BUSINESS_DEFAULTS.address.city,
    state: a.state?.trim() || BUSINESS_DEFAULTS.address.state,
    zip: a.zip?.trim() ?? '',
    country: a.country?.trim() || BUSINESS_DEFAULTS.address.country,
  };
  const cityLine = [address.city, [address.state, address.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  const addressLines = [address.street, cityLine].filter(Boolean);

  const social = (platform: string, fallback: { url: string; label: string }) => {
    const entry = settings?.social?.find((s) => s.platform === platform && s.url?.trim());
    return entry ? { url: entry.url, label: entry.label?.trim() || fallback.label } : fallback;
  };

  return {
    email: settings?.contactEmail?.trim() || CONTACT.email,
    phone,
    phoneHref: toTelHref(phone),
    address,
    addressLines,
    hours: settings?.hours ?? [],
    instagram: social('instagram', { url: CONTACT.instagramUrl, label: CONTACT.instagramHandle }),
    facebook: social('facebook', { url: CONTACT.facebookUrl, label: CONTACT.facebookLabel }),
    tiktok: social('tiktok', { url: CONTACT.tiktokUrl, label: CONTACT.tiktokHandle }),
  };
}

const DAY_ORDER: BusinessHoursEntry['day'][] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_NAMES: Record<Locale, Record<BusinessHoursEntry['day'], string>> = {
  en: { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' },
  es: { monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles', thursday: 'Jueves', friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo' },
};

function formatTime(value: string, locale: Locale): string {
  const [h, m] = value.split(':').map(Number);
  if (Number.isNaN(h)) return value;
  const date = new Date();
  date.setHours(h, m ?? 0, 0, 0);
  return date.toLocaleTimeString(locale === 'es' ? 'es-US' : 'en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatHours(hours: BusinessHoursEntry[], locale: Locale): Array<{ day: string; value: string }> {
  return [...hours]
    .sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))
    .map((entry) => ({
      day: DAY_NAMES[locale][entry.day],
      value: entry.closed ? (locale === 'es' ? 'Cerrado' : 'Closed') : `${formatTime(entry.open, locale)} – ${formatTime(entry.close, locale)}`,
    }));
}

/**
 * One consistent, customer-friendly hours line per run of days with the same hours,
 * e.g. "Monday–Friday: 7:00 AM – 4:00 PM". Days missing from the list are shown as closed
 * so a day is never silently omitted.
 */
export function formatHoursGrouped(hours: BusinessHoursEntry[], locale: Locale): Array<{ days: string; value: string }> {
  const byDay = new Map(hours.map((entry) => [entry.day, entry]));
  const rows = DAY_ORDER.map((day) => {
    const entry = byDay.get(day);
    const value =
      !entry || entry.closed
        ? locale === 'es' ? 'Cerrado' : 'Closed'
        : `${formatTime(entry.open, locale)} – ${formatTime(entry.close, locale)}`;
    return { day, value };
  });
  const groups: Array<{ first: BusinessHoursEntry['day']; last: BusinessHoursEntry['day']; value: string }> = [];
  for (const row of rows) {
    const prev = groups[groups.length - 1];
    if (prev && prev.value === row.value) prev.last = row.day;
    else groups.push({ first: row.day, last: row.day, value: row.value });
  }
  return groups.map((g) => ({
    days: g.first === g.last ? DAY_NAMES[locale][g.first] : `${DAY_NAMES[locale][g.first]}–${DAY_NAMES[locale][g.last]}`,
    value: g.value,
  }));
}
