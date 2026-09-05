import Image from 'next/image';
import { Sparkles, Gift, Leaf, CalendarHeart, CupSoda, BookOpen, Check } from 'lucide-react';
import { CATERING_TAGLINE, DELIVERY, MONTHLY_TEA_CLUB } from '@/lib/brand-content';
import { MonthlyTeaClubJoinPanel } from '@/components/sections/MonthlyTeaClubJoinPanel';
import { cn } from '@/lib/utils';

const FEATURE_ICONS = [Sparkles, Leaf, Gift, CalendarHeart] as const;
const INSIDE_ICONS = [CupSoda, BookOpen, Sparkles, Gift, CalendarHeart] as const;

interface MonthlyTeaClubSectionProps {
  /** When true, reduces outer padding for use inside the menu category panel. */
  embedded?: boolean;
}

export function MonthlyTeaClubSection({ embedded = false }: MonthlyTeaClubSectionProps) {
  return (
    <section className="relative w-full overflow-x-hidden bg-white text-carbon">
      <div
        className={cn(
          'relative mx-auto max-w-7xl px-4 lg:px-8',
          embedded ? 'py-8 lg:py-10' : 'py-20 lg:py-24'
        )}
      >
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-lime/20 via-transparent to-pink/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-grey/15 bg-white shadow-xl">
              <Image
                src={MONTHLY_TEA_CLUB.posterImage}
                alt="Monthly Mega Tea Club — Fusion Fuel & Boost Co."
                width={720}
                height={900}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-pink">{MONTHLY_TEA_CLUB.intro}</p>
            <h2 className="font-display mt-3 text-5xl leading-none text-carbon md:text-6xl">{MONTHLY_TEA_CLUB.name}</h2>
            <div className="mt-6 space-y-3">
              <p className="text-xl font-semibold text-carbon md:text-2xl">{MONTHLY_TEA_CLUB.taglines.primary}</p>
              <p className="text-lg italic text-pink">{MONTHLY_TEA_CLUB.taglines.secondary}</p>
              <p className="max-w-xl text-base text-grey">{MONTHLY_TEA_CLUB.surpriseNote}</p>
            </div>

            <ul className="mt-8 space-y-3 text-sm text-grey">
              {MONTHLY_TEA_CLUB.features.slice(0, 3).map((feature) => (
                <li key={feature.title} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-pink" aria-hidden />
                  <span>
                    <strong className="text-carbon">{feature.title}</strong> — {feature.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <MonthlyTeaClubJoinPanel />

        <div className="mt-20 lg:mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-pink">Membership Benefits</p>
            <h3 className="font-display mt-3 text-4xl text-carbon md:text-5xl">Why You&apos;ll Love It</h3>
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

        <div className="mt-20 rounded-[1.75rem] border border-grey/15 bg-white p-6 shadow-sm md:p-8 lg:mt-24 lg:p-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-pink">Every Box Includes</p>
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

        <div className="mt-20 rounded-[1.75rem] border border-grey/15 bg-cream/30 p-6 md:p-8 lg:mt-24">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-pink">{MONTHLY_TEA_CLUB.joinHeadline}</p>
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
      </div>
    </section>
  );
}
