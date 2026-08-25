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
          sizes="100%"
          className="object-cover object-[72%_center] sm:object-[78%_center] lg:object-right"
        />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-center px-4 pb-8 pt-16 sm:min-h-[calc(100svh-4.5rem)] sm:px-6 sm:pt-20 lg:min-h-[min(100svh,920px)] lg:px-8 lg:pt-24">
        <div className="max-w-2xl [text-shadow:0_2px_18px_rgba(0,0,0,0.75)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#F5FF00] sm:text-xs">
            {HOME_HERO.eyebrow}
          </p>

          <BrandTagline
            fuelLine={fuelLine}
            boostLine={boostLine}
            size="hero"
            animated
            boostTone="brand"
            className="mt-5 lg:max-w-4xl"
          />

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {HOME_HERO.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            <Link href={kitHref}>
              <Button
                size="lg"
                className="rounded-md px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-ink"
              >
                {HOME_HERO.ctaPrimary}
              </Button>
            </Link>
            <Link href="/menu">
              <Button
                variant="outline"
                size="lg"
                className="rounded-md border-2 border-white bg-transparent px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-ink"
              >
                {HOME_HERO.ctaSecondary}
              </Button>
            </Link>
          </div>

          <Link
            href="/booking"
            className="mt-6 inline-block text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:text-[#F5FF00]"
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
