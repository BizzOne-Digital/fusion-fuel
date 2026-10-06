'use client';

import { Sparkles } from 'lucide-react';
import { PageHero } from '@/components/sections/PageHero';
import type { Locale } from '@/types';

interface MenuPageIntroProps {
  locale: Locale;
}

export function MenuPageIntro({ locale }: MenuPageIntroProps) {
  const isEs = locale === 'es';
  const title = isEs ? 'Menú' : 'Menu';

  return (
    <PageHero
      variant="bright"
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
  );
}
