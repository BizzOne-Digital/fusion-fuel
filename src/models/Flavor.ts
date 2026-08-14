import mongoose, { Document, Model, Schema } from 'mongoose';
import { SLUG_REGEX } from '@/lib/constants';
import { LocalizedRichTextSchema, LocalizedStringSchema } from '@/types';
import type { ContentStatus } from '@/types';

export interface IFlavor extends Document {
  name: { en: string; es: string };
  slug: string;
  category: string;
  color: string;
  description: { en: string; es: string };
  image?: { url: string; alt: string };
  status: ContentStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FlavorSchema = new Schema<IFlavor>(
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
    category: { type: String, required: true, trim: true, index: true },
    color: { type: String, required: true, trim: true },
    description: { type: LocalizedRichTextSchema, default: () => ({ en: '', es: '' }) },
    image: {
      url: { type: String, trim: true },
      alt: { type: String, trim: true, default: '' },
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

FlavorSchema.index({ slug: 1 }, { unique: true });
FlavorSchema.index({ category: 1, status: 1, order: 1 });

const Flavor: Model<IFlavor> =
  mongoose.models.Flavor ?? mongoose.model<IFlavor>('Flavor', FlavorSchema);

export default Flavor;
