import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getSiteSettings } from '@/lib/data';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/Toast';
import { CartProvider } from '@/context/CartContext';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';
import { resolveCatering, resolveContact } from '@/lib/site-content';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd';
import { WebSiteJsonLd } from '@/components/seo/WebSiteJsonLd';
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
  const localeKey = locale as Locale;
  const siteValue = {
    contact: resolveContact(settings),
    catering: { en: resolveCatering(settings.catering, 'en'), es: resolveCatering(settings.catering, 'es') },
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <SiteSettingsProvider value={siteValue}>
      <AuthProvider>
        <CartProvider>
          <OrganizationJsonLd settings={settings} />
          <WebSiteJsonLd />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[300] focus:rounded focus:bg-lime focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          <SiteChrome
            locale={localeKey}
            announcement={settings.announcement ?? { enabled: false, message: { en: '', es: '' } }}
            footer={<Footer settings={settings} locale={localeKey} />}
          >
            {children}
          </SiteChrome>
          <Toaster position="top-center" richColors closeButton />
        </CartProvider>
      </AuthProvider>
      </SiteSettingsProvider>
    </NextIntlClientProvider>
  );
}
