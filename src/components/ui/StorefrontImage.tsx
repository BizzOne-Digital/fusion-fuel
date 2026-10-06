import Image, { type ImageProps } from 'next/image';
import { normalizeStorefrontImageUrl, useUnoptimizedStorefrontImage } from '@/lib/storefront-image';

type StorefrontImageProps = Omit<ImageProps, 'src'> & {
  src: string;
};

export function StorefrontImage({ src, alt, ...props }: StorefrontImageProps) {
  const resolved = normalizeStorefrontImageUrl(src);
  return (
    <Image
      {...props}
      src={resolved}
      alt={alt}
      unoptimized={useUnoptimizedStorefrontImage(resolved) || props.unoptimized}
    />
  );
}
