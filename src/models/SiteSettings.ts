import mongoose, { Document, Model, Schema } from 'mongoose';
import {
  BRAND,
  BUSINESS_DEFAULTS,
  DEFAULT_BUSINESS_HOURS,
  DEFAULT_CURRENCY,
  SITE_SETTINGS_KEY,
  SUPPORTED_LOCALES,
} from '@/lib/constants';
import {
  AnnouncementBar,
  FooterSettings,
  LegalLink,
  LocalizedStringSchema,
  PickupSettings,
  SeoSchema,
  ShippingSettings,
  SocialLink,
  BusinessHoursEntry,
} from '@/types';

export interface ISiteSettings extends Document {
  key: string;
  businessName: string;
  tagline: { en: string; es: string };
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  timezone: string;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: { url: string; alt: string; width?: number; height?: number };
    noIndex?: boolean;
  };
  announcement: AnnouncementBar;
  shipping: ShippingSettings;
  pickup: PickupSettings;
  currency: string;
  taxRateBps: number;
  locales: string[];
  defaultLocale: string;
  footer: FooterSettings;
  social: SocialLink[];
  hours: BusinessHoursEntry[];
  legalLinks: LegalLink[];
  createdAt: Date;
  updatedAt: Date;
}

const BusinessHoursSchema = new Schema<BusinessHoursEntry>(
  {
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true,
    },
    open: { type: String, required: true },
    close: { type: String, required: true },
    closed: { type: Boolean, default: false },
  },
  { _id: false }
);

const SocialLinkSchema = new Schema<SocialLink>(
  {
    platform: {
      type: String,
      enum: ['instagram', 'facebook', 'tiktok', 'twitter', 'youtube', 'linkedin'],
      required: true,
    },
    url: { type: String, required: true, trim: true },
    label: { type: String, trim: true },
  },
  { _id: false }
);

const LegalLinkSchema = new Schema<LegalLink>(
  {
    label: { type: LocalizedStringSchema, required: true },
    href: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: SITE_SETTINGS_KEY,
    },
    businessName: { type: String, default: BRAND.name, trim: true },
    tagline: { type: LocalizedStringSchema, default: () => ({ ...BRAND.tagline }) },
    contactEmail: { type: String, default: BUSINESS_DEFAULTS.email, trim: true },
    contactPhone: { type: String, default: BUSINESS_DEFAULTS.phone, trim: true },
    address: {
      street: { type: String, default: BUSINESS_DEFAULTS.address.street },
      city: { type: String, default: BUSINESS_DEFAULTS.address.city },
      state: { type: String, default: BUSINESS_DEFAULTS.address.state },
      zip: { type: String, default: BUSINESS_DEFAULTS.address.zip },
      country: { type: String, default: BUSINESS_DEFAULTS.address.country },
    },
    timezone: { type: String, default: BUSINESS_DEFAULTS.timezone },
    seo: { type: SeoSchema, default: () => ({}) },
    announcement: {
      enabled: { type: Boolean, default: false },
      message: {
        type: LocalizedStringSchema,
        default: () => ({ en: '', es: '' }),
      },
      link: { type: String, trim: true },
      backgroundColor: { type: String, trim: true },
      textColor: { type: String, trim: true },
    },
    shipping: {
      enabled: { type: Boolean, default: true },
      flatRate: { type: Number, min: 0 },
      freeShippingThreshold: { type: Number, min: 0 },
      estimatedDaysMin: { type: Number, min: 0 },
      estimatedDaysMax: { type: Number, min: 0 },
      zones: [
        {
          name: { type: String, trim: true },
          states: [{ type: String, trim: true }],
          rate: { type: Number, min: 0 },
        },
      ],
    },
    pickup: {
      enabled: { type: Boolean, default: true },
      locations: [
        {
          name: { type: String, trim: true },
          address: { type: String, trim: true },
          instructions: LocalizedStringSchema,
        },
      ],
    },
    currency: { type: String, default: DEFAULT_CURRENCY, uppercase: true, maxlength: 3 },
    taxRateBps: { type: Number, min: 0, default: 0 },
    locales: { type: [String], default: () => [...SUPPORTED_LOCALES] },
    defaultLocale: { type: String, default: 'en' },
    footer: {
      tagline: LocalizedStringSchema,
      columns: [
        {
          title: LocalizedStringSchema,
          links: [
            {
              label: LocalizedStringSchema,
              href: { type: String, trim: true },
            },
          ],
        },
      ],
    },
    social: [SocialLinkSchema],
    hours: { type: [BusinessHoursSchema], default: () => [...DEFAULT_BUSINESS_HOURS] },
    legalLinks: [LegalLinkSchema],
  },
  { timestamps: true }
);

SiteSettingsSchema.index({ key: 1 }, { unique: true });

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ??
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
