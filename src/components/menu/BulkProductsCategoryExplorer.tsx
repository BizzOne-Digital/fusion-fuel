'use client';

import Image from 'next/image';
import { BULK_PRODUCTS_MENU } from '@/lib/bulk-products-menu';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/types';

interface BulkProductsCategoryExplorerProps {
  locale: Locale;
}

export function BulkProductsCategoryExplorer({ locale }: BulkProductsCategoryExplorerProps) {
  return (
    <div className="mt-6 max-w-3xl">
      <p className="text-grey">{BULK_PRODUCTS_MENU.description}</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-grey/15 bg-white shadow-sm">
        <div className="relative aspect-[16/10] bg-cream">
          <Image
            src={BULK_PRODUCTS_MENU.image.url}
            alt={BULK_PRODUCTS_MENU.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 730px"
          />
        </div>

        <div className="space-y-4 p-6">
          <p className="text-sm text-grey">
            {locale === 'es'
              ? 'Compra en línea en la tienda oficial de Herbalife.'
              : 'Shop online on the official Herbalife storefront.'}
          </p>
          <a href={BULK_PRODUCTS_MENU.shopUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg">
              {locale === 'es' ? 'Comprar productos al por mayor' : 'Shop bulk products'}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
