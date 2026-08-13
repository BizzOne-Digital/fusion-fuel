import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { ImageSchema, LocalizedStringSchema } from '@/types';
import type { ContentStatus } from '@/types';

export interface IGalleryImage extends Document {
  categoryId: Types.ObjectId;
  title: { en: string; es: string };
  caption?: { en: string; es: string };
  image: { url: string; alt: string; width?: number; height?: number };
  tags: string[];
  order: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'GalleryCategory',
      required: true,
      index: true,
    },
    title: { type: LocalizedStringSchema, required: true },
    caption: LocalizedStringSchema,
    image: { type: ImageSchema, required: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    order: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
  },
  { timestamps: true }
);

GalleryImageSchema.index({ categoryId: 1, status: 1, order: 1 });
GalleryImageSchema.index({ tags: 1 });

const GalleryImage: Model<IGalleryImage> =
  mongoose.models.GalleryImage ??
  mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema);

export default GalleryImage;
