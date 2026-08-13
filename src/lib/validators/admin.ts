import { z } from 'zod';
import { EMAIL_REGEX, SLUG_REGEX } from '@/lib/constants';

const localizedStringSchema = z.object({
  en: z.string().trim().min(1),
  es: z.string().trim().min(1),
});

const imageSchema = z.object({
  url: z.string().trim().min(1),
  alt: z.string().trim().min(1),
  width: z.number().int().min(0).optional(),
  height: z.number().int().min(0).optional(),
});

export const adminUserFormSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .regex(EMAIL_REGEX, 'Invalid email address'),
  name: z.string().trim().min(2).max(120),
  role: z.enum(['super_admin', 'admin', 'editor']),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .optional(),
});

export const categoryFormSchema = z.object({
  name: localizedStringSchema,
  slug: z.string().trim().regex(SLUG_REGEX, 'Invalid slug format'),
  description: localizedStringSchema.optional(),
  image: imageSchema.optional(),
  displayOrder: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export const flavorFormSchema = z.object({
  name: localizedStringSchema,
  slug: z.string().trim().regex(SLUG_REGEX, 'Invalid slug format'),
  category: z.string().trim().max(64).optional(),
  color: z.string().trim().max(32).optional(),
  description: localizedStringSchema.optional(),
  displayOrder: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export const addInFormSchema = z.object({
  name: localizedStringSchema,
  slug: z.string().trim().regex(SLUG_REGEX, 'Invalid slug format'),
  description: localizedStringSchema.optional(),
  price: z.number().int().min(0),
  category: z.string().trim().max(64).optional(),
  displayOrder: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export const promotionFormSchema = z.object({
  code: z.string().trim().toUpperCase().min(2).max(32).optional(),
  name: localizedStringSchema,
  description: localizedStringSchema.optional(),
  type: z.enum(['percentage', 'fixed_amount', 'free_shipping']),
  automatic: z.boolean().default(false),
  discountValue: z.number().int().min(0),
  minimumOrderAmount: z.number().int().min(0).optional(),
  maximumDiscountAmount: z.number().int().min(0).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  maxUses: z.number().int().min(1).optional(),
  maxUsesPerCustomer: z.number().int().min(1).optional(),
  firstOrderOnly: z.boolean().default(false),
  active: z.boolean().default(false),
});

export const serviceListingFormSchema = z.object({
  name: localizedStringSchema,
  slug: z.string().trim().regex(SLUG_REGEX, 'Invalid slug format'),
  shortDescription: localizedStringSchema,
  mainImage: imageSchema,
  highlights: z.array(localizedStringSchema).optional(),
  priceText: localizedStringSchema.optional(),
  displayOrder: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export const siteSettingsFormSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  email: z.string().trim().regex(EMAIL_REGEX),
  phone: z.string().trim().max(30).optional(),
  instagram: z.string().trim().url().optional().or(z.literal('')),
  currency: z.string().trim().length(3).default('USD'),
});

export type AdminUserFormInput = z.infer<typeof adminUserFormSchema>;
export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
export type FlavorFormInput = z.infer<typeof flavorFormSchema>;
export type AddInFormInput = z.infer<typeof addInFormSchema>;
export type PromotionFormInput = z.infer<typeof promotionFormSchema>;
export type ServiceListingFormInput = z.infer<typeof serviceListingFormSchema>;
export type SiteSettingsFormInput = z.infer<typeof siteSettingsFormSchema>;

const seoSchema = z.object({
  title: z.string().trim().max(70).optional(),
  description: z.string().trim().max(160).optional(),
  keywords: z.array(z.string().trim()).optional(),
  ogImage: imageSchema.optional(),
  noIndex: z.boolean().optional(),
});

export const pageFormSchema = z.object({
  pageKey: z.string().trim().min(1).max(64),
  title: localizedStringSchema,
  seo: seoSchema.optional(),
  hero: z
    .object({
      title: localizedStringSchema,
      subtitle: localizedStringSchema.optional(),
      backgroundImage: imageSchema.optional(),
      cta: z
        .object({
          label: localizedStringSchema,
          href: z.string().trim().min(1),
          variant: z.enum(['primary', 'secondary', 'outline']).optional(),
          openInNewTab: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
  sections: z
    .array(
      z.object({
        key: z.string().trim().min(1),
        type: z.enum(['text', 'image_text', 'gallery', 'cta', 'features', 'custom']),
        title: localizedStringSchema.optional(),
        body: z.object({ en: z.string(), es: z.string() }).optional(),
        images: z.array(imageSchema).optional(),
        cta: z
          .object({
            label: localizedStringSchema,
            href: z.string().trim().min(1),
            variant: z.enum(['primary', 'secondary', 'outline']).optional(),
            openInNewTab: z.boolean().optional(),
          })
          .optional(),
        theme: z.enum(['light', 'dark', 'accent', 'gradient']).optional(),
        order: z.number().int().min(0),
        visible: z.boolean().optional(),
      })
    )
    .default([]),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export const serviceFormSchema = z.object({
  name: localizedStringSchema,
  slug: z.string().trim().regex(SLUG_REGEX, 'Invalid slug format'),
  shortDescription: localizedStringSchema,
  description: z.object({ en: z.string().min(1), es: z.string().min(1) }),
  detailContent: z.object({ en: z.string().min(1), es: z.string().min(1) }),
  thumbnail: imageSchema.optional(),
  heroImage: imageSchema.optional(),
  startingPrice: z.number().int().min(0).optional(),
  seo: seoSchema.optional(),
  sections: z
    .array(
      z.object({
        title: localizedStringSchema,
        body: z.object({ en: z.string().min(1), es: z.string().min(1) }),
        image: imageSchema.optional(),
        order: z.number().int().min(0),
      })
    )
    .default([]),
  faqs: z
    .array(
      z.object({
        question: localizedStringSchema,
        answer: z.object({ en: z.string().min(1), es: z.string().min(1) }),
        order: z.number().int().min(0),
      })
    )
    .default([]),
  order: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export const orderStatusUpdateSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'processing',
    'ready',
    'shipped',
    'delivered',
    'completed',
    'cancelled',
    'refunded',
  ]),
  note: z.string().trim().max(500).optional(),
  internalNotes: z.string().trim().max(2000).optional(),
});

export const bookingStatusUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
  internalNotes: z.string().trim().max(2000).optional(),
  depositPaid: z.boolean().optional(),
});

export const faqFormSchema = z.object({
  category: z.string().trim().min(1).max(64),
  question: localizedStringSchema,
  answer: z.object({ en: z.string().min(1), es: z.string().min(1) }),
  locale: z.array(z.enum(['en', 'es'])).default(['en', 'es']),
  order: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
});

export const testimonialFormSchema = z.object({
  name: z.string().trim().min(1).max(120),
  role: localizedStringSchema.optional(),
  quote: localizedStringSchema,
  image: imageSchema.optional(),
  rating: z.number().int().min(1).max(5),
  verified: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export const galleryCategoryFormSchema = z.object({
  name: localizedStringSchema,
  slug: z.string().trim().regex(SLUG_REGEX, 'Invalid slug format'),
  description: localizedStringSchema.optional(),
  coverImage: imageSchema.optional(),
  order: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
});

export const galleryImageFormSchema = z.object({
  categoryId: z.string().trim().min(1),
  title: localizedStringSchema,
  caption: localizedStringSchema.optional(),
  image: imageSchema,
  tags: z.array(z.string().trim()).default([]),
  order: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
});

export const blogPostFormSchema = z.object({
  title: localizedStringSchema,
  slug: z.string().trim().regex(SLUG_REGEX, 'Invalid slug format'),
  excerpt: localizedStringSchema,
  contentSections: z
    .array(
      z.object({
        heading: z.string().trim().optional(),
        body: z.string().min(1),
        image: imageSchema.optional(),
        order: z.number().int().min(0),
      })
    )
    .default([]),
  featuredImage: imageSchema.optional(),
  author: z.string().trim().max(120).optional(),
  tags: z.array(z.string().trim()).default([]),
  seo: seoSchema.optional(),
  locale: z.array(z.enum(['en', 'es'])).default(['en']),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  publishedAt: z.coerce.date().optional(),
});

export const pricingFormSchema = z.object({
  shipping: z.object({
    enabled: z.boolean(),
    flatRate: z.number().int().min(0).optional(),
    freeShippingThreshold: z.number().int().min(0).optional(),
    estimatedDaysMin: z.number().int().min(0).optional(),
    estimatedDaysMax: z.number().int().min(0).optional(),
    zones: z
      .array(
        z.object({
          name: z.string().trim().min(1),
          states: z.array(z.string().trim()),
          rate: z.number().int().min(0),
        })
      )
      .optional(),
  }),
  pickup: z.object({
    enabled: z.boolean(),
    locations: z
      .array(
        z.object({
          name: z.string().trim().min(1),
          address: z.string().trim().min(1),
          instructions: localizedStringSchema.optional(),
        })
      )
      .optional(),
  }),
  taxRateBps: z.number().int().min(0).max(10000).default(0),
  currency: z.string().trim().length(3).default('USD'),
});

export const settingsFormSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  tagline: localizedStringSchema,
  contactEmail: z.string().trim().regex(EMAIL_REGEX),
  contactPhone: z.string().trim().max(30),
  address: z.object({
    street: z.string().trim().min(1),
    city: z.string().trim().min(1),
    state: z.string().trim().min(1),
    zip: z.string().trim().min(1),
    country: z.string().trim().min(2).default('US'),
  }),
  timezone: z.string().trim().min(1),
  seo: seoSchema.optional(),
  announcement: z.object({
    enabled: z.boolean(),
    message: localizedStringSchema,
    link: z.string().trim().optional(),
    backgroundColor: z.string().trim().optional(),
    textColor: z.string().trim().optional(),
  }),
  social: z
    .array(
      z.object({
        platform: z.enum(['instagram', 'facebook', 'tiktok', 'twitter', 'youtube', 'linkedin']),
        url: z.string().trim().url(),
        label: z.string().trim().optional(),
      })
    )
    .default([]),
  hours: z
    .array(
      z.object({
        day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
        open: z.string().trim().min(1),
        close: z.string().trim().min(1),
        closed: z.boolean().optional(),
      })
    )
    .default([]),
});

export const integrationTestSchema = z.object({
  eventType: z
    .enum(['customer.created', 'order.paid', 'order.status_changed', 'booking.created', 'contact.created'])
    .default('contact.created'),
});

export const translationUpdateSchema = z.object({
  locale: z.enum(['en', 'es']),
  translations: z.record(z.union([z.string(), z.record(z.unknown())])),
});

export const contactSubmissionUpdateSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']),
  adminNotes: z.string().trim().max(2000).optional(),
});

export type PageFormInput = z.infer<typeof pageFormSchema>;
export type ServiceFormInput = z.infer<typeof serviceFormSchema>;
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
export type BookingStatusUpdateInput = z.infer<typeof bookingStatusUpdateSchema>;
export type FAQFormInput = z.infer<typeof faqFormSchema>;
export type TestimonialFormInput = z.infer<typeof testimonialFormSchema>;
export type GalleryCategoryFormInput = z.infer<typeof galleryCategoryFormSchema>;
export type GalleryImageFormInput = z.infer<typeof galleryImageFormSchema>;
export type BlogPostFormInput = z.infer<typeof blogPostFormSchema>;
export type PricingFormInput = z.infer<typeof pricingFormSchema>;
export type SettingsFormInput = z.infer<typeof settingsFormSchema>;
