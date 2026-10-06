'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { BRAND } from '@/lib/constants';
import { cn } from '@/lib/utils';

const LOGO_HEADER_SRC = '/brand/fusion-fuel-boost-logo.png';
const LOGO_HEADER_ALT_SRC = '/brand/fusion-fuel-boost-logo-trimmed-transparent.png';
const LOGO_PRIMARY_SRC = '/brand/fusion-fuel-boost-logo.png';
const LOGO_FALLBACK_SRC = '/brand/final-logo.png';

/** Wide horizontal logo — height-driven so the mark reads large in the header. */
export const HEADER_LOGO_BOX_CLASS =
  'relative h-16 w-[min(58vw,420px)] shrink-0 lg:h-[4.75rem] lg:w-[min(50vw,560px)] xl:h-[5.75rem] xl:w-[min(44vw,680px)] 2xl:h-[6.25rem] 2xl:w-[min(40vw,760px)]';

interface LogoProps {
  className?: string;
  priority?: boolean;
  asLink?: boolean;
  /** `header` and `light` both use the full-color logo on white backgrounds. */
  variant?: 'header' | 'light';
}

export function Logo({
  className,
  priority,
  asLink = true,
  variant = 'header',
}: LogoProps) {
  const isHeader = variant === 'header';
  const [src, setSrc] = useState(isHeader ? LOGO_HEADER_SRC : LOGO_PRIMARY_SRC);

  const image = (
    <Image
      src={src}
      alt={BRAND.name}
      fill
      className={cn('object-contain', isHeader ? 'object-center' : 'object-left')}
      priority={priority}
      sizes={isHeader ? '(max-width: 1024px) 360px, 760px' : '320px'}
      onError={() => {
        if (src === LOGO_HEADER_SRC) {
          setSrc(LOGO_HEADER_ALT_SRC);
          return;
        }
        if (src === LOGO_HEADER_ALT_SRC) {
          setSrc(LOGO_FALLBACK_SRC);
          return;
        }
        if (src !== LOGO_FALLBACK_SRC) setSrc(LOGO_FALLBACK_SRC);
      }}
    />
  );

  const boxClassName = cn(isHeader ? HEADER_LOGO_BOX_CLASS : 'relative h-14 w-[240px] sm:w-[300px]', className);

  const content = (
    <>
      <div className={boxClassName}>{image}</div>
      <span className="sr-only">{BRAND.name}</span>
    </>
  );

  if (!asLink) {
    return (
      <div className="inline-flex shrink-0 items-center justify-center" aria-label={BRAND.name}>
        {content}
      </div>
    );
  }

  return (
    <Link href="/" className="inline-flex shrink-0 items-center justify-center" aria-label={`${BRAND.name} home`}>
      {content}
    </Link>
  );
}
