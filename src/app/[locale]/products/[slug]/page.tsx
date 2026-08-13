import { notFound } from 'next/navigation';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getProductBySlug, getPublishedFlavors, getPublishedAddIns } from '@/lib/data';
import { getLocalized, sanitizeHtml, formatPrice, hasPrice } from '@/lib/utils';
import { getProductFallbackImage } from '@/lib/site-images';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { KitBuilder } from '@/components/products/KitBuilder';
import { ProductJsonLd } from '@/components/seo/ProductJsonLd';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import type { Locale } from '@/types';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [flavors, addIns] = await Promise.all([getPublishedFlavors(), getPublishedAddIns()]);
  const image = product.images[0] ?? {
    url: getProductFallbackImage(undefined, product.productType),
    alt: getLocalized(product.name, locale as Locale),
  };

  return (
    <>
      <ProductJsonLd product={product} locale={locale as Locale} />
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: getLocalized(product.name, locale as Locale) }]} />
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
            <Image src={image.url} alt={image.alt} fill className="object-cover" priority />
          </div>
          <div>
            <h1 className="font-display text-5xl">{getLocalized(product.name, locale as Locale)}</h1>
            <p className="mt-2 text-grey">{getLocalized(product.shortDescription, locale as Locale)}</p>
            <p className="mt-4 font-display text-3xl text-pink">{formatPrice(product.basePrice, 'USD', locale as Locale)}</p>
            <div className="prose-brand mt-6 text-grey" dangerouslySetInnerHTML={{ __html: sanitizeHtml(getLocalized(product.description, locale as Locale)) }} />
            {product.caffeineMg != null && (
              <p className="mt-4 rounded-xl bg-cream p-4 text-sm">Contains caffeine (~{product.caffeineMg}mg). Not recommended for all audiences.</p>
            )}
            {product.productType === 'kit' ? (
              <div className="mt-8"><KitBuilder product={product} flavors={flavors} addIns={addIns} /></div>
            ) : hasPrice(product.basePrice) ? (
              <div className="mt-8"><AddToCartButton productId={String(product._id)} locale={locale as Locale} /></div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
