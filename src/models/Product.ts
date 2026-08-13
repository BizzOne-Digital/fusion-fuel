import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { SLUG_REGEX } from '@/lib/constants';
import {
  ImageSchema,
  KitSize,
  LocalizedRichTextSchema,
  LocalizedStringSchema,
  NutritionSchema,
  ProductAddInOption,
  ProductVariant,
  SeoSchema,
} from '@/types';
import type { ContentStatus, DietaryTag, ProductType } from '@/types';

export interface IProduct extends Document {
  slug: string;
  sku: string;
  name: { en: string; es: string };
  shortDescription: { en: string; es: string };
  description: { en: string; es: string };
  productType: ProductType;
  categoryId?: Types.ObjectId;
  images: { url: string; alt: string; width?: number; height?: number }[];
  basePrice: number;
  compareAtPrice?: number;
  variants: ProductVariant[];
  flavorIds: Types.ObjectId[];
  kitSizes: KitSize[];
  addInOptions: ProductAddInOption[];
  inventory: {
    trackInventory: boolean;
    quantity: number;
    lowStockThreshold: number;
    allowBackorder: boolean;
  };
  allergens: string[];
  caffeineMg?: number;
  nutrition?: {
    servingSize?: string;
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    sugar?: number;
    fat?: number;
    fiber?: number;
    sodium?: number;
  };
  dietaryTags: DietaryTag[];
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: { url: string; alt: string; width?: number; height?: number };
    noIndex?: boolean;
  };
  status: ContentStatus;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<ProductVariant>(
  {
    sku: { type: String, required: true, trim: true, uppercase: true },
    name: { type: LocalizedStringSchema, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    inventory: { type: Number, min: 0, default: 0 },
    attributes: { type: Map, of: String },
  },
  { _id: true }
);

const KitSizeSchema = new Schema<KitSize>(
  {
    key: { type: String, required: true, trim: true },
    name: { type: LocalizedStringSchema, required: true },
    servings: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
  },
  { _id: false }
);

const ProductAddInOptionSchema = new Schema<ProductAddInOption>(
  {
    addInId: { type: Schema.Types.ObjectId, ref: 'AddIn', required: true },
    maxQuantity: { type: Number, min: 1, default: 1 },
    included: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [SLUG_REGEX, 'Invalid slug format'],
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: { type: LocalizedStringSchema, required: true },
    shortDescription: { type: LocalizedStringSchema, required: true },
    description: { type: LocalizedRichTextSchema, required: true },
    productType: {
      type: String,
      enum: ['single', 'kit', 'bundle', 'subscription'],
      default: 'single',
    },
    categoryId: { type: Schema.Types.ObjectId, ref: 'ProductCategory', index: true },
    images: { type: [ImageSchema], default: [] },
    basePrice: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    variants: { type: [ProductVariantSchema], default: [] },
    flavorIds: [{ type: Schema.Types.ObjectId, ref: 'Flavor' }],
    kitSizes: { type: [KitSizeSchema], default: [] },
    addInOptions: { type: [ProductAddInOptionSchema], default: [] },
    inventory: {
      trackInventory: { type: Boolean, default: true },
      quantity: { type: Number, min: 0, default: 0 },
      lowStockThreshold: { type: Number, min: 0, default: 5 },
      allowBackorder: { type: Boolean, default: false },
    },
    allergens: [{ type: String, trim: true }],
    caffeineMg: { type: Number, min: 0 },
    nutrition: NutritionSchema,
    dietaryTags: {
      type: [String],
      enum: [
        'vegan',
        'vegetarian',
        'gluten_free',
        'dairy_free',
        'nut_free',
        'keto',
        'organic',
        'non_gmo',
      ],
      default: [],
    },
    seo: { type: SeoSchema, default: () => ({}) },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ sku: 1 }, { unique: true });
ProductSchema.index({ status: 1, order: 1 });
ProductSchema.index({ categoryId: 1, status: 1 });
ProductSchema.index({ featured: 1, status: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
