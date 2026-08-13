import connectDB from '@/lib/mongodb';
import FAQ from '@/models/FAQ';
import Testimonial from '@/models/Testimonial';
import { serializeForClient } from '@/lib/utils';
import type { IFAQ } from '@/models/FAQ';
import type { ITestimonial } from '@/models/Testimonial';
import type { Locale } from '@/types';

export async function getPublishedFaqs(locale: Locale): Promise<IFAQ[]> {
  try {
    await connectDB();
    return serializeForClient(
      await FAQ.find({ status: 'published', locale: { $in: [locale] } })
        .sort({ order: 1 })
        .lean<IFAQ[]>()
    );
  } catch {
    return [];
  }
}

export async function getPublishedTestimonials(limit = 6): Promise<ITestimonial[]> {
  try {
    await connectDB();
    return serializeForClient(
      await Testimonial.find({ status: 'published' })
        .sort({ order: 1 })
        .limit(limit)
        .lean<ITestimonial[]>()
    );
  } catch {
    return [];
  }
}

export { getPageByKey, getPublishedPages, getHomeFallback } from './pages';
export { getPublishedProducts, getProductBySlug, getPublishedCategories, getPublishedFlavors, getPublishedAddIns, getKitProducts } from './products';
export { getPublishedServices, getServiceBySlug } from './services';
export { getSiteSettings, getDefaultSettings } from './settings';
