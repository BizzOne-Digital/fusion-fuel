import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized } from '@/lib/utils';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { splitBrandSlogan } from '@/lib/brand-slogan';
import { HomeHeroSection } from '@/components/sections/HomeHeroSection';
import { HomeMenuCategoriesSection } from '@/components/sections/HomeMenuCategoriesSection';
import { AcaiBowlEventSection } from '@/components/sections/AcaiBowlEventSection';
import { MonthlyTeaClubSection } from '@/components/sections/MonthlyTeaClubSection';
import { SITE_IMAGES } from '@/lib/site-images';
import { Button } from '@/components/ui/Button';
import { CATERING_TAGLINE, CONTACT, DELIVERY, LOADED_TEAS, MONTHLY_TEA_CLUB } from '@/lib/brand-content';
import type { Locale } from '@/types';
import type { IProduct } from '@/models/Product';
import type { IProductCategory } from '@/models/ProductCategory';
import type { IAddIn } from '@/models/AddIn';
import type { IService } from '@/models/Service';
import type { ISiteSettings } from '@/models/SiteSettings';

const LIFESTYLE_IMAGES = [
  { url: SITE_IMAGES.megaTea, alt: 'Loaded Tea drinks' },
  { url: SITE_IMAGES.acaiBowl, alt: 'Açaí bowl' },
  { url: SITE_IMAGES.proteinCoffee, alt: 'Protein coffee' },
  { url: SITE_IMAGES.catering, alt: 'Catering spread' },
  { url: SITE_IMAGES.waffle, alt: 'Waffles' },
  { url: SITE_IMAGES.megaTeaKit, alt: 'Mega Tea Kit' },
] as const;

interface HomePageSectionsProps {
  locale: Locale;
  hero: {
    title: { en: string; es: string };
    subtitle?: { en: string; es: string };
    backgroundImage?: { url: string; alt: string };
    cta?: { label: { en: string; es: string }; href: string };
  };
  products: IProduct[];
  categories: IProductCategory[];
  addIns: IAddIn[];
  services: IService[];
  settings: Partial<ISiteSettings>;
}

export function HomePageSections({
  locale,
  hero,
  products,
  categories,
  addIns,
  services,
  settings,
}: HomePageSectionsProps) {
  const kitProduct = products.find((p) => p.productType === 'kit');
  const instagram = settings.social?.find((s) => s.platform === 'instagram');
  const facebook = settings.social?.find((s) => s.platform === 'facebook');
  const heroTitle = getLocalized(hero.title, locale);
  const { fuel: fuelLine, boost: boostLine } = splitBrandSlogan(heroTitle);
  const addOnLabels =
    addIns.length > 0
      ? addIns.map((addIn) => ({ id: String(addIn._id), label: getLocalized(addIn.name, locale) }))
      : LOADED_TEAS.addOns.map((name) => ({ id: name, label: name }));

  return (
    <div className="min-w-0 w-full max-w-full overflow-x-hidden">
      {/* Hero */}
      <HomeHeroSection
        fuelLine={fuelLine}
        boostLine={boostLine || undefined}
        kitHref={kitProduct ? `/products/${kitProduct.slug}` : '/products/mega-tea-kit-builder'}
        backgroundUrl={hero.backgroundImage?.url ?? SITE_IMAGES.heroDrinks}
      />

      {/* Menu categories */}
      <SectionReveal>
        <HomeMenuCategoriesSection categories={categories} locale={locale} />
      </SectionReveal>

      {/* Açaí Bowl Event Experience */}      <AcaiBowlEventSection />

      {/* Monthly Tea Club */}      <SectionReveal>
        <MonthlyTeaClubSection kitHref={kitProduct ? `/products/${kitProduct.slug}` : '/products/mega-tea-kit-builder'} />
      </SectionReveal>

      <SectionReveal>
        <section className="section-dark py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <h3 className="font-display text-3xl text-lime">Add-Ons Available</h3>
            <p className="mt-2 text-sm text-white/70">{LOADED_TEAS.combinations}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {addOnLabels.map(({ id, label }) => (
                <span key={id} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/90">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* 13. Catering */}
      <SectionReveal>
        <section className="py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-6">
            <Image src={SITE_IMAGES.catering} alt="Catering" width={600} height={450} className="h-auto w-full rounded-2xl object-cover" />
            <div>
              <h2 className="font-display text-4xl">Catering for Every Occasion</h2>
              <p className="mt-3 text-grey">{CATERING_TAGLINE}</p>
              <ul className="mt-4 space-y-2 text-grey">
                {services.slice(0, 5).map((s) => (
                  <li key={String(s._id)}>• {getLocalized(s.name, locale)}</li>
                ))}
              </ul>
              <Link href="/booking" className="mt-6 inline-block"><Button>Book Catering</Button></Link>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* 14. How it works */}
      <SectionReveal>
        <section className="section-cream py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <h2 className="font-display text-center text-4xl">How It Works</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                { step: '1', title: 'Choose Your Plan', desc: 'Pick a 6, 12, 20, or 30 tea kit box and select your flavors.' },
                { step: '2', title: 'Delivered Monthly', desc: 'Receive loaded tea blends, guides, boosters, and sweet surprises.' },
                { step: '3', title: 'Sip & Enjoy', desc: 'Make energizing teas at home — or book catering for your next event.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <span className="font-display inline-flex h-14 w-14 items-center justify-center rounded-full bg-lime text-2xl text-ink">{item.step}</span>
                  <h3 className="font-display mt-4 text-2xl">{item.title}</h3>
                  <p className="mt-2 text-grey">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* 15. Special offer */}
      <SectionReveal>
        <section className="px-4 py-16">
          <div className="mx-auto max-w-3xl rounded-2xl border border-grey/20 bg-white p-6 text-center shadow-sm sm:p-8">
            <h2 className="font-display text-3xl">{MONTHLY_TEA_CLUB.cta}</h2>
            <p className="mt-4 text-grey">{MONTHLY_TEA_CLUB.ctaDetail}</p>
            <p className="mt-2 text-sm text-grey">{DELIVERY.local}</p>
            <Link href="/contact" className="mt-6 inline-block text-pink font-semibold hover:underline">Contact us to subscribe →</Link>
          </div>
        </section>
      </SectionReveal>

      {/* Lifestyle montage */}
      <SectionReveal>
        <section className="section-dark py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <h2 className="font-display text-4xl text-lime">Fuel Your Lifestyle</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {LIFESTYLE_IMAGES.map((img) => (
                <Image key={img.url} src={img.url} alt={img.alt} width={400} height={300} className="h-48 w-full rounded-xl object-cover md:h-56" />
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* 20. Instagram CTA */}
      <SectionReveal>
        <section className="gradient-boost py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center md:flex-row md:text-left">
              <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-2xl bg-white/10 shadow-lg">
                <Image
                  src={CONTACT.instagramQrImage}
                  alt={`Scan to follow ${CONTACT.instagramHandle} on Instagram`}
                  fill
                  className="object-cover"
                  sizes="176px"
                />
              </div>
              <div>
                <h2 className="font-display text-4xl">Follow the Energy</h2>
                <p className="mt-2 text-white/85">Scan the code or tap below to follow us on social.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
                  {instagram ? (
                    <a
                      href={instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold underline"
                    >
                      {instagram.label ?? CONTACT.instagramHandle}
                    </a>
                  ) : null}
                  {facebook ? (
                    <a
                      href={facebook.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold underline"
                    >
                      {facebook.label ?? 'Facebook'}
                    </a>
                  ) : (
                    <a
                      href={CONTACT.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold underline"
                    >
                      {CONTACT.facebookLabel}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* 21. Final CTA */}
      <SectionReveal>
        <section className="section-dark py-24">
          <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
            <h2 className="font-display text-5xl text-lime">{MONTHLY_TEA_CLUB.taglines.secondary}</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={kitProduct ? `/products/${kitProduct.slug}` : '/products/mega-tea-kit-builder'}>
                <Button size="lg">{MONTHLY_TEA_CLUB.cta}</Button>
              </Link>
              <Link href="/booking"><Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-ink">Book Catering</Button></Link>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  );
}
