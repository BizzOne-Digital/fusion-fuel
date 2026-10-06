'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import type { Locale } from '@/types';

export function AddToCartButton({ productId, locale }: { productId: string; locale: Locale }) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      loading={loading}
      onClick={async () => {
        setLoading(true);
        await addItem({ productId, quantity: 1 });
        setLoading(false);
      }}
    >
      {locale === 'es' ? 'Agregar al carrito' : 'Add to cart'}
    </Button>
  );
}
