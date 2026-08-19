'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Logo } from './Logo';
import { LanguageToggle } from './LanguageToggle';
import { MobileNav } from './MobileNav';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/products', key: 'shop' },
  { href: '/products', key: 'menu' },
  { href: '/booking', key: 'catering' },
  { href: '/about', key: 'ourStory' },
  { href: '/contact', key: 'contact' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();
  const isHome = pathname === '/';

  return (
    <>
      <header className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden border-b border-white/10 bg-black text-white backdrop-blur-md">
        <div
          className={cn(
            'mx-auto max-w-7xl items-center px-3 sm:px-4 lg:px-8',
            isHome
              ? 'grid h-16 grid-cols-[minmax(0,1fr)_auto] gap-3 lg:h-[4.5rem] lg:grid-cols-[minmax(220px,1fr)_auto_minmax(220px,1fr)]'
              : 'flex h-16 justify-between gap-2 sm:gap-3 lg:h-[4.5rem] lg:px-6'
          )}
        >
          <Logo
            priority
            className={cn(
              'shrink-0 object-contain object-left',
              isHome
                ? 'h-[3.4rem] w-auto max-w-[min(58vw,230px)] sm:h-[3.75rem] sm:max-w-[270px] lg:h-[4.15rem] lg:max-w-[320px]'
                : 'h-10 w-auto max-w-[140px] sm:h-11 sm:max-w-[160px] lg:h-12 lg:max-w-[190px]'
            )}
          />

          <nav
            className={cn(
              'items-center justify-center gap-7 xl:gap-9',
              isHome ? 'hidden lg:flex' : 'hidden lg:flex lg:flex-1 lg:justify-center'
            )}
            aria-label="Main"
          >
            {navItems.map((item) => (
              <Link
                key={`${item.href}-${item.key}`}
                href={item.href}
                className="text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:text-[#F5FF00]"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3 lg:gap-4">
            <LanguageToggle className="hidden lg:flex" />

            <Link
              href="/products"
              className="rounded-full p-1.5 transition hover:bg-white/10"
              aria-label={t('search')}
            >
              <Search className="h-[1.15rem] w-[1.15rem]" />
            </Link>

            <Link
              href="/account"
              className="rounded-full p-1.5 transition hover:bg-white/10"
              aria-label={t('account')}
            >
              <User className="h-[1.15rem] w-[1.15rem]" />
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              className="relative rounded-full p-1.5 transition hover:bg-white/10"
              aria-label={t('cart')}
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
              <span className="absolute -right-1 -top-1 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-[#F5FF00] px-1 text-[10px] font-bold text-ink">
                {itemCount}
              </span>
            </button>

            <button
              type="button"
              className="rounded-full p-1.5 transition hover:bg-white/10 lg:hidden"
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
