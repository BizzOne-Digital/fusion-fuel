'use client';

import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ContactForm } from '@/components/forms/ContactForm';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { PageHero } from '@/components/sections/PageHero';
import { LifestyleMontage } from '@/components/sections/LifestyleMontage';
import { SocialFollowSection } from '@/components/sections/SocialFollowSection';
import { PageCtaBanner } from '@/components/sections/PageCtaBanner';
import { Button } from '@/components/ui/Button';
import { CONTACT } from '@/lib/brand-content';
import { SITE_IMAGES } from '@/lib/site-images';
import type { ISiteSettings } from '@/models/SiteSettings';
import type { Locale } from '@/types';

interface ContactPageSectionsProps {
  locale: Locale;
  settings: Partial<ISiteSettings>;
}

export function ContactPageSections({ locale, settings }: ContactPageSectionsProps) {
  const isEs = locale === 'es';
  const phoneHref = `tel:${(settings.contactPhone ?? CONTACT.phone).replace(/\s/g, '')}`;

  return (
    <div className="min-w-0 overflow-x-hidden">
      <PageHero
        eyebrow={isEs ? 'Estamos aquí para ti' : 'We Are Here for You'}
        title={isEs ? 'Contáctanos' : 'Contact Us'}
        subtitle={
          isEs
            ? 'Preguntas sobre catering, el menú o pedidos — escríbenos o llámanos.'
            : 'Questions about catering, the menu, or orders — reach out anytime.'
        }
        image={SITE_IMAGES.contact}
        imageAlt="Fusion Fuel team"
        badge={
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-lime/40 bg-lime/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lime">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            Wimauma, FL
          </span>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/booking">
            <Button size="lg">{isEs ? 'Reservar catering' : 'Book Catering'}</Button>
          </Link>
          <Link href="/menu">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              {isEs ? 'Ver menú' : 'Browse Menu'}
            </Button>
          </Link>
        </div>
      </PageHero>

      <SectionReveal>
        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2 lg:gap-16 lg:px-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink">
                {isEs ? 'Información' : 'Get in Touch'}
              </p>
              <h2 className="font-display mt-2 text-4xl">
                {isEs ? 'Hablemos' : "Let's Connect"}
              </h2>
              <p className="mt-4 text-grey">
                {isEs
                  ? 'Catering, preguntas de productos o información de precios — estamos listos para ayudarte.'
                  : 'Catering inquiries, product questions, or pricing information — we are ready to help.'}
              </p>

              <dl className="mt-10 space-y-6">
                <div className="card-hover flex gap-4 rounded-2xl border border-grey/10 bg-cream p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime/30">
                    <Mail className="h-5 w-5 text-carbon" aria-hidden />
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-widest text-grey">Email</dt>
                    <dd className="mt-1 font-semibold">{settings.contactEmail ?? CONTACT.email}</dd>
                  </div>
                </div>
                <div className="card-hover flex gap-4 rounded-2xl border border-grey/10 bg-cream p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink/20">
                    <Phone className="h-5 w-5 text-carbon" aria-hidden />
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-widest text-grey">Phone</dt>
                    <dd className="mt-1">
                      <a href={phoneHref} className="font-semibold text-pink hover:underline">
                        {settings.contactPhone ?? CONTACT.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                </div>
                {settings.social?.map((link) => (
                  <div
                    key={link.url}
                    className="card-hover flex gap-4 rounded-2xl border border-grey/10 bg-cream p-5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                      <span className="text-xs font-bold uppercase text-pink">
                        {link.platform.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-widest text-grey">
                        {link.platform}
                      </dt>
                      <dd className="mt-1">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-pink hover:underline"
                        >
                          {link.label ?? link.url}
                        </a>
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div className="absolute -left-4 -top-4 hidden h-32 w-32 overflow-hidden rounded-2xl border-4 border-white shadow-lg lg:block">
                <Image
                  src={SITE_IMAGES.heroDrinks}
                  alt=""
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="card-hover rounded-3xl border border-grey/10 bg-white p-6 shadow-lg sm:p-8">
                <h3 className="font-display text-2xl">{isEs ? 'Envíanos un mensaje' : 'Send a Message'}</h3>
                <p className="mt-2 text-sm text-grey">
                  {isEs ? 'Responderemos lo antes posible.' : 'We will get back to you as soon as we can.'}
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      <LifestyleMontage title={isEs ? 'Energía para tu estilo de vida' : 'Fuel Your Lifestyle'} />
      <SocialFollowSection social={settings.social} />
      <PageCtaBanner
        title={isEs ? '¿Listo para tu próximo evento?' : 'Ready for Your Next Event?'}
        primaryHref="/booking"
        primaryLabel={isEs ? 'Reservar catering' : 'Book Catering'}
        secondaryHref="/menu"
        secondaryLabel={isEs ? 'Ver menú' : 'Browse Menu'}
      />
    </div>
  );
}
