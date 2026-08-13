import mongoose, { Document, Model, Schema } from 'mongoose';
import { SLUG_REGEX } from '@/lib/constants';
import {
  ImageSchema,
  LocalizedRichTextSchema,
  LocalizedStringSchema,
  SeoSchema,
  ServiceFaq,
  ServiceSection,
} from '@/types';
import type { ContentStatus } from '@/types';

export interface IService extends Document {
  slug: string;
  name: { en: string; es: string };
  shortDescription: { en: string; es: string };
  description: { en: string; es: string };
  thumbnail?: { url: string; alt: string; width?: number; height?: number };
  heroImage?: { url: string; alt: string; width?: number; height?: number };
  startingPrice?: number;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: { url: string; alt: string; width?: number; height?: number };
    noIndex?: boolean;
  };
  detailContent: { en: string; es: string };
  faqs: ServiceFaq[];
  sections: ServiceSection[];
  status: ContentStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceFaqSchema = new Schema<ServiceFaq>(
  {
    question: { type: LocalizedStringSchema, required: true },
    answer: { type: LocalizedRichTextSchema, required: true },
    order: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const ServiceSectionSchema = new Schema<ServiceSection>(
  {
    title: { type: LocalizedStringSchema, required: true },
    body: { type: LocalizedRichTextSchema, required: true },
    image: ImageSchema,
    order: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const ServiceSchema = new Schema<IService>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [SLUG_REGEX, 'Invalid slug format'],
    },
    name: { type: LocalizedStringSchema, required: true },
    shortDescription: { type: LocalizedStringSchema, required: true },
    description: { type: LocalizedRichTextSchema, required: true },
    thumbnail: ImageSchema,
    heroImage: ImageSchema,
    startingPrice: { type: Number, min: 0 },
    seo: { type: SeoSchema, default: () => ({}) },
    detailContent: { type: LocalizedRichTextSchema, required: true },
    faqs: { type: [ServiceFaqSchema], default: [] },
    sections: { type: [ServiceSectionSchema], default: [] },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

ServiceSchema.index({ slug: 1 }, { unique: true });
ServiceSchema.index({ status: 1, order: 1 });

const Service: Model<IService> =
  mongoose.models.Service ?? mongoose.model<IService>('Service', ServiceSchema);

export default Service;
