import { notFound } from 'next/navigation';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getProductBySlug, getPublishedFlavors, getPublishedAddIns } from '@/lib/data';
import { getLocalized, sanitizeHtml } from '@/lib/utils';
import {
  inferProductCategorySlug,
  productUsesPlaceholderCard,
} from '@/lib/product-placeholder';
import { ProductPlaceholderVisual } from '@/components/products/ProductPlaceholderVisual';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { KitBuilder } from '@/components/products/KitBuilder';
import { ProductAddToCart } from '@/components/products/ProductAddToCart';
import { resolveProductAddIns } from '@/lib/product-add-ins';
import { ProductJsonLd } from '@/components/seo/ProductJsonLd';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { formatPrice, hasPrice } from '@/lib/utils';
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
  const typedLocale = locale as Locale;
  const name = getLocalized(product.name, typedLocale);
  const shortDescription = getLocalized(product.shortDescription, typedLocale);
  const categorySlug = inferProductCategorySlug(product.slug);
  const usePlaceholder = productUsesPlaceholderCard(product);
  const productAddIns = resolveProductAddIns(product, addIns);
  const image = product.images[0];

  return (
    <>
      <ProductJsonLd product={product} locale={typedLocale} />
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Menu', href: '/menu' }, { label: name }]} />
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
            {usePlaceholder ? (
              <ProductPlaceholderVisual
                name={name}
                subtitle={shortDescription}
                categorySlug={categorySlug}
                locale={typedLocale}
              />
            ) : (
              <Image
                src={image.url}
                alt={image.alt || name}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
          <div>
            <h1 className="font-display text-5xl">{name}</h1>
            <p className="mt-2 text-grey">{shortDescription}</p>
            {hasPrice(product.basePrice) && (
              <p className="mt-4 font-display text-3xl text-pink">
                {formatPrice(product.basePrice, 'USD', typedLocale)}
              </p>
            )}
            <div className="prose-brand mt-6 text-grey" dangerouslySetInnerHTML={{ __html: sanitizeHtml(getLocalized(product.description, typedLocale)) }} />
            {product.caffeineMg != null && (
              <p className="mt-4 rounded-xl bg-cream p-4 text-sm">Contains caffeine (~{product.caffeineMg}mg). Not recommended for all audiences.</p>
            )}
            {product.productType === 'kit' ? (
              <div className="mt-8"><KitBuilder product={product} flavors={flavors} addIns={addIns} /></div>
            ) : hasPrice(product.basePrice) ? (
              <div className="mt-8 space-y-4">
                <ProductAddToCart product={product} addIns={productAddIns} locale={typedLocale} />
                <Link href="/booking">
                  <Button variant="outline" size="lg">
                    {typedLocale === 'es' ? 'Reservar catering' : 'Book catering'}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/booking">
                  <Button size="lg">
                    {typedLocale === 'es' ? 'Reservar catering' : 'Book catering'}
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    {typedLocale === 'es' ? 'Contáctanos' : 'Contact us'}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
