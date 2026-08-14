'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { BRAND } from '@/lib/constants';
import { cn } from '@/lib/utils';

const LOGO_SRC = '/brand/fusion-fuel-boost-logo-trimmed-transparent.png';
const LOGO_FALLBACK_SRC = '/brand/fusion-fuel-boost-logo-trimmed.png';
const LOGO_WIDTH = 364;
const LOGO_HEIGHT = 182;

interface LogoProps {
  className?: string;
  priority?: boolean;
  asLink?: boolean;
  /** Screen-blends black matte when a non-transparent PNG must be used */
  knockout?: boolean;
}

export function Logo({
  className = 'h-10 w-auto max-w-full object-contain object-left',
  priority,
  asLink = true,
  knockout = false,
}: LogoProps) {
  const [src, setSrc] = useState(LOGO_SRC);
  const useKnockout = knockout || src !== LOGO_SRC;

  const imageClassName = cn(className, useKnockout && 'mix-blend-screen');

  const content = (
    <>
      <Image
        src={src}
        alt={BRAND.name}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className={imageClassName}
        priority={priority}
        onError={() => {
          if (src === LOGO_SRC) setSrc(LOGO_FALLBACK_SRC);
          else if (src !== '/brand/fusion-fuel-boost-logo.png') {
            setSrc('/brand/fusion-fuel-boost-logo.png');
          }
        }}
      />
      <span className="sr-only">{BRAND.name}</span>
    </>
  );

  if (!asLink) {
    return (
      <div className="inline-flex items-center" aria-label={BRAND.name}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href="/"
      className="inline-flex min-w-0 max-w-[min(100%,58vw)] shrink items-center sm:max-w-none"
      aria-label={`${BRAND.name} home`}
    >
      {content}
    </Link>
  );
}
