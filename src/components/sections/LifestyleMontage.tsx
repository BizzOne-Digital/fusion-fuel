'use client';

import Image from 'next/image';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { LIFESTYLE_IMAGES } from '@/lib/lifestyle-images';
import { getHomePageCopy } from '@/lib/marketing-i18n';
import type { Locale } from '@/types';

interface LifestyleMontageProps {
  locale?: Locale;
  title?: string;
  className?: string;
}

export function LifestyleMontage({
  locale = 'en',
  title,
  className = 'bg-white',
}: LifestyleMontageProps) {
  const copy = getHomePageCopy(locale);
  const heading = title ?? copy.lifestyleTitle;
  return (
    <SectionReveal>
      <section className={`py-20 ${className}`}>
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="font-display text-4xl text-carbon md:text-5xl">{heading}</h2>
          <p className="mt-3 max-w-2xl text-grey">{copy.lifestyleSubtitle}</p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
            {LIFESTYLE_IMAGES.map((img, index) => {
              const isHero = index === 0;
              const isAcai = index === 1;
              const tallCell = isHero || isAcai;

              return (
                <div
                  key={img.url}
                  className={`img-zoom group overflow-hidden rounded-2xl shadow-md ${
                    isHero ? 'md:col-span-2' : ''
                  } ${tallCell ? 'h-44 md:h-72' : 'h-44 md:h-56'}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    width={600}
                    height={400}
                    className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                      isAcai ? 'object-center' : ''
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SectionReveal>
  );
}
