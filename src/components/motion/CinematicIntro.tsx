'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useIntro } from '@/context/IntroContext';
import { SITE_IMAGES } from '@/lib/site-images';

const INTRO_DURATION_MS = 2800;
const INTRO_DURATION_MOBILE_MS = 1400;

export function CinematicIntro() {
  const { completeIntro } = useIntro();
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReduced);

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const duration = isMobile ? INTRO_DURATION_MOBILE_MS : INTRO_DURATION_MS;
    const timer = window.setTimeout(() => setVisible(false), duration);

    return () => window.clearTimeout(timer);
  }, []);

  const finish = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence onExitComplete={completeIntro}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-ink px-3 pb-20 pt-10 text-white sm:px-4 sm:pb-24 sm:pt-12"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.55, ease: 'easeInOut' }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.75, ease: 'easeOut' }}
            className="relative h-[min(78svh,720px)] w-full max-w-[min(92vw,640px)] sm:max-w-[min(88vw,720px)]"
          >
            <Image
              src={SITE_IMAGES.introPoster}
              alt="Fusion Fuel & Boost Co. — Loaded Teas, Açaí Bowls, Coffee, Catering, Events & Delivery"
              fill
              priority
              sizes="(max-width: 640px) 92vw, 720px"
              className="object-contain object-center"
            />
          </motion.div>
          <Button
            variant="ghost"
            className="absolute bottom-6 text-white hover:bg-white/10 sm:bottom-8"
            onClick={finish}
          >
            Skip intro
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
