import { Schema, Types } from 'mongoose';

// ─── Enums & union types ────────────────────────────────────────────────────

export type Locale = 'en' | 'es';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type AdminRole = 'super_admin' | 'admin' | 'editor';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type FulfillmentStatus =
  | 'unfulfilled'
  | 'partial'
  | 'fulfilled'
  | 'ready_for_pickup'
  | 'picked_up';

export type FulfillmentMethod = 'shipping' | 'pickup';

export type PromotionType = 'percentage' | 'fixed_amount' | 'free_shipping';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type ContactSubmissionStatus = 'new' | 'read' | 'replied' | 'archived';

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'publish'
  | 'unpublish';

export type DietaryTag =
  | 'vegan'
  | 'vegetarian'
  | 'gluten_free'
  | 'dairy_free'
  | 'nut_free'
  | 'keto'
  | 'organic'
  | 'non_gmo';

export type ProductType = 'single' | 'kit' | 'bundle' | 'subscription';

export type SectionTheme = 'light' | 'dark' | 'accent' | 'gradient';

// ─── Shared document shapes ─────────────────────────────────────────────────

export interface ImageObject {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface SeoFields {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: ImageObject;
  noIndex?: boolean;
}

export interface LocalizedString {
  en: string;
  es: string;
}

export interface LocalizedRichText {
  en: string;
  es: string;
}

export interface CtaButton {
  label: LocalizedString;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
  openInNewTab?: boolean;
}

export interface PageHero {
  title: LocalizedString;
  subtitle?: LocalizedString;
  backgroundImage?: ImageObject;
  cta?: CtaButton;
}

export interface PageSection {
  key: string;
  type: 'text' | 'image_text' | 'gallery' | 'cta' | 'features' | 'custom';
  title?: LocalizedString;
  body?: LocalizedRichText;
  images?: ImageObject[];
  cta?: CtaButton;
  theme?: SectionTheme;
  order: number;
  visible?: boolean;
}

export interface NutritionFacts {
  servingSize?: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  sugar?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
}

export interface ProductVariant {
  sku: string;
  name: LocalizedString;
  price: number;
  compareAtPrice?: number;
  inventory?: number;
  attributes?: Record<string, string>;
}

export interface KitSize {
  key: string;
  name: LocalizedString;
  servings: number;
  price: number;
  compareAtPrice?: number;
}

export interface ProductAddInOption {
  addInId: Types.ObjectId;
  maxQuantity?: number;
  included?: boolean;
}

export interface CartAddIn {
  addInId: Types.ObjectId;
  name: LocalizedString;
  quantity: number;
  unitPrice: number;
}

export interface CartKitConfig {
  kitSizeKey: string;
  kitSizeName: LocalizedString;
  servings: number;
  unitPrice: number;
}

export interface CartItem {
  productId: Types.ObjectId;
  productName: LocalizedString;
  productSlug: string;
  sku?: string;
  variantSku?: string;
  variantName?: LocalizedString;
  flavorIds?: Types.ObjectId[];
  flavorNames?: LocalizedString[];
  addIns?: CartAddIn[];
  kitConfig?: CartKitConfig;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  notes?: string;
}

export interface OrderLineItem extends CartItem {
  refundedQuantity?: number;
  refundedAmount?: number;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
}

export interface ShippingAddress {
  label?: string;
  name: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

export interface PickupDetails {
  locationName: string;
  address: string;
  scheduledAt?: Date;
  instructions?: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  note?: string;
  changedAt: Date;
  changedBy?: Types.ObjectId;
}

export interface RefundRecord {
  stripeRefundId?: string;
  amount: number;
  reason?: string;
  refundedAt: Date;
  items?: { lineItemIndex: number; quantity: number; amount: number }[];
}

export interface PromotionRules {
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  applicableProductIds?: Types.ObjectId[];
  applicableCategoryIds?: Types.ObjectId[];
}

export interface PromotionEligibility {
  firstOrderOnly?: boolean;
  customerIds?: Types.ObjectId[];
  excludedCustomerIds?: Types.ObjectId[];
  requiredProductIds?: Types.ObjectId[];
}

export interface PromotionLimits {
  maxUses?: number;
  maxUsesPerCustomer?: number;
  currentUses?: number;
}

export interface ServiceFaq {
  question: LocalizedString;
  answer: LocalizedRichText;
  order: number;
}

export interface ServiceSection {
  title: LocalizedString;
  body: LocalizedRichText;
  image?: ImageObject;
  order: number;
}

export interface BlogContentSection {
  heading?: string;
  body: string;
  image?: ImageObject;
  order: number;
}

export interface BusinessHoursEntry {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string;
  close: string;
  closed?: boolean;
}

export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'youtube' | 'linkedin';
  url: string;
  label?: string;
}

export interface LegalLink {
  label: LocalizedString;
  href: string;
}

export interface ShippingSettings {
  enabled: boolean;
  flatRate?: number;
  freeShippingThreshold?: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  zones?: { name: string; states: string[]; rate: number }[];
}

export interface PickupSettings {
  enabled: boolean;
  locations?: {
    name: string;
    address: string;
    instructions?: LocalizedString;
  }[];
}

export interface AnnouncementBar {
  enabled: boolean;
  message: LocalizedString;
  link?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface FooterSettings {
  tagline?: LocalizedString;
  columns?: {
    title: LocalizedString;
    links: { label: LocalizedString; href: string }[];
  }[];
}

// ─── Reusable Mongoose sub-schemas ──────────────────────────────────────────

export const ImageSchema = new Schema<ImageObject>(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },
  { _id: false }
);

export const LocalizedStringSchema = new Schema<LocalizedString>(
  {
    en: { type: String, required: true, trim: true },
    es: { type: String, required: true, trim: true },
  },
  { _id: false }
);

export const LocalizedRichTextSchema = new Schema<LocalizedRichText>(
  {
    en: { type: String, required: true },
    es: { type: String, required: true },
  },
  { _id: false }
);

export const SeoSchema = new Schema<SeoFields>(
  {
    title: { type: String, trim: true, maxlength: 70 },
    description: { type: String, trim: true, maxlength: 160 },
    keywords: [{ type: String, trim: true }],
    ogImage: ImageSchema,
    noIndex: { type: Boolean, default: false },
  },
  { _id: false }
);

export const CtaButtonSchema = new Schema<CtaButton>(
  {
    label: { type: LocalizedStringSchema, required: true },
    href: { type: String, required: true, trim: true },
    variant: {
      type: String,
      enum: ['primary', 'secondary', 'outline'],
      default: 'primary',
    },
    openInNewTab: { type: Boolean, default: false },
  },
  { _id: false }
);

export const NutritionSchema = new Schema<NutritionFacts>(
  {
    servingSize: { type: String, trim: true },
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbohydrates: { type: Number, min: 0 },
    sugar: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    fiber: { type: Number, min: 0 },
    sodium: { type: Number, min: 0 },
  },
  { _id: false }
);
