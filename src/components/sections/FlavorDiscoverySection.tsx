'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { getLocalized, sanitizeHtml } from '@/lib/utils';
import { resolveFlavorImage } from '@/lib/site-images';
import { LOADED_TEAS, MONTHLY_TEA_CLUB } from '@/lib/brand-content';
import type { IFlavor } from '@/models/Flavor';
import type { Locale } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface FlavorDiscoverySectionProps {
  flavors: IFlavor[];
  locale: Locale;
}

function FlavorScrollCard({
  flavor,
  locale,
  isSelected,
  onToggle,
  disabled,
}: {
  flavor: IFlavor;
  locale: Locale;
  isSelected: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  const name = getLocalized(flavor.name, locale);
  const isNew = name.toLowerCase().includes('new');
  const image = resolveFlavorImage(flavor, name);

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`flex min-h-[420px] w-[min(78vw,280px)] shrink-0 snap-start flex-col rounded-2xl border p-4 text-left transition disabled:opacity-40 sm:min-h-[440px] sm:w-[300px] sm:p-5 md:w-[320px] ${
        isSelected
          ? 'border-pink bg-pink/10 shadow-lg shadow-pink/10'
          : 'border-white/10 bg-white/95 hover:border-lime hover:bg-white'
      }`}
    >
      <div
        className="relative mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-2xl bg-cream sm:max-w-[200px]"
        style={{ boxShadow: `inset 0 0 0 4px ${flavor.color}` }}
      >
        {image.url ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="200px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-carbon/35">
            Photo soon
          </div>
        )}
      </div>
      <div className="mt-4 flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-lg leading-tight text-carbon sm:text-xl">
            {name.replace(/\s*—\s*NEW!$/i, '')}
          </span>
          {isNew && (
            <span className="rounded-full bg-pink px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              New
            </span>
          )}
        </div>
        <div
          className="prose-brand mt-3 max-w-none flex-1 text-xs leading-relaxed text-grey [&_li]:my-0.5 [&_ul]:my-1 [&_ul]:pl-4"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(getLocalized(flavor.description, locale)),
          }}
        />
      </div>
    </button>
  );
}

export function FlavorDiscoverySection({ flavors, locale }: FlavorDiscoverySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const limit = 6;

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= limit) return prev;
      return [...prev, id];
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || flavors.length === 0) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    if (prefersReduced || isMobile) return;

    const ctx = gsap.context(() => {
      const getScrollDistance = () => {
        const trackWidth = track.scrollWidth;
        const viewport = window.innerWidth;
        return Math.max(trackWidth - viewport + 64, 0);
      };

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, section);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      ctx.revert();
    };
  }, [flavors.length]);

  return (
    <div className="min-w-0 w-full max-w-full overflow-x-hidden">
      <section ref={sectionRef} className="section-dark relative w-full overflow-x-hidden bg-ink">
        <div className="flex min-h-screen flex-col justify-center overflow-x-hidden py-16 md:py-20">
          <div className="mx-auto w-full min-w-0 max-w-7xl px-4 lg:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-3xl text-lime sm:text-4xl md:text-5xl">{LOADED_TEAS.headline}</h2>
                <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">{LOADED_TEAS.combinations}</p>
              </div>
              <span className="shrink-0 text-sm text-white/60">
                {selected.length}/{limit} {locale === 'es' ? 'seleccionados' : 'selected'}
              </span>
            </div>
            <p className="mt-3 text-xs uppercase tracking-widest text-white/40 md:hidden">
              {locale === 'es' ? 'Desliza para ver sabores →' : 'Swipe to explore flavors →'}
            </p>
            <p className="mt-3 hidden text-xs uppercase tracking-widest text-white/40 md:block">
              {locale === 'es' ? 'Desplázate para explorar sabores →' : 'Scroll to explore flavors →'}
            </p>
          </div>

          <div className="relative mt-8 w-full min-w-0 max-w-full overflow-hidden md:mt-10">
            <div className="w-full max-w-full overflow-x-auto overscroll-x-contain scrollbar-hide [-webkit-overflow-scrolling:touch] lg:overflow-visible">
              <div
                ref={trackRef}
                className="flex w-max max-w-none gap-4 px-4 pb-2 sm:gap-6 lg:px-6 lg:will-change-transform snap-x snap-mandatory lg:snap-none"
              >
                {flavors.map((flavor) => {
                  const id = String(flavor._id);
                  return (
                    <FlavorScrollCard
                      key={id}
                      flavor={flavor}
                      locale={locale}
                      isSelected={selected.includes(id)}
                      onToggle={() => toggle(id)}
                      disabled={!selected.includes(id) && selected.length >= limit}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-dark w-full overflow-x-hidden bg-ink px-4 pb-20 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/products/mega-tea-kit-builder" className="inline-block">
            <Button>{MONTHLY_TEA_CLUB.cta}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
