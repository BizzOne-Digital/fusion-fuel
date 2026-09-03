import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getProductBySlug, getPublishedFlavors, getPublishedAddIns } from '@/lib/data';
import { getLocalized, sanitizeHtml } from '@/lib/utils';
import {
  inferProductCategorySlug,
  productUsesPlaceholderCard,
} from '@/lib/product-placeholder';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import { ProductPlaceholderVisual } from '@/components/products/ProductPlaceholderVisual';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { KitBuilder } from '@/components/products/KitBuilder';
import { MegaTeaKitProductDetail } from '@/components/products/MegaTeaKitProductDetail';
import { LoadedTeaProductDetail } from '@/components/products/LoadedTeaProductDetail';
import { ProteinShakeProductDetail } from '@/components/products/ProteinShakeProductDetail';
import { AcaiBowlProductDetail } from '@/components/products/AcaiBowlProductDetail';
import { WaffleProductDetail } from '@/components/products/WaffleProductDetail';
import { isMegaTeaKitProduct } from '@/lib/mega-tea-kits-menu';
import { isLoadedTeaProduct } from '@/lib/loaded-teas-menu';
import { isProteinShakeProduct } from '@/lib/protein-shakes-menu';
import { isAcaiBowlProduct } from '@/lib/acai-bowls-menu';
import { isWaffleProduct } from '@/lib/waffles-menu';
import { PieInACupProductDetail } from '@/components/products/PieInACupProductDetail';
import { ProteinTreatProductDetail } from '@/components/products/ProteinTreatProductDetail';
import { isPieInACupProduct, isProteinTreatProduct } from '@/lib/protein-treats-menu';
import { ProteinCoffeeProductDetail } from '@/components/products/ProteinCoffeeProductDetail';
import { isProteinCoffeeProduct } from '@/lib/protein-coffee-menu';
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
  const productAddIns = resolveProductAddIns(product, addIns);
  const galleryImages = product.images.filter((image) => image.url?.trim());
  const usePlaceholder = productUsesPlaceholderCard(product);
  const pricedVariants = product.variants.filter((variant) => variant.price > 0);
  const showListedPrice = hasPrice(product.basePrice) && pricedVariants.length <= 1;

  const isMegaTeaKit = isMegaTeaKitProduct(slug);
  const isLoadedTea = isLoadedTeaProduct(slug);
  const isProteinShake = isProteinShakeProduct(slug);
  const isAcaiBowl = isAcaiBowlProduct(slug);
  const isWaffle = isWaffleProduct(slug);
  const isPieInACup = isPieInACupProduct(slug);
  const isProteinTreat = isProteinTreatProduct(slug) && !isPieInACup;
  const isProteinCoffee = isProteinCoffeeProduct(slug);

  return (
    <>
      <ProductJsonLd product={product} locale={typedLocale} />
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Menu', href: '/menu' }, { label: name }]} />
        {isMegaTeaKit ? (
          <MegaTeaKitProductDetail product={product} flavors={flavors} addIns={productAddIns} locale={typedLocale} />
        ) : isLoadedTea ? (
          <LoadedTeaProductDetail product={product} addIns={productAddIns} locale={typedLocale} />
        ) : isProteinShake ? (
          <ProteinShakeProductDetail product={product} addIns={productAddIns} locale={typedLocale} />
        ) : isAcaiBowl ? (
          <AcaiBowlProductDetail
            product={product}
            addIns={productAddIns}
            locale={typedLocale}
            categorySlug={categorySlug}
          />
        ) : isWaffle ? (
          <WaffleProductDetail
            product={product}
            addIns={productAddIns}
            locale={typedLocale}
            categorySlug={categorySlug}
          />
        ) : isPieInACup ? (
          <PieInACupProductDetail product={product} locale={typedLocale} />
        ) : isProteinTreat ? (
          <ProteinTreatProductDetail product={product} locale={typedLocale} />
        ) : isProteinCoffee ? (
          <ProteinCoffeeProductDetail product={product} addIns={productAddIns} locale={typedLocale} />
        ) : (
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            {usePlaceholder ? (
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
                <ProductPlaceholderVisual
                  name={name}
                  subtitle={shortDescription}
                  categorySlug={categorySlug}
                  locale={typedLocale}
                />
              </div>
            ) : (
              <ProductImageGallery images={galleryImages} name={name} />
            )}
          </div>
          <div>
            <h1 className="font-display text-5xl">{name}</h1>
            <p className="mt-2 text-grey">{shortDescription}</p>
            {showListedPrice && (
              <p className="mt-4 font-display text-3xl text-pink">
                {formatPrice(product.basePrice, 'USD', typedLocale)}
              </p>
            )}
            <div className="prose-brand mt-6 text-grey" dangerouslySetInnerHTML={{ __html: sanitizeHtml(getLocalized(product.description, typedLocale)) }} />
            {product.caffeineMg != null && (
              <p className="mt-4 rounded-xl bg-cream p-4 text-sm">Contains caffeine (~{product.caffeineMg}mg). Not recommended for all audiences.</p>
            )}
            {product.productType === 'kit' && !isMegaTeaKit ? (
              <div className="mt-8"><KitBuilder product={product} flavors={flavors} addIns={addIns} /></div>
            ) : product.productType !== 'kit' && hasPrice(product.basePrice) ? (
              <div className="mt-8 space-y-4">
                <ProductAddToCart product={product} addIns={productAddIns} locale={typedLocale} />
                <Link href="/booking">
                  <Button variant="outline" size="lg">
                    {typedLocale === 'es' ? 'Reservar catering' : 'Book catering'}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-8">
                <Link href="/booking">
                  <Button size="lg">
                    {typedLocale === 'es' ? 'Reservar catering' : 'Book catering'}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </>
  );
}
