'use client';

import Image from 'next/image';
import { Calendar, MapPin, PartyPopper, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { getLocalized } from '@/lib/utils';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { PageHero } from '@/components/sections/PageHero';
import { LifestyleMontage } from '@/components/sections/LifestyleMontage';
import { PageCtaBanner } from '@/components/sections/PageCtaBanner';
import { Button } from '@/components/ui/Button';
import { ACAI_BOWL_EVENT, CONTACT } from '@/lib/brand-content';
import { SITE_IMAGES } from '@/lib/site-images';
import type { IService } from '@/models/Service';
import type { Locale } from '@/types';

interface BookingPageSectionsProps {
  locale: Locale;
  services: IService[];
}

export function BookingPageSections({ locale, services }: BookingPageSectionsProps) {
  const isEs = locale === 'es';

  return (
    <div className="min-w-0 overflow-x-hidden">
      <PageHero
        eyebrow={isEs ? 'Catering y eventos' : 'Catering & Events'}
        title={isEs ? 'Reservar Catering' : 'Book Catering'}
        subtitle={
          isEs
            ? `Solicita un evento — incluyendo ${ACAI_BOWL_EVENT.name}. Confirmación después de revisión.`
            : `Request an event — including our ${ACAI_BOWL_EVENT.name}. Confirmation follows after review.`
        }
        image={SITE_IMAGES.booking}
        imageAlt="Fusion Fuel catering"
        badge={
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-lime/40 bg-lime/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lime">
            <PartyPopper className="h-3.5 w-3.5" aria-hidden />
            {isEs ? 'Eventos especiales' : 'Special Events'}
          </span>
        }
      >
        <Link href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
            <Phone className="mr-2 h-4 w-4" aria-hidden />
            {CONTACT.phoneDisplay}
          </Button>
        </Link>
      </PageHero>

      <SectionReveal>
        <section className="section-lime border-y border-carbon/10 py-8">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-3 lg:px-6">
            {[
              {
                icon: Calendar,
                label: isEs ? 'Reserva fácil' : 'Easy Booking',
                value: isEs ? 'Formulario en línea' : 'Online request form',
              },
              {
                icon: MapPin,
                label: isEs ? 'Área de servicio' : 'Service Area',
                value: ACAI_BOWL_EVENT.serviceArea,
              },
              {
                icon: PartyPopper,
                label: isEs ? 'Experiencias' : 'Experiences',
                value: ACAI_BOWL_EVENT.name,
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 sm:block sm:text-left">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-carbon/10">
                  <item.icon className="h-5 w-5 text-carbon" aria-hidden />
                </div>
                <div className="sm:mt-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-carbon/60">{item.label}</p>
                  <p className="font-display mt-1 text-xl text-carbon">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
              <div>
                <div className="relative mb-8 overflow-hidden rounded-3xl shadow-xl">
                  <Image
                    src={SITE_IMAGES.acaiBowl}
                    alt={ACAI_BOWL_EVENT.name}
                    width={600}
                    height={450}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="card-hover rounded-2xl border border-grey/15 bg-cream p-6">
                  <p className="font-semibold text-carbon">{ACAI_BOWL_EVENT.deposit}</p>
                  <p className="mt-2 text-grey">{ACAI_BOWL_EVENT.balance}</p>
                  <p className="mt-4 text-sm text-grey">{ACAI_BOWL_EVENT.serviceArea}</p>
                  <p className="mt-2 text-sm text-grey">
                    {isEs ? 'Llama' : 'Call'} {CONTACT.phoneDisplay} {isEs ? 'con preguntas.' : 'with questions.'}
                  </p>
                </div>
                <div className="mt-8">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink">
                    {isEs ? 'Servicios' : 'Our Services'}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {services.slice(0, 6).map((service) => (
                      <li key={String(service._id)}>
                        <Link
                          href={`/services/${service.slug}`}
                          className="text-grey transition hover:text-pink"
                        >
                          • {getLocalized(service.name, locale)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="card-hover rounded-3xl border border-grey/10 bg-white p-6 shadow-lg sm:p-8">
                <h2 className="font-display text-3xl">
                  {isEs ? 'Solicitud de evento' : 'Event Request'}
                </h2>
                <p className="mt-2 text-sm text-grey">
                  {isEs
                    ? 'Completa el formulario y nos pondremos en contacto contigo.'
                    : 'Fill out the form and we will be in touch.'}
                </p>
                <div className="mt-8">
                  <BookingWizard services={services} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      <LifestyleMontage />
      <PageCtaBanner
        title={isEs ? '¿Preguntas antes de reservar?' : 'Questions Before You Book?'}
        primaryHref="/contact"
        primaryLabel={isEs ? 'Contáctanos' : 'Contact Us'}
        secondaryHref="/services"
        secondaryLabel={isEs ? 'Ver servicios' : 'View Services'}
      />
    </div>
  );
}
