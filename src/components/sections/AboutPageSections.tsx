import Image from 'next/image';
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  PartyPopper,
  Phone,
  Quote,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { Button } from '@/components/ui/Button';
import {
  ABOUT_CONNECT,
  ABOUT_HERO,
  ABOUT_HIGHLIGHTS,
  ABOUT_MISSION,
  ABOUT_REVIEWS,
  ABOUT_SERVICE_CARDS,
  ABOUT_STORY,
  ABOUT_TAGLINE,
  ABOUT_VALUE_PILLARS,
  ABOUT_VALUES,
  type AboutServiceIcon,
} from '@/lib/about-content';
import { CONTACT } from '@/lib/brand-content';
import { SITE_IMAGES } from '@/lib/site-images';
import { getLocalized } from '@/lib/utils';
import type { ITestimonial } from '@/models/Testimonial';
import type { Locale } from '@/types';

const SERVICE_ICON_BG: Record<AboutServiceIcon, string> = {
  school: 'from-lime/30 to-lime/5',
  medical: 'from-pink/25 to-pink/5',
  business: 'from-carbon/10 to-cream',
  sport: 'from-lime/20 to-pink/10',
  celebration: 'from-pink/30 to-lime/10',
  community: 'from-pink/20 to-cream',
};

function ServiceIcon({ icon }: { icon: AboutServiceIcon }) {
  const className = 'h-7 w-7 text-carbon';
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink">{children}</p>
  );
}

function TaglineBanner({ className = '' }: { className?: string }) {
  return (
    <p className={`font-display text-2xl text-pink md:text-3xl ${className}`}>{ABOUT_TAGLINE}</p>
  );
}

interface AboutPageSectionsProps {
  locale: Locale;
  testimonials: ITestimonial[];
}

export function AboutPageSections({ locale, testimonials }: AboutPageSectionsProps) {
  const phoneHref = `tel:${CONTACT.phone.replace(/\s/g, '')}`;

  const connectLinks = [
    {
      href: CONTACT.facebookUrl,
      external: true,
      icon: <FacebookIcon className="h-5 w-5" />,
      label: 'Facebook',
      value: CONTACT.facebookLabel,
    },
    {
      href: CONTACT.instagramUrl,
      external: true,
      icon: <InstagramIcon className="h-5 w-5" />,
      label: 'Instagram',
      value: CONTACT.instagramHandle,
    },
    {
      href: CONTACT.tiktokUrl,
      external: true,
      icon: <TikTokIcon className="h-5 w-5" />,
      label: 'TikTok',
      value: CONTACT.tiktokHandle,
    },
    {
      href: `mailto:${CONTACT.email}`,
      external: false,
      icon: <Mail className="h-5 w-5" aria-hidden />,
      label: 'Email',
      value: CONTACT.email,
    },
    {
      href: phoneHref,
      external: false,
      icon: <Phone className="h-5 w-5" aria-hidden />,
      label: locale === 'es' ? 'Llama o envía texto' : 'Call or Text',
      value: CONTACT.phoneDisplay,
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative min-h-[52vh] overflow-hidden bg-ink text-white">
        <Image
          src={SITE_IMAGES.catering}
          alt="Fusion Fuel catering spread"
          fill
          className="object-cover opacity-45"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <div className="relative mx-auto flex min-h-[52vh] max-w-7xl flex-col justify-end px-4 pb-14 pt-28 lg:px-6 lg:pb-20">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-lime/40 bg-lime/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lime">
            <Heart className="h-3.5 w-3.5" aria-hidden />
            {getLocalized(ABOUT_HERO.badge, locale)}
          </span>
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.25em] text-lime">
            {getLocalized(ABOUT_HERO.eyebrow, locale)}
          </p>
          <h1 className="font-display mt-2 max-w-3xl text-5xl leading-none md:text-6xl lg:text-7xl">
            {getLocalized(ABOUT_STORY.title, locale)}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/85 md:text-xl">
            {getLocalized(ABOUT_HERO.subtitle, locale)}
          </p>
          <p className="mt-6 font-display text-2xl text-lime md:text-3xl">{ABOUT_TAGLINE}</p>
        </div>
      </section>

      {/* Highlights */}
      <SectionReveal>
        <section className="section-lime border-y border-carbon/10 py-8">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-3 lg:px-6">
            {ABOUT_HIGHLIGHTS.map((item) => (
              <div key={getLocalized(item.value, locale)} className="text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-carbon/60">
                  {getLocalized(item.label, locale)}
                </p>
                <p className="font-display mt-1 text-2xl text-carbon">{getLocalized(item.value, locale)}</p>
              </div>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* Story */}
      <SectionReveal>
        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16 lg:px-6">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={SITE_IMAGES.aboutTeam}
                  alt="Fusion Fuel & Boost Co."
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 hidden w-44 overflow-hidden rounded-2xl border-4 border-white shadow-xl md:block lg:-right-8">
                <div className="relative aspect-square">
                  <Image
                    src={SITE_IMAGES.heroDrinks}
                    alt="Loaded teas and drinks"
                    fill
                    className="object-cover"
                    sizes="176px"
                  />
                </div>
              </div>
            </div>

            <div>
              <SectionLabel>{getLocalized(ABOUT_STORY.title, locale)}</SectionLabel>
              <h2 className="font-display mt-3 text-4xl md:text-5xl">
                {locale === 'es' ? 'Nuestra historia familiar' : 'A Family Story'}
              </h2>
              <p className="mt-6 text-lg font-medium leading-relaxed text-carbon">
                {getLocalized(ABOUT_STORY.paragraphs[0], locale)}
              </p>
              <div className="mt-6 space-y-4 text-grey">
                {ABOUT_STORY.paragraphs.slice(1).map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">{getLocalized(paragraph, locale)}</p>
                ))}
              </div>
              <TaglineBanner className="mt-8" />
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Mission */}
      <SectionReveal>
        <section className="section-pink py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white shadow-lg">
                <Target className="h-10 w-10 text-pink" aria-hidden />
              </div>
              <div>
                <SectionLabel>{getLocalized(ABOUT_MISSION.title, locale)}</SectionLabel>
                <h2 className="font-display mt-2 text-4xl md:text-5xl">{getLocalized(ABOUT_MISSION.title, locale)}</h2>
                <div className="mt-6 space-y-4 text-grey">
                  {ABOUT_MISSION.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-lg leading-relaxed">{getLocalized(paragraph, locale)}</p>
                  ))}
                </div>
                <TaglineBanner className="mt-8" />
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Values */}
      <SectionReveal>
        <section className="section-dark py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="max-w-2xl">
              <SectionLabel>
                <span className="text-lime">{getLocalized(ABOUT_VALUES.title, locale)}</span>
              </SectionLabel>
              <h2 className="font-display mt-2 text-4xl md:text-5xl">{getLocalized(ABOUT_VALUES.title, locale)}</h2>
              <p className="mt-4 text-lg text-white/75">{getLocalized(ABOUT_VALUES.paragraphs[0], locale)}</p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ABOUT_VALUE_PILLARS.map((pillar, index) => {
                const icons = [Users, Heart, Sparkles, Star];
                const Icon = icons[index] ?? Heart;
                return (
                  <div
                    key={getLocalized(pillar.title, locale)}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-lime/40 hover:bg-white/10"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime/20">
                      <Icon className="h-5 w-5 text-lime" aria-hidden />
                    </div>
                    <h3 className="font-display mt-4 text-2xl">{getLocalized(pillar.title, locale)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {getLocalized(pillar.description, locale)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 max-w-3xl space-y-4 text-white/75">
              {ABOUT_VALUES.paragraphs.slice(1).map((paragraph, index) => (
                <p key={index} className="leading-relaxed">{getLocalized(paragraph, locale)}</p>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Services */}
      <SectionReveal>
        <section className="section-cream py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="text-center">
              <SectionLabel>{locale === 'es' ? 'Servicios' : 'Services'}</SectionLabel>
              <h2 className="font-display mt-2 text-4xl md:text-5xl">
                {locale === 'es' ? '¡Déjanos servirte!' : 'Let Us Serve You!'}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-grey">
                {locale === 'es'
                  ? 'Catering y servicios para cada ocasión en Hillsborough y Manatee.'
                  : 'Catering and services for every occasion across Hillsborough and Manatee counties.'}
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ABOUT_SERVICE_CARDS.map((card) => (
                <Link
                  key={`${card.href}-${getLocalized(card.title, locale)}`}
                  href={card.href}
                  className="group relative overflow-hidden rounded-2xl border border-grey/10 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-pink/30 hover:shadow-xl"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${SERVICE_ICON_BG[card.icon]} transition group-hover:scale-105`}
                  >
                    <ServiceIcon icon={card.icon} />
                  </div>
                  <h3 className="font-display mt-5 text-2xl text-carbon transition group-hover:text-pink">
                    {getLocalized(card.title, locale)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-grey">
                    {getLocalized(card.description, locale)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-pink opacity-0 transition group-hover:opacity-100">
                    {locale === 'es' ? 'Ver más' : 'Learn more'}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/booking">
                <Button size="lg">{locale === 'es' ? 'Reservar catering' : 'Book Catering'}</Button>
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Connect */}
      <SectionReveal>
        <section className="gradient-boost relative overflow-hidden py-20 text-white">
          <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-lime/20 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
            <div className="text-center">
              <SectionLabel>
                <span className="text-lime">{getLocalized(ABOUT_CONNECT.title, locale)}</span>
              </SectionLabel>
              <h2 className="font-display mt-2 text-4xl md:text-5xl">{getLocalized(ABOUT_CONNECT.title, locale)}</h2>
              <p className="mx-auto mt-4 max-w-xl text-white/80">
                {getLocalized(ABOUT_CONNECT.ctaDescription, locale)}
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {connectLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm transition hover:border-white/30 hover:bg-white/15"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 transition group-hover:bg-white/25">
                    {link.icon}
                  </div>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-widest text-white/60">
                      {link.label}
                    </span>
                    <span className="block truncate font-semibold">{link.value}</span>
                  </span>
                </a>
              ))}
            </div>

            <p className="mt-12 text-center font-display text-2xl text-lime md:text-3xl">{ABOUT_TAGLINE}</p>
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

      {/* Reviews */}
      <SectionReveal>
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="text-center">
              <SectionLabel>{locale === 'es' ? 'Reseñas' : 'Reviews'}</SectionLabel>
              <h2 className="font-display mt-2 text-4xl md:text-5xl">{getLocalized(ABOUT_REVIEWS.title, locale)}</h2>
            </div>

            {testimonials.length === 0 ? (
              <div className="mx-auto mt-12 max-w-xl rounded-3xl border border-dashed border-grey/25 bg-cream px-8 py-14 text-center">
                <Quote className="mx-auto h-10 w-10 text-pink/40" aria-hidden />
                <p className="mt-4 text-grey">{getLocalized(ABOUT_REVIEWS.empty, locale)}</p>
              </div>
            ) : (
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <blockquote
                    key={String(testimonial._id)}
                    className="relative flex h-full flex-col rounded-2xl border border-grey/10 bg-cream p-6 shadow-sm"
                  >
                    <Quote className="h-8 w-8 text-pink/30" aria-hidden />
                    <div className="mt-3 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-lime text-lime" aria-hidden />
                      ))}
                    </div>
                    <p className="mt-4 flex-1 text-base leading-relaxed text-grey">
                      &ldquo;{getLocalized(testimonial.quote, locale)}&rdquo;
                    </p>
                    <footer className="mt-6 border-t border-grey/10 pt-4">
                      <strong className="text-carbon">{testimonial.name}</strong>
                      {testimonial.role && (
                        <span className="block text-sm text-grey">
                          {getLocalized(testimonial.role, locale)}
                        </span>
                      )}
                      {testimonial.verified && (
                        <span className="mt-1 inline-block text-xs font-bold uppercase tracking-wide text-pink">
                          {locale === 'es' ? 'Verificado' : 'Verified'}
                        </span>
                      )}
                    </footer>
                  </blockquote>
                ))}
              </div>
            )}

            <div className="mt-10 text-center">
              <Link
                href="/testimonials"
                className="inline-flex items-center gap-2 text-sm font-semibold text-pink hover:underline"
              >
                {getLocalized(ABOUT_REVIEWS.viewAll, locale)}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  );
}
