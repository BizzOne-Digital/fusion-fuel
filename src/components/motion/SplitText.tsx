'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SplitTextProps {
  text: string;
  className?: string;
}

export function SplitText({ text, className }: SplitTextProps) {
  const words = text.split(' ');

  return (
    <span
      className={cn('block max-w-full break-words', className)}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block max-w-full break-words align-top mr-[0.25em] last:mr-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
