'use client';

import Image from 'next/image';
import { CupSoda, Package, UtensilsCrossed } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { BrandTagline } from '@/components/brand/BrandTagline';
import { Button } from '@/components/ui/Button';
import { HOME_HERO } from '@/lib/brand-content';
import { SITE_IMAGES } from '@/lib/site-images';

const FEATURE_ICONS = {
  cup: CupSoda,
  kit: Package,
  catering: UtensilsCrossed,
} as const;

interface HomeHeroSectionProps {
  fuelLine: string;
  boostLine?: string;
  kitHref: string;
  backgroundUrl?: string;
}

export function HomeHeroSection({
  fuelLine,
  boostLine,
  kitHref,
  backgroundUrl = SITE_IMAGES.heroDrinks,
}: HomeHeroSectionProps) {
  return (
    <section className="relative w-full max-w-full overflow-x-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Image
          src={backgroundUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_42%] sm:object-[72%_center] lg:object-right"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/75 sm:bg-gradient-to-r sm:from-black/90 sm:via-black/65 sm:to-black/25"
          aria-hidden
        />
      </div>

      <div className="relative mx-auto flex min-h-[min(100svh-4.5rem,780px)] max-w-7xl flex-col justify-end px-5 pb-10 pt-8 sm:min-h-[calc(100svh-5rem)] sm:justify-center sm:px-6 sm:pb-8 sm:pt-20 lg:min-h-[min(100svh,920px)] lg:px-8 lg:pt-24">
        <div className="w-full max-w-xl sm:max-w-2xl [text-shadow:0_2px_20px_rgba(0,0,0,0.85)]">
          <p className="max-w-[18rem] text-[10px] font-bold uppercase leading-snug tracking-[0.22em] text-[#F5FF00] sm:max-w-none sm:text-xs sm:tracking-[0.28em]">
            {HOME_HERO.eyebrow}
          </p>

          <BrandTagline
            fuelLine={fuelLine}
            boostLine={boostLine}
            size="hero"
            animated
            boostTone="brand"
            className="mt-4 sm:mt-5 lg:max-w-4xl"
          />

          <p className="mt-4 max-w-md text-sm leading-relaxed text-white sm:mt-6 sm:max-w-xl sm:text-lg">
            {HOME_HERO.description}
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
            <Link href={kitHref} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full rounded-md px-5 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-ink sm:w-auto sm:px-7 sm:py-4 sm:text-sm sm:tracking-[0.12em]"
              >
                {HOME_HERO.ctaPrimary}
              </Button>
            </Link>
            <Link href="/menu" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-md border-2 border-white bg-black/25 px-5 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm hover:bg-white hover:text-ink sm:w-auto sm:bg-transparent sm:px-7 sm:py-4 sm:text-sm sm:tracking-[0.12em]"
              >
                {HOME_HERO.ctaSecondary}
              </Button>
            </Link>
          </div>

          <Link
            href="/booking"
            className="mt-5 inline-block text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:text-[#F5FF00] sm:mt-6 sm:text-sm sm:tracking-[0.18em]"
          >
            {HOME_HERO.ctaTertiary}
          </Link>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/55 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {HOME_HERO.features.map((feature) => {
            const Icon = FEATURE_ICONS[feature.icon];
            return (
              <Link
                key={feature.label}
                href={feature.href}
                className="group flex items-center justify-center gap-3 px-6 py-5 text-center transition hover:bg-white/5 sm:py-6"
              >
                <Icon className="h-5 w-5 shrink-0 text-[#F5FF00] transition group-hover:scale-110" aria-hidden />
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-[13px]">
                  {feature.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
