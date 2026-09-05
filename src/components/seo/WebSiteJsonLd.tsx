import { BRAND } from '@/lib/constants';
import { absoluteUrl, localePath } from '@/lib/seo';

export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND.name,
    url: absoluteUrl(localePath('en')),
    inLanguage: ['en-US', 'es-US'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl(localePath('en', '/menu'))}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
