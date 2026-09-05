import { setRequestLocale } from 'next-intl/server';
import { getPublishedFaqs } from '@/lib/data';
import { generatePageMetadata } from '@/lib/seo';
import { getLocalized, sanitizeHtml } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Accordion } from '@/components/ui/Accordion';
import { FAQJsonLd } from '@/components/seo/FAQJsonLd';
import type { Metadata } from 'next';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata('faqs', locale as Locale, '/faqs');
}

export default async function FaqsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const faqs = await getPublishedFaqs(locale as Locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <FAQJsonLd faqs={faqs} locale={locale as Locale} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'FAQs' }]} />
      <h1 className="font-display text-5xl">FAQs</h1>
      {faqs.length === 0 ? (
        <p className="mt-8 text-grey">FAQs will appear here when published.</p>
      ) : (
        <Accordion
          className="mt-10"
          items={faqs.map((faq) => ({
            id: String(faq._id),
            title: getLocalized(faq.question, locale as Locale),
            content: <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(getLocalized(faq.answer, locale as Locale)) }} />,
          }))}
        />
      )}
    </div>
  );
}
