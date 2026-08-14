'use client';

import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { AnnouncementBarComponent } from '@/components/layout/AnnouncementBar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';
import { CinematicIntro } from '@/components/motion/CinematicIntro';
import { useIntro } from '@/context/IntroContext';
import type { AnnouncementBar } from '@/types';
import type { Locale } from '@/types';
import { cn } from '@/lib/utils';

interface SiteChromeProps {
  children: ReactNode;
  footer: ReactNode;
  locale: Locale;
  announcement: AnnouncementBar;
}

export function SiteChrome({ children, footer, locale, announcement }: SiteChromeProps) {
  const { phase } = useIntro();
  const siteHidden = phase !== 'done';

  return (
    <>
      <div
        className={cn(
          'site-shell flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col',
          siteHidden && 'invisible pointer-events-none'
        )}
        aria-hidden={siteHidden}
      >
        <AnnouncementBarComponent announcement={announcement} locale={locale} />
        <SmoothScrollProvider>
          <Header />
          <main
            id="main-content"
            className="site-content page-shell min-w-0 w-full max-w-full flex-1 overflow-x-clip"
          >
            {children}
          </main>
          {footer}
        </SmoothScrollProvider>
        <CartDrawer />
      </div>
      {phase === 'pending' && (
        <div className="fixed inset-0 z-[200] bg-ink" aria-hidden="true" />
      )}
      {phase === 'intro' && <CinematicIntro />}
    </>
  );
}
