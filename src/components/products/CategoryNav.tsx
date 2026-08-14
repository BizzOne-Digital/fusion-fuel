import { Link } from '@/i18n/navigation';
import { getLocalized } from '@/lib/utils';
import type { IProductCategory } from '@/models/ProductCategory';
import type { Locale } from '@/types';

interface CategoryNavProps {
  categories: IProductCategory[];
  locale: Locale;
  activeSlug?: string;
}

export function CategoryNav({ categories, locale, activeSlug }: CategoryNavProps) {
  return (
    <nav aria-label="Product categories" className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
      <Link
        href="/products"
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
          !activeSlug ? 'bg-lime text-ink' : 'bg-cream text-carbon hover:bg-lime/30'
        }`}
      >
        {locale === 'es' ? 'Todos' : 'All'}
      </Link>
      {categories.map((cat) => (
        <Link
          key={String(cat._id)}
          href={`/products?category=${cat.slug}`}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
            activeSlug === cat.slug ? 'bg-lime text-ink' : 'bg-cream text-carbon hover:bg-lime/30'
          }`}
        >
          {getLocalized(cat.name, locale)}
        </Link>
      ))}
    </nav>
  );
}
