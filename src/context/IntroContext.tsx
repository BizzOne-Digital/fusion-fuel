'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

const INTRO_KEY = 'ffb_intro_seen';

export type IntroPhase = 'pending' | 'intro' | 'done';

interface IntroContextValue {
  phase: IntroPhase;
  completeIntro: () => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

function shouldPlayIntro() {
  if (typeof window === 'undefined') return false;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seen = sessionStorage.getItem(INTRO_KEY) === '1';
  return !prefersReduced && !seen;
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>('pending');

  useEffect(() => {
    if (shouldPlayIntro()) {
      document.documentElement.classList.add('intro-active');
      setPhase('intro');
      return;
    }

    document.documentElement.classList.remove('intro-active');
    setPhase('done');
  }, []);

  const completeIntro = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, '1');
    document.documentElement.classList.remove('intro-active');
    setPhase('done');
  }, []);

  return (
    <IntroContext.Provider value={{ phase, completeIntro }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error('useIntro must be used within IntroProvider');
  }
  return context;
}

export { INTRO_KEY };
