'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface LiquidMaskProps {
  children: ReactNode;
  className?: string;
}

export function LiquidMask({ children, className }: LiquidMaskProps) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      whileInView={{ clipPath: 'circle(100% at 50% 50%)' }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
