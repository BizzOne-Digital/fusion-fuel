import { Link } from '@/i18n/navigation';
import { getLocalized } from '@/lib/utils';
import type { IProductCategory } from '@/models/ProductCategory';
import type { Locale } from '@/types';

interface MenuCategorySidebarProps {
  categories: IProductCategory[];
  locale: Locale;
  activeSlug?: string;
}

export function MenuCategorySidebar({ categories, locale, activeSlug }: MenuCategorySidebarProps) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-grey">
        {locale === 'es' ? 'Filtrar' : 'Filter'}
      </p>
      <nav aria-label={locale === 'es' ? 'Categorías del menú' : 'Menu categories'} className="flex flex-col gap-1">
        <Link
          href="/menu"
          className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
            !activeSlug ? 'bg-lime text-ink' : 'bg-cream text-carbon hover:bg-lime/30'
          }`}
        >
          {locale === 'es' ? 'Todo el menú' : 'All menu'}
        </Link>
        {categories.map((cat) => (
          <Link
            key={String(cat._id)}
            href={`/menu?category=${cat.slug}`}
            className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
              activeSlug === cat.slug ? 'bg-lime text-ink' : 'bg-cream text-carbon hover:bg-lime/30'
            }`}
          >
            {getLocalized(cat.name, locale)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
