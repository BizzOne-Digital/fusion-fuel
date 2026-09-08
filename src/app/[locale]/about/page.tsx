import { setRequestLocale } from 'next-intl/server';
import { getPublishedTestimonials } from '@/lib/data';
import { generatePageMetadata } from '@/lib/seo';
import { AboutPageSections } from '@/components/sections/AboutPageSections';
import type { Metadata } from 'next';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata('about', locale as Locale, '/about');
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const testimonials = await getPublishedTestimonials(3);

  return (
    <div className="min-w-0 overflow-x-hidden">
      <AboutPageSections locale={typedLocale} testimonials={testimonials} />
    </div>
  );
}
