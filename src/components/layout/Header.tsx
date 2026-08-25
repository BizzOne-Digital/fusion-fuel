'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Logo } from './Logo';
import { LanguageToggle } from './LanguageToggle';
import { MobileNav } from './MobileNav';
import { useCart } from '@/context/CartContext';

const navItems = [
  { href: '/menu', key: 'menu' },
  { href: '/booking', key: 'catering' },
  { href: '/about', key: 'ourStory' },
  { href: '/contact', key: 'contact' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black text-white">
        <div className="mx-auto grid h-14 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-3 sm:h-16 sm:gap-4 sm:px-4 lg:px-8">
          <Logo priority />

          <nav className="hidden items-center justify-center gap-5 lg:flex xl:gap-8" aria-label="Main">
            {navItems.map((item) => (
              <Link
                key={`${item.href}-${item.key}`}
                href={item.href}
                className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:text-[#F5FF00] xl:text-sm"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex min-w-0 items-center justify-end gap-1 sm:gap-2">
            <LanguageToggle className="hidden md:flex" />

            <Link
              href="/menu"
              className="rounded-full p-2 transition hover:bg-white/10"
              aria-label={t('search')}
            >
              <Search className="h-[1.1rem] w-[1.1rem]" />
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              className="relative rounded-full p-2 transition hover:bg-white/10"
              aria-label={t('cart')}
            >
              <ShoppingBag className="h-[1.1rem] w-[1.1rem]" />
              {itemCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F5FF00] px-1 text-[10px] font-bold leading-none text-ink">
                  {itemCount}
                </span>
              )}
            </button>

            <Link
              href="/account"
              className="hidden rounded-full p-2 transition hover:bg-white/10 sm:inline-flex"
              aria-label={t('account')}
            >
              <User className="h-[1.1rem] w-[1.1rem]" />
            </Link>

            <button
              type="button"
              className="rounded-full p-2 transition hover:bg-white/10 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
