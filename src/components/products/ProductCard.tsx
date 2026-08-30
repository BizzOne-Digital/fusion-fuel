import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized } from '@/lib/utils';
import {
  inferProductCategorySlug,
  productUsesPlaceholderCard,
} from '@/lib/product-placeholder';
import { ProductPlaceholderVisual } from '@/components/products/ProductPlaceholderVisual';
import type { IProduct } from '@/models/Product';
import type { Locale } from '@/types';

interface ProductCardProps {
  product: IProduct;
  locale: Locale;
  categorySlug?: string;
}

export function ProductCard({ product, locale, categorySlug }: ProductCardProps) {
  const name = getLocalized(product.name, locale);
  const subtitle = getLocalized(product.shortDescription, locale);
  const resolvedCategory = categorySlug ?? inferProductCategorySlug(product.slug);
  const usePlaceholder = productUsesPlaceholderCard(product);

  return (
    <article className="group overflow-hidden rounded-2xl border border-grey/15 bg-white transition hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-cream">
          {usePlaceholder ? (
            <ProductPlaceholderVisual
              name={name}
              categorySlug={resolvedCategory}
              compact
              locale={locale}
            />
          ) : (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width:768px) 100%, 33vw"
            />
          )}
          {product.featured && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-lime px-3 py-1 text-xs font-bold uppercase text-ink">
              Featured
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-display text-xl text-carbon">{name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-grey">{subtitle}</p>
        </div>
      </Link>
    </article>
  );
}
