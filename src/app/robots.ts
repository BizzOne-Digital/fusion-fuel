import type { MetadataRoute } from 'next';

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/account/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
