'use client';

import Image from 'next/image';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { LIFESTYLE_IMAGES } from '@/lib/lifestyle-images';

interface LifestyleMontageProps {
  title?: string;
  className?: string;
}

export function LifestyleMontage({
  title = 'Fuel Your Lifestyle',
  className = 'bg-white',
}: LifestyleMontageProps) {
  return (
    <SectionReveal>
      <section className={`py-20 ${className}`}>
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="font-display text-4xl text-carbon md:text-5xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-grey">
            Loaded teas, protein coffee, açaí bowls, catering, and more — made to energize your day.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
            {LIFESTYLE_IMAGES.map((img, index) => (
              <div
                key={img.url}
                className={`img-zoom group overflow-hidden rounded-2xl shadow-md ${
                  index === 0 ? 'md:col-span-2 md:row-span-1' : ''
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  width={600}
                  height={400}
                  className={`h-44 w-full object-cover transition duration-500 group-hover:scale-105 md:h-56 ${
                    index === 0 ? 'md:h-72' : ''
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </SectionReveal>
  );
}
