'use client';

import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { AnnouncementBarComponent } from '@/components/layout/AnnouncementBar';
import { CartDrawer } from '@/components/cart/CartDrawer';
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
  const introActive = phase === 'intro';

  return (
    <>
      <div
        className={cn(
          'site-shell flex w-full min-w-0 max-w-full flex-col',
          introActive && 'invisible pointer-events-none'
        )}
        aria-hidden={introActive}
      >
        <AnnouncementBarComponent announcement={announcement} locale={locale} />
        <Header />
        <main
          id="main-content"
          className="site-content page-shell min-w-0 w-full max-w-full flex-1"
        >
          {children}
        </main>
        {footer}
      </div>
      <CartDrawer />
      {introActive && <CinematicIntro />}
    </>
  );
}
