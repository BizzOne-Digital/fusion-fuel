'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/Button';

const INTRO_KEY = 'ffb_intro_seen';

export function CinematicIntro() {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    setReducedMotion(prefersReduced);

    if (prefersReduced || sessionStorage.getItem(INTRO_KEY) === '1') {
      return;
    }

    setVisible(true);
    if (isMobile) {
      const timer = setTimeout(() => {
        sessionStorage.setItem(INTRO_KEY, '1');
        setVisible(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const skip = () => {
    sessionStorage.setItem(INTRO_KEY, '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.8, ease: 'easeOut' }}
            className="text-center"
          >
            <div className="mb-6 flex justify-center">
              <Logo
                className="h-24 w-auto max-w-[min(92vw,420px)] md:h-32"
                priority
                asLink={false}
              />
            </div>
            <p className="font-display text-3xl text-lime md:text-5xl">FUEL YOUR DAY.</p>
            <p className="font-display mt-2 text-3xl text-pink md:text-5xl">BOOST YOUR LIFE.</p>
          </motion.div>
          <Button
            variant="ghost"
            className="absolute bottom-8 text-white hover:bg-white/10"
            onClick={skip}
          >
            Skip intro
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
