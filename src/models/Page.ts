import mongoose, { Document, Model, Schema } from 'mongoose';
import {
  CtaButtonSchema,
  ImageSchema,
  LocalizedRichTextSchema,
  LocalizedStringSchema,
  PageHero,
  PageSection,
  SeoSchema,
} from '@/types';
import type { ContentStatus } from '@/types';

export interface IPage extends Document {
  pageKey: string;
  title: { en: string; es: string };
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: { url: string; alt: string; width?: number; height?: number };
    noIndex?: boolean;
  };
  hero?: PageHero;
  sections: PageSection[];
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PageHeroSchema = new Schema<PageHero>(
  {
    title: { type: LocalizedStringSchema, required: true },
    subtitle: LocalizedStringSchema,
    backgroundImage: ImageSchema,
    cta: CtaButtonSchema,
  },
  { _id: false }
);

const PageSectionSchema = new Schema<PageSection>(
  {
    key: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['text', 'image_text', 'gallery', 'cta', 'features', 'custom'],
      required: true,
    },
    title: LocalizedStringSchema,
    body: LocalizedRichTextSchema,
    images: [ImageSchema],
    cta: CtaButtonSchema,
    theme: {
      type: String,
      enum: ['light', 'dark', 'accent', 'gradient'],
      default: 'light',
    },
    order: { type: Number, required: true, min: 0 },
    visible: { type: Boolean, default: true },
  },
  { _id: true }
);

const PageSchema = new Schema<IPage>(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: LocalizedStringSchema, required: true },
    seo: { type: SeoSchema, default: () => ({}) },
    hero: PageHeroSchema,
    sections: { type: [PageSectionSchema], default: [] },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

PageSchema.index({ pageKey: 1 }, { unique: true });
PageSchema.index({ status: 1 });

const Page: Model<IPage> =
  mongoose.models.Page ?? mongoose.model<IPage>('Page', PageSchema);

export default Page;
