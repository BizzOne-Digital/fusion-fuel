import type { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import { SUPPORTED_LOCALES } from '@/lib/constants';
import Product from '@/models/Product';
import Service from '@/models/Service';

const STATIC_ROUTES = [
  '',
  '/about',
  '/services',
  '/pricing',
  '/menu',
  '/booking',
  '/testimonials',
  '/faqs',
  '/contact',
];

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: `${base}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    }
  }

  try {
    await connectDB();

    const [services, products] = await Promise.all([
      Service.find({ status: 'published' }).select('slug updatedAt').lean(),
      Product.find({ status: 'published' }).select('slug updatedAt').lean(),
    ]);

    for (const locale of SUPPORTED_LOCALES) {
      for (const service of services) {
        entries.push({
          url: `${base}/${locale}/services/${service.slug}`,
          lastModified: service.updatedAt ?? new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }

      for (const product of products) {
        entries.push({
          url: `${base}/${locale}/products/${product.slug}`,
          lastModified: product.updatedAt ?? new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  } catch {
    // Return static entries when the database is unavailable at build/runtime.
  }

  return entries;
}
