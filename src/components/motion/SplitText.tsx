'use client';

import { motion } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
}

export function SplitText({ text, className }: SplitTextProps) {
  const words = text.split(' ');

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block mr-[0.25em]"
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
