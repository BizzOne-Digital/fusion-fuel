import mongoose, { Document, Model, Schema } from 'mongoose';
import { SLUG_REGEX } from '@/lib/constants';
import { LocalizedRichTextSchema, LocalizedStringSchema } from '@/types';
import type { ContentStatus } from '@/types';

export interface IAddIn extends Document {
  name: { en: string; es: string };
  slug: string;
  description: { en: string; es: string };
  price: number;
  category: string;
  status: ContentStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const AddInSchema = new Schema<IAddIn>(
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
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true, index: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

AddInSchema.index({ slug: 1 }, { unique: true });
AddInSchema.index({ category: 1, status: 1, order: 1 });

const AddIn: Model<IAddIn> =
  mongoose.models.AddIn ?? mongoose.model<IAddIn>('AddIn', AddInSchema);

export default AddIn;
