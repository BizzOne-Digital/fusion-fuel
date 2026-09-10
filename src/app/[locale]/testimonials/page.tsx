import { setRequestLocale } from 'next-intl/server';
import { getPublishedTestimonials } from '@/lib/data';
import { generatePageMetadata } from '@/lib/seo';
import { TestimonialsPageSections } from '@/components/sections/TestimonialsPageSections';
import type { Metadata } from 'next';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata('testimonials', locale as Locale, '/testimonials');
}

export default async function TestimonialsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale } = await params;
  const { tab } = await searchParams;
  setRequestLocale(locale);
  const testimonials = await getPublishedTestimonials(50);

  return (
    <div className="min-w-0 overflow-x-hidden">
      <TestimonialsPageSections
        locale={locale as Locale}
        testimonials={testimonials}
        initialTab={tab === 'write' ? 'write' : 'reviews'}
      />
    </div>
  );
}
