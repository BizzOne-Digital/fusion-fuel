'use client';

import Image from 'next/image';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { PageHero } from '@/components/sections/PageHero';
import { LifestyleMontage } from '@/components/sections/LifestyleMontage';
import { PageCtaBanner } from '@/components/sections/PageCtaBanner';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { getServiceImage } from '@/lib/site-images';
import { SITE_IMAGES } from '@/lib/site-images';
import type { IService } from '@/models/Service';
import type { Locale } from '@/types';

interface ServicesPageSectionsProps {
  locale: Locale;
  services: IService[];
}

export function ServicesPageSections({ locale, services }: ServicesPageSectionsProps) {
  const isEs = locale === 'es';

  return (
    <div className="min-w-0 overflow-x-hidden">
      <PageHero
        eyebrow={isEs ? 'Servicios profesionales' : 'Professional Services'}
        title={isEs ? 'Catering y Programas' : 'Catering & Programs'}
        subtitle={
          isEs
            ? 'Catering profesional para oficinas, escuelas, bodas y celebraciones.'
            : 'Professional catering for offices, schools, weddings, and celebrations.'
        }
        image={SITE_IMAGES.catering}
        imageAlt="Fusion Fuel catering spread"
        badge={
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-lime/40 bg-lime/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lime">
            <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden />
            {isEs ? 'Eventos a tu medida' : 'Custom Events'}
          </span>
        }
      >
        <Link href="/booking">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-lime px-7 py-4 text-sm font-bold uppercase tracking-wider text-ink transition hover:bg-yellow"
          >
            {isEs ? 'Reservar catering' : 'Book Catering'}
          </button>
        </Link>
      </PageHero>

      <SectionReveal>
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink">
                {isEs ? 'Nuestros servicios' : 'What We Offer'}
              </p>
              <h2 className="font-display mt-2 text-4xl md:text-5xl">
                {isEs ? 'Déjanos servirte' : 'Let Us Serve You'}
              </h2>
            </div>

            {services.length === 0 ? (
              <p className="mt-12 text-center text-grey">
                {isEs ? 'Los servicios aparecerán aquí cuando se publiquen.' : 'Services will appear here when published.'}
              </p>
            ) : (
              <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => {
                  const imageUrl =
                    service.thumbnail?.url?.includes('/placeholders/')
                      ? getServiceImage(service.slug)
                      : (service.thumbnail?.url ?? getServiceImage(service.slug));
                  const name = getLocalized(service.name, locale);

                  return (
                    <Link
                      key={String(service._id)}
                      href={`/services/${service.slug}`}
                      className="card-hover group overflow-hidden rounded-2xl border border-grey/15 bg-white shadow-sm"
                    >
                      <div className="relative aspect-video overflow-hidden bg-cream">
                        <Image
                          src={imageUrl}
                          alt={service.thumbnail?.alt ?? name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent opacity-0 transition group-hover:opacity-100" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-2xl transition group-hover:text-pink">{name}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-grey">
                          {getLocalized(service.shortDescription, locale)}
                        </p>
                        <p className="mt-3 font-semibold text-pink">
                          {hasPrice(service.startingPrice)
                            ? `${isEs ? 'Desde' : 'From'} ${formatPrice(service.startingPrice, 'USD', locale)}`
                            : isEs
                              ? 'Solicitar cotización'
                              : 'Request a quote'}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-pink opacity-0 transition group-hover:opacity-100">
                          {isEs ? 'Ver más' : 'Learn more'}
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </SectionReveal>

      <LifestyleMontage />
      <PageCtaBanner
        title={isEs ? '¿Listo para planificar tu evento?' : 'Ready to Plan Your Event?'}
        primaryHref="/booking"
        primaryLabel={isEs ? 'Reservar catering' : 'Book Catering'}
        secondaryHref="/contact"
        secondaryLabel={isEs ? 'Contáctanos' : 'Contact Us'}
      />
    </div>
  );
}
