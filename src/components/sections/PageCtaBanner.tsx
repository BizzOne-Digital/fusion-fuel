'use client';

import { Link } from '@/i18n/navigation';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { Button } from '@/components/ui/Button';

interface PageCtaBannerProps {
  title: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function PageCtaBanner({
  title,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: PageCtaBannerProps) {
  return (
    <SectionReveal>
      <section className="section-pink-bold py-20">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
          <h2 className="font-display text-4xl text-white md:text-5xl">{title}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={primaryHref}>
              <Button size="lg">{primaryLabel}</Button>
            </Link>
            {secondaryHref && secondaryLabel ? (
              <Link href={secondaryHref}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-ink"
                >
                  {secondaryLabel}
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </SectionReveal>
  );
}
