'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  images: { url: string; alt: string }[];
  name: string;
}

export function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
        <Image
          src={active.url}
          alt={active.alt || name}
          fill
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
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
              <Image src={image.url} alt={image.alt || name} fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
