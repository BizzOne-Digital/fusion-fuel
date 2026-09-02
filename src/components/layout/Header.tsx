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
  className,
}: {
  itemCount: number;
  onOpenCart: () => void;
  showLanguage?: boolean;
  showAccount?: boolean;
  className?: string;
}) {
  const t = useTranslations('nav');

  return (
    <div className={className}>
      {showLanguage ? <LanguageToggle className="hidden md:flex" /> : null}

      <Link
        href="/menu"
        className="rounded-full p-2 text-carbon transition hover:bg-lime/20"
        aria-label={t('search')}
      >
        <Search className="h-[1.2rem] w-[1.2rem]" strokeWidth={2} />
      </Link>

      <button
        type="button"
        onClick={onOpenCart}
        className="relative rounded-full p-2 text-carbon transition hover:bg-lime/20"
        aria-label={t('cart')}
      >
        <ShoppingBag className="h-[1.2rem] w-[1.2rem]" strokeWidth={2} />
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
          <User className="h-[1.2rem] w-[1.2rem]" strokeWidth={2} />
        </Link>
      ) : null}
    </div>
  );
}

export function Header() {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();

  return (
    <>
      <header className="sticky top-0 z-[60] w-full border-b border-grey/15 bg-white text-carbon shadow-sm">
        <div className="relative mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8">
          {/* Desktop */}
          <div className="relative hidden h-[5.25rem] items-center xl:h-[6.25rem] lg:flex">
            <nav
              className="relative z-30 flex flex-1 items-center justify-start gap-4 pr-4 xl:gap-8"
              aria-label="Main"
            >
              {navItems.map((item) => (
                <Link
                  key={`${item.href}-${item.key}`}
                  href={item.href}
                  className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-carbon transition hover:text-pink xl:text-xs 2xl:text-sm"
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>

            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <Logo priority variant="header" className="pointer-events-auto" />
            </div>

            <HeaderActions
              itemCount={itemCount}
              onOpenCart={openDrawer}
              className="relative z-30 flex flex-1 items-center justify-end gap-1 pl-4 sm:gap-2"
            />
          </div>

          {/* Mobile */}
          <div className="flex h-[4.5rem] items-center justify-between gap-2 sm:h-[5rem] lg:hidden">
            <button
              type="button"
              className="relative z-30 shrink-0 rounded-full p-2 text-carbon transition hover:bg-lime/20"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-14">
              <Logo
                priority
                variant="header"
                className="pointer-events-auto relative h-14 w-[min(72vw,300px)] sm:h-16 sm:w-[min(68vw,360px)]"
              />
            </div>

            <HeaderActions
              itemCount={itemCount}
              onOpenCart={openDrawer}
              showLanguage={false}
              showAccount={false}
              className="relative z-30 flex shrink-0 items-center gap-0.5"
            />
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
