'use client';

import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { AnnouncementBarComponent } from '@/components/layout/AnnouncementBar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import type { AnnouncementBar } from '@/types';
import type { Locale } from '@/types';

interface SiteChromeProps {
  children: ReactNode;
  footer: ReactNode;
  locale: Locale;
  announcement: AnnouncementBar;
}

export function SiteChrome({ children, footer, locale, announcement }: SiteChromeProps) {
  return (
    <>
      <div className="site-shell flex w-full min-w-0 max-w-full flex-col">
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
    </>
  );
}
