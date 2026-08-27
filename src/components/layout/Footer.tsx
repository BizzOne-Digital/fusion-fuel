import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Logo } from './Logo';
import { getLocalized } from '@/lib/utils';
import type { ISiteSettings } from '@/models/SiteSettings';
import type { Locale } from '@/types';

interface FooterProps {
  settings: Partial<ISiteSettings>;
  locale: Locale;
}

export async function Footer({ settings, locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const columns = settings.footer?.columns?.length
    ? settings.footer.columns
    : [
        {
          title: { en: 'Explore', es: 'Explorar' },
          links: [
            { label: { en: 'Menu', es: 'Menú' }, href: '/menu' },
            { label: { en: 'Services', es: 'Servicios' }, href: '/services' },
            { label: { en: 'Book Catering', es: 'Reservar catering' }, href: '/booking' },
          ],
        },
        {
          title: { en: 'Company', es: 'Empresa' },
          links: [
            { label: { en: 'About', es: 'Nosotros' }, href: '/about' },
            { label: { en: 'Contact', es: 'Contacto' }, href: '/contact' },
            { label: { en: 'FAQs', es: 'Preguntas' }, href: '/faqs' },
          ],
        },
      ];

  return (
    <footer className="site-content section-dark mt-auto w-full overflow-x-hidden border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo className="relative h-16 w-[260px] md:h-20 md:w-[320px]" />
            <p className="max-w-xs text-sm text-white/70">
              {getLocalized(settings.footer?.tagline ?? settings.tagline, locale)}
            </p>
            <div className="space-y-1 break-all text-sm text-white/80">
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
                  className="text-sm text-lime hover:underline"
                >
                  {s.label ?? (s.platform === 'instagram' ? 'Instagram' : s.platform === 'facebook' ? 'Facebook' : s.platform)}
                </a>
              ))}
            </div>
          </div>
          {columns.map((col, i) => (
            <div key={i}>
              <h3 className="font-display mb-4 text-lg text-lime">{getLocalized(col.title, locale)}</h3>
              <ul className="space-y-2">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.href} className="text-sm text-white/75 hover:text-white">
                      {getLocalized(link.label, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="font-display mb-4 text-lg text-lime">{tNav('menu')}</h3>
            <ul className="space-y-2 text-sm text-white/75">
              <li><Link href="/menu" className="hover:text-white">{tNav('menu')}</Link></li>
              <li><Link href="/booking" className="hover:text-white">{tNav('booking')}</Link></li>
              <li><Link href="/account" className="hover:text-white">{tNav('account')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {settings.businessName ?? 'Fusion Fuel & Boost Co.'}. {t('rights')}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {(settings.legalLinks ?? []).map((link, i) => (
              <Link key={i} href={link.href} className="hover:text-white">
                {getLocalized(link.label, locale)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
