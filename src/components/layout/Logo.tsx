'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { BRAND } from '@/lib/constants';
import { cn } from '@/lib/utils';

const LOGO_PRIMARY_SRC = '/brand/fusion-fuel-boost-logo.png';
const LOGO_FALLBACK_SRC = '/brand/final-logo.png';

/** Wide horizontal logo box for the header row. */
export const HEADER_LOGO_BOX_CLASS =
  'relative h-11 w-[200px] shrink-0 sm:h-12 sm:w-[240px] md:h-[3.25rem] md:w-[280px] lg:h-14 lg:w-[320px]';

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
  const [src, setSrc] = useState(LOGO_PRIMARY_SRC);
  const isHeader = variant === 'header';

  const image = (
    <Image
      src={src}
      alt={BRAND.name}
      fill
      className="object-contain object-left"
      priority={priority}
      sizes={isHeader ? '(max-width: 640px) 200px, 320px' : '320px'}
      onError={() => {
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
