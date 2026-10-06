import mongoose, { Document, Model, Schema } from 'mongoose';
import { SLUG_REGEX } from '@/lib/constants';
import {
  BlogContentSection,
  ImageSchema,
  LocalizedStringSchema,
  SeoSchema,
} from '@/types';
import type { ContentStatus, Locale } from '@/types';

export interface IBlogPost extends Document {
  title: { en: string; es: string };
  slug: string;
  excerpt: { en: string; es: string };
  contentSections: BlogContentSection[];
  featuredImage?: { url: string; alt: string; width?: number; height?: number };
  author?: string;
  tags: string[];
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: { url: string; alt: string; width?: number; height?: number };
    noIndex?: boolean;
  };
  locale: Locale[];
  status: ContentStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogContentSectionSchema = new Schema<BlogContentSection>(
  {
    heading: { type: String, trim: true },
    body: { type: String, required: true },
    image: ImageSchema,
    order: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: LocalizedStringSchema, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [SLUG_REGEX, 'Invalid slug format'],
    },
    excerpt: { type: LocalizedStringSchema, required: true },
    contentSections: { type: [BlogContentSectionSchema], default: [] },
    featuredImage: ImageSchema,
    author: { type: String, trim: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    seo: { type: SeoSchema, default: () => ({}) },
    locale: {
      type: [String],
      enum: ['en', 'es'],
      default: ['en'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

BlogPostSchema.index({ slug: 1 }, { unique: true });
BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ locale: 1, status: 1 });

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost ?? mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;
