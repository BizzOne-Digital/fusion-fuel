import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getSiteSettings } from '@/lib/data';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBarComponent } from '@/components/layout/AnnouncementBar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';
import { CinematicIntro } from '@/components/motion/CinematicIntro';
import { Toaster } from '@/components/ui/Toast';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd';
import type { Locale } from '@/types';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const settings = await getSiteSettings();

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        <CartProvider>
        <OrganizationJsonLd settings={settings} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[300] focus:rounded focus:bg-lime focus:px-4 focus:py-2">
          Skip to content
        </a>
        <AnnouncementBarComponent announcement={settings.announcement ?? { enabled: false, message: { en: '', es: '' } }} locale={locale as Locale} />
        <SmoothScrollProvider>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer settings={settings} locale={locale as Locale} />
        </SmoothScrollProvider>
        <CartDrawer />
        <CinematicIntro />
        <Toaster position="top-center" richColors closeButton />
        </CartProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
