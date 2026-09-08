import Image from 'next/image';
import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  badge?: ReactNode;
  children?: ReactNode;
  minHeightClass?: string;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt = '',
  badge,
  children,
  minHeightClass = 'min-h-[48vh] lg:min-h-[52vh]',
}: PageHeroProps) {
  return (
    <section className={`relative overflow-hidden bg-ink text-white ${minHeightClass}`}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/88 to-ink/35" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/20" aria-hidden />

      <div
        className={`relative mx-auto flex ${minHeightClass} max-w-7xl flex-col justify-end px-4 pb-12 pt-24 lg:px-6 lg:pb-16 lg:pt-28`}
      >
        {badge}
        {eyebrow ? (
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-lime">{eyebrow}</p>
        ) : null}
        <h1 className="font-display mt-2 max-w-4xl text-5xl leading-none md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-lg text-white/85 md:text-xl">{subtitle}</p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
