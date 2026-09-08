'use client';

import Image from 'next/image';
import { HelpCircle, MessageCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { PageHero } from '@/components/sections/PageHero';
import { PageCtaBanner } from '@/components/sections/PageCtaBanner';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { sanitizeHtml } from '@/lib/utils';
import { SITE_IMAGES } from '@/lib/site-images';
import type { Locale } from '@/types';

interface FaqItem {
  _id: unknown;
  question: { en: string; es: string };
  answer: { en: string; es: string };
}

interface FaqsPageSectionsProps {
  locale: Locale;
  faqs: FaqItem[];
}

export function FaqsPageSections({ locale, faqs }: FaqsPageSectionsProps) {
  const isEs = locale === 'es';
  const getLoc = (field: { en: string; es: string }) => (isEs ? field.es : field.en);

  return (
    <div className="min-w-0 overflow-x-hidden">
      <PageHero
        eyebrow={isEs ? 'Ayuda' : 'Help Center'}
        title={isEs ? 'Preguntas Frecuentes' : 'FAQs'}
        subtitle={
          isEs
            ? 'Respuestas sobre el menú, catering, pedidos y más.'
            : 'Answers about the menu, catering, orders, and more.'
        }
        image={SITE_IMAGES.faq}
        imageAlt="Fusion Fuel drinks"
        badge={
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-lime/40 bg-lime/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lime">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden />
            {isEs ? 'Soporte' : 'Support'}
          </span>
        }
      >
        <Link href="/contact">
          <Button size="lg">
            <MessageCircle className="mr-2 h-4 w-4" aria-hidden />
            {isEs ? 'Contáctanos' : 'Contact Us'}
          </Button>
        </Link>
      </PageHero>

      <SectionReveal>
        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-4 lg:px-6">
            <div className="mb-12 grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink">
                  {isEs ? 'Respuestas rápidas' : 'Quick Answers'}
                </p>
                <h2 className="font-display mt-2 text-3xl md:text-4xl">
                  {isEs ? '¿En qué podemos ayudarte?' : 'What Can We Help With?'}
                </h2>
              </div>
              <div className="relative hidden h-24 w-24 overflow-hidden rounded-2xl shadow-lg md:block">
                <Image src={SITE_IMAGES.megaTeaKit} alt="" fill className="object-cover" sizes="96px" />
              </div>
            </div>

            {faqs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-grey/25 bg-cream px-8 py-14 text-center">
                <HelpCircle className="mx-auto h-10 w-10 text-pink/40" aria-hidden />
                <p className="mt-4 text-grey">
                  {isEs
                    ? 'Las preguntas frecuentes aparecerán aquí cuando se publiquen.'
                    : 'FAQs will appear here when published.'}
                </p>
              </div>
            ) : (
              <Accordion
                items={faqs.map((faq) => ({
                  id: String(faq._id),
                  title: getLoc(faq.question),
                  content: (
                    <div
                      className="prose-brand text-grey"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(getLoc(faq.answer)) }}
                    />
                  ),
                }))}
              />
            )}
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="section-cream py-16">
          <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
            <h2 className="font-display text-3xl">
              {isEs ? '¿No encontraste tu respuesta?' : "Didn't Find Your Answer?"}
            </h2>
            <p className="mt-3 text-grey">
              {isEs
                ? 'Estamos a un mensaje de distancia.'
                : 'We are just a message away.'}
            </p>
            <Link href="/contact" className="mt-6 inline-block">
              <Button size="lg">{isEs ? 'Contáctanos' : 'Get in Touch'}</Button>
            </Link>
          </div>
        </section>
      </SectionReveal>

      <PageCtaBanner
        title={isEs ? 'Explora el menú completo' : 'Explore the Full Menu'}
        primaryHref="/menu"
        primaryLabel={isEs ? 'Ver menú' : 'Browse Menu'}
        secondaryHref="/booking"
        secondaryLabel={isEs ? 'Reservar catering' : 'Book Catering'}
      />
    </div>
  );
}
