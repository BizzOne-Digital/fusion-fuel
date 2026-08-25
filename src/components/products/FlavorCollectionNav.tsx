import { Link } from '@/i18n/navigation';
import { FLAVOR_COLLECTIONS } from '@/lib/menu-flavors';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types';

interface FlavorCollectionNavProps {
  locale: Locale;
  activeSlug?: string;
  className?: string;
  /** Use hash-only on the same page, or `/menu` when linking from elsewhere. */
  basePath?: string;
  variant?: 'light' | 'dark';
}

export function FlavorCollectionNav({
  locale,
  activeSlug,
  className,
  basePath = '',
  variant = 'light',
}: FlavorCollectionNavProps) {
  const inactiveClass =
    variant === 'dark'
      ? 'bg-white/10 text-white hover:bg-white/20'
      : 'bg-cream text-carbon hover:bg-lime/30';

  return (
    <nav
      aria-label={locale === 'es' ? 'Colecciones de sabores' : 'Flavor collections'}
      className={cn(
        'flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible',
        className
      )}
    >
      {FLAVOR_COLLECTIONS.map((collection) => {
        const href = basePath ? `${basePath}#${collection.slug}` : `#${collection.slug}`;
        const isActive = activeSlug === collection.slug;

        return (
          <Link
            key={collection.slug}
            href={href}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
              isActive ? 'bg-lime text-ink' : inactiveClass
            )}
          >
            {collection.name}
          </Link>
        );
      })}
    </nav>
  );
}
