import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { MEGA_TEA_KITS_MENU, megaTeaKitPricingSummary } from '@/lib/mega-tea-kits-menu';
import type { Locale } from '@/types';

interface MegaTeaKitFactsSectionProps {
  locale: Locale;
  kitHref: string;
}

export function MegaTeaKitFactsSection({ locale, kitHref }: MegaTeaKitFactsSectionProps) {
  const isEs = locale === 'es';

  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16 lg:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-pink">
            {isEs ? 'Hecho para llevar' : 'Made for home'}
          </p>
          <h2 className="mt-3 font-display text-4xl text-carbon md:text-5xl">
            {MEGA_TEA_KITS_MENU.headline}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-grey">
            {MEGA_TEA_KITS_MENU.convenienceNote}
          </p>
          <p className="mt-3 text-grey">{MEGA_TEA_KITS_MENU.description}</p>
          <p className="mt-4 font-display text-2xl text-pink">{megaTeaKitPricingSummary()}</p>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-carbon">
              {isEs ? 'Cada kit incluye 5 productos' : 'Every kit contains 5 products'}
            </p>
            <ul className="mt-4 space-y-3">
              {MEGA_TEA_KITS_MENU.kitProducts.map((product) => (
                <li key={product} className="flex items-center gap-3 text-carbon">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-lime" aria-hidden />
                  <span>{product}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link href={kitHref} className="mt-8 inline-block">
            <Button size="lg">{isEs ? 'Ver Mega Tea Kits' : 'Shop Mega Tea Kits'}</Button>
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="overflow-hidden rounded-2xl border border-grey/15 bg-cream shadow-lg">
            <Image
              src={MEGA_TEA_KITS_MENU.factsImage.url}
              alt={MEGA_TEA_KITS_MENU.factsImage.alt}
              width={960}
              height={720}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
