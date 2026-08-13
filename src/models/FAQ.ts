import mongoose, { Document, Model, Schema } from 'mongoose';
import { LocalizedRichTextSchema, LocalizedStringSchema } from '@/types';
import type { ContentStatus, Locale } from '@/types';

export interface IFAQ extends Document {
  category: string;
  question: { en: string; es: string };
  answer: { en: string; es: string };
  locale: Locale[];
  order: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    category: { type: String, required: true, trim: true, index: true },
    question: { type: LocalizedStringSchema, required: true },
    answer: { type: LocalizedRichTextSchema, required: true },
    locale: {
      type: [String],
      enum: ['en', 'es'],
      default: ['en', 'es'],
    },
    order: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
  },
  { timestamps: true }
);

FAQSchema.index({ category: 1, status: 1, order: 1 });
FAQSchema.index({ locale: 1, status: 1 });

const FAQ: Model<IFAQ> =
  mongoose.models.FAQ ?? mongoose.model<IFAQ>('FAQ', FAQSchema);

export default FAQ;
