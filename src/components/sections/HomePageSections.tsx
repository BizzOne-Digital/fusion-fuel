import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized } from '@/lib/utils';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { splitBrandSlogan } from '@/lib/brand-slogan';
import { HomeHeroSection } from '@/components/sections/HomeHeroSection';
import { LiquidMask } from '@/components/motion/LiquidMask';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CategoryNav } from '@/components/products/CategoryNav';
import { FlavorDiscoverySection } from '@/components/sections/FlavorDiscoverySection';
import { AcaiBowlEventSection } from '@/components/sections/AcaiBowlEventSection';
import { MonthlyTeaClubSection } from '@/components/sections/MonthlyTeaClubSection';
import { Button } from '@/components/ui/Button';
import { SITE_IMAGES, getCategoryImage } from '@/lib/site-images';
import { CATERING_TAGLINE, DELIVERY, LOADED_TEAS, MONTHLY_TEA_CLUB } from '@/lib/brand-content';
import type { Locale } from '@/types';
import type { IProduct } from '@/models/Product';
import type { IProductCategory } from '@/models/ProductCategory';
import type { IFlavor } from '@/models/Flavor';
import type { IAddIn } from '@/models/AddIn';
import type { IService } from '@/models/Service';
import type { ITestimonial } from '@/models/Testimonial';
import type { ISiteSettings } from '@/models/SiteSettings';

const LIFESTYLE_IMAGES = [
  { url: SITE_IMAGES.megaTea, alt: 'Mega Tea drinks' },
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
  flavors: IFlavor[];
  addIns: IAddIn[];
  services: IService[];
  testimonials: ITestimonial[];
  settings: Partial<ISiteSettings>;
}

export function HomePageSections({
  locale,
  hero,
  products,
  categories,
  flavors,
  addIns,
  services,
  testimonials,
  settings,
}: HomePageSectionsProps) {
  const kitProduct = products.find((p) => p.productType === 'kit');
  const featured = products.filter((p) => p.featured).slice(0, 6);
  const instagram = settings.social?.find((s) => s.platform === 'instagram');
  const heroTitle = getLocalized(hero.title, locale);
  const { fuel: fuelLine, boost: boostLine } = splitBrandSlogan(heroTitle);

  return (
    <div className="min-w-0 w-full max-w-full overflow-x-hidden">
      {/* Hero */}
      <HomeHeroSection
        fuelLine={fuelLine}
        boostLine={boostLine || undefined}
        kitHref={kitProduct ? `/products/${kitProduct.slug}` : '/products/mega-tea-kit-builder'}
        backgroundUrl={hero.backgroundImage?.url ?? SITE_IMAGES.heroDrinks}
      />

      {/* 4. Mega Tea showcase */}
      <SectionReveal>
        <section className="section-cream py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-6">
            <LiquidMask className="overflow-hidden rounded-2xl">
              <Image src={SITE_IMAGES.megaTea} alt="Mega Tea" width={600} height={500} className="h-auto w-full max-w-full rounded-2xl object-cover" />
            </LiquidMask>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-pink">01 · Loaded Teas</p>
              <h2 className="font-display mt-2 text-4xl md:text-5xl">{LOADED_TEAS.headline.replace(' For You!', '')}<span className="text-pink"> For You!</span></h2>
              <p className="mt-4 text-grey">{LOADED_TEAS.sellingPoints.join(' ')}</p>
              <p className="mt-2 font-semibold text-carbon">{LOADED_TEAS.combinations}</p>
              <Link href="/products?category=mega-teas" className="mt-6 inline-block text-pink font-semibold hover:underline">View Mega Teas →</Link>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* 5. Category navigation */}
      <SectionReveal>
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <h2 className="font-display mb-8 text-4xl">Explore the Menu</h2>
            <CategoryNav categories={categories} locale={locale} />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.slice(0, 6).map((cat) => (
                <Link key={String(cat._id)} href={`/products?category=${cat.slug}`} className="group relative overflow-hidden rounded-2xl bg-carbon p-6 text-white">
                  <Image src={getCategoryImage(cat.slug)} alt="" width={400} height={200} className="absolute inset-0 h-full w-full object-cover opacity-40 transition group-hover:scale-105" />
                  <span className="relative font-display text-2xl">{getLocalized(cat.name, locale)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* 6. Flavor discovery — pinned horizontal scroll */}
      <FlavorDiscoverySection flavors={flavors} locale={locale} />

      {/* 7. Açaí Bowl Event Experience */}
      <SectionReveal>
        <AcaiBowlEventSection />
      </SectionReveal>

      {/* 8. Protein coffee & shakes */}
      <SectionReveal>
        <section className="section-cream py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 lg:px-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <Image src={SITE_IMAGES.proteinCoffee} alt="Protein coffee" width={500} height={350} className="h-auto w-full rounded-xl object-cover" />
              <h3 className="font-display mt-4 text-2xl">Protein Coffee</h3>
              <p className="mt-2 text-sm text-grey">Caffeine disclosure available. Not recommended for all audiences.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <Image src={SITE_IMAGES.proteinShake} alt="Protein shake" width={500} height={350} className="h-auto w-full rounded-xl object-cover" />
              <h3 className="font-display mt-4 text-2xl">Protein Shakes</h3>
              <p className="mt-2 text-sm text-grey">Protein-forward options with ingredient details on request.</p>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* 9. Waffles, donuts, treats */}
      <SectionReveal>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <h2 className="font-display text-4xl">Treats & More</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[SITE_IMAGES.waffle, SITE_IMAGES.donut, SITE_IMAGES.proteinTreat].map((src) => (
                <Image key={src} src={src} alt="" width={400} height={300} className="h-56 w-full rounded-2xl object-cover" />
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Monthly Tea Club */}
      <SectionReveal>
        <MonthlyTeaClubSection kitHref={kitProduct ? `/products/${kitProduct.slug}` : '/products/mega-tea-kit-builder'} />
      </SectionReveal>

      <SectionReveal>
        <section className="section-dark py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <h3 className="font-display text-3xl text-lime">Add-Ons Available</h3>
            <p className="mt-2 text-sm text-white/70">{LOADED_TEAS.combinations}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {LOADED_TEAS.addOns.map((name) => (
                <span key={name} className="rounded-full bg-white/10 px-4 py-2 text-sm">{name}</span>
              ))}
            </div>
            {addIns.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-6">
                {addIns.map((a) => (
                  <span key={String(a._id)} className="rounded-full bg-lime/20 px-4 py-2 text-sm text-lime">{getLocalized(a.name, locale)}</span>
                ))}
              </div>
            )}
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

      {/* 16. Featured products */}
      <SectionReveal>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <h2 className="font-display text-4xl">Featured Products</h2>
            <div className="mt-8"><ProductGrid products={featured.length ? featured : products.slice(0, 6)} locale={locale} /></div>
          </div>
        </section>
      </SectionReveal>

      {/* 17. Lifestyle montage */}
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

      {/* 18. Testimonials */}
      <SectionReveal>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <h2 className="font-display text-4xl">Client Feedback</h2>
            {testimonials.length === 0 ? (
              <p className="mt-4 text-grey">Verified testimonials will appear here when published by the business.</p>
            ) : (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {testimonials.slice(0, 2).map((t) => (
                  <blockquote key={String(t._id)} className="rounded-2xl border border-grey/15 p-6">
                    <p className="text-grey">&ldquo;{getLocalized(t.quote, locale)}&rdquo;</p>
                    <footer className="mt-4 font-semibold">{t.name}{t.verified && ' · Verified'}</footer>
                  </blockquote>
                ))}
              </div>
            )}
            <Link href="/testimonials" className="mt-6 inline-block text-pink hover:underline">View all →</Link>
          </div>
        </section>
      </SectionReveal>

      {/* 20. Instagram CTA */}
      <SectionReveal>
        <section className="gradient-boost py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center lg:px-6">
            <h2 className="font-display text-4xl">Follow the Energy</h2>
            {instagram ? (
              <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block max-w-full break-all text-lg underline">@{instagram.url.split('/').filter(Boolean).pop()}</a>
            ) : (
              <p className="mt-4 text-white/80">Connect with us on Instagram for updates.</p>
            )}
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
