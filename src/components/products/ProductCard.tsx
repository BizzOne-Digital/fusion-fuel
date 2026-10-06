import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { getMenuCatalogImageUrl, getPrimaryProductImage } from '@/lib/product-display';
import {
  inferProductCategorySlug,
  productUsesPlaceholderCard,
} from '@/lib/product-placeholder';
import { ProductPlaceholderVisual } from '@/components/products/ProductPlaceholderVisual';
import { StorefrontImage } from '@/components/ui/StorefrontImage';
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
  const catalogFallback = getMenuCatalogImageUrl(product.slug);
  const primaryImage = getPrimaryProductImage(
    product,
    catalogFallback ? { url: catalogFallback, alt: name } : undefined
  );
  const usePlaceholder = !primaryImage && productUsesPlaceholderCard(product);
  const hoverImage = getProductHoverImage(product, name);

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
          ) : primaryImage ? (
            <>
              <StorefrontImage
                src={primaryImage.url}
                alt={primaryImage.alt || name}
                fill
                className={`object-cover transition duration-500 ${
                  hoverImage
                    ? 'opacity-100 group-hover:opacity-0 group-hover:scale-105'
                    : 'group-hover:scale-105'
                }`}
                sizes="(max-width:768px) 100%, 33vw"
              />
              {hoverImage && (
                <StorefrontImage
                  src={hoverImage.url}
                  alt={hoverImage.alt}
                  fill
                  className="absolute inset-0 object-cover opacity-0 transition duration-500 group-hover:opacity-100 group-hover:scale-105"
                  sizes="(max-width:768px) 100%, 33vw"
                />
              )}
            </>
          ) : null}
          {product.featured && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-lime px-3 py-1 text-xs font-bold uppercase text-ink">
              Featured
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-display text-xl text-carbon">{name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-grey">{subtitle}</p>
          {hasPrice(product.basePrice) && (
            <p className="mt-2 font-display text-lg text-pink">
              {formatPrice(product.basePrice, 'USD', locale)}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}

function getProductHoverImage(product: IProduct, name: string) {
  const gallery = (product.images ?? []).filter((image) => image.url?.trim());
  if (gallery.length < 2) return null;
  const second = gallery[1];
  return { url: second.url, alt: second.alt || `${name} alternate view` };
}
