import { setRequestLocale } from 'next-intl/server';
import { getPublishedFaqs } from '@/lib/data';
import { generatePageMetadata } from '@/lib/seo';
import { FaqsPageSections } from '@/components/sections/FaqsPageSections';
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
    <div className="min-w-0 overflow-x-hidden">
      <FAQJsonLd faqs={faqs} locale={locale as Locale} />
      <FaqsPageSections locale={locale as Locale} faqs={faqs} />
    </div>
  );
}
