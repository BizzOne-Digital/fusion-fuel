'use client';

import Image from 'next/image';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { CONTACT } from '@/lib/brand-content';
import { useSiteContact } from '@/context/SiteSettingsContext';
import { getSocialFollowCopy } from '@/lib/marketing-i18n';
import type { Locale } from '@/types';

interface SocialLink {
  platform: string;
  url: string;
  label?: string;
}

interface SocialFollowSectionProps {
  locale: Locale;
  social?: SocialLink[];
}

export function SocialFollowSection({ locale, social = [] }: SocialFollowSectionProps) {
  const copy = getSocialFollowCopy(locale);
  const { instagram, facebook, tiktok } = useSiteContact();
  void social; // kept for API compatibility; values now come from site settings

  return (
    <SectionReveal>
      <section className="gradient-boost py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center md:flex-row md:text-left">
            <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-2xl bg-white/10 shadow-lg">
              <Image
                src={CONTACT.instagramQrImage}
                alt={copy.qrAlt(instagram.label)}
                fill
                className="object-cover"
                sizes="176px"
              />
            </div>
            <div>
              <h2 className="font-display text-4xl">{copy.title}</h2>
              <p className="mt-2 text-white/85">{copy.subtitle}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
                <a
                  href={instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold underline transition hover:text-lime"
                >
                  {instagram.label}
                </a>
                <a
                  href={facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold underline transition hover:text-lime"
                >
                  {facebook.label}
                </a>
                <a
                  href={tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold underline transition hover:text-lime"
                >
                  {tiktok.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SectionReveal>
  );
}
