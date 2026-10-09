import Image from 'next/image';

/** Mongo-backed and legacy disk upload paths — use a plain img (Next/Image optimizer breaks on /api/uploads). */
export function isDirectAdminUploadUrl(src: string): boolean {
  const trimmed = src.trim();
  return trimmed.startsWith('/api/uploads/') || trimmed.startsWith('/uploads/');
}

type AdminStoredImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
};

export function AdminStoredImage({
  src,
  alt,
  className = '',
  fill,
  sizes,
  width,
  height,
}: AdminStoredImageProps) {
  if (isDirectAdminUploadUrl(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element -- served from dynamic upload API
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${className}`}
          sizes={sizes}
          decoding="async"
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element -- served from dynamic upload API
      <img src={src} alt={alt} className={className} width={width} height={height} decoding="async" />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      width={width}
      height={height}
      unoptimized
    />
  );
}
