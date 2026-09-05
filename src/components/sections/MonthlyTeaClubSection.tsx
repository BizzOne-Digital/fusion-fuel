import Image from 'next/image';
import {
  Sparkles,
  Gift,
  Leaf,
  CalendarHeart,
  CupSoda,
  BookOpen,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { CATERING_TAGLINE, CONTACT, DELIVERY, MONTHLY_TEA_CLUB } from '@/lib/brand-content';
import { cn } from '@/lib/utils';

const FEATURE_ICONS = [Sparkles, Leaf, Gift, CalendarHeart] as const;

const INSIDE_ICONS = [CupSoda, BookOpen, Sparkles, Gift, CalendarHeart] as const;

const PLAN_BADGES = ['Starter', 'Most Popular', 'Best Value', 'Bulk'] as const;

interface MonthlyTeaClubSectionProps {
  kitHref: string;
  /** When true, reduces outer padding for use inside the menu category panel. */
  embedded?: boolean;
}

export function MonthlyTeaClubSection({ kitHref, embedded = false }: MonthlyTeaClubSectionProps) {
  return (
    <section className="relative w-full overflow-x-hidden bg-white text-carbon">
      <div
        className={cn(
          'relative mx-auto max-w-7xl px-4 lg:px-8',
          embedded ? 'py-8 lg:py-10' : 'py-20 lg:py-24'
        )}
      >
        {/* Intro */}
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-lime/20 via-transparent to-pink/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-grey/15 bg-white shadow-xl">
              <Image
                src={MONTHLY_TEA_CLUB.posterImage}
                alt="Monthly Tea Club — Fusion Fuel & Boost Co."
                width={720}
                height={900}
                className="h-auto w-full object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-6 pb-6 pt-20">
                <p className="font-display text-xl text-lime md:text-2xl">{MONTHLY_TEA_CLUB.boxTagline}</p>
                <p className="mt-2 text-sm text-white/80">{MONTHLY_TEA_CLUB.taglines.product}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-pink">
              {MONTHLY_TEA_CLUB.intro}
            </p>
            <h2 className="font-display mt-3 text-5xl leading-none text-carbon md:text-6xl lg:text-7xl">
              {MONTHLY_TEA_CLUB.name}
            </h2>
            <div className="mt-6 space-y-3">
              <p className="text-xl font-semibold text-carbon md:text-2xl">{MONTHLY_TEA_CLUB.taglines.primary}</p>
              <p className="text-lg italic text-pink">{MONTHLY_TEA_CLUB.taglines.secondary}</p>
              <p className="max-w-xl text-base text-grey">{MONTHLY_TEA_CLUB.taglines.product}</p>
            </div>
            <Link href={kitHref} className="mt-8 inline-block">
              <Button
                size="lg"
                className="rounded-md px-8 py-4 text-sm font-bold uppercase tracking-[0.12em]"
              >
                {MONTHLY_TEA_CLUB.cta}
              </Button>
            </Link>
            <p className="mt-4 text-sm text-grey">{MONTHLY_TEA_CLUB.ctaDetail}</p>
          </div>
        </div>

        {/* Why Join */}
        <div className="mt-20 lg:mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-pink">Membership Benefits</p>
            <h3 className="font-display mt-3 text-4xl text-carbon md:text-5xl">Why Join?</h3>
            <p className="mt-3 text-base text-grey">
              A monthly box built for flavor lovers who want energy, variety, and convenience.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {MONTHLY_TEA_CLUB.features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index] ?? Sparkles;
              return (
                <article
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-grey/15 bg-white p-6 shadow-sm transition hover:border-lime/50 hover:shadow-md"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lime via-yellow to-pink opacity-80" />
                  <span className="font-display text-5xl leading-none text-carbon/10 transition group-hover:text-lime/30">
                    0{index + 1}
                  </span>
                  <div className="mt-4 inline-flex rounded-xl bg-lime/20 p-3">
                    <Icon className="h-5 w-5 text-carbon" aria-hidden />
                  </div>
                  <h4 className="font-display mt-4 text-2xl leading-tight text-carbon">{feature.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-grey">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>

        {/* What's Inside */}
        <div className="mt-20 rounded-[1.75rem] border border-grey/15 bg-white p-6 shadow-sm md:p-8 lg:mt-24 lg:p-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-pink">Unbox the Good Stuff</p>
              <h3 className="font-display mt-2 text-4xl text-carbon md:text-5xl">What&apos;s Inside?</h3>
            </div>
            <p className="max-w-md text-sm text-grey lg:text-right">{MONTHLY_TEA_CLUB.taglines.value}</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {MONTHLY_TEA_CLUB.whatsInside.map((item, index) => {
              const Icon = INSIDE_ICONS[index] ?? Check;
              return (
                <div
                  key={item}
                  className="flex min-h-[148px] flex-col rounded-2xl border border-grey/15 bg-cream/40 p-5 transition hover:border-lime/50 hover:bg-lime/10"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-pink/15">
                    <Icon className="h-5 w-5 text-pink" aria-hidden />
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-snug text-carbon">{item}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Choose Your Plan */}
        <div className="mt-20 lg:mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-pink">Flexible Sizes</p>
            <h3 className="font-display mt-3 text-4xl text-carbon md:text-5xl">Choose Your Plan</h3>
            <p className="mt-3 text-base text-grey">{MONTHLY_TEA_CLUB.taglines.value}</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {MONTHLY_TEA_CLUB.plans.map((plan, index) => {
              const isFeatured = plan.servings === 12;
              return (
                <Link
                  key={plan.servings}
                  href={kitHref}
                  className={cn(
                    'group relative flex flex-col rounded-[1.5rem] border p-6 text-center transition duration-300',
                    isFeatured
                      ? 'border-lime bg-lime/15 shadow-md hover:-translate-y-1'
                      : 'border-grey/15 bg-white shadow-sm hover:border-pink/30 hover:shadow-md'
                  )}
                >
                  {isFeatured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-pink px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {PLAN_BADGES[index]}
                    </span>
                  )}
                  {!isFeatured && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-grey">
                      {PLAN_BADGES[index]}
                    </span>
                  )}
                  <p
                    className={cn(
                      'font-display mt-3 text-6xl leading-none',
                      isFeatured ? 'text-pink' : 'text-carbon'
                    )}
                  >
                    {plan.servings}
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-grey">
                    Tea Kit Box
                  </p>
                  <p className="mt-4 text-xs leading-relaxed text-grey">{plan.label}</p>
                  <span
                    className={cn(
                      'mt-6 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.14em] transition',
                      isFeatured ? 'text-pink' : 'text-carbon group-hover:text-pink'
                    )}
                  >
                    Select Plan
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href={kitHref}>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-md px-8 py-4 text-sm font-bold uppercase tracking-[0.12em]"
              >
                {MONTHLY_TEA_CLUB.cta}
              </Button>
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold uppercase tracking-[0.14em] text-pink transition hover:text-carbon"
            >
              Questions? Contact Us
            </Link>
          </div>
        </div>

        {/* Delivery, shipping & join */}
        <div className="mt-20 rounded-[1.75rem] border border-grey/15 bg-cream/30 p-6 md:p-8 lg:mt-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-pink">{MONTHLY_TEA_CLUB.joinHeadline}</p>
              <p className="mt-3 text-lg text-carbon">{MONTHLY_TEA_CLUB.ctaDetail}</p>
              <ul className="mt-6 space-y-3 text-sm text-grey">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-pink" aria-hidden />
                  {DELIVERY.local}
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-pink" aria-hidden />
                  {DELIVERY.nationwide}
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-pink" aria-hidden />
                  {CATERING_TAGLINE}
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-grey/15 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-grey">Get in Touch</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <span className="text-grey">Phone: </span>
                  <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="font-semibold text-carbon hover:text-pink">
                    {CONTACT.phone}
                  </a>
                </li>
                <li>
                  <span className="text-grey">Email: </span>
                  <a href={`mailto:${CONTACT.email}`} className="font-semibold text-carbon hover:text-pink">
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <span className="text-grey">Instagram: </span>
                  <a
                    href={CONTACT.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-carbon hover:text-pink"
                  >
                    {CONTACT.instagramHandle}
                  </a>
                </li>
                <li>
                  <span className="text-grey">Facebook: </span>
                  <a
                    href={CONTACT.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-carbon hover:text-pink"
                  >
                    {CONTACT.facebookLabel}
                  </a>
                </li>
              </ul>
              <Link href="/contact" className="mt-6 inline-block">
                <Button size="sm" className="rounded-md text-xs font-bold uppercase tracking-[0.1em]">
                  {MONTHLY_TEA_CLUB.cta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
