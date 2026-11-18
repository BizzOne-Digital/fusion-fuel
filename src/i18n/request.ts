import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { applyOverrides, getTranslationOverrides } from '@/lib/translation-overrides';

const NAV_EXTRAS = {
  en: {
    shop: 'Shop',
    menu: 'Menu',
    catering: 'Catering',
    ourStory: 'Our Story',
    search: 'Search',
    viewMenu: 'View Menu',
  },
  es: {
    shop: 'Tienda',
    menu: 'Menú',
    catering: 'Catering',
    ourStory: 'Nuestra Historia',
    search: 'Buscar',
    viewMenu: 'Ver Menú',
  },
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const imported = (await import(`@/messages/${locale}.json`)).default as {
    nav?: Record<string, string>;
    [key: string]: unknown;
  };

  const localeKey = locale as keyof typeof NAV_EXTRAS;
  const overrides = await getTranslationOverrides(locale as 'en' | 'es');

  return {
    locale,
    messages: applyOverrides(
      {
        ...imported,
        nav: {
          ...(imported.nav ?? {}),
          ...NAV_EXTRAS[localeKey],
        },
      },
      overrides
    ),
  };
});
