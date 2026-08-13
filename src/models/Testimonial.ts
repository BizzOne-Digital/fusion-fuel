import mongoose, { Document, Model, Schema } from 'mongoose';
import { ImageSchema, LocalizedStringSchema } from '@/types';
import type { ContentStatus } from '@/types';

export interface ITestimonial extends Document {
  name: string;
  role?: { en: string; es: string };
  quote: { en: string; es: string };
  image?: { url: string; alt: string; width?: number; height?: number };
  rating: number;
  verified: boolean;
  status: ContentStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: LocalizedStringSchema,
    quote: { type: LocalizedStringSchema, required: true },
    image: ImageSchema,
    rating: { type: Number, required: true, min: 1, max: 5 },
    verified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

TestimonialSchema.index({ status: 1, order: 1 });
TestimonialSchema.index({ verified: 1, status: 1 });

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ??
  mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;
