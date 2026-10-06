'use client';

import { Link } from '@/i18n/navigation';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { PageHero } from '@/components/sections/PageHero';
import { PageSectionRenderer } from '@/components/sections/PageSectionRenderer';
import { PageCtaBanner } from '@/components/sections/PageCtaBanner';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { SITE_IMAGES } from '@/lib/site-images';
import type { IPage } from '@/models/Page';
import type { IProduct } from '@/models/Product';
import type { Locale } from '@/types';

interface PricingPageSectionsProps {
  locale: Locale;
  page: IPage | null;
  products: IProduct[];
}

export function PricingPageSections({ locale, page, products }: PricingPageSectionsProps) {
  const isEs = locale === 'es';
  const pageTitle = page ? getLocalized(page.title, locale) : isEs ? 'Precios' : 'Pricing';

  const pricedProducts = products.filter((p) => hasPrice(p.basePrice) && p.basePrice > 0);

  return (
    <div className="min-w-0 overflow-x-hidden">
      <PageHero
        eyebrow={isEs ? 'Transparencia' : 'Transparency'}
        title={pageTitle}
        subtitle={
          isEs
            ? 'Los precios los establece el negocio. Contáctanos cuando el precio no esté publicado.'
            : 'Prices are set by the business. Contact us when pricing is not yet published.'
        }
        image={SITE_IMAGES.pricing}
        imageAlt="Fusion Fuel products"
        minHeightClass="min-h-[40vh] lg:min-h-[44vh]"
      />

      {(page?.sections ?? []).map((section) => (
        <PageSectionRenderer key={section.key} section={section} locale={locale} />
      ))}

      <SectionReveal>
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink">
                {isEs ? 'Productos' : 'Products'}
              </p>
              <h2 className="font-display mt-2 text-4xl">
                {isEs ? 'Precios publicados' : 'Published Pricing'}
              </h2>
            </div>

            <div className="mt-12 overflow-hidden rounded-3xl border border-grey/15 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="section-lime">
                    <tr>
                      <th className="p-5 font-display text-lg">{isEs ? 'Producto' : 'Product'}</th>
                      <th className="p-5 font-display text-lg">{isEs ? 'Precio' : 'Price'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricedProducts.map((product, index) => (
                      <tr
                        key={String(product._id)}
                        className={`border-t border-grey/10 transition hover:bg-cream/50 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-cream/30'
                        }`}
                      >
                        <td className="p-5 font-medium">
                          <Link
                            href={`/products/${product.slug}`}
                            className="transition hover:text-pink"
                          >
                            {getLocalized(product.name, locale)}
                          </Link>
                        </td>
                        <td className="p-5 font-semibold text-pink">
                          {formatPrice(product.basePrice, 'USD', locale)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pricedProducts.length === 0 && (
                <p className="p-10 text-center text-grey">
                  {isEs
                    ? 'Aún no hay productos publicados con precios.'
                    : 'No published products with pricing yet.'}
                </p>
              )}
            </div>
          </div>
        </section>
      </SectionReveal>

      <PageCtaBanner
        title={isEs ? '¿Necesitas una cotización personalizada?' : 'Need a Custom Quote?'}
        primaryHref="/contact"
        primaryLabel={isEs ? 'Contáctanos' : 'Contact Us'}
        secondaryHref="/booking"
        secondaryLabel={isEs ? 'Reservar catering' : 'Book Catering'}
      />
    </div>
  );
}
