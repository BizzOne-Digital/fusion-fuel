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
import { MONTHLY_TEA_CLUB } from '@/lib/brand-content';
import { SITE_IMAGES } from '@/lib/site-images';
import { cn } from '@/lib/utils';

const FEATURE_ICONS = [Sparkles, Leaf, Gift, CalendarHeart] as const;

const INSIDE_ICONS = [CupSoda, BookOpen, Sparkles, Gift, CalendarHeart] as const;

const PLAN_BADGES = ['Starter', 'Most Popular', 'Best Value', 'Bulk'] as const;

interface MonthlyTeaClubSectionProps {
  kitHref: string;
}

export function MonthlyTeaClubSection({ kitHref }: MonthlyTeaClubSectionProps) {
  return (
    <section className="relative w-full overflow-x-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-lime/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-pink/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-24">
        {/* Intro */}
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-lime/30 via-transparent to-pink/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-carbon shadow-2xl shadow-black/40">
              <Image
                src={SITE_IMAGES.megaTeaKit}
                alt="Monthly Tea Club kit"
                width={720}
                height={640}
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-16">
                <p className="font-display text-2xl text-lime">100+ Combinations</p>
                <p className="mt-1 text-sm text-white/75">Build your perfect loaded tea at home.</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#F5FF00]">
              {MONTHLY_TEA_CLUB.intro}
            </p>
            <h2 className="font-display mt-3 text-5xl leading-none text-white md:text-6xl lg:text-7xl">
              {MONTHLY_TEA_CLUB.name}
            </h2>
            <div className="mt-6 space-y-3">
              <p className="text-xl font-semibold text-white md:text-2xl">{MONTHLY_TEA_CLUB.taglines.primary}</p>
              <p className="text-lg italic text-pink">{MONTHLY_TEA_CLUB.taglines.secondary}</p>
              <p className="max-w-xl text-base text-white/70">{MONTHLY_TEA_CLUB.taglines.product}</p>
            </div>
            <Link href={kitHref} className="mt-8 inline-block">
              <Button
                size="lg"
                className="rounded-md px-8 py-4 text-sm font-bold uppercase tracking-[0.12em]"
              >
                {MONTHLY_TEA_CLUB.cta}
              </Button>
            </Link>
            <p className="mt-4 text-sm text-white/55">{MONTHLY_TEA_CLUB.ctaDetail}</p>
          </div>
        </div>

        {/* Why Join */}
        <div className="mt-20 lg:mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-pink">Membership Benefits</p>
            <h3 className="font-display mt-3 text-4xl text-white md:text-5xl">Why Join?</h3>
            <p className="mt-3 text-base text-white/65">
              A monthly box built for flavor lovers who want energy, variety, and convenience.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {MONTHLY_TEA_CLUB.features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index] ?? Sparkles;
              return (
                <article
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 transition hover:border-lime/40 hover:shadow-[0_0_40px_rgba(232,240,0,0.12)]"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lime via-yellow to-pink opacity-80" />
                  <span className="font-display text-5xl leading-none text-white/10 transition group-hover:text-lime/20">
                    0{index + 1}
                  </span>
                  <div className="mt-4 inline-flex rounded-xl bg-lime/15 p-3">
                    <Icon className="h-5 w-5 text-[#F5FF00]" aria-hidden />
                  </div>
                  <h4 className="font-display mt-4 text-2xl leading-tight text-white">{feature.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>

        {/* What's Inside */}
        <div className="mt-20 rounded-[1.75rem] border border-white/10 bg-carbon p-6 md:p-8 lg:mt-24 lg:p-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime">Unbox the Good Stuff</p>
              <h3 className="font-display mt-2 text-4xl text-white md:text-5xl">What&apos;s Inside?</h3>
            </div>
            <p className="max-w-md text-sm text-white/60 lg:text-right">{MONTHLY_TEA_CLUB.taglines.value}</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {MONTHLY_TEA_CLUB.whatsInside.map((item, index) => {
              const Icon = INSIDE_ICONS[index] ?? Check;
              return (
                <div
                  key={item}
                  className="flex min-h-[148px] flex-col rounded-2xl border border-white/10 bg-ink/70 p-5 transition hover:border-pink/40 hover:bg-ink"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-pink/15">
                    <Icon className="h-5 w-5 text-pink" aria-hidden />
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-snug text-white">{item}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Choose Your Plan */}
        <div className="mt-20 lg:mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#F5FF00]">Flexible Sizes</p>
            <h3 className="font-display mt-3 text-4xl text-white md:text-5xl">Choose Your Plan</h3>
            <p className="mt-3 text-base text-white/65">{MONTHLY_TEA_CLUB.taglines.value}</p>
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
                      ? 'border-lime bg-gradient-to-b from-lime/20 via-lime/10 to-transparent shadow-[0_0_50px_rgba(232,240,0,0.15)] hover:-translate-y-1'
                      : 'border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]'
                  )}
                >
                  {isFeatured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-pink px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {PLAN_BADGES[index]}
                    </span>
                  )}
                  {!isFeatured && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                      {PLAN_BADGES[index]}
                    </span>
                  )}
                  <p
                    className={cn(
                      'font-display mt-3 text-6xl leading-none',
                      isFeatured ? 'text-lime' : 'text-white'
                    )}
                  >
                    {plan.servings}
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
                    Tea Kit Box
                  </p>
                  <p className="mt-4 text-xs leading-relaxed text-white/55">{plan.label}</p>
                  <span
                    className={cn(
                      'mt-6 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.14em] transition',
                      isFeatured ? 'text-lime' : 'text-white/70 group-hover:text-white'
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
              className="text-sm font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:text-[#F5FF00]"
            >
              Questions? Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
