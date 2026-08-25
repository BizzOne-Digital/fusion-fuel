'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { BRAND } from '@/lib/constants';
import { cn } from '@/lib/utils';

const LOGO_HEADER_SRC = '/brand/fusion-fuel-boost-logo-header.png';
const LOGO_LIGHT_SRC = '/brand/fusion-fuel-boost-logo-trimmed-transparent.png';
const LOGO_FALLBACK_SRC = '/brand/fusion-fuel-boost-logo-trimmed.png';

/** Fixed box — sized to header row height so nav and icons stay visible. */
export const HEADER_LOGO_BOX_CLASS =
  'relative h-10 w-[148px] shrink-0 sm:h-11 sm:w-[168px] md:h-12 md:w-[188px] lg:h-[3.25rem] lg:w-[220px]';

interface LogoProps {
  className?: string;
  priority?: boolean;
  asLink?: boolean;
  /** `header` = full logo on dark backgrounds; `light` = transparent logo on white */
  variant?: 'header' | 'light';
}

export function Logo({
  className,
  priority,
  asLink = true,
  variant = 'header',
}: LogoProps) {
  const initialSrc = variant === 'light' ? LOGO_LIGHT_SRC : LOGO_HEADER_SRC;
  const [src, setSrc] = useState(initialSrc);
  const isHeader = variant === 'header';

  const image = (
    <Image
      src={src}
      alt={BRAND.name}
      fill
      className={cn(
        'object-contain object-left',
        !isHeader && src === LOGO_FALLBACK_SRC && 'mix-blend-screen'
      )}
      priority={priority}
      sizes={isHeader ? '(max-width: 640px) 148px, 220px' : '240px'}
      onError={() => {
        if (src === LOGO_HEADER_SRC) setSrc(LOGO_LIGHT_SRC);
        else if (src === LOGO_LIGHT_SRC) setSrc(LOGO_FALLBACK_SRC);
        else if (src !== '/brand/fusion-fuel-boost-logo.png') {
          setSrc('/brand/fusion-fuel-boost-logo.png');
        }
      }}
    />
  );

  const boxClassName = cn(isHeader ? HEADER_LOGO_BOX_CLASS : 'relative h-12 w-[200px] sm:w-[240px]', className);

  const content = (
    <>
      <div className={boxClassName}>{image}</div>
      <span className="sr-only">{BRAND.name}</span>
    </>
  );

  if (!asLink) {
    return (
      <div className="inline-flex shrink-0 items-center" aria-label={BRAND.name}>
        {content}
      </div>
    );
  }

  return (
    <Link href="/" className="inline-flex shrink-0 items-center" aria-label={`${BRAND.name} home`}>
      {content}
    </Link>
  );
}
