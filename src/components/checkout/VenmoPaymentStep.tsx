'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { VENMO_CHECKOUT } from '@/lib/brand-content';
import { formatPrice } from '@/lib/utils';
import type { OrderTotals } from '@/types';

interface VenmoPaymentStepProps {
  totals: OrderTotals;
  confirmed: boolean;
  onConfirmedChange: (confirmed: boolean) => void;
}

export function VenmoPaymentStep({ totals, confirmed, onConfirmedChange }: VenmoPaymentStepProps) {
  const t = useTranslations('checkout');
  const locale = useLocale() as 'en' | 'es';

  return (
    <section className="rounded-2xl border border-pink/25 bg-cream p-6">
      <h2 className="font-display text-2xl text-carbon">{t('venmoTitle')}</h2>
      <p className="mt-2 text-sm text-grey">{t('venmoInstructions')}</p>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative h-52 w-52 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg">
          <Image
            src={VENMO_CHECKOUT.qrImage}
            alt={t('venmoQrAlt')}
            fill
            className="object-contain p-2"
            sizes="208px"
            priority
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-pink">{t('venmoPayAmount')}</p>
          <p className="font-display mt-1 text-4xl text-carbon">
            {formatPrice(totals.total, totals.currency, locale)}
          </p>
          <p className="mt-3 text-sm text-grey">
            {t('venmoHandle')}: <span className="font-semibold text-carbon">{VENMO_CHECKOUT.handle}</span>
          </p>
          <p className="mt-4 text-xs text-grey">{VENMO_CHECKOUT.instructions}</p>
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-grey/15 bg-white p-4 transition hover:border-pink/30">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => onConfirmedChange(event.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-pink"
        />
        <span className="text-sm leading-relaxed text-carbon">
          <span className="font-semibold">{t('venmoConfirmLabel')}</span>
          <span className="mt-1 block text-grey">{t('venmoConfirmHint')}</span>
        </span>
      </label>
    </section>
  );
}
