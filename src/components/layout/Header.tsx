'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, ShoppingBag, User } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { useCart } from '@/context/CartContext';

const navItems = [
  { href: '/products', key: 'products' },
  { href: '/services', key: 'services' },
  { href: '/pricing', key: 'pricing' },
  { href: '/booking', key: 'booking' },
  { href: '/contact', key: 'contact' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-grey/15 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 lg:h-16 lg:px-6">
          <Logo priority className="h-7 w-auto max-w-[120px] object-contain object-left sm:h-8 sm:max-w-[136px]" />
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Main">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-carbon hover:text-pink">
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Link href="/account" className="rounded-full p-1.5 hover:bg-cream" aria-label={t('account')}>
              <User className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={openDrawer}
              className="relative rounded-full p-1.5 hover:bg-cream"
              aria-label={t('cart')}
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink px-1 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="rounded-full p-1.5 hover:bg-cream lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
