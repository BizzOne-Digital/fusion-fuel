'use client';

import { FlavorCollectionsExplorer } from '@/components/products/FlavorCollectionsExplorer';
import { MAKE_YOUR_OWN_LOADED_TEA_MENU } from '@/lib/make-your-own-loaded-tea-menu';
import type { IFlavor } from '@/models/Flavor';
import type { Locale } from '@/types';

interface MakeYourOwnLoadedTeaCategoryExplorerProps {
  flavors: IFlavor[];
  locale: Locale;
}

export function MakeYourOwnLoadedTeaCategoryExplorer({
  flavors,
  locale,
}: MakeYourOwnLoadedTeaCategoryExplorerProps) {
  return (
    <FlavorCollectionsExplorer
      flavors={flavors}
      locale={locale}
      kitHref={MAKE_YOUR_OWN_LOADED_TEA_MENU.orderHref}
      primaryCtaLabel={
        locale === 'es' ? 'Ordena tu loaded tea' : 'Order your loaded tea'
      }
      title={MAKE_YOUR_OWN_LOADED_TEA_MENU.headline}
      subtitle={MAKE_YOUR_OWN_LOADED_TEA_MENU.description}
    />
  );
}
