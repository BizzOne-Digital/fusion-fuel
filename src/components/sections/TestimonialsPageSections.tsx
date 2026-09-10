'use client';

import { useState } from 'react';
import { Quote, Star } from 'lucide-react';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { PageHero } from '@/components/sections/PageHero';
import { LifestyleMontage } from '@/components/sections/LifestyleMontage';
import { PageCtaBanner } from '@/components/sections/PageCtaBanner';
import { ReviewForm } from '@/components/forms/ReviewForm';
import { getLocalized } from '@/lib/utils';
import { SITE_IMAGES } from '@/lib/site-images';
import type { ITestimonial } from '@/models/Testimonial';
import type { Locale } from '@/types';

interface TestimonialsPageSectionsProps {
  locale: Locale;
  testimonials: ITestimonial[];
  initialTab?: TabId;
}

type TabId = 'reviews' | 'write';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-lime text-lime' : 'text-grey/25'}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

function TestimonialsGrid({
  locale,
  testimonials,
}: {
  locale: Locale;
  testimonials: ITestimonial[];
}) {
  const isEs = locale === 'es';

  if (testimonials.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-grey/25 bg-cream px-8 py-14 text-center">
        <Quote className="mx-auto h-10 w-10 text-pink/40" aria-hidden />
        <p className="mt-4 text-grey">
          {isEs
            ? 'Aún no hay reseñas publicadas. ¡Sé el primero en compartir tu experiencia!'
            : 'No reviews published yet. Be the first to share your experience!'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {testimonials.map((testimonial, index) => (
        <blockquote
          key={String(testimonial._id)}
          className={`card-hover relative flex h-full flex-col rounded-2xl border border-grey/10 p-6 shadow-sm ${
            index % 3 === 0 ? 'md:col-span-2 md:flex-row md:gap-8 md:p-8' : 'bg-cream'
          }`}
        >
          <Quote
            className={`h-8 w-8 shrink-0 text-pink/30 ${index % 3 === 0 ? 'md:h-12 md:w-12' : ''}`}
            aria-hidden
          />
          <div className="flex-1">
            <div className="mt-3">
              <StarRating rating={testimonial.rating} />
            </div>
            <p
              className={`mt-4 flex-1 leading-relaxed text-grey ${
                index % 3 === 0 ? 'text-lg md:text-xl' : 'text-base'
              }`}
            >
              &ldquo;{getLocalized(testimonial.quote, locale)}&rdquo;
            </p>
            <footer className="mt-6 border-t border-grey/10 pt-4">
              <strong className="text-carbon">{testimonial.name}</strong>
              {testimonial.role && (
                <span className="block text-sm text-grey">
                  {getLocalized(testimonial.role, locale)}
                </span>
              )}
              {testimonial.verified && (
                <span className="mt-1 inline-block text-xs font-bold uppercase tracking-wide text-pink">
                  {isEs ? 'Verificado' : 'Verified'}
                </span>
              )}
            </footer>
          </div>
        </blockquote>
      ))}
    </div>
  );
}

export function TestimonialsPageSections({
  locale,
  testimonials,
  initialTab = 'reviews',
}: TestimonialsPageSectionsProps) {
  const isEs = locale === 'es';
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'reviews', label: isEs ? 'Reseñas' : 'Reviews' },
    { id: 'write', label: isEs ? 'Escribir reseña' : 'Write a Review' },
  ];

  return (
    <div className="min-w-0 overflow-x-hidden">
      <PageHero
        eyebrow={isEs ? 'Comunidad' : 'Community'}
        title={isEs ? 'Testimonios' : 'Testimonials'}
        subtitle={
          isEs
            ? 'Lee reseñas de clientes o comparte tu propia experiencia con Fusion Fuel.'
            : 'Read customer reviews or share your own Fusion Fuel experience.'
        }
        image={SITE_IMAGES.testimonials}
        imageAlt="Happy customers at Fusion Fuel event"
        badge={
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-lime/40 bg-lime/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lime">
            <Star className="h-3.5 w-3.5 fill-lime" aria-hidden />
            {isEs ? 'Reseñas de clientes' : 'Customer Reviews'}
          </span>
        }
      />

      <SectionReveal>
        <section className="section-lime border-y border-carbon/10 py-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 text-center lg:px-6">
            <div>
              <p className="font-display text-4xl text-carbon">{testimonials.length}+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-carbon/60">
                {isEs ? 'Reseñas publicadas' : 'Published Reviews'}
              </p>
            </div>
            <div className="hidden h-8 w-px bg-carbon/20 sm:block" />
            <div>
              <p className="font-display text-4xl text-carbon">5★</p>
              <p className="text-xs font-bold uppercase tracking-widest text-carbon/60">
                {isEs ? 'Energía y sabor' : 'Energy & Flavor'}
              </p>
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? 'bg-carbon text-white shadow-md'
                      : 'border border-grey/20 bg-cream text-carbon hover:border-pink/40 hover:text-pink'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'reviews' ? (
              <TestimonialsGrid locale={locale} testimonials={testimonials} />
            ) : (
              <div className="mx-auto max-w-2xl">
                <div className="mb-8 text-center">
                  <h2 className="font-display text-2xl text-carbon md:text-3xl">
                    {isEs ? 'Comparte tu experiencia' : 'Share Your Experience'}
                  </h2>
                  <p className="mt-2 text-grey">
                    {isEs
                      ? 'Tu reseña será revisada por nuestro equipo antes de publicarse.'
                      : 'Your review will be reviewed by our team before it goes live.'}
                  </p>
                </div>
                <ReviewForm onSuccess={() => setActiveTab('reviews')} />
              </div>
            )}
          </div>
        </section>
      </SectionReveal>

      <LifestyleMontage />
      <PageCtaBanner
        title={isEs ? 'Únete a la comunidad Fusion Fuel' : 'Join the Fusion Fuel Community'}
        primaryHref="/menu"
        primaryLabel={isEs ? 'Ver menú' : 'Browse Menu'}
        secondaryHref="/about"
        secondaryLabel={isEs ? 'Nuestra historia' : 'Our Story'}
      />
    </div>
  );
}
