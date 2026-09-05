import { setRequestLocale } from 'next-intl/server';
import { getPageByKey, getPublishedProducts } from '@/lib/data';
import { generatePageMetadata } from '@/lib/seo';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PageSectionRenderer } from '@/components/sections/PageSectionRenderer';
import type { Metadata } from 'next';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata('pricing', locale as Locale, '/pricing');
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [page, products] = await Promise.all([getPageByKey('pricing'), getPublishedProducts()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Pricing' }]} />
      <h1 className="font-display text-5xl">{page ? getLocalized(page.title, locale as Locale) : 'Pricing'}</h1>
      <p className="mt-4 max-w-2xl text-grey">Prices are set by the business. Contact us when pricing is not yet published.</p>
      {(page?.sections ?? []).map((s) => <PageSectionRenderer key={s.key} section={s} locale={locale as Locale} />)}
      <div className="mt-12 overflow-x-auto rounded-2xl border border-grey/15">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={String(p._id)} className="border-t border-grey/10">
                <td className="p-4">{getLocalized(p.name, locale as Locale)}</td>
                <td className="p-4 font-semibold">{formatPrice(p.basePrice, 'USD', locale as Locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-8 text-grey">No published products with pricing yet.</p>}
      </div>
    </div>
  );
}
