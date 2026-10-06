import { getLocalized, hasPrice } from '@/lib/utils';
import { absoluteUrl, localePath } from '@/lib/seo';
import type { IProduct } from '@/models/Product';
import type { Locale } from '@/types';

export function ProductJsonLd({ product, locale }: { product: IProduct; locale: Locale }) {
  const productUrl = absoluteUrl(localePath(locale, `/products/${product.slug}`));
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: getLocalized(product.name, locale),
    description: getLocalized(product.shortDescription, locale),
    sku: product.sku,
    image: product.images.map((i) => i.url),
    url: productUrl,
    ...(hasPrice(product.basePrice)
      ? {
          offers: {
            '@type': 'Offer',
            url: productUrl,
            priceCurrency: 'USD',
            price: (product.basePrice / 100).toFixed(2),
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
