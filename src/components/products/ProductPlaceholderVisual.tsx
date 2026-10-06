import { getCategoryCardStyle } from '@/lib/product-placeholder';

interface ProductPlaceholderVisualProps {
  name: string;
  subtitle?: string;
  categorySlug: string;
  compact?: boolean;
  locale?: 'en' | 'es';
}

export function ProductPlaceholderVisual({
  name,
  subtitle,
  categorySlug,
  compact = false,
  locale = 'en',
}: ProductPlaceholderVisualProps) {
  const style = getCategoryCardStyle(categorySlug);

  return (
    <div
      className={`flex h-full w-full flex-col justify-between bg-gradient-to-br ${style.gradient} ${
        compact ? 'p-4' : 'p-6'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-carbon/50">
          {style.label}
        </span>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${style.badge}`}
        >
          {locale === 'es' ? 'Pronto' : 'Soon'}
        </span>
      </div>

      <div className="my-auto py-3">
        <p
          className={`font-display leading-tight text-carbon ${
            compact ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-4xl'
          }`}
        >
          {name}
        </p>
        {subtitle && (
          <p
            className={`mt-2 text-carbon/70 ${compact ? 'line-clamp-3 text-xs sm:text-sm' : 'line-clamp-4 text-sm'}`}
          >
            {subtitle}
          </p>
        )}
      </div>

      <p className="text-[10px] font-medium uppercase tracking-widest text-carbon/35">
        {locale === 'es' ? 'Foto próximamente' : 'Photo coming soon'}
      </p>
    </div>
  );
}
