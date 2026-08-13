import { getLocalized } from '@/lib/utils';
import type { IFAQ } from '@/models/FAQ';
import type { Locale } from '@/types';

export function FAQJsonLd({ faqs, locale }: { faqs: IFAQ[]; locale: Locale }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: getLocalized(faq.question, locale),
      acceptedAnswer: {
        '@type': 'Answer',
        text: getLocalized(faq.answer, locale),
      },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
