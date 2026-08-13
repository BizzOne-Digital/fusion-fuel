import mongoose, { Document, Model, Schema } from 'mongoose';
import { SLUG_REGEX } from '@/lib/constants';
import { ImageSchema, LocalizedRichTextSchema, LocalizedStringSchema } from '@/types';
import type { ContentStatus } from '@/types';

export interface IProductCategory extends Document {
  name: { en: string; es: string };
  slug: string;
  description: { en: string; es: string };
  image?: { url: string; alt: string; width?: number; height?: number };
  order: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ProductCategorySchema = new Schema<IProductCategory>(
  {
    name: { type: LocalizedStringSchema, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [SLUG_REGEX, 'Invalid slug format'],
    },
    description: { type: LocalizedRichTextSchema, default: () => ({ en: '', es: '' }) },
    image: ImageSchema,
    order: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
  },
  { timestamps: true }
);

ProductCategorySchema.index({ slug: 1 }, { unique: true });
ProductCategorySchema.index({ status: 1, order: 1 });

const ProductCategory: Model<IProductCategory> =
  mongoose.models.ProductCategory ??
  mongoose.model<IProductCategory>('ProductCategory', ProductCategorySchema);

export default ProductCategory;
