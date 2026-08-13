import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import type { IProduct } from '@/models/Product';
import type { Locale } from '@/types';

export function ProductJsonLd({ product, locale }: { product: IProduct; locale: Locale }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: getLocalized(product.name, locale),
    description: getLocalized(product.shortDescription, locale),
    sku: product.sku,
    image: product.images.map((i) => i.url),
    ...(hasPrice(product.basePrice)
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: (product.basePrice / 100).toFixed(2),
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
