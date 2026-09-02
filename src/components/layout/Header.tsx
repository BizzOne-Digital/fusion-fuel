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

function HeaderActions({
  itemCount,
  onOpenCart,
  showLanguage = true,
  showAccount = true,
}: {
  itemCount: number;
  onOpenCart: () => void;
  showLanguage?: boolean;
  showAccount?: boolean;
}) {
  const t = useTranslations('nav');

  return (
    <>
      {showLanguage ? <LanguageToggle className="hidden md:flex" /> : null}

      <Link
        href="/menu"
        className="rounded-full p-2 text-carbon transition hover:bg-lime/20"
        aria-label={t('search')}
      >
        <Search className="h-[1.15rem] w-[1.15rem]" />
      </Link>

      <button
        type="button"
        onClick={onOpenCart}
        className="relative rounded-full p-2 text-carbon transition hover:bg-lime/20"
        aria-label={t('cart')}
      >
        <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
        {itemCount > 0 && (
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink px-1 text-[10px] font-bold leading-none text-white">
            {itemCount}
          </span>
        )}
      </button>

      {showAccount ? (
        <Link
          href="/account"
          className="hidden rounded-full p-2 text-carbon transition hover:bg-lime/20 sm:inline-flex"
          aria-label={t('account')}
        >
          <User className="h-[1.15rem] w-[1.15rem]" />
        </Link>
      ) : null}
    </>
  );
}

export function Header() {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-grey/15 bg-white/95 text-carbon shadow-sm backdrop-blur-sm">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          {/* Desktop: nav left · logo center · actions right */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6 lg:py-3 xl:gap-8 xl:py-4">
            <nav className="flex items-center justify-end gap-5 xl:gap-8" aria-label="Main">
              {navItems.map((item) => (
                <Link
                  key={`${item.href}-${item.key}`}
                  href={item.href}
                  className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.16em] text-carbon transition hover:text-pink xl:text-sm"
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>

            <div className="flex justify-center px-2">
              <Logo priority variant="header" />
            </div>

            <div className="flex items-center justify-start gap-1 sm:gap-2">
              <HeaderActions itemCount={itemCount} onOpenCart={openDrawer} />
            </div>
          </div>

          {/* Mobile: menu · centered logo · actions */}
          <div className="flex h-[4.25rem] items-center justify-between gap-3 sm:h-[4.75rem] lg:hidden">
            <button
              type="button"
              className="rounded-full p-2 text-carbon transition hover:bg-lime/20"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex min-w-0 flex-1 justify-center">
              <Logo
                priority
                variant="header"
                className="relative h-12 w-[220px] sm:h-14 sm:w-[280px] md:h-16 md:w-[340px]"
              />
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <HeaderActions
                itemCount={itemCount}
                onOpenCart={openDrawer}
                showLanguage={false}
                showAccount={false}
              />
            </div>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
