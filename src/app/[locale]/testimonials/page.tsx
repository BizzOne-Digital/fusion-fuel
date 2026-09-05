import { setRequestLocale } from 'next-intl/server';
import { getPublishedTestimonials } from '@/lib/data';
import { generatePageMetadata } from '@/lib/seo';
import { getLocalized } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
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

export default async function TestimonialsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const testimonials = await getPublishedTestimonials(50);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Testimonials' }]} />
      <h1 className="font-display text-5xl">Testimonials</h1>
      <p className="mt-4 text-grey">Verified feedback published by Fusion Fuel & Boost Co.</p>
      {testimonials.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-grey/30 p-8 text-center text-grey">
          No verified testimonials have been published yet.
        </p>
      ) : (
        <div className="mt-12 space-y-6">
          {testimonials.map((t) => (
            <blockquote key={String(t._id)} className="rounded-2xl border border-grey/15 p-6">
              <p className="text-lg text-grey">&ldquo;{getLocalized(t.quote, locale as Locale)}&rdquo;</p>
              <footer className="mt-4">
                <strong>{t.name}</strong>
                {t.role && <span className="text-grey"> · {getLocalized(t.role, locale as Locale)}</span>}
                {t.verified && <span className="ml-2 text-xs text-lime">Verified</span>}
              </footer>
            </blockquote>
          ))}
        </div>
      )}
    </div>
  );
}
