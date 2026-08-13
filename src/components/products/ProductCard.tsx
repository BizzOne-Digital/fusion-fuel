import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { getProductFallbackImage } from '@/lib/site-images';
import type { IProduct } from '@/models/Product';
import type { Locale } from '@/types';

interface ProductCardProps {
  product: IProduct;
  locale: Locale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const image = product.images[0] ?? {
    url: getProductFallbackImage(undefined, product.productType),
    alt: getLocalized(product.name, locale),
  };
  const price = product.basePrice;

  return (
    <article className="group overflow-hidden rounded-2xl border border-grey/15 bg-white transition hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-cream">
          <Image
            src={image.url}
            alt={image.alt || getLocalized(product.name, locale)}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
          {product.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-lime px-3 py-1 text-xs font-bold uppercase text-ink">
              Featured
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-display text-xl text-carbon">{getLocalized(product.name, locale)}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-grey">
            {getLocalized(product.shortDescription, locale)}
          </p>
          <p className="mt-3 font-semibold text-pink">
            {hasPrice(price) ? formatPrice(price, 'USD', locale) : formatPrice(null, 'USD', locale)}
          </p>
        </div>
      </Link>
    </article>
  );
}
