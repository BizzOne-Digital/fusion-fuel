import mongoose, { Document, Model, Schema } from 'mongoose';
import { SLUG_REGEX } from '@/lib/constants';
import { ImageSchema, LocalizedStringSchema } from '@/types';
import type { ContentStatus } from '@/types';

export interface IGalleryCategory extends Document {
  name: { en: string; es: string };
  slug: string;
  description?: { en: string; es: string };
  coverImage?: { url: string; alt: string; width?: number; height?: number };
  order: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryCategorySchema = new Schema<IGalleryCategory>(
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
    description: LocalizedStringSchema,
    coverImage: ImageSchema,
    order: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
  },
  { timestamps: true }
);

GalleryCategorySchema.index({ slug: 1 }, { unique: true });
GalleryCategorySchema.index({ status: 1, order: 1 });

const GalleryCategory: Model<IGalleryCategory> =
  mongoose.models.GalleryCategory ??
  mongoose.model<IGalleryCategory>('GalleryCategory', GalleryCategorySchema);

export default GalleryCategory;
