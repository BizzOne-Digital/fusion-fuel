import { setRequestLocale } from 'next-intl/server';
import { getSiteSettings } from '@/lib/data';
import { generatePageMetadata } from '@/lib/seo';
import { ContactPageSections } from '@/components/sections/ContactPageSections';
import type { Metadata } from 'next';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata('contact', locale as Locale, '/contact');
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSiteSettings();

  return (
    <div className="min-w-0 overflow-x-hidden">
      <ContactPageSections locale={locale as Locale} settings={settings} />
    </div>
  );
}
