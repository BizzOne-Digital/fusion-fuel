'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { BRAND_POSTERS } from '@/lib/lifestyle-images';

interface BrandPosterShowcaseProps {
  title?: string;
  subtitle?: string;
  locale?: 'en' | 'es';
}

export function BrandPosterShowcase({
  title = 'Explore the Menu',
  subtitle = 'Posters, flavors, and favorites from Fusion Fuel & Boost Co.',
  locale = 'en',
}: BrandPosterShowcaseProps) {
  const viewLabel = locale === 'es' ? 'Ver menú' : 'View menu';

  return (
    <SectionReveal>
      <section className="section-cream py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink">Menu Highlights</p>
            <h2 className="font-display mt-2 text-4xl md:text-5xl">{title}</h2>
            <p className="mt-4 text-grey">{subtitle}</p>
          </div>

          <div className="mt-12 flex gap-5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {BRAND_POSTERS.map((poster) => {
              const title = locale === 'es' && 'titleEs' in poster ? poster.titleEs : poster.title;
              const cardClassName =
                'card-hover group relative w-64 shrink-0 snap-start overflow-hidden rounded-2xl border border-grey/10 bg-white shadow-md sm:w-72';

              const cardContent = (
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={poster.url}
                    alt={poster.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="288px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-display text-2xl text-white">{title}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-lime opacity-0 transition group-hover:opacity-100">
                      {viewLabel}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </div>
              );

              if ('external' in poster && poster.external) {
                return (
                  <a
                    key={poster.url}
                    href={poster.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClassName}
                  >
                    {cardContent}
                  </a>
                );
              }

              return (
                <Link key={poster.url} href={poster.href} className={cardClassName}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </SectionReveal>
  );
}
