'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { BRAND } from '@/lib/constants';

const LOGO_WIDTH = 1024;
const LOGO_HEIGHT = 682;

interface LogoProps {
  className?: string;
  priority?: boolean;
  asLink?: boolean;
}

export function Logo({
  className = 'h-8 w-auto max-w-[140px] object-contain object-left',
  priority,
  asLink = true,
}: LogoProps) {
  const [imgError, setImgError] = useState(false);

  const content = imgError ? (
    <span className="font-display text-lg leading-none text-carbon">{BRAND.shortName}</span>
  ) : (
    <>
      <Image
        src="/brand/fusion-fuel-boost-logo.png"
        alt={BRAND.name}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className={className}
        priority={priority}
        onError={() => setImgError(true)}
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
    <Link href="/" className="inline-flex shrink-0 items-center" aria-label={`${BRAND.name} home`}>
      {content}
    </Link>
  );
}
