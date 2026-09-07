import {
  Building2,
  GraduationCap,
  Mail,
  MapPin,
  PartyPopper,
  Phone,
  Stethoscope,
  Trophy,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { Button } from '@/components/ui/Button';
import {
  ABOUT_CONNECT,
  ABOUT_MISSION,
  ABOUT_REVIEWS,
  ABOUT_SERVICE_CARDS,
  ABOUT_STORY,
  ABOUT_TAGLINE,
  ABOUT_VALUES,
  type AboutServiceIcon,
} from '@/lib/about-content';
import { CONTACT } from '@/lib/brand-content';
import { getLocalized } from '@/lib/utils';
import type { ITestimonial } from '@/models/Testimonial';
import type { Locale } from '@/types';

function ServiceIcon({ icon }: { icon: AboutServiceIcon }) {
  const className = 'h-7 w-7 text-pink';
  switch (icon) {
    case 'school':
      return <GraduationCap className={className} aria-hidden />;
    case 'medical':
      return <Stethoscope className={className} aria-hidden />;
    case 'business':
      return <Building2 className={className} aria-hidden />;
    case 'sport':
      return <Trophy className={className} aria-hidden />;
    case 'celebration':
      return <PartyPopper className={className} aria-hidden />;
    case 'community':
      return <MapPin className={className} aria-hidden />;
    default:
      return null;
  }
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
      />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"
      />
    </svg>
  );
}

interface AboutPageSectionsProps {
  locale: Locale;
  testimonials: ITestimonial[];
}

export function AboutPageSections({ locale, testimonials }: AboutPageSectionsProps) {
  const phoneHref = `tel:${CONTACT.phone.replace(/\s/g, '')}`;

  return (
    <div className="mt-12 space-y-0">
      <SectionReveal>
        <section className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 lg:px-6">
            <h2 className="font-display text-4xl">{getLocalized(ABOUT_STORY.title, locale)}</h2>
            <div className="mt-6 space-y-4 text-grey">
              {ABOUT_STORY.paragraphs.map((paragraph, index) => (
                <p key={index} className="leading-relaxed">{getLocalized(paragraph, locale)}</p>
              ))}
            </div>
            <p className="mt-8 font-display text-2xl text-pink">{ABOUT_TAGLINE}</p>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="section-cream py-16">
          <div className="mx-auto max-w-3xl px-4 lg:px-6">
            <h2 className="font-display text-4xl">{getLocalized(ABOUT_MISSION.title, locale)}</h2>
            <div className="mt-6 space-y-4 text-grey">
              {ABOUT_MISSION.paragraphs.map((paragraph, index) => (
                <p key={index} className="leading-relaxed">{getLocalized(paragraph, locale)}</p>
              ))}
            </div>
            <p className="mt-8 font-display text-2xl text-pink">{ABOUT_TAGLINE}</p>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="section-dark py-16 text-white">
          <div className="mx-auto max-w-3xl px-4 lg:px-6">
            <h2 className="font-display text-4xl">{getLocalized(ABOUT_VALUES.title, locale)}</h2>
            <div className="mt-6 space-y-4 text-white/80">
              {ABOUT_VALUES.paragraphs.map((paragraph, index) => (
                <p key={index} className="leading-relaxed">{getLocalized(paragraph, locale)}</p>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <h2 className="font-display text-center text-4xl">
              {locale === 'es' ? 'Déjanos servirte' : 'Let Us Serve You!'}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-grey">
              {locale === 'es'
                ? 'Catering y servicios para cada ocasión en Hillsborough y Manatee.'
                : 'Catering and services for every occasion across Hillsborough and Manatee counties.'}
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ABOUT_SERVICE_CARDS.map((card) => (
                <Link
                  key={`${card.href}-${getLocalized(card.title, locale)}`}
                  href={card.href}
                  className="group rounded-2xl border border-grey/15 bg-cream p-6 transition hover:border-pink/30 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                    <ServiceIcon icon={card.icon} />
                  </div>
                  <h3 className="font-display mt-4 text-2xl text-carbon group-hover:text-pink">
                    {getLocalized(card.title, locale)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-grey">
                    {getLocalized(card.description, locale)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="gradient-boost py-16 text-white">
          <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
            <h2 className="font-display text-4xl">{getLocalized(ABOUT_CONNECT.title, locale)}</h2>
            <ul className="mt-8 space-y-4 text-left sm:mx-auto sm:max-w-md">
              <li>
                <a
                  href={CONTACT.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/15"
                >
                  <FacebookIcon className="h-5 w-5 shrink-0" />
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-white/70">Facebook</span>
                    <span className="font-semibold">{CONTACT.facebookLabel}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/15"
                >
                  <InstagramIcon className="h-5 w-5 shrink-0" />
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-white/70">Instagram</span>
                    <span className="font-semibold">{CONTACT.instagramHandle}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/15"
                >
                  <TikTokIcon className="h-5 w-5 shrink-0" />
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-white/70">TikTok</span>
                    <span className="font-semibold">{CONTACT.tiktokHandle}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/15"
                >
                  <Mail className="h-5 w-5 shrink-0" aria-hidden />
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-white/70">Email</span>
                    <span className="font-semibold break-all">{CONTACT.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={phoneHref}
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 transition hover:bg-white/15"
                >
                  <Phone className="h-5 w-5 shrink-0" aria-hidden />
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-white/70">
                      {locale === 'es' ? 'Llama o envía texto' : 'Call or Text'}
                    </span>
                    <span className="font-semibold">{CONTACT.phoneDisplay}</span>
                  </span>
                </a>
              </li>
            </ul>
            <p className="mt-10 font-display text-2xl">{ABOUT_TAGLINE}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg">{locale === 'es' ? 'Contáctanos' : 'Contact Us'}</Button>
              </Link>
              <Link href="/booking">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  {locale === 'es' ? 'Reservar catering' : 'Book Catering'}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="section-cream py-16">
          <div className="mx-auto max-w-4xl px-4 lg:px-6">
            <h2 className="font-display text-center text-4xl">{getLocalized(ABOUT_REVIEWS.title, locale)}</h2>
            {testimonials.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-dashed border-grey/30 bg-white p-8 text-center text-grey">
                {getLocalized(ABOUT_REVIEWS.empty, locale)}
              </p>
            ) : (
              <div className="mt-10 space-y-6">
                {testimonials.map((testimonial) => (
                  <blockquote
                    key={String(testimonial._id)}
                    className="rounded-2xl border border-grey/15 bg-white p-6 shadow-sm"
                  >
                    <p className="text-lg text-grey">
                      &ldquo;{getLocalized(testimonial.quote, locale)}&rdquo;
                    </p>
                    <footer className="mt-4">
                      <strong className="text-carbon">{testimonial.name}</strong>
                      {testimonial.role && (
                        <span className="text-grey"> · {getLocalized(testimonial.role, locale)}</span>
                      )}
                      {testimonial.verified && (
                        <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-lime">
                          {locale === 'es' ? 'Verificado' : 'Verified'}
                        </span>
                      )}
                    </footer>
                  </blockquote>
                ))}
              </div>
            )}
            <div className="mt-8 text-center">
              <Link href="/testimonials" className="text-sm font-semibold text-pink hover:underline">
                {getLocalized(ABOUT_REVIEWS.viewAll, locale)} →
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  );
}
