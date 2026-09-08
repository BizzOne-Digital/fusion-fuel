'use client';

import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { PageHero } from '@/components/sections/PageHero';
import { BRAND_POSTERS } from '@/lib/lifestyle-images';
import type { Locale } from '@/types';

interface MenuPageIntroProps {
  locale: Locale;
}

export function MenuPageIntro({ locale }: MenuPageIntroProps) {
  const isEs = locale === 'es';
  const title = isEs ? 'Menú' : 'Menu';

  return (
    <>
      <PageHero
        eyebrow={isEs ? '100+ combinaciones' : '100+ Combinations'}
        title={title}
        subtitle={
          isEs
            ? 'Filtra por categoría o explora el menú completo.'
            : 'Filter by category or browse the full menu.'
        }
        image="/images/mega-tea-kits/hero.jpg"
        imageAlt="Mega Tea Kits and loaded teas"
        badge={
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-lime/40 bg-lime/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lime">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {isEs ? 'Fusion Fuel' : 'Fusion Fuel'}
          </span>
        }
        minHeightClass="min-h-[40vh] lg:min-h-[44vh]"
      />

      <SectionReveal>
        <section className="section-cream border-b border-grey/10 py-6">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink">
              {isEs ? 'Destacados' : 'Featured'}
            </p>
            <div className="mt-4 flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
              {BRAND_POSTERS.slice(0, 4).map((poster) => (
                <Link
                  key={poster.url}
                  href={poster.href}
                  className="card-hover group relative h-28 w-40 shrink-0 overflow-hidden rounded-xl shadow-md sm:h-32 sm:w-48"
                >
                  <Image
                    src={poster.url}
                    alt={poster.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="192px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                  <span className="absolute bottom-2 left-2 font-display text-sm text-white">
                    {poster.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>
    </>
  );
}
