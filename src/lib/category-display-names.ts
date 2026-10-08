import type { Locale } from '@/types';
import { getLocalized } from '@/lib/utils';
import type { LocalizedString } from '@/types';

/** Spanish menu category titles for home grid (when DB `es` is still English). */
const CATEGORY_NAME_ES: Record<string, string> = {
  'loaded-teas': 'Loaded Teas',
  'mega-teas': 'Loaded Teas',
  'monthly-tea-club': 'Club Mensual Mega Tea',
  'mega-tea-kits': 'Kits Mega Tea',
  'acai-bowls': 'Bowls de Açaí',
  'protein-bowls': 'Bowls de Proteína',
  'protein-coffee': 'Café con Proteína',
  'protein-shakes': 'Batidos de Proteína',
  waffles: 'Waffles',
  'protein-treats': 'Treats de Proteína',
  'bulk-products': 'Productos de Bienestar al Mayoreo',
  donuts: 'Donuts',
  'new-and-seasonal-items': 'Novedades y Temporada',
};

export function getCategoryDisplayName(
  slug: string,
  name: LocalizedString,
  locale: Locale
): string {
  if (locale === 'es') {
    const override = CATEGORY_NAME_ES[slug];
    if (override) return override;
  }
  return getLocalized(name, locale);
}
