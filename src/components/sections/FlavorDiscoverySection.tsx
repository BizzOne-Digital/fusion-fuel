'use client';

import { FlavorCollectionsExplorer } from '@/components/products/FlavorCollectionsExplorer';
import { LOADED_TEAS } from '@/lib/brand-content';
import type { IFlavor } from '@/models/Flavor';
import type { Locale } from '@/types';

interface FlavorDiscoverySectionProps {
  flavors: IFlavor[];
  locale: Locale;
  kitProductId?: string;
}

/** @deprecated Homepage no longer uses this — prefer FlavorCollectionsExplorer on the menu page. */
export function FlavorDiscoverySection({ flavors, locale, kitProductId }: FlavorDiscoverySectionProps) {
  return (
    <FlavorCollectionsExplorer
      flavors={flavors}
      locale={locale}
      kitProductId={kitProductId}
      title={LOADED_TEAS.headline}
      subtitle={LOADED_TEAS.combinations}
    />
  );
}
