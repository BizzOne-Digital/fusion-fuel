import type { IProduct } from '@/models/Product';
import type { Locale } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: IProduct[];
  locale: Locale;
  categorySlug?: string;
}

export function ProductGrid({ products, locale, categorySlug }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-grey/30 p-8 text-center text-grey">
        {locale === 'es' ? 'No hay productos publicados todavía.' : 'No published products yet.'}
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={String(product._id)}
          product={product}
          locale={locale}
          categorySlug={categorySlug}
        />
      ))}
    </div>
  );
}
