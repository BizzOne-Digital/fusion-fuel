import { z } from 'zod';
import { SLUG_REGEX } from '@/lib/constants';

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

const variantSchema = z.object({
  sku: z.string().trim().min(1).max(64),
  name: localizedStringSchema,
  price: z.number().int().min(0),
  compareAtPrice: z.number().int().min(0).optional(),
  inventory: z.number().int().min(0).optional(),
  attributes: z.record(z.string()).optional(),
});

const kitSizeSchema = z.object({
  key: z.string().trim().min(1).max(32),
  name: localizedStringSchema,
  servings: z.number().int().min(1),
  price: z.number().int().min(0),
  compareAtPrice: z.number().int().min(0).optional(),
});

export const productFormSchema = z.object({
  name: localizedStringSchema,
  slug: z.string().trim().regex(SLUG_REGEX, 'Invalid slug format'),
  sku: z.string().trim().min(1).max(64),
  shortDescription: localizedStringSchema,
  fullDescription: z.object({
    en: z.string().min(1),
    es: z.string().min(1),
  }),
  categoryId: z.string().trim().min(1),
  images: z.array(imageSchema).min(1),
  price: z.number().int().min(0).optional(),
  compareAtPrice: z.number().int().min(0).optional(),
  cost: z.number().int().min(0).optional(),
  currency: z.string().trim().length(3).default('USD'),
  taxCategory: z.string().trim().max(64).optional(),
  trackInventory: z.boolean().default(false),
  inventory: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  preparationTime: z.string().trim().max(120).optional(),
  ingredients: localizedStringSchema.optional(),
  allergenInfo: localizedStringSchema.optional(),
  caffeineInfo: localizedStringSchema.optional(),
  dietaryTags: z.array(z.string()).optional(),
  productType: z.enum(['single', 'kit', 'bundle', 'subscription']).default('single'),
  variants: z.array(variantSchema).optional(),
  kitSizes: z.array(kitSizeSchema).optional(),
  maxSelectableFlavors: z.number().int().min(0).optional(),
  shippingEligible: z.boolean().default(true),
  pickupEligible: z.boolean().default(true),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  displayOrder: z.number().int().min(0).default(0),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
