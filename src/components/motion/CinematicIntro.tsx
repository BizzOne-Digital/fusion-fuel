'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/layout/Logo';
import { BrandTagline } from '@/components/brand/BrandTagline';
import { Button } from '@/components/ui/Button';
import { useIntro } from '@/context/IntroContext';

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
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-ink px-4 text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.55, ease: 'easeInOut' }}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.75, ease: 'easeOut' }}
            className="w-full max-w-full text-center"
          >
            <div className="mb-6 flex justify-center sm:mb-8 md:mb-10">
              <Logo
                className="h-28 w-auto max-w-[min(92vw,480px)] sm:h-36 md:h-44 lg:h-52"
                priority
                asLink={false}
              />
            </div>
            <BrandTagline
              fuelLine="Fuel Your Day."
              boostLine="Boost Your Life."
              size="intro"
              animated={false}
              boostTone="light"
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
