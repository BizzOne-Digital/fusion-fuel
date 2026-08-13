'use client';

import { useState } from 'react';
import type { IFlavor } from '@/models/Flavor';
import type { Locale } from '@/types';
import { FlavorSelector } from '@/components/products/FlavorSelector';

interface FlavorDiscoverySectionProps {
  flavors: IFlavor[];
  locale: Locale;
}

export function FlavorDiscoverySection({ flavors, locale }: FlavorDiscoverySectionProps) {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <FlavorSelector
      flavors={flavors}
      locale={locale}
      limit={6}
      selected={selected}
      onChange={setSelected}
    />
  );
}
