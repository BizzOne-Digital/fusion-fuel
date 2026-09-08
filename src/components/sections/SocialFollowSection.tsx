'use client';

import Image from 'next/image';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { CONTACT } from '@/lib/brand-content';

interface SocialLink {
  platform: string;
  url: string;
  label?: string;
}

interface SocialFollowSectionProps {
  social?: SocialLink[];
}

export function SocialFollowSection({ social = [] }: SocialFollowSectionProps) {
  const instagram = social.find((s) => s.platform === 'instagram');
  const facebook = social.find((s) => s.platform === 'facebook');
  const tiktok = social.find((s) => s.platform === 'tiktok');

  return (
    <SectionReveal>
      <section className="gradient-boost py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center md:flex-row md:text-left">
            <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-2xl bg-white/10 shadow-lg">
              <Image
                src={CONTACT.instagramQrImage}
                alt={`Scan to follow ${CONTACT.instagramHandle} on Instagram`}
                fill
                className="object-cover"
                sizes="176px"
              />
            </div>
            <div>
              <h2 className="font-display text-4xl">Follow the Energy</h2>
              <p className="mt-2 text-white/85">Scan the code or tap below to follow us on social.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
                <a
                  href={instagram?.url ?? CONTACT.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold underline transition hover:text-lime"
                >
                  {instagram?.label ?? CONTACT.instagramHandle}
                </a>
                <a
                  href={facebook?.url ?? CONTACT.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold underline transition hover:text-lime"
                >
                  {facebook?.label ?? CONTACT.facebookLabel}
                </a>
                {tiktok ? (
                  <a
                    href={tiktok.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold underline transition hover:text-lime"
                  >
                    {tiktok.label ?? CONTACT.tiktokHandle}
                  </a>
                ) : (
                  <a
                    href={CONTACT.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold underline transition hover:text-lime"
                  >
                    {CONTACT.tiktokHandle}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SectionReveal>
  );
}
