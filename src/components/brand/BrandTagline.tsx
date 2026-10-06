'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BRAND_SLOGAN_COLORS } from '@/lib/brand-slogan';

interface BrandTaglineProps {
  fuelLine: string;
  boostLine?: string;
  className?: string;
  size?: 'hero' | 'intro' | 'compact';
  animated?: boolean;
  boostTone?: 'brand' | 'light';
}

const sizeClasses = {
  hero: {
    fuel: 'text-[clamp(1.625rem,8.2vw,4.5rem)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
    boost: 'text-[clamp(1.625rem,8.2vw,4.5rem)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
    gap: 'gap-0.5 sm:gap-2',
  },
  intro: {
    fuel: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    boost: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    gap: 'gap-1 sm:gap-2',
  },
  compact: {
    fuel: 'text-2xl md:text-3xl',
    boost: 'text-2xl md:text-3xl',
    gap: 'gap-0.5',
  },
} as const;

export function BrandTagline({
  fuelLine,
  boostLine,
  className,
  size = 'hero',
  animated = false,
  boostTone = 'brand',
}: BrandTaglineProps) {
  const sizes = sizeClasses[size];
  const lines = [
    { key: 'fuel', text: fuelLine, color: BRAND_SLOGAN_COLORS.fuel, className: sizes.fuel },
    ...(boostLine
      ? [
          {
            key: 'boost',
            text: boostLine,
            color: boostTone === 'light' ? '#FFFFFF' : BRAND_SLOGAN_COLORS.boost,
            className: sizes.boost,
          },
        ]
      : []),
  ] as const;

  return (
    <div
      className={cn('max-w-full min-w-0 font-display leading-none tracking-wide', sizes.gap, className)}
      aria-label={boostLine ? `${fuelLine} ${boostLine}` : fuelLine}
    >
      {lines.map((line, index) => {
        const content = (
          <span
            className={cn('block max-w-full break-words drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]', line.className)}
            style={{ color: line.color }}
          >
            {line.text}
          </span>
        );

        if (!animated) {
          return <span key={line.key}>{content}</span>;
        }

        return (
          <motion.span
            key={line.key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12, duration: 0.5, ease: 'easeOut' }}
            className="block"
          >
            {content}
          </motion.span>
        );
      })}
    </div>
  );
}
