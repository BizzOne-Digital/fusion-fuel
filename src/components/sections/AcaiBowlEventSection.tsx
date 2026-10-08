'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { CONTACT } from '@/lib/brand-content';
import { getAcaiBowlEvent, getBrandTagline } from '@/lib/marketing-i18n';
import { SITE_IMAGES } from '@/lib/site-images';
import type { Locale } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const PIN_START = 'top 88px';

interface AcaiBowlEventSectionProps {
  locale: Locale;
}

export function AcaiBowlEventSection({ locale }: AcaiBowlEventSectionProps) {
  const event = getAcaiBowlEvent(locale);
  const isEs = locale === 'es';
  const sectionRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const pin = ScrollTrigger.create({
        trigger: section,
        start: PIN_START,
        end: 'bottom bottom',
        pin: media,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      return () => pin.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="section-yellow w-full py-20">
      <div ref={sectionRef} className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-pink">{event.name}</p>
            <h2 className="font-display mt-2 text-4xl md:text-5xl">{event.name}</h2>
            <p className="mt-4 text-lg text-grey">{event.headline}</p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-grey/15 bg-cream p-5">
                <h3 className="font-display text-xl">{isEs ? 'Paquetes por invitados' : 'Guest Packages'}</h3>
                <p className="mt-2 text-sm text-grey">{isEs ? 'Disponible para:' : 'Available for:'}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {event.guestPackages.map((count) => (
                    <span
                      key={count}
                      className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-carbon"
                    >
                      {count}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-grey/15 bg-cream p-5">
                <h3 className="font-display text-xl">{isEs ? 'Tamaños de bowl' : 'Bowl Sizes'}</h3>
                <ul className="mt-2 space-y-1 text-sm text-carbon">
                  {event.bowlSizes.map((size) => (
                    <li key={size}>• {size}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-display text-2xl">
                {isEs ? 'Tu paquete incluye' : 'Your Package Includes'}
              </h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {event.packageIncludes.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-grey">
                    <span className="text-lime">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-display text-lg">{isEs ? 'Fruta fresca' : 'Fresh Fruit'}</h4>
                <ul className="mt-2 space-y-1 text-sm text-grey">
                  {event.freshFruits.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-display text-lg">{isEs ? 'Toppings premium' : 'Premium Toppings'}</h4>
                <ul className="mt-2 space-y-1 text-sm text-grey">
                  {event.premiumToppings.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-pink/90 p-6 text-white shadow-lg">
              <h3 className="font-display text-2xl text-lime">{isEs ? 'Cómo funciona' : 'How It Works'}</h3>
              <ol className="mt-4 space-y-3 text-sm text-white/90">
                {event.howItWorks.map((step, index) => (
                  <li key={step}>
                    <span className="font-bold text-lime">{index + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 rounded-2xl border border-pink/30 bg-pink/5 p-6">
              <h3 className="font-display text-xl">
                {isEs ? 'Reservas y pago' : 'Reservations & Payment'}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-carbon">
                <li>• {event.deposit}</li>
                <li>• {event.balance}</li>
              </ul>
              <p className="mt-4 text-sm font-semibold text-carbon">{event.serviceArea}</p>
              <p className="mt-1 text-sm text-grey">
                {isEs ? 'Eventos en interior o exterior · ' : 'Indoor or outdoor events · '}
                {event.deliveryNote}
              </p>
            </div>

            <p className="mt-6 text-sm text-grey">
              {isEs ? 'Ideal para:' : 'Perfect for:'} {event.perfectFor.join(' • ')}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/booking">
                <Button size="lg">
                  {isEs ? 'Reserva tu evento de açaí' : 'Book Your Açaí Event'}
                </Button>
              </Link>
              <Link href="/services/acai-bowl-event-experience">
                <Button variant="outline" size="lg">
                  {isEs ? 'Ver detalles completos' : 'View Full Details'}
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-grey">
              {isEs ? '¿Preguntas? Llama al ' : 'Questions? Call '}
              {CONTACT.phoneDisplay}
            </p>
          </div>

          <div
            ref={mediaRef}
            className="space-y-4 lg:sticky lg:top-[88px] lg:self-start"
          >
            <Image
              src={SITE_IMAGES.acaiBowl}
              alt={isEs ? 'Barra de bowls de açaí Fusion Fuel' : 'Fusion Fuel Açaí Bowl Bar'}
              width={600}
              height={500}
              className="h-auto w-full rounded-2xl object-cover shadow-lg"
            />
            <div className="rounded-2xl gradient-fuel p-5 text-ink">
              <p className="font-display text-2xl">{getBrandTagline(locale)}</p>
              <p className="mt-2 text-sm font-semibold">Fusion Fuel & Boost Co.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
