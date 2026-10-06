import { getTranslations } from 'next-intl/server';
import { Logo } from './Logo';
import { AppLink } from '@/components/ui/AppLink';
import { resolveFooterColumns } from '@/lib/footer-links';
import { getLocalized } from '@/lib/utils';
import type { ISiteSettings } from '@/models/SiteSettings';
import type { Locale } from '@/types';

interface FooterProps {
  settings: Partial<ISiteSettings>;
  locale: Locale;
}

export async function Footer({ settings, locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const columns = resolveFooterColumns(settings.footer?.columns);

  return (
    <footer className="site-content section-lime mt-auto w-full overflow-x-hidden border-t border-carbon/10">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo className="relative h-16 w-[260px] md:h-20 md:w-[320px]" variant="light" />
            <p className="max-w-xs text-sm text-carbon/80">
              {getLocalized(settings.footer?.tagline ?? settings.tagline, locale)}
            </p>
            <div className="space-y-1 break-all text-sm text-carbon/90">
              <p>{settings.contactEmail}</p>
              <p>{settings.contactPhone}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {settings.social?.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-pink hover:underline"
                >
                  {s.label ?? (s.platform === 'instagram' ? 'Instagram' : s.platform === 'facebook' ? 'Facebook' : s.platform)}
                </a>
              ))}
            </div>
          </div>
          {columns.map((col, i) => (
            <div key={i}>
              <h3 className="font-display mb-4 text-lg text-pink">{getLocalized(col.title, locale)}</h3>
              <ul className="space-y-2">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <AppLink href={link.href} className="text-sm text-carbon/80 transition hover:text-carbon">
                      {getLocalized(link.label, locale)}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-carbon/15 pt-6 text-sm text-carbon/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {settings.businessName ?? 'Fusion Fuel & Boost Co.'}. {t('rights')}</p>
          {(settings.legalLinks ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {(settings.legalLinks ?? []).map((link, i) => (
                <AppLink key={i} href={link.href} className="hover:text-carbon">
                  {getLocalized(link.label, locale)}
                </AppLink>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
