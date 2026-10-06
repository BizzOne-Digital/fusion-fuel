'use client';

import { useState } from 'react';
import { StorefrontImage } from '@/components/ui/StorefrontImage';
import { normalizeStorefrontImageUrl } from '@/lib/storefront-image';

interface ProductImageGalleryProps {
  images: { url: string; alt: string }[];
  name: string;
}

export function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const resolved = images
    .map((image) => ({
      url: normalizeStorefrontImageUrl(image.url),
      alt: image.alt || name,
    }))
    .filter((image) => image.url);
  const active = resolved[activeIndex] ?? resolved[0];

  if (!active) return null;

  if (resolved.length === 2) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {resolved.map((image) => (
          <div key={image.url} className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
            <StorefrontImage
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
        <StorefrontImage src={active.url} alt={active.alt} fill className="object-cover" priority />
      </div>
      {resolved.length > 2 && (
        <div className="grid grid-cols-4 gap-2">
          {resolved.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-xl bg-cream transition ring-offset-2 ${
                index === activeIndex ? 'ring-2 ring-pink' : 'hover:ring-2 hover:ring-pink/40'
              }`}
              aria-label={image.alt || `${name} photo ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <StorefrontImage src={image.url} alt={image.alt} fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
